import { api } from '@/src/api/axiosConfig';
import { Platform } from 'react-native';

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

async function crearEvento(tipoEvento: string, idCultivo: string, descripcion?: string, observaciones?: string) {
  const payload = {
    idCultivo,
    idEtapa: null,
    tipoEvento,
    fechaEvento: todayISO(),
    descripcion: descripcion || '',
    observaciones: observaciones || '',
  };
  const { data } = await api.post('/eventos', payload);
  return data.data?.idEvento ?? data.data?.id ?? data.data;
}

export async function crearReporteRiego(idCultivo: string, form: Record<string, string>) {
  const idEvento = await crearEvento('riego', idCultivo, form.descripcion, form.observaciones);
  const payload = {
    idEvento,
    cantidadAgua: form.cantidad_agua ? parseFloat(form.cantidad_agua) : undefined,
    metodoRiego: form.metodo_riego,
    duracionMinutos: form.duracion_minutos ? parseInt(form.duracion_minutos, 10) : undefined,
  };
  return api.post('/riegos', payload);
}

export async function crearReportePoda(idCultivo: string, form: Record<string, string>) {
  const idEvento = await crearEvento('poda', idCultivo, form.observaciones, form.observaciones);
  const payload = {
    idEvento,
    tipoPoda: form.tipo_poda,
    partesPodadas: form.partes_podadas,
    porcentajePodado: form.porcentaje_podado ? parseFloat(form.porcentaje_podado) : undefined,
    herramientasUtilizadas: form.herramientas,
    estadoPlantaDespues: form.estado_planta,
  };
  return api.post('/podas', payload);
}

export async function crearReporteFertilizacion(idCultivo: string, form: Record<string, string>) {
  const idEvento = await crearEvento('fertilizacion', idCultivo, form.observaciones, form.observaciones);
  const payload = {
    idEvento,
    tipoFertilizante: form.tipo_fertilizante,
    nombreFertilizante: form.nombre_fertilizante,
    cantidadAplicada: form.cantidad_aplicada ? parseFloat(form.cantidad_aplicada) : undefined,
    unidadMedida: form.unidad_medida,
    metodoAplicacion: form.metodo_aplicacion,
    costo: form.costo ? parseFloat(form.costo) : undefined,
  };
  return api.post('/fertilizaciones', payload);
}

export async function crearReporteFumigacion(idCultivo: string, form: Record<string, string>) {
  const idEvento = await crearEvento('fumigacion', idCultivo, form.plaga_objetivo, form.observaciones);
  const payload = {
    idEvento,
    nombreProducto: form.nombre_producto,
    tipoProducto: form.tipo_producto,
    ingredienteActivo: form.ingrediente_activo,
    dosis: form.dosis ? parseFloat(form.dosis) : undefined,
    unidadMedida: form.unidad_medida,
    totalMezclaLitros: form.total_mezcla_litros ? parseFloat(form.total_mezcla_litros) : undefined,
    metodoAplicacion: form.metodo_aplicacion,
    plagaObjetivo: form.plaga_objetivo,
    periodoSeguridadDias: form.periodo_seguridad_dias ? parseInt(form.periodo_seguridad_dias, 10) : undefined,
    costo: form.costo ? parseFloat(form.costo) : undefined,
  };
  return api.post('/fumigaciones', payload);
}

export async function reportarIrregularidad(idCultivo: string, form: Record<string, string>) {
  const payload = {
    idCultivo,
    idRegistro: null,
    tipoIrregularidad: form.tipo_irregularidad,
    nombrePlaga: form.nombre_plaga,
    nivelDano: form.nivel_dano,
    comentarioAgricultor: form.comentario,
    severidad: form.severidad,
    estado: form.estado,
    descripcion: form.descripcion,
  };
  return api.post('/irregularidades', payload);
}

export async function registrarCrecimiento(idCultivo: string, form: Record<string, string>) {
  const payload = {
    idCultivo,
    idEtapa: null,
    fechaRegistro: todayISO(),
    alturaPlanta: form.altura_planta ? parseFloat(form.altura_planta) : undefined,
    grosorTallo: form.grosor_tallo ? parseFloat(form.grosor_tallo) : undefined,
    diametro: form.diametro ? parseFloat(form.diametro) : undefined,
    estadoSalud: form.estado_salud,
    observaciones: form.observaciones,
  };
  return api.post('/crecimiento', payload);
}

export async function enviarReporte(tipo: string, idCultivo: string, form: Record<string, string>) {
  switch (tipo) {
    case 'Riego':
      return crearReporteRiego(idCultivo, form);
    case 'Poda':
      return crearReportePoda(idCultivo, form);
    case 'Fertilizacion':
      return crearReporteFertilizacion(idCultivo, form);
    case 'Fumigacion':
      return crearReporteFumigacion(idCultivo, form);
    case 'Irregularidad':
      return reportarIrregularidad(idCultivo, form);
    case 'Crecimiento':
      return registrarCrecimiento(idCultivo, form);
    default:
      throw new Error(`Tipo de reporte no soportado: ${tipo}`);
  }
}

export async function uploadImagen(
  uri: string,
  idReferencia: string,
  tipo: 'RIEGO' | 'FERTILIZACION' | 'FUMIGACION' | 'PODA' | 'IRREGULARIDAD' | 'CRECIMIENTO',
  descripcion?: string,
  onProgress?: (percent: number) => void
) {
  const nombre = uri.split('/').pop() || `foto-${Date.now()}.jpg`;
  const formData = new FormData();
  if (Platform.OS === 'web') {
    const resp = await fetch(uri);
    const blob = await resp.blob();
    const file = new File([blob], nombre, { type: blob.type || 'image/jpeg' });
    formData.append('archivo', file);
  } else {
    formData.append('archivo', {
      uri,
      name: nombre,
      type: 'image/jpeg',
    } as any);
  }
  formData.append('descripcion', descripcion || '');
  formData.append('idReferencia', idReferencia);
  formData.append('tipo', tipo);

  return api.post('/imagenes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (e.total && e.total > 0) {
        const pct = Math.round((e.loaded / e.total) * 100);
        if (onProgress) onProgress(pct);
      }
    },
  });
}
