import { useState, useMemo, useCallback } from 'react';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/src/api/axiosConfig';
import {
    getEventosPorCultivo,
    getRiegoPorEvento,
    getPodaPorEvento,
    getFertilizacionPorEvento,
    getFumigacionPorEvento,
    getIrregularidadesPorCultivo,
    getCrecimientoPorCultivo,
    getEtapaPorId
} from '@/src/services/reporteService';

type HistorialItem = {
    id: string;
    eventId?: string | null;
    tipo: string;
    etapa: string;
    fecha: string;
    fotoUrl?: string;
    descripcion?: string;
    observaciones?: string;
};

export const filtros = ['Todos', 'Riego', 'Poda', 'Fertilizacion', 'Fumigacion', 'Irregularidad', 'Crecimiento'];

function formatFechaISOToDDMMYY(iso?: string): string {
    if (!iso) return 'N/D';
    const [y, m, d] = iso.split('T')[0].split('-');
    return `${d}/${m}/${y.slice(-2)}`;
}

function parseISOToDate(iso: string): Date {
    const [y, m, d] = iso.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    dt.setHours(0, 0, 0, 0);
    return dt;
}

async function resolverEtapaPorFecha(idCultivo: string, fechaISO: string): Promise<string> {
    try {
        const fecha = parseISOToDate(fechaISO);
        const fasesRes = await api.get(`/fases/cultivo/${idCultivo}`);
        const fases: any[] = fasesRes.data?.data || [];
        const fasesOrdenadas = [...fases].sort((a, b) => (a.numeroCiclo || 0) - (b.numeroCiclo || 0));
        const faseActiva = fasesOrdenadas.find((f) => {
            const ini = parseISOToDate(f.fechaInicio);
            const fin = parseISOToDate(f.fechaFin);
            return fecha >= ini && fecha <= fin;
        }) || (fasesOrdenadas.length ? fasesOrdenadas[fasesOrdenadas.length - 1] : null);
        if (!faseActiva?.idCiclo) return 'N/A';
        const etapasRes = await api.get(`/etapas/ciclo/${faseActiva.idCiclo}`);
        const etapas: any[] = etapasRes.data?.data || [];
        const etapasOrdenadas = [...etapas].sort((a, b) => parseISOToDate(a.fechaInicio).getTime() - parseISOToDate(b.fechaInicio).getTime());
        const etapaVigente = etapasOrdenadas.find((e) => {
            const ini = parseISOToDate(e.fechaInicio);
            const fin = parseISOToDate(e.fechaFin);
            return fecha >= ini && fecha <= fin;
        }) || (etapasOrdenadas.length ? etapasOrdenadas[etapasOrdenadas.length - 1] : null);
        const nombre = etapaVigente?.nombreEtapa || etapaVigente?.nombre || etapaVigente?.etapa;
        return nombre || 'N/A';
    } catch {
        return 'N/A';
    }
}

async function getPhotoForRef(tipo: string, idRef: string): Promise<string | null> {
    const key = `reportPhoto:${tipo}:${idRef}`;
    if (Platform.OS === 'web') {
        return localStorage.getItem(key);
    }
    return (await SecureStore.getItemAsync(key)) || null;
}

