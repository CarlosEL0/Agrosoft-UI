import { useState, useCallback } from 'react';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/src/theme/colors';
import { getAnalisisIA, AnalisisIaResponse } from '@/src/services/iaService';
import { getEventosPorCultivo } from '@/src/services/reporteService';

export function useAnalisisIA(idCultivo?: string | string[]) {
    const params = useLocalSearchParams<{ idIrregularidad?: string }>();
    const idIrregularidad = params?.idIrregularidad as string | undefined;

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{
        resultadoAnalisis: string;
        recomendaciones: Array<{ idRecomendacion: string; titulo: string; descripcion: string; prioridad: string }>;
    } | null>(null);

    const fetchAnalisis = async () => {
        try {
            setLoading(true);
            if (idCultivo && typeof idCultivo === 'string') {
                let extra: string | undefined = undefined;
                try {
                    const evRes = await getEventosPorCultivo(idCultivo);
                    const evs = evRes.data?.data || [];
                    const recent = evs.slice(0, 5).map((e: any) => {
                        const fecha = (e.fechaEvento || '').split('T')[0] || '';
                        const t = String(e.tipoEvento || '').toUpperCase();
                        const desc = [e.descripcion, e.observaciones].filter(Boolean).join(' | ');
                        return `- ${fecha} ${t}: ${desc}`.trim();
                    }).filter(Boolean);
                    if (recent.length) {
                        extra = `Eventos recientes:\n${recent.join('\n')}`;
                    }
                } catch {}
                const res: AnalisisIaResponse = await getAnalisisIA(idCultivo, idIrregularidad, extra);
                const recomendacionesMapped = (res.recomendaciones || []).map((r) => ({
                    idRecomendacion: String(r.idRecomendacion || ''),
                    titulo: String(r.titulo || 'Recomendación'),
                    descripcion: String(r.descripcion || r.mensaje || r.mensajeBase || ''),
                    prioridad: String(r.prioridad || 'media').toLowerCase(),
                }));
                setData({
                    resultadoAnalisis: String(res.resultadoAnalisis || 'La IA no devolvió análisis.'),
                    recomendaciones: recomendacionesMapped,
                });
            } else {
                setData({
                    resultadoAnalisis: 'Selecciona un cultivo para generar el análisis.',
                    recomendaciones: [],
                });
            }
        } catch (error) {
            console.error('Error fetching IA análisis:', error);
            setData({
                resultadoAnalisis: 'No se pudo generar el análisis en este momento.',
                recomendaciones: [],
            });
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchAnalisis();
        }, [idCultivo, idIrregularidad])
    );

    const getPriorityBadgeColor = (prioridad: string) => {
        switch (prioridad.toLowerCase()) {
            case 'alta': return { bg: Colors.danger, text: Colors.surface };
            case 'media': return { bg: Colors.warning, text: Colors.surface };
            case 'baja': return { bg: Colors.success, text: Colors.surface };
            default: return { bg: '#f5f5f5', text: '#9e9e9e' };
        }
    };

    return {
        data,
        loading,
        getPriorityBadgeColor,
    };
}
