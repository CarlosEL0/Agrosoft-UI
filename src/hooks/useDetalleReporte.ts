import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

export function useDetalleReporte(idReporte?: string) {
    const [cargando, setCargando] = useState(false);

    // Mock data — luego vendrá de la API
    const [reporte, setReporte] = useState({
        tipo: 'Riego',
        etapa: 'Germinacion',
        fecha: '25/06/24',
        detalles: [
            { label: 'Humedad del suelo', value: 'Baja' },
        ],
        fotos: [null, null], // placeholders
    });

    const fetchDetalleReporte = async () => {
        try {
            setCargando(true);
            // Cuando la API esté lista:
            // if (idReporte) {
            //   const data = await ReporteService.getDetalleReporte(idReporte);
            //   setReporte(data);
            // }
        } catch (error) {
            console.error('Error fetching detalle reporte:', error);
        } finally {
            setCargando(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchDetalleReporte();
        }, [idReporte])
    );

    return {
        reporte,
        cargando,
    };
}
