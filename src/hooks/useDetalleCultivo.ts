import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { CultivoService } from '@/src/services/cultivoService';

export function useDetalleCultivo(idCultivo?: string) {
    const [cargando, setCargando] = useState(false);

    // Mock data — luego vendrá de la API
    const [cultivo, setCultivo] = useState({
        nombre: 'Maiz',
        ciclo: 'Ciclo floracion',
        diaActual: 45,
        diaTotal: 90,
        progreso: 35,
        salud: 'Buena',
        faseActual: 'Germinacion',
        riesgo: 'Bajo',
        ia: {
            riego: 'Óptimo',
            nutricion: 'Adecuada',
            plagas: 'Sin indicios',
        },
    });

    const fetchDetalleCultivo = async () => {
        try {
            setCargando(true);
            // Cuando la API esté lista:
            // if (idCultivo) {
            //   const data = await CultivoService.getDetalleCultivo(idCultivo);
            //   setCultivo(data);
            // }
        } catch (error) {
            console.error('Error fetching detalle cultivo:', error);
        } finally {
            setCargando(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchDetalleCultivo();
        }, [idCultivo])
    );

    return {
        cultivo,
        cargando,
    };
}
