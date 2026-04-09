import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { getNotificacionesDelUsuario, marcarNotificacionLeida, ejecutarRevisionEtapas } from '@/src/services/notificationService';

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

      // 1. Trigger manual check on backend so it generates new ones if a stage finished
      try {
        await ejecutarRevisionEtapas();
      } catch (err) {
        console.warn('Error en revisión manual de etapas:', err);
      }

      // 2. Fetch notifications from DB
      const res = await getNotificacionesDelUsuario(userId);
      const data = res.data?.data || [];
      console.log('Notificaciones recibidas:', data);
      
      const parsedItems = data.map((n: any) => ({
        idNotificacion: n.idNotificacion,
        titulo: n.titulo,
        mensaje: n.mensaje,
        tipoNotificacion: n.tipoNotificacion,
        fechaEnvio: n.fechaEnvio,
        leido: n.leido === true || n.leido === 'true',
        idRecurso: n.idRecurso || null,
        tipoRecurso: n.tipoRecurso || null,
      }));

      // Ordenar por fecha de envío (más recientes primero)
      parsedItems.sort((a: any, b: any) => new Date(b.fechaEnvio).getTime() - new Date(a.fechaEnvio).getTime());

      setItems(parsedItems);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
      setItems([]);
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
    try {
      await marcarNotificacionLeida(id);
      setItems((prev) => prev.map((i) => (i.idNotificacion === id ? { ...i, leido: true } : i)));
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
    }
  };

  return {
    cargando,
    items,
    unreadCount,
    markAsRead,
    refresh: fetchNotificaciones,
  };
}
