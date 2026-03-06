import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { Colors } from '@/src/theme/colors';

// Mock de la respuesta de la API (AnalisisIaResponseDTO)
export const MOCK_API_RESPONSE = {
    resultadoAnalisis: "Basado en los registros del cultivo y las anomalías reportadas, se detectan signos claros consistentes con una infestación temprana de Mosca Blanca. El alto nivel de humedad reciente ha favorecido su rápida propagación en el envés de las hojas. El cultivo se encuentra sometido a estrés, lo cual podría impactar la próxima etapa de floración si no se toman medidas correctivas inmediatas.",
    recomendaciones: [
        {
            idRecomendacion: '1',
            titulo: 'Aplicación Tratar con Jabón Potásico',
            descripcion: 'Preparar una solución de 20ml de jabón potásico por litro de agua. Rociar abundantemente prestando especial atención al envés de las hojas, preferiblemente al atardecer para evitar quemaduras solares.',
            prioridad: 'alta'
        },
        {
            idRecomendacion: '2',
            titulo: 'Podas de Aclareo y Ventilación',
            descripcion: 'Realizar una poda leve en el tercio inferior del cultivo. Esto facilitará la circulación de aire, reduciendo la humedad estancada que favorece la plaga.',
            prioridad: 'media'
        },
        {
            idRecomendacion: '3',
            titulo: 'Trampas Cromáticas Amarillas',
            descripcion: 'Instalar trampas adhesivas amarillas a 20cm por encima del dosel del cultivo para capturar adultos voladores e ir monitoreando la población durante las próximas 2 semanas.',
            prioridad: 'baja'
        }
    ]
};

export function useAnalisisIA(idCultivo?: string | string[]) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<typeof MOCK_API_RESPONSE | null>(null);

    const fetchAnalisis = async () => {
        try {
            setLoading(true);
            // Simula retraso de red (reemplazar con llamada real a API)
            await new Promise(resolve => setTimeout(resolve, 1500));
            // if (idCultivo) {
            //   const result = await IaService.getAnalisis(idCultivo);
            //   setData(result);
            // } else {
            setData(MOCK_API_RESPONSE);
            // }
        } catch (error) {
            console.error('Error fetching IAM análisis:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchAnalisis();
        }, [idCultivo])
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
