import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { getNotificacionesDelUsuario, marcarNotificacionLeida } from '@/src/services/notificationService';

type NotificacionItem = {
  idNotificacion: string;
  titulo: string;
  mensaje: string;
  tipoNotificacion: string;
  fechaEnvio: string;
  leido: boolean;
  idRecurso?: string | null;
  tipoRecurso?: string | null;
};

export function useNotificaciones() {
  const [cargando, setCargando] = useState(true);
  const [items, setItems] = useState<NotificacionItem[]>([]);

  const fetchNotificaciones = useCallback(async () => {
    try {
      setCargando(true);
      let userId: string | null = null;
      if (Platform.OS === 'web') {
        userId = localStorage.getItem('userId');
      } else {
        userId = await SecureStore.getItemAsync('userId');
      }
      if (!userId) {
        setItems([]);
        return;
      }
      const res = await getNotificacionesDelUsuario(userId);
      const data = res.data?.data || [];
      setItems(
        data.map((n: any) => ({
          idNotificacion: n.idNotificacion,
          titulo: n.titulo,
          mensaje: n.mensaje,
          tipoNotificacion: n.tipoNotificacion,
          fechaEnvio: n.fechaEnvio,
          leido: !!n.leido,
          idRecurso: n.idRecurso || null,
          tipoRecurso: n.tipoRecurso || null,
        }))
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchNotificaciones();
    }, [fetchNotificaciones])
  );

  const unreadCount = items.filter((i) => !i.leido).length;

  const markAsRead = async (id: string) => {
    await marcarNotificacionLeida(id);
    setItems((prev) => prev.map((i) => (i.idNotificacion === id ? { ...i, leido: true } : i)));
  };

  return {
    cargando,
    items,
    unreadCount,
    markAsRead,
    refresh: fetchNotificaciones,
  };
}
