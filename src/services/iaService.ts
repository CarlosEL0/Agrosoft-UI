import { api } from '@/src/api/axiosConfig';

export type AnalisisIaResponse = {
  idAnalisis?: string;
  idCultivo?: string;
  tipoAnalisis?: string;
  resultadoAnalisis?: string;
  recomendaciones?: Array<{
    idRecomendacion?: string;
    titulo?: string;
    descripcion?: string;
    mensaje?: string;
    mensajeBase?: string;
    prioridad?: string;
  }>;
};

export async function getAnalisisIA(idCultivo: string, idIrregularidad?: string, preguntaAdicional?: string) {
  const payload = {
    idCultivo,
    idIrregularidad: idIrregularidad || null,
    tipoAnalisis: 'recomendacion',
    preguntaAdicional: preguntaAdicional || null,
  };
  const res = await api.post('/ai/analyze', payload);
  return res.data?.data as AnalisisIaResponse;
}
