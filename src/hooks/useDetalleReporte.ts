import { useState, useCallback } from 'react';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { getRiegoPorEvento, getPodaPorEvento, getFertilizacionPorEvento, getFumigacionPorEvento, getIrregularidadesPorCultivo, getCrecimientoPorCultivo, getEventoPorId } from '@/src/services/reporteService';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/src/api/axiosConfig';

export function useDetalleReporte() {
    const [cargando, setCargando] = useState(false);
    const { idRef, tipo, idCultivo, etapa, fecha, idEvento } = useLocalSearchParams<{ idRef: string; tipo: string; idCultivo: string; etapa?: string; fecha?: string; idEvento?: string }>();

    const [reporte, setReporte] = useState({
        tipo: (tipo as string) || 'Reporte',
        etapa: (etapa as string) || 'N/A',
        fecha: (fecha as string) || 'N/D',
        detalles: [
            { label: 'Humedad del suelo', value: 'Baja' },
        ],
        fotos: [] as (string | null)[],
    });

    const fetchDetalleReporte = async () => {
        try {
            setCargando(true);
            const t = (tipo as string) || '';
            const id = idRef as string;
            const eventId = (idEvento as string) || '';
            const formato = (iso?: string) => {
                if (!iso) return 'N/D';
                const [y, m, d] = iso.split('T')[0].split('-');
                return `${d}/${m}/${y.slice(-2)}`;
            };
            const parseISOToDate = (iso: string) => {
                const [y, m, d] = iso.split('-').map(Number);
                const dt = new Date(y, m - 1, d);
                dt.setHours(0, 0, 0, 0);
                return dt;
            };
            const resolverEtapaPorFecha = async (cultivo: string, fechaISO: string) => {
                try {
                    const fecha = parseISOToDate(fechaISO);
                    const fasesRes = await api.get(`/fases/cultivo/${cultivo}`);
                    const fases: any[] = fasesRes.data?.data || [];
                    const fasesOrd = [...fases].sort((a, b) => (a.numeroCiclo || 0) - (b.numeroCiclo || 0));
                    const faseActiva = fasesOrd.find((f) => {
                        const ini = parseISOToDate(f.fechaInicio);
                        const fin = parseISOToDate(f.fechaFin);
                        return fecha >= ini && fecha <= fin;
                    }) || (fasesOrd.length ? fasesOrd[fasesOrd.length - 1] : null);
                    if (!faseActiva?.idCiclo) return 'N/A';
                    const etapasRes = await api.get(`/etapas/ciclo/${faseActiva.idCiclo}`);
                    const etapas: any[] = etapasRes.data?.data || [];
                    const etapasOrd = [...etapas].sort((a, b) => parseISOToDate(a.fechaInicio).getTime() - parseISOToDate(b.fechaInicio).getTime());
                    const etapaVigente = etapasOrd.find((e) => {
                        const ini = parseISOToDate(e.fechaInicio);
                        const fin = parseISOToDate(e.fechaFin);
                        return fecha >= ini && fecha <= fin;
                    }) || (etapasOrd.length ? etapasOrd[etapasOrd.length - 1] : null);
                    const nombre = etapaVigente?.nombreEtapa || etapaVigente?.nombre || etapaVigente?.etapa;
                    return nombre || 'N/A';
                } catch {
                    return 'N/A';
                }
            };

            let detalles: Array<{ label: string; value: string }> = [];
            let fecha = 'N/D';
            let etapaTexto = (etapa as string) || 'N/A';

            if (t === 'Riego') {
                const res = await getRiegoPorEvento(eventId || id);
                const data = res.data?.data || {};
                detalles = [
                    { label: 'Cantidad de agua (L)', value: String(data.cantidadAgua ?? 'N/D') },
                    { label: 'Método', value: String(data.metodoRiego ?? 'N/D') },
                    { label: 'Duración (min)', value: String(data.duracionMinutos ?? 'N/D') },
                ];
                // Evento para fecha/etapa/observaciones/descripcion
                if (eventId) {
                    try {
                        const evRes = await getEventoPorId(eventId);
                        const ev = evRes.data?.data || {};
                        fecha = formato(ev.fechaEvento);
                        if (ev.idEtapa) {
                            const etapaRes = await api.get(`/etapas/${ev.idEtapa}`);
                            const et = etapaRes.data?.data || {};
                            etapaTexto = et.nombreEtapa || et.nombre || et.etapa || etapaTexto;
                        } else if (ev.fechaEvento) {
                            etapaTexto = await resolverEtapaPorFecha(idCultivo as string, ev.fechaEvento.split('T')[0]);
                        }
                        if (ev.descripcion) {
                            detalles.push({ label: 'Descripción', value: String(ev.descripcion) });
                        }
                        if (ev.observaciones) {
                            detalles.push({ label: 'Observaciones', value: String(ev.observaciones) });
                        }
                    } catch {}
                } else {
                    fecha = (fecha as string) || 'N/D';
                }
            } else if (t === 'Poda') {
                const res = await getPodaPorEvento(eventId || id);
                const data = res.data?.data || {};
                detalles = [
                    { label: 'Tipo de poda', value: String(data.tipoPoda ?? 'N/D') },
                    { label: 'Partes podadas', value: String(data.partesPodadas ?? 'N/D') },
                    { label: 'Porcentaje podado', value: String(data.porcentajePodado ?? 'N/D') },
                    { label: 'Herramientas', value: String(data.herramientasUtilizadas ?? 'N/D') },
                    { label: 'Estado planta', value: String(data.estadoPlantaDespues ?? 'N/D') },
                ];
                if (eventId) {
                    try {
                        const evRes = await getEventoPorId(eventId);
                        const ev = evRes.data?.data || {};
                        fecha = formato(ev.fechaEvento);
                        if (ev.idEtapa) {
                            const etapaRes = await api.get(`/etapas/${ev.idEtapa}`);
                            const et = etapaRes.data?.data || {};
                            etapaTexto = et.nombreEtapa || et.nombre || et.etapa || etapaTexto;
                        } else if (ev.fechaEvento) {
                            etapaTexto = await resolverEtapaPorFecha(idCultivo as string, ev.fechaEvento.split('T')[0]);
                        }
                        if (ev.descripcion) detalles.push({ label: 'Descripción', value: String(ev.descripcion) });
                        if (ev.observaciones) detalles.push({ label: 'Observaciones', value: String(ev.observaciones) });
                    } catch {}
                } else {
                    fecha = (fecha as string) || 'N/D';
                }
            } else if (t === 'Fertilizacion') {
                const res = await getFertilizacionPorEvento(eventId || id);
                const data = res.data?.data || {};
                detalles = [
                    { label: 'Tipo fertilizante', value: String(data.tipoFertilizante ?? 'N/D') },
                    { label: 'Nombre', value: String(data.nombreFertilizante ?? 'N/D') },
                    { label: 'Cantidad aplicada', value: String(data.cantidadAplicada ?? 'N/D') },
                    { label: 'Unidad', value: String(data.unidadMedida ?? 'N/D') },
                    { label: 'Método', value: String(data.metodoAplicacion ?? 'N/D') },
                    { label: 'Costo', value: String(data.costo ?? 'N/D') },
                ];
                if (eventId) {
                    try {
                        const evRes = await getEventoPorId(eventId);
                        const ev = evRes.data?.data || {};
                        fecha = formato(ev.fechaEvento);
                        if (ev.idEtapa) {
                            const etapaRes = await api.get(`/etapas/${ev.idEtapa}`);
                            const et = etapaRes.data?.data || {};
                            etapaTexto = et.nombreEtapa || et.nombre || et.etapa || etapaTexto;
                        } else if (ev.fechaEvento) {
                            etapaTexto = await resolverEtapaPorFecha(idCultivo as string, ev.fechaEvento.split('T')[0]);
                        }
                        if (ev.descripcion) detalles.push({ label: 'Descripción', value: String(ev.descripcion) });
                        if (ev.observaciones) detalles.push({ label: 'Observaciones', value: String(ev.observaciones) });
                    } catch {}
                } else {
                    fecha = (fecha as string) || 'N/D';
                }
            } else if (t === 'Fumigacion') {
                const res = await getFumigacionPorEvento(eventId || id);
                const data = res.data?.data || {};
                detalles = [
                    { label: 'Producto', value: String(data.nombreProducto ?? 'N/D') },
                    { label: 'Tipo', value: String(data.tipoProducto ?? 'N/D') },
                    { label: 'Ingrediente activo', value: String(data.ingredienteActivo ?? 'N/D') },
                    { label: 'Dosis', value: String(data.dosis ?? 'N/D') },
                    { label: 'Unidad', value: String(data.unidadMedida ?? 'N/D') },
                    { label: 'Total mezcla (L)', value: String(data.totalMezclaLitros ?? 'N/D') },
                    { label: 'Método', value: String(data.metodoAplicacion ?? 'N/D') },
                    { label: 'Plaga objetivo', value: String(data.plagaObjetivo ?? 'N/D') },
                    { label: 'Periodo seguridad (d)', value: String(data.periodoSeguridadDias ?? 'N/D') },
                    { label: 'Costo', value: String(data.costo ?? 'N/D') },
                ];
                if (eventId) {
                    try {
                        const evRes = await getEventoPorId(eventId);
                        const ev = evRes.data?.data || {};
                        fecha = formato(ev.fechaEvento);
                        if (ev.idEtapa) {
                            const etapaRes = await api.get(`/etapas/${ev.idEtapa}`);
                            const et = etapaRes.data?.data || {};
                            etapaTexto = et.nombreEtapa || et.nombre || et.etapa || etapaTexto;
                        } else if (ev.fechaEvento) {
                            etapaTexto = await resolverEtapaPorFecha(idCultivo as string, ev.fechaEvento.split('T')[0]);
                        }
                        if (ev.descripcion) detalles.push({ label: 'Descripción', value: String(ev.descripcion) });
                        if (ev.observaciones) detalles.push({ label: 'Observaciones', value: String(ev.observaciones) });
                    } catch {}
                } else {
                    fecha = (fecha as string) || 'N/D';
                }
            } else if (t === 'Irregularidad' && idCultivo) {
                const irrRes = await getIrregularidadesPorCultivo(idCultivo as string);
                const lista = irrRes.data?.data || [];
                const data = lista.find((x: any) => String(x.id) === String(id)) || {};
                detalles = [
                    { label: 'Tipo', value: String(data.tipoIrregularidad ?? 'N/D') },
                    { label: 'Plaga', value: String(data.nombrePlaga ?? 'N/D') },
                    { label: 'Daño', value: String(data.nivelDano ?? 'N/D') },
                    { label: 'Severidad', value: String(data.severidad ?? 'N/D') },
                    { label: 'Estado', value: String(data.estado ?? 'N/D') },
                    { label: 'Descripción', value: String(data.descripcion ?? 'N/D') },
                ];
                fecha = formato(data.fechaDeteccion);
                if (data.idEtapa) {
                    const etapaRes = await api.get(`/etapas/${data.idEtapa}`);
                    const et = etapaRes.data?.data || {};
                    etapaTexto = et.nombreEtapa || et.nombre || et.etapa || etapaTexto;
                } else if (data.fechaDeteccion) {
                    etapaTexto = await resolverEtapaPorFecha(idCultivo as string, String(data.fechaDeteccion));
                }
            } else if (t === 'Crecimiento' && idCultivo) {
                const crecRes = await getCrecimientoPorCultivo(idCultivo as string);
                const lista = crecRes.data?.data || [];
                const data = lista.find((x: any) => String(x.id) === String(id)) || {};
                detalles = [
                    { label: 'Altura (cm)', value: String(data.alturaPlanta ?? 'N/D') },
                    { label: 'Grosor tallo (cm)', value: String(data.grosorTallo ?? 'N/D') },
                    { label: 'Diámetro (cm)', value: String(data.diametro ?? 'N/D') },
                    { label: 'Salud', value: String(data.estadoSalud ?? 'N/D') },
                    { label: 'Observaciones', value: String(data.observaciones ?? 'N/D') },
                ];
                fecha = formato(data.fechaRegistro);
                if (data.idEtapa) {
                    const etapaRes = await api.get(`/etapas/${data.idEtapa}`);
                    const et = etapaRes.data?.data || {};
                    etapaTexto = et.nombreEtapa || et.nombre || et.etapa || etapaTexto;
                } else if (data.fechaRegistro) {
                    etapaTexto = await resolverEtapaPorFecha(idCultivo as string, String(data.fechaRegistro));
                }
            }

            const tipoUpper = (tipo as string || '').toUpperCase();
            const keySingle = `reportPhoto:${tipoUpper}:${id}`;
            const keyMulti = `reportPhotos:${tipoUpper}:${id}`;
            let fotosUrls: string[] = [];
            if (Platform.OS === 'web') {
                const json = localStorage.getItem(keyMulti);
                if (json) {
                    try { fotosUrls = JSON.parse(json) || []; } catch {}
                }
                if (fotosUrls.length === 0) {
                    const single = localStorage.getItem(keySingle);
                    if (single) fotosUrls = [single];
                }
            } else {
                const json = await SecureStore.getItemAsync(keyMulti);
                if (json) {
                    try { fotosUrls = JSON.parse(json) || []; } catch {}
                }
                if (fotosUrls.length === 0) {
                    const single = await SecureStore.getItemAsync(keySingle);
                    if (single) fotosUrls = [single];
                }
            }

            setReporte({
                tipo: t || 'Reporte',
                etapa: etapaTexto,
                fecha,
                detalles,
                fotos: fotosUrls,
            });
        } catch (error) {
            console.error('Error fetching detalle reporte:', error);
        } finally {
            setCargando(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchDetalleReporte();
        }, [idRef, tipo, idCultivo])
    );

    return {
        reporte,
        cargando,
    };
}
