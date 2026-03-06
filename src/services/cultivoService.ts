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

        // 3. Payload del Cultivo
        const cultivoPayload = {
            idUsuario: userId,
            nombreCultivo: formData.tipoCultivo === 'Otro' ? formData.nombrePersonalizado : formData.tipoCultivo,
            tipoCultivo: formData.tipoCultivoDetalle || 'Vegetal',
            fechaSiembra: fechaFormateada,
            notasGenerales: `Variedad: ${formData.variedad || 'Ninguna'}`.trim(),
            tamanoTerreno: tamanoTerrenoNumerico ? parseInt(tamanoTerrenoNumerico, 10) : null,
            cantidadSemillas: cantidadSemillasNumerico ? parseInt(cantidadSemillasNumerico, 10) : null,
            alturaEsperada: null,
        };

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
        const responseFase = await api.post('/fases', {
            idCultivo: idCultivoCreado,
            numeroCiclo: 1,
            nombreCiclo: formData.nombreCiclo || 'Ciclo 1',
            fechaInicio: inicioCicloFormateada,
            fechaFin: finCicloFormateada,
            estado: 'Activo'
        });

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
                    await api.post('/etapas', {
                        idCiclo: idCicloCreado,
                        nombreEtapa: etapaData.nombre || `Etapa ${i + 1}`,
                        ordenEtapa: i + 1,
                        fechaInicio: formatoFecha(etapaData.inicio),
                        fechaFin: formatoFecha(etapaData.fin)
                    });
                }
            } catch (errorEtapas) {
                console.error('Error sincronizando etapas personalizadas:', errorEtapas);
                // Error no bloqueante para no interrumpir el flujo si la fase falló parcialmente
            }
        }
    }
}
