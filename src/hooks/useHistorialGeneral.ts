import { useState, useMemo, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/src/api/axiosConfig';
import { CultivoService } from '@/src/services/cultivoService';
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

async function getPhotoForRef(tipo: string, idRef: string): Promise<string | null> {
    const tipoUpper = tipo.toUpperCase();
    const key = `reportPhoto.${tipoUpper}.${idRef}`;
    if (Platform.OS === 'web') {
        return localStorage.getItem(key);
    }
    return (await SecureStore.getItemAsync(key)) || null;
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

type GeneralItem = {
    id: string;
    eventId?: string | null;
    cultivo: string;
    idCultivo: string;
    tipo: string;
    etapa: string;
    fecha: string;
    fotoUrl?: string;
    descripcion?: string;
    observaciones?: string;
};

export function useHistorialGeneral() {
    const [filtroActivo, setFiltroActivo] = useState('Todos');
    const [cargando, setCargando] = useState(false);
    const [reportes, setReportes] = useState<GeneralItem[]>([]);

    const fetchReportes = useCallback(async () => {
        try {
            setCargando(true);
            let userId: string | null = null;
            if (Platform.OS === 'web') {
                userId = localStorage.getItem('userId');
            } else {
                userId = await SecureStore.getItemAsync('userId');
            }
            if (!userId) {
                setReportes([]);
                return;
            }
            const cultivos = await CultivoService.getCultivosDelUsuario(userId);
            const res: GeneralItem[] = [];

            for (const c of cultivos) {
                try {
                    const idCultivo = c.id; // Corregido: el objeto del servicio usa 'id', no 'idCultivo'
                    const nombreCultivo = c.nombre || c.tipoCultivo || 'Sin nombre';

                    if (!idCultivo) {
                        console.warn('Se encontró un cultivo sin ID en la lista:', c);
                        continue;
                    }

                    // 1. Obtener Eventos (Riego, Poda, Fert, Fumig)
                    const eventosRes = await getEventosPorCultivo(idCultivo);
                    const eventos = eventosRes.data?.data || [];
                    
                    for (const ev of eventos) {
                        try {
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
                                const etapa = await resolverEtapaPorFecha(idCultivo, ev.fechaEvento);
                                res.push({
                                    id: String(idRef), // Usar solo el idRef para que el hook detalle lo encuentre
                                    eventId: ev.idEvento,
                                    cultivo: nombreCultivo,
                                    idCultivo: idCultivo,
                                    tipo: tipoUi,
                                    fecha: formatFechaISOToDDMMYY(ev.fechaEvento),
                                    etapa,
                                    fotoUrl: foto || undefined,
                                    descripcion: d.descripcion || d.observaciones,
                                    observaciones: d.observaciones
                                });
                            }
                        } catch (err) {
                            console.warn(`Error procesando evento ${ev.idEvento} del cultivo ${idCultivo}:`, err);
                        }
                    }

                    // 2. Obtener Irregularidades
                    try {
                        const irrRes = await getIrregularidadesPorCultivo(idCultivo);
                        const irrs = irrRes.data?.data || [];
                        for (const irr of irrs) {
                        const idIrr = irr.idIrregularidad;
                        const foto = await getPhotoForRef('Irregularidad', String(idIrr));
                        const etapa = await resolverEtapaPorFecha(idCultivo, irr.fechaDeteccion);
                        res.push({
                            id: String(idIrr), // Usar solo el ID para que coincida con lo que espera el detalle
                            cultivo: nombreCultivo,
                            idCultivo: idCultivo,
                            tipo: 'Irregularidad',
                            fecha: formatFechaISOToDDMMYY(irr.fechaDeteccion),
                            etapa,
                            fotoUrl: foto || undefined,
                            descripcion: irr.descripcion,
                            observaciones: irr.observaciones
                        });
                    }
                    } catch (err) {
                        console.warn(`Error obteniendo irregularidades del cultivo ${idCultivo}:`, err);
                    }

                    // 3. Obtener Crecimiento
                    try {
                        const creRes = await getCrecimientoPorCultivo(idCultivo);
                        const cres = creRes.data?.data || [];
                        for (const cre of cres) {
                        const idCre = cre.idCrecimiento;
                        const foto = await getPhotoForRef('Crecimiento', String(idCre));
                        const etapa = await resolverEtapaPorFecha(idCultivo, cre.fechaRegistro);
                        res.push({
                            id: String(idCre), // Usar solo el ID
                            cultivo: nombreCultivo,
                            idCultivo: idCultivo,
                            tipo: 'Crecimiento',
                            fecha: formatFechaISOToDDMMYY(cre.fechaRegistro),
                            etapa,
                            fotoUrl: foto || undefined,
                            descripcion: cre.notas,
                            observaciones: cre.notas
                        });
                    }
                    } catch (err) {
                        console.warn(`Error obteniendo crecimiento del cultivo ${idCultivo}:`, err);
                    }
                } catch (err) {
                    console.error(`Error procesando el cultivo ${c.idCultivo}:`, err);
                }
            }

            // Ordenar por fecha descendente
            res.sort((a, b) => {
                const da = a.fecha.split('/').reverse().join('');
                const db = b.fecha.split('/').reverse().join('');
                return db.localeCompare(da);
            });

            setReportes(res);
        } catch (error) {
            console.error('Error fetching historial general:', error);
        } finally {
            setCargando(false);
        }
    }, []);

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
