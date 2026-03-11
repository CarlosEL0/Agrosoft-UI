import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { CultivoService } from '@/src/services/cultivoService';

const CULTIVO_DEFAULT = {
    nombre: '...',
    ciclo: 'Cargando...',
    diaActual: 0,
    diaTotal: 1,
    progreso: 0,
    salud: '...',
    faseActual: '...',
    riesgo: '...',
    resumenIA: 'Consultando motor inteligente...',
    idCiclo: null as string | null,
};

export function useDetalleCultivo(idCultivo?: string) {
    const [cargando, setCargando] = useState(true);
    const [cultivo, setCultivo] = useState(CULTIVO_DEFAULT);
    const [error, setError] = useState<string | null>(null);

    const fetchDetalleCultivo = useCallback(async () => {
        if (!idCultivo) return;
        try {
            setCargando(true);
            setError(null);
            const data = await CultivoService.getDetalleCultivo(idCultivo);
            setCultivo(data);
        } catch (err) {
            console.error('Error fetching detalle cultivo:', err);
            setError('No se pudo cargar el cultivo. Intenta de nuevo.');
        } finally {
            setCargando(false);
        }
    }, [idCultivo]);

    useFocusEffect(
        useCallback(() => {
            fetchDetalleCultivo();
        }, [fetchDetalleCultivo])
    );

    return {
        cultivo,
        cargando,
        error,
    };
}

