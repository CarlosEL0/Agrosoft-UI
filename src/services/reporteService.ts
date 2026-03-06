import { api } from '@/src/api/axiosConfig';
import { Platform } from 'react-native';

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseFechaDMYToISO(dmy?: string): string | null {
  if (!dmy) return null;
  const parts = dmy.replace(/\s+/g, '').split('/');
  if (parts.length !== 3) return null;
  const [dd, mm, yy] = parts;
  const year = yy.length === 2 ? `20${yy}` : yy;
  return `${year}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
}

function parseISOToDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setHours(0, 0, 0, 0);
  return dt;
}

function fmt(value?: string | number, suffix?: string) {
  if (value === undefined || value === null || value === '') return null;
  const v = typeof value === 'string' ? value : String(value);
  return suffix ? `${v}${suffix}` : v;
}

function buildDescripcionRiego(form: Record<string, string>) {
  const parts = [
    'Riego:',
    fmt(form.cantidad_agua, 'L'),
    form.metodo_riego ? `Método: ${form.metodo_riego}` : null,
    form.duracion_minutos ? `Duración: ${form.duracion_minutos}min` : null,
  ].filter(Boolean);
  return parts.join(' | ');
}

function buildDescripcionPoda(form: Record<string, string>) {
  const parts = [
    'Poda:',
    form.tipo_poda ? `Tipo: ${form.tipo_poda}` : null,
    form.partes_podadas ? `Partes: ${form.partes_podadas}` : null,
    form.porcentaje_podado ? `Porcentaje: ${form.porcentaje_podado}%` : null,
    form.herramientas ? `Herramientas: ${form.herramientas}` : null,
    form.estado_planta ? `Estado: ${form.estado_planta}` : null,
  ].filter(Boolean);
  return parts.join(' | ');
}

function buildDescripcionFertilizacion(form: Record<string, string>) {
  const parts = [
    'Fertilización:',
    form.tipo_fertilizante ? `Tipo: ${form.tipo_fertilizante}` : null,
    form.nombre_fertilizante ? `Nombre: ${form.nombre_fertilizante}` : null,
    fmt(form.cantidad_aplicada) ? `Cantidad: ${form.cantidad_aplicada}` : null,
    form.unidad_medida ? `Unidad: ${form.unidad_medida}` : null,
    form.metodo_aplicacion ? `Método: ${form.metodo_aplicacion}` : null,
    fmt(form.costo) ? `Costo: ${form.costo}` : null,
  ].filter(Boolean);
  return parts.join(' | ');
}

function buildDescripcionFumigacion(form: Record<string, string>) {
  const parts = [
    'Fumigación:',
    form.nombre_producto ? `Producto: ${form.nombre_producto}` : null,
    form.tipo_producto ? `Tipo: ${form.tipo_producto}` : null,
    form.ingrediente_activo ? `Ingrediente: ${form.ingrediente_activo}` : null,
    fmt(form.dosis) ? `Dosis: ${form.dosis}` : null,
    form.unidad_medida ? `Unidad: ${form.unidad_medida}` : null,
    fmt(form.total_mezcla_litros, 'L') ? `Mezcla: ${form.total_mezcla_litros}L` : null,
    form.metodo_aplicacion ? `Método: ${form.metodo_aplicacion}` : null,
    form.plaga_objetivo ? `Plaga: ${form.plaga_objetivo}` : null,
    fmt(form.periodo_seguridad_dias, 'd') ? `PPS: ${form.periodo_seguridad_dias}d` : null,
    fmt(form.costo) ? `Costo: ${form.costo}` : null,
  ].filter(Boolean);
  return parts.join(' | ');
}

async function crearEvento(
  tipoEvento: string,
  idCultivo: string,
  descripcion?: string,
  observaciones?: string,
  fechaEventoISO?: string | null
) {
  // Resolver idEtapa automáticamente según fecha del evento
  let idEtapaResuelta: string | null = null;
  try {
    const fechaISO = fechaEventoISO || todayISO();
    const fecha = parseISOToDate(fechaISO);
    // 1) Fases del cultivo
    const fasesRes = await api.get(`/fases/cultivo/${idCultivo}`);
    const fases: any[] = fasesRes.data?.data || [];
    // Ordenar y encontrar fase que cubra la fecha
    const fasesOrdenadas = [...fases].sort((a, b) => (a.numeroCiclo || 0) - (b.numeroCiclo || 0));
    const faseActiva = fasesOrdenadas.find((f) => {
      const ini = parseISOToDate(f.fechaInicio);
      const fin = parseISOToDate(f.fechaFin);
      return fecha >= ini && fecha <= fin;
    }) || (fasesOrdenadas.length ? fasesOrdenadas[fasesOrdenadas.length - 1] : null);
    if (faseActiva?.idCiclo) {
      // 2) Etapas del ciclo
      const etapasRes = await api.get(`/etapas/ciclo/${faseActiva.idCiclo}`);
      const etapas: any[] = etapasRes.data?.data || [];
      const etapasOrdenadas = [...etapas].sort((a, b) => parseISOToDate(a.fechaInicio).getTime() - parseISOToDate(b.fechaInicio).getTime());
      const etapaVigente = etapasOrdenadas.find((e) => {
        const ini = parseISOToDate(e.fechaInicio);
        const fin = parseISOToDate(e.fechaFin);
        return fecha >= ini && fecha <= fin;
      }) || (etapasOrdenadas.length ? etapasOrdenadas[etapasOrdenadas.length - 1] : null);
      if (etapaVigente?.idEtapa) {
        idEtapaResuelta = etapaVigente.idEtapa;
      }
    }
  } catch {
    // Si algo falla, seguimos con idEtapa null
  }

  const payload = {
    idCultivo,
    idEtapa: idEtapaResuelta,
    tipoEvento,
    fechaEvento: fechaEventoISO || todayISO(),
    descripcion: descripcion || '',
    observaciones: observaciones || '',
  };
  const { data } = await api.post('/eventos', payload);
  return data.data?.idEvento ?? data.data?.id ?? data.data;
}

export async function crearReporteRiego(idCultivo: string, form: Record<string, string>) {
  const fechaISO = parseFechaDMYToISO(form.fecha_evento);
  const desc = form.descripcion || buildDescripcionRiego(form);
  const idEvento = await crearEvento('riego', idCultivo, desc, form.observaciones, fechaISO);
  const payload = {
    idEvento,
    cantidadAgua: form.cantidad_agua ? parseFloat(form.cantidad_agua) : undefined,
    metodoRiego: form.metodo_riego,
    duracionMinutos: form.duracion_minutos ? parseInt(form.duracion_minutos, 10) : undefined,
  };
  return api.post('/riegos', payload);
}

export async function crearReportePoda(idCultivo: string, form: Record<string, string>) {
  const fechaISO = parseFechaDMYToISO(form.fecha_evento);
  const desc = form.descripcion || buildDescripcionPoda(form);
  const idEvento = await crearEvento('poda', idCultivo, desc, form.observaciones, fechaISO);
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
  const fechaISO = parseFechaDMYToISO(form.fecha_evento);
  const desc = form.descripcion || buildDescripcionFertilizacion(form);
  const idEvento = await crearEvento('fertilizacion', idCultivo, desc, form.observaciones, fechaISO);
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
  const fechaISO = parseFechaDMYToISO(form.fecha_evento);
  const desc = form.descripcion || buildDescripcionFumigacion(form);
  const idEvento = await crearEvento('fumigacion', idCultivo, desc, form.observaciones, fechaISO);
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
  // Resolver idEtapa automáticamente para la fecha de registro
  let idEtapaResuelta: string | null = null;
  try {
    const fechaISO = todayISO();
    const fecha = parseISOToDate(fechaISO);
    const fasesRes = await api.get(`/fases/cultivo/${idCultivo}`);
    const fases: any[] = fasesRes.data?.data || [];
    const fasesOrdenadas = [...fases].sort((a, b) => (a.numeroCiclo || 0) - (b.numeroCiclo || 0));
    const faseActiva = fasesOrdenadas.find((f) => {
      const ini = parseISOToDate(f.fechaInicio);
      const fin = parseISOToDate(f.fechaFin);
      return fecha >= ini && fecha <= fin;
    }) || (fasesOrdenadas.length ? fasesOrdenadas[fasesOrdenadas.length - 1] : null);
    if (faseActiva?.idCiclo) {
      const etapasRes = await api.get(`/etapas/ciclo/${faseActiva.idCiclo}`);
      const etapas: any[] = etapasRes.data?.data || [];
      const etapasOrdenadas = [...etapas].sort((a, b) => parseISOToDate(a.fechaInicio).getTime() - parseISOToDate(b.fechaInicio).getTime());
      const etapaVigente = etapasOrdenadas.find((e) => {
        const ini = parseISOToDate(e.fechaInicio);
        const fin = parseISOToDate(e.fechaFin);
        return fecha >= ini && fecha <= fin;
      }) || (etapasOrdenadas.length ? etapasOrdenadas[etapasOrdenadas.length - 1] : null);
      if (etapaVigente?.idEtapa) {
        idEtapaResuelta = etapaVigente.idEtapa;
      }
    }
  } catch {}

  const payload = {
    idCultivo,
    idEtapa: idEtapaResuelta,
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

export async function getEventosPorCultivo(idCultivo: string) {
  return api.get(`/eventos/cultivo/${idCultivo}`);
}

export async function getRiegoPorEvento(idEvento: string) {
  return api.get(`/riegos/evento/${idEvento}`);
}

export async function getPodaPorEvento(idEvento: string) {
  return api.get(`/podas/evento/${idEvento}`);
}

export async function getFertilizacionPorEvento(idEvento: string) {
  return api.get(`/fertilizaciones/evento/${idEvento}`);
}

export async function getFumigacionPorEvento(idEvento: string) {
  return api.get(`/fumigaciones/evento/${idEvento}`);
}

export async function getIrregularidadesPorCultivo(idCultivo: string) {
  return api.get(`/irregularidades/cultivo/${idCultivo}`);
}

export async function getCrecimientoPorCultivo(idCultivo: string) {
  return api.get(`/crecimiento/cultivo/${idCultivo}`);
}

export async function getEtapaPorId(idEtapa: string) {
  return api.get(`/etapas/${idEtapa}`);
}

export async function getEventoPorId(idEvento: string) {
  return api.get(`/eventos/${idEvento}`);
}
