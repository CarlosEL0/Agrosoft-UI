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
    const tipoUpper = tipo.toUpperCase();
    const key = `reportPhoto.${tipoUpper}.${idRef}`;
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
                }

                if (detalleRes?.data?.data) {
                    const d = detalleRes.data.data;
                    const idRef = d.idRiego || d.idPoda || d.idFertilizacion || d.idFumigacion;
                    const foto = await getPhotoForRef(tipoUi, String(idRef));
                    const etapa = await resolverEtapaPorFecha(cultivoId, ev.fechaEvento);
                    resultado.push({
                        id: `${tipoUi}-${idRef}`, // ID único
                        eventId: ev.idEvento,
                        tipo: tipoUi,
                        fecha: formatFechaISOToDDMMYY(ev.fechaEvento),
                        etapa,
                        fotoUrl: foto || undefined,
                        descripcion: d.descripcion || d.observaciones,
                        observaciones: d.observaciones
                    });
                }
            }

            // Irregularidades
            const irrRes = await getIrregularidadesPorCultivo(cultivoId);
            const irrs = irrRes.data?.data || [];
            for (const irr of irrs) {
                const idIrr = irr.idIrregularidad;
                const foto = await getPhotoForRef('Irregularidad', String(idIrr));
                const etapa = await resolverEtapaPorFecha(cultivoId, irr.fechaDeteccion);
                resultado.push({
                    id: `Irr-${idIrr}`, // ID único
                    tipo: 'Irregularidad',
                    fecha: formatFechaISOToDDMMYY(irr.fechaDeteccion),
                    etapa,
                    fotoUrl: foto || undefined,
                    descripcion: irr.descripcion,
                    observaciones: irr.observaciones
                });
            }

            // Crecimiento
            const creRes = await getCrecimientoPorCultivo(cultivoId);
            const cres = creRes.data?.data || [];
            for (const cre of cres) {
                const idCre = cre.idCrecimiento;
                const foto = await getPhotoForRef('Crecimiento', String(idCre));
                const etapa = await resolverEtapaPorFecha(cultivoId, cre.fechaRegistro);
                resultado.push({
                    id: `Cre-${idCre}`, // ID único
                    tipo: 'Crecimiento',
                    fecha: formatFechaISOToDDMMYY(cre.fechaRegistro),
                    etapa,
                    fotoUrl: foto || undefined,
                    descripcion: cre.notas,
                    observaciones: cre.notas
                });
            }

            // Ordenar por fecha desc
            resultado.sort((a, b) => {
                const da = a.fecha.split('/').reverse().join('');
                const db = b.fecha.split('/').reverse().join('');
                return db.localeCompare(da);
            });

            setReportes(resultado);
        } catch (error) {
            console.error('Error fetching historial cultivo:', error);
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
        if (filtroActivo === 'Todos') return reportes;
        return reportes.filter((r) => r.tipo === filtroActivo);
    }, [reportes, filtroActivo]);

    return {
        filtros,
        filtroActivo,
        setFiltroActivo,
        reportesFiltrados,
        cargando,
        refresh: fetchReportes
    };
}