export function useHistorialCultivo(idCultivoParam?: string) {
    const { idCultivo } = useLocalSearchParams<{ idCultivo: string }>();
    const cultivoId = (idCultivoParam as string) || (idCultivo as string);

    const [filtroActivo, setFiltroActivo] = useState('Todos');
    const [cargando, setCargando] = useState(false);
    const [reportes, setReportes] = useState<HistorialItem[]>([]);

    const fetchReportes = useCallback(async () => {
        if (!cultivoId) return;
        try {
            setCargando(true);
            const resultado: HistorialItem[] = [];

            const eventosRes = await getEventosPorCultivo(cultivoId);
            const eventos = eventosRes.data?.data || [];
            for (const ev of eventos) {
                const tipo = (ev.tipoEvento || '').toLowerCase();
                let detalleRes;
                let tipoUi = '';
                if (tipo === 'riego') {
                    detalleRes = await getRiegoPorEvento(ev.idEvento);
                    tipoUi = 'Riego';
                } else if (tipo === 'poda') {
                    detalleRes = await getPodaPorEvento(ev.idEvento);
                    tipoUi = 'Poda';
                } else if (tipo === 'fertilizacion') {
                    detalleRes = await getFertilizacionPorEvento(ev.idEvento);
                    tipoUi = 'Fertilizacion';
                } else if (tipo === 'fumigacion') {
                    detalleRes = await getFumigacionPorEvento(ev.idEvento);
                    tipoUi = 'Fumigacion';
                } else {
                    continue;
                }
                const data = detalleRes.data?.data || {};
                const idRef = data.idRiego || data.idPoda || data.idFertilizacion || data.idFumigacion;
                const fotoUrl = idRef ? await getPhotoForRef(tipoUi.toUpperCase(), idRef) : null;
                let etapaNombre = 'N/A';
                if (ev.idEtapa) {
                    try {
                        const etapaRes = await getEtapaPorId(ev.idEtapa);
                        const etapa = etapaRes.data?.data || {};
                        etapaNombre = etapa.nombreEtapa || etapa.nombre || etapa.etapa || 'N/A';
                    } catch {}
                } else if (ev.fechaEvento) {
                    etapaNombre = await resolverEtapaPorFecha(cultivoId, ev.fechaEvento.split('T')[0]);
                }
                resultado.push({
                    id: idRef || ev.idEvento,
                    eventId: ev.idEvento,
                    tipo: tipoUi,
                    etapa: etapaNombre,
                    fecha: formatFechaISOToDDMMYY(ev.fechaEvento),
                    fotoUrl: fotoUrl || undefined,
                    descripcion: ev.descripcion || '',
                    observaciones: ev.observaciones || '',
                });
            }

            const irrRes = await getIrregularidadesPorCultivo(cultivoId);
            const irregularidades = irrRes.data?.data || [];
            for (const irr of irregularidades) {
                const fotoUrl = irr.id ? await getPhotoForRef('IRREGULARIDAD', irr.id) : null;
                resultado.push({
                    id: irr.id,
                    eventId: null,
                    tipo: 'Irregularidad',
                    etapa: 'N/A',
                    fecha: formatFechaISOToDDMMYY(irr.fechaDeteccion),
                    fotoUrl: fotoUrl || undefined,
                    descripcion: irr.descripcion || '',
                    observaciones: irr.comentarioAgricultor || '',
                });
            }

            const crecRes = await getCrecimientoPorCultivo(cultivoId);
            const crecimientos = crecRes.data?.data || [];
            for (const reg of crecimientos) {
                const fotoUrl = reg.id ? await getPhotoForRef('CRECIMIENTO', reg.id) : null;
                let etapaNombre = 'N/A';
                if (reg.idEtapa) {
                    try {
                        const etapaRes = await getEtapaPorId(reg.idEtapa);
                        const etapa = etapaRes.data?.data || {};
                        etapaNombre = etapa.nombreEtapa || etapa.nombre || etapa.etapa || 'N/A';
                    } catch {}
                } else if (reg.fechaRegistro) {
                    etapaNombre = await resolverEtapaPorFecha(cultivoId, reg.fechaRegistro);
                }
                resultado.push({
                    id: reg.id,
                    eventId: null,
                    tipo: 'Crecimiento',
                    etapa: etapaNombre,
                    fecha: formatFechaISOToDDMMYY(reg.fechaRegistro),
                    fotoUrl: fotoUrl || undefined,
                    descripcion: reg.observaciones || '',
                    observaciones: '',
                });
            }

            setReportes(resultado);
        } catch (error) {
            console.error('Error fetching historial de reportes:', error);
        } finally {
            setCargando(false);
        }
    }, [cultivoId]);

    useFocusEffect(
        useCallback(() => {
            fetchReportes();
        }, [fetchReportes])
    );

    const reportesFiltrados = useMemo(() => {
        return reportes.filter((r) => {
            if (filtroActivo === 'Todos') return true;
            return r.tipo.toLowerCase().includes(filtroActivo.toLowerCase());
        });
    }, [reportes, filtroActivo]);

    return {
        filtros,
        filtroActivo,
        setFiltroActivo,
        reportesFiltrados,
        cargando,
    };
}
