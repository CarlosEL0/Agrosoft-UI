import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { CultivoService } from '@/src/services/cultivoService';
import { api } from '@/src/api/axiosConfig';

type CultivoResumen = {
  id: string;
  nombre: string;
  dia: number;
  estado: 'Activo' | 'Hecho';
  riesgo: 'Bajo' | 'Moderado' | 'Alto';
  irregularidades: number;
};

export function useInicio() {
  const [cargando, setCargando] = useState(true);
  const [cultivos, setCultivos] = useState<CultivoResumen[]>([]);
  const [cultivoEnRiesgo, setCultivoEnRiesgo] = useState<CultivoResumen | null>(null);

  const fetchInicio = useCallback(async () => {
    try {
      setCargando(true);
      let userId: string | null = null;
      if (Platform.OS === 'web') {
        userId = localStorage.getItem('userId');
      } else {
        userId = await SecureStore.getItemAsync('userId');
      }
      if (!userId) {
        setCultivos([]);
        setCultivoEnRiesgo(null);
        return;
      }
      const lista = await CultivoService.getCultivosDelUsuario(userId);
      const enriquecidos: CultivoResumen[] = [];
      for (const c of lista) {
        let irregularidades = 0;
        let riesgo: 'Bajo' | 'Moderado' | 'Alto' = 'Bajo';
        try {
          const res = await api.get(`/irregularidades/cultivo/${c.id}`, { params: { estado: 'activa' } });
          const activas = (res.data?.data || []) as any[];
          irregularidades = activas.length;
          if (irregularidades === 0) riesgo = 'Bajo';
          else if (irregularidades <= 2) riesgo = 'Moderado';
          else riesgo = 'Alto';
        } catch {}
        enriquecidos.push({
          id: c.id,
          nombre: c.nombre,
          dia: c.dia,
          estado: c.estado,
          riesgo,
          irregularidades,
        });
      }
      setCultivos(enriquecidos);
      const riesgoOrdenado = [...enriquecidos].sort((a, b) => {
        const p = (x: CultivoResumen) => (x.riesgo === 'Alto' ? 3 : x.riesgo === 'Moderado' ? 2 : 1);
        return p(b) - p(a);
      });
      setCultivoEnRiesgo(riesgoOrdenado.find((c) => c.riesgo !== 'Bajo') || null);
    } catch (e) {
      setCultivos([]);
      setCultivoEnRiesgo(null);
    } finally {
      setCargando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchInicio();
    }, [fetchInicio])
  );

  return {
    cargando,
    cultivos,
    cultivoEnRiesgo,
  };
}
