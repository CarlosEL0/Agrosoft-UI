import { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { CultivoService } from '@/src/services/cultivoService';

export function useCultivos() {
    const [filtroActivo, setFiltroActivo] = useState('Todos');
    const [busqueda, setBusqueda] = useState('');
    const [cultivos, setCultivos] = useState<any[]>([]);
    const [cargando, setCargando] = useState(true);

    const fetchCultivos = async () => {
        try {
            setCargando(true);
            let userId: string | null = null;

            if (Platform.OS === 'web') {
                userId = localStorage.getItem('userId');
            } else {
                userId = await SecureStore.getItemAsync('userId');
            }

            if (userId) {
                const cultivosFormateados = await CultivoService.getCultivosDelUsuario(userId);
                setCultivos(cultivosFormateados);
            }
        } catch (error) {
            console.error('Error al obtener cultivos:', error);
        } finally {
            setCargando(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchCultivos();
        }, [])
    );

    const cultivosFiltrados = cultivos.filter((c) => {
        const matchFiltro =
            filtroActivo === 'Todos' ||
            (filtroActivo === 'Activos' && c.estado === 'Activo') ||
            (filtroActivo === 'Hechos' && c.estado === 'Hecho');
        const matchBusqueda = c.nombre.toLowerCase().includes(busqueda.toLowerCase());
        return matchFiltro && matchBusqueda;
    });

    return {
        filtroActivo,
        setFiltroActivo,
        busqueda,
        setBusqueda,
        cargando,
        cultivos,
        cultivosFiltrados
    };
}
