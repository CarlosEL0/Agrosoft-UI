import { api } from '@/src/api/axiosConfig';

export async function getNotificacionesDelUsuario(idUsuario: string) {
  return api.get(`/notificaciones/usuario/${idUsuario}`);
}

export async function marcarNotificacionLeida(idNotificacion: string) {
  return api.patch(`/notificaciones/${idNotificacion}/leida`);
}

export async function ejecutarRevisionEtapas() {
  return api.post(`/notificaciones/check-etapas`);
}
