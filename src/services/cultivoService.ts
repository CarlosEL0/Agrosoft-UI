import { api } from '@/src/api/axiosConfig';
import { CultivoFormData } from '@/src/utils/formSchemas';

export class CultivoService {
    /**
     * Crea un cultivo completo con su Fase Agrícola y Etapas personalizadas sincronizadas
     * con el backend bajo el patrón de Service Layer (SOA Frontend).
     */
    static async crearCultivoCompleto(formData: CultivoFormData, userId: string): Promise<void> {
        // 1. Formatear la fecha principal a YYYY-MM-DD
        let fechaFormateada = new Date().toISOString().split('T')[0];
        if (formData.fechaSiembra) {
            const parts = formData.fechaSiembra.split('/');
            if (parts.length === 3) {
                let y = parts[2];
                if (y.length === 2) y = '20' + y;
                fechaFormateada = `${y}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            }
        }

        // 2. Limpiar texto a números
        const tamanoTerrenoNumerico = formData.tamanoTerreno.replace(/[^0-9]/g, '');
        const cantidadSemillasNumerico = formData.cantidadSemillas.replace(/[^0-9]/g, '');

        // 3. Payload del Cultivo (Enviamos como Number ahora que el backend debe estar corregido)
        const cultivoPayload = {
            idUsuario: userId,
            nombreCultivo: formData.tipoCultivo === 'Otro' ? formData.nombrePersonalizado : formData.tipoCultivo,
            tipoCultivo: formData.tipoCultivoDetalle || 'Vegetal',
            fechaSiembra: fechaFormateada,
            notasGenerales: formData.notasGenerales?.trim() || `Variedad: ${formData.variedad || 'Ninguna'}`,
            region: formData.region || '',
            tamanoTerreno: tamanoTerrenoNumerico ? parseInt(tamanoTerrenoNumerico, 10) : 0,
            cantidadSemillas: cantidadSemillasNumerico ? parseInt(cantidadSemillasNumerico, 10) : 0,
            phSueloMin: formData.phSueloMin ? formData.phSueloMin.toString() : null,
            phSueloMax: formData.phSueloMax ? formData.phSueloMax.toString() : null,
        };

        console.log('>>>>> PAYLOAD CULTIVO:', JSON.stringify(cultivoPayload, null, 2));

        // 4. Crear el Cultivo Base
        const responseCultivo = await api.post('/cultivos', cultivoPayload);
        const idCultivoCreado = responseCultivo.data.data.idCultivo;

        if (!idCultivoCreado) {
            throw new Error('No se pudo obtener el ID del cultivo creado');
        }

        // 5. Preparar fechas del Ciclo 1
        let inicioCicloFormateada = fechaFormateada;
        if (formData.fechaInicioCiclo) {
            const parts = formData.fechaInicioCiclo.split('/');
            if (parts.length === 3) {
                let y = parts[2];
                if (y.length === 2) y = '20' + y;
                inicioCicloFormateada = `${y}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            }
        }

        let finCicloFormateada = fechaFormateada;
        if (formData.fechaFinCiclo) {
            const parts = formData.fechaFinCiclo.split('/');
            if (parts.length === 3) {
                let y = parts[2];
                if (y.length === 2) y = '20' + y;
                finCicloFormateada = `${y}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            }
        }

        // 6. Crear la Fase Agrícola (Ciclo 1)
        const fasePayload = {
            idCultivo: idCultivoCreado,
            numeroCiclo: 1,
            nombreCiclo: formData.nombreCiclo || 'Ciclo 1',
            fechaInicio: inicioCicloFormateada,
            fechaFin: finCicloFormateada,
            estado: 'Activo'
        };
        console.log('>>>>> PAYLOAD FASE:', JSON.stringify(fasePayload, null, 2));

        const responseFase = await api.post('/fases', fasePayload);

        const idCicloCreado = responseFase.data.data.idCiclo;

        // 7. Sincronizar Etapas Personalizadas y eliminar las generadas por defecto en el backend
        if (idCicloCreado && formData.etapas.length > 0) {
            try {
                // A. Obtener etapas autogeneradas por el Java Backend
                const resEtapas = await api.get(`/etapas/ciclo/${idCicloCreado}`);
                const etapasGeneradas = resEtapas.data.data;

                // B. Eliminar etapas autogeneradas
                for (const etapaGen of etapasGeneradas) {
                    await api.delete(`/etapas/${etapaGen.idEtapa}`);
                }

                // C. Formateador local para etapas
                const formatoFecha = (f: string) => {
                    if (!f) return fechaFormateada;
                    const p = f.split('/');
                    if (p.length === 3) {
                        let y = p[2];
                        if (y.length === 2) y = '20' + y;
                        return `${y}-${p[1].padStart(2, '0')}-${p[0].padStart(2, '0')}`;
                    }
                    return fechaFormateada;
                };

                // D. Insertar etapas personalizadas mapeadas desde la UI
                for (let i = 0; i < formData.etapas.length; i++) {
                    const etapaData = formData.etapas[i];
                    const etapaPayload = {
                        idCiclo: idCicloCreado,
                        nombreEtapa: etapaData.nombre || `Etapa ${i + 1}`,
                        ordenEtapa: i + 1,
                        fechaInicio: formatoFecha(etapaData.inicio),
                        fechaFin: formatoFecha(etapaData.fin)
                    };
                    console.log(`>>>>> PAYLOAD ETAPA ${i + 1}:`, JSON.stringify(etapaPayload, null, 2));
                    await api.post('/etapas', etapaPayload);
                }
            } catch (errorEtapas) {
                console.error('Error sincronizando etapas personalizadas:', errorEtapas);
                // Error no bloqueante para no interrumpir el flujo si la fase falló parcialmente
            }
        }
    }

    /**
     * Obtiene y transforma todos los cultivos pertenecientes a un usuario específico.
     */
    static async getCultivosDelUsuario(userId: string): Promise<any[]> {
        const response = await api.get('/cultivos');
        const data = response.data?.data || [];

        // 1. Filtrar solo los del usuario
        const misCultivos = data.filter((c: any) => c.idUsuario === userId);

        // Helper: parsear YYYY-MM-DD como fecha LOCAL (no UTC) para evitar desfases
        const fechaLocal = (iso: string): Date => {
            const [y, m, d] = iso.split('-').map(Number);
            const dt = new Date(y, m - 1, d);
            dt.setHours(0, 0, 0, 0);
            return dt;
        };

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        // 2. Transformar al formato de UI con estado calculado por fases
        const items = await Promise.all(
            misCultivos.map(async (c: any) => {
                let diaTranscurrido = 1;
                if (c.fechaSiembra) {
                    const siembra = fechaLocal(c.fechaSiembra);
                    diaTranscurrido = Math.floor((hoy.getTime() - siembra.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                }

                let estado: 'Activo' | 'Hecho' = 'Activo';
                try {
                    const fasesRes = await api.get(`/fases/cultivo/${c.idCultivo}`);
                    const fases: any[] = fasesRes.data?.data || [];
                    if (fases.length > 0) {
                        const maxFin = fases
                            .map((f) => fechaLocal(f.fechaFin))
                            .reduce((a, b) => (a > b ? a : b));
                        if (hoy >= maxFin) {
                            estado = 'Hecho';
                        }
                    }
                } catch {}

                return {
                    id: c.idCultivo,
                    nombre: c.nombreCultivo,
                    dia: Math.max(1, diaTranscurrido),
                    estado,
                };
            })
        );

        return items;
    }

    /**
     * Obtiene el detalle completo de un cultivo: datos base, fase activa (primer ciclo),
     * y etapa actual calculada automáticamente por fecha.
     */
    static async getDetalleCultivo(idCultivo: string): Promise<any> {
        // Parsear fecha YYYY-MM-DD como hora LOCAL (no UTC) para evitar desfases de zona horaria
        const fechaLocal = (iso: string): Date => {
            const [y, m, d] = iso.split('-').map(Number);
            return new Date(y, m - 1, d); // mes es 0-indexado
        };

        // Fecha de hoy a medianoche local (para comparar solo fechas, sin hora)
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        // 1. Obtener el cultivo base
        const resCultivo = await api.get(`/cultivos/${idCultivo}`);
        const cultivo = resCultivo.data?.data;

        // 2. Obtener todas las fases del cultivo
        const resFases = await api.get(`/fases/cultivo/${idCultivo}`);
        const fases: any[] = resFases.data?.data || [];

        // 3. Calcular días transcurridos desde la siembra
        let diaActual = 0;
        let diaTotal = 0;
        let progreso = 0;
        let cicloNombre = 'Sin ciclo';

        // Ordenar fases por numeroCiclo y tomar la más reciente
        const fasesOrdenadas = [...fases].sort((a, b) => (a.numeroCiclo || 0) - (b.numeroCiclo || 0));
        const faseActiva = fasesOrdenadas.find(f => {
            const inicio = fechaLocal(f.fechaInicio);
            const fin = fechaLocal(f.fechaFin);
            return hoy >= inicio && hoy <= fin;
        }) || fasesOrdenadas[fasesOrdenadas.length - 1]; // fallback: última fase

        if (faseActiva) {
            cicloNombre = faseActiva.nombreCiclo || `Ciclo ${faseActiva.numeroCiclo}`;
            const inicioFase = fechaLocal(faseActiva.fechaInicio);
            const finFase = fechaLocal(faseActiva.fechaFin);
            // +1 para que el primer día sea "Día 1" no "Día 0"
            diaActual = Math.floor((hoy.getTime() - inicioFase.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            diaTotal = Math.round((finFase.getTime() - inicioFase.getTime()) / (1000 * 60 * 60 * 24));
            progreso = diaTotal > 0 ? Math.min(100, Math.round(((diaActual - 1) / diaTotal) * 100)) : 0;
        }

        // 4. Obtener etapas de la fase activa y calcular cuál está activa hoy
        let etapaActual = 'Sin etapa';
        if (faseActiva?.idCiclo) {
            const resEtapas = await api.get(`/etapas/ciclo/${faseActiva.idCiclo}`);
            const etapas: any[] = resEtapas.data?.data || [];

            // Ordenar por fechaInicio
            const etapasOrdenadas = [...etapas].sort((a, b) => fechaLocal(a.fechaInicio).getTime() - fechaLocal(b.fechaInicio).getTime());

            // Buscar la etapa cuyo rango de fechas incluye hoy
            const etapaVigente = etapasOrdenadas.find(e => {
                const inicio = fechaLocal(e.fechaInicio);
                const fin = fechaLocal(e.fechaFin);
                return hoy >= inicio && hoy <= fin;
            });

            if (etapaVigente) {
                etapaActual = etapaVigente.nombreEtapa;
            } else {
                // Si ya pasaron todas las etapas, mostrar la última
                const etapasFinalizadas = etapasOrdenadas.filter(e => fechaLocal(e.fechaFin) < hoy);
                if (etapasFinalizadas.length > 0) {
                    etapaActual = etapasFinalizadas[etapasFinalizadas.length - 1].nombreEtapa + ' (completada)';
                } else if (etapasOrdenadas.length > 0) {
                    // Aún no empezó la primera etapa
                    etapaActual = etapasOrdenadas[0].nombreEtapa;
                }
            }
        }

        // 5. Calcular Salud y Riesgo a partir de irregularidades activas y último registro de crecimiento
        let salud = 'Buena';
        let riesgo = 'Bajo';
        try {
            // A. Obtener irregularidades activas
            const resIrreg = await api.get(`/irregularidades/cultivo/${idCultivo}`, {
                params: { estado: 'activa' }
            });
            const irregActivas: any[] = resIrreg.data?.data || [];
            
            // B. Obtener último registro de crecimiento para ver la salud reportada
            let saludCrecimiento = 'Excelente';
            try {
                const resCrec = await api.get(`/crecimiento/cultivo/${idCultivo}`);
                const crecimientos: any[] = resCrec.data?.data || [];
                if (crecimientos.length > 0) {
                    // Ordenar por fecha y tomar el más reciente
                    const ultimoCrec = crecimientos.sort((a, b) => 
                        new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime()
                    )[0];
                    saludCrecimiento = ultimoCrec.estadoSalud || 'Excelente';
                }
            } catch (errCrec) {
                console.error('Error al obtener crecimiento para salud:', errCrec);
            }

            // C. Lógica de Salud Combinada
            const tieneIrregAlta = irregActivas.some(i => i.severidad === 'Alta');
            const tieneIrregMedia = irregActivas.some(i => i.severidad === 'Media');
            
            if (saludCrecimiento === 'Malo' || tieneIrregAlta || irregActivas.length > 3) {
                salud = 'Mala';
            } else if (saludCrecimiento === 'Regular' || tieneIrregMedia || irregActivas.length > 0) {
                salud = 'Regular';
            } else {
                salud = 'Buena';
            }

            // D. Lógica de Riesgo Combinada
            if (tieneIrregAlta || irregActivas.length > 2 || saludCrecimiento === 'Malo') {
                riesgo = 'Alto';
            } else if (tieneIrregMedia || irregActivas.length > 0 || saludCrecimiento === 'Regular') {
                riesgo = 'Moderado';
            } else {
                riesgo = 'Bajo';
            }
        } catch (err) {
            console.error('Error calculando salud/riesgo:', err);
            // Fallback a valores por defecto si falla algo
        }

        // 6. Llamar a la IA para resumen de cuidados recientes (últimos 7 días)
        //    POST /ai/resumen-cuidados — sin modificar el backend
        const regionContexto = cultivo?.region
            ? `Incluye recomendaciones considerando el clima típico de la región: ${cultivo.region}.`
            : null;
        let resumenIA = 'Analizando los registros del cultivo...';
        try {
            const resIA = await api.post('/ai/resumen-cuidados', {
                idCultivo,
                diasRetroceso: 7,
                preguntaAdicional: regionContexto,
            });
            resumenIA = resIA.data?.data?.resultadoAnalisis || resumenIA;
        } catch {
            resumenIA = 'No se pudo obtener el análisis de IA en este momento.';
        }

        // 7. Retornar en formato compatible con la UI
        return {
            nombre: cultivo?.nombreCultivo || 'Cultivo',
            ciclo: cicloNombre,
            diaActual: Math.max(0, diaActual),
            diaTotal: Math.max(1, diaTotal),
            progreso,
            salud,
            faseActual: etapaActual,
            riesgo,
            resumenIA,
            idCiclo: faseActiva?.idCiclo || null,
        };
    }
}

