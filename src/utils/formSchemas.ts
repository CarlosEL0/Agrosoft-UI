export const tiposReporte = ['Riego', 'Poda', 'Irregularidad', 'Crecimiento', 'Fertilizacion', 'Fumigacion'];

export type CampoFormulario = {
    key: string;
    label: string;
    placeholder: string;
    tipo?: string;
    opciones?: string[];
};

export const camposPorTipo: Record<string, CampoFormulario[]> = {
    Riego: [
        { key: 'cantidad_agua', label: 'Cantidad de agua (litros)', placeholder: 'Ej: 10', tipo: 'numeric' },
        { key: 'metodo_riego', label: 'Método de riego', placeholder: 'goteo, aspersion, manual, inundación', tipo: 'select', opciones: ['Goteo', 'Aspersión', 'Manual', 'Inundación'] },
        { key: 'duracion_minutos', label: 'Duración (minutos)', placeholder: 'Ej: 30', tipo: 'numeric' },
        { key: 'descripcion', label: 'Descripción', placeholder: 'Descripción del riego', tipo: 'textarea' },
        { key: 'observaciones', label: 'Observaciones', placeholder: 'Observaciones adicionales', tipo: 'textarea' },
    ],
    Poda: [
        { key: 'tipo_poda', label: 'Tipo de poda', placeholder: 'Selecciona tipo', tipo: 'select', opciones: ['Formación', 'Mantenimiento', 'Sanitaria', 'Rejuvenecimiento'] },
        { key: 'partes_podadas', label: 'Partes podadas', placeholder: 'Ej: hojas, ramas, flores' },
        { key: 'porcentaje_podado', label: 'Porcentaje podado (%)', placeholder: 'Ej: 25', tipo: 'numeric' },
        { key: 'herramientas', label: 'Herramientas utilizadas', placeholder: 'Ej: tijeras, serrucho' },
        { key: 'estado_planta', label: 'Estado planta después', placeholder: 'Selecciona estado', tipo: 'select', opciones: ['Buena', 'Regular', 'Estresada'] },
        { key: 'observaciones', label: 'Observaciones', placeholder: 'Observaciones adicionales', tipo: 'textarea' },
    ],
    Irregularidad: [
        { key: 'tipo_irregularidad', label: 'Tipo de irregularidad', placeholder: 'Selecciona tipo', tipo: 'select', opciones: ['Plaga', 'Enfermedad', 'Crecimiento anormal'] },
        { key: 'nombre_plaga', label: 'Nombre de la plaga', placeholder: 'Ej: pulgón, mosca blanca' },
        { key: 'nivel_dano', label: 'Nivel de daño', placeholder: 'Selecciona nivel', tipo: 'select', opciones: ['Leve', 'Moderado', 'Severo', 'Crítico'] },
        { key: 'severidad', label: 'Severidad', placeholder: 'Selecciona severidad', tipo: 'select', opciones: ['Baja', 'Media', 'Alta'] },
        { key: 'estado', label: 'Estado', placeholder: 'Selecciona estado', tipo: 'select', opciones: ['Activa', 'En tratamiento', 'Resuelta'] },
        { key: 'comentario', label: 'Comentario del agricultor', placeholder: 'Describe la situación', tipo: 'textarea' },
        { key: 'descripcion', label: 'Descripción', placeholder: 'Descripción detallada', tipo: 'textarea' },
    ],
    Crecimiento: [
        { key: 'altura_planta', label: 'Altura de la planta (cm)', placeholder: 'Ej: 45.5', tipo: 'decimal' },
        { key: 'grosor_tallo', label: 'Grosor del tallo (cm)', placeholder: 'Ej: 2.3', tipo: 'decimal' },
        { key: 'diametro', label: 'Diámetro (cm)', placeholder: 'Ej: 5.0', tipo: 'decimal' },
        { key: 'estado_salud', label: 'Estado de salud', placeholder: 'Selecciona estado', tipo: 'select', opciones: ['Excelente', 'Bueno', 'Regular', 'Malo'] },
        { key: 'observaciones', label: 'Observaciones', placeholder: 'Observaciones del registro', tipo: 'textarea' },
    ],
    Fertilizacion: [
        { key: 'tipo_fertilizante', label: 'Tipo de fertilizante', placeholder: 'Selecciona tipo', tipo: 'select', opciones: ['Orgánico', 'Químico', 'Foliar'] },
        { key: 'nombre_fertilizante', label: 'Nombre del fertilizante', placeholder: 'Ej: Nitrato de amonio' },
        { key: 'cantidad_aplicada', label: 'Cantidad aplicada', placeholder: 'Ej: 5', tipo: 'decimal' },
        { key: 'unidad_medida', label: 'Unidad de medida', placeholder: 'Selecciona unidad', tipo: 'select', opciones: ['kg', 'l', 'g'] },
        { key: 'metodo_aplicacion', label: 'Método de aplicación', placeholder: 'Selecciona método', tipo: 'select', opciones: ['Edáfico', 'Foliar', 'Fertirriego'] },
        { key: 'costo', label: 'Costo ($)', placeholder: 'Ej: 150.00', tipo: 'decimal' },
        { key: 'observaciones', label: 'Observaciones', placeholder: 'Observaciones adicionales', tipo: 'textarea' },
    ],
    Fumigacion: [
        { key: 'nombre_producto', label: 'Nombre del producto', placeholder: 'Ej: Clorpirifos' },
        { key: 'tipo_producto', label: 'Tipo de producto', placeholder: 'Selecciona tipo', tipo: 'select', opciones: ['Insecticida', 'Fungicida', 'Herbicida', 'Acaricida'] },
        { key: 'ingrediente_activo', label: 'Ingrediente activo', placeholder: 'Ej: Imidacloprid' },
        { key: 'dosis', label: 'Dosis aplicada', placeholder: 'Ej: 2.5', tipo: 'decimal' },
        { key: 'unidad_medida', label: 'Unidad de medida', placeholder: 'Selecciona unidad', tipo: 'select', opciones: ['ml/l', 'g/l', 'kg/ha'] },
        { key: 'total_mezcla_litros', label: 'Total mezcla (litros)', placeholder: 'Ej: 20', tipo: 'decimal' },
        { key: 'metodo_aplicacion', label: 'Método de aplicación', placeholder: 'Selecciona método', tipo: 'select', opciones: ['Aspersión', 'Espolvoreo', 'Inyección'] },
        { key: 'plaga_objetivo', label: 'Plaga objetivo', placeholder: 'Ej: pulgón, mosca blanca' },
        { key: 'periodo_seguridad_dias', label: 'Período de seguridad (días)', placeholder: 'Ej: 14', tipo: 'numeric' },
        { key: 'costo', label: 'Costo ($)', placeholder: 'Ej: 200.00', tipo: 'decimal' },
    ],
};

// ── Tipos y configuraciones para Crear Cultivo ────────────────────────────────


export interface Etapa {
    nombre: string;
    inicio: string;
    fin: string;
    dias: number;
}

export interface CultivoFormData {
    tipoCultivo: string;
    variedad: string;
    tipoCultivoDetalle: string;
    tamanoTerreno: string;
    cantidadSemillas: string;
    fechaSiembra: string;
    nombreCiclo: string;
    fechaInicioCiclo: string;
    fechaFinCiclo: string;
    etapas: Etapa[];
    nombrePersonalizado: string;
    // Nuevos campos del backend
    region: string;
    notasGenerales: string;
    phSueloMin: string;
    phSueloMax: string;
    usarIA: boolean;
}

export const tiposCultivo = ['Maiz', 'Frijol', 'Lechuga', 'Otro'];

export function generarEtapasPreview(fechaSiembraInput: string): Etapa[] {
    let baseDate = new Date();
    if (fechaSiembraInput) {
        const parts = fechaSiembraInput.split('/');
        if (parts.length === 3) {
            let y = parts[2];
            if (y.length === 2) y = '20' + y;
            baseDate = new Date(parseInt(y), parseInt(parts[1]) - 1, parseInt(parts[0]));
        }
    }

    const formatearFecha = (d: Date) => {
        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const anio = String(d.getFullYear()).slice(-2);
        return `${dia}/${mes}/${anio}`;
    };

    const sumarDias = (d: Date, dias: number) => {
        const nueva = new Date(d);
        nueva.setDate(nueva.getDate() + dias);
        return nueva;
    };

    const duraciones = [
        { nombre: 'Germinación', dias: 10 },
        { nombre: 'Plántula', dias: 10 },
        { nombre: 'Crecimiento', dias: 20 },
        { nombre: 'Floración', dias: 20 },
        { nombre: 'Cosecha', dias: 15 },
    ];

    let fechaActual = baseDate;
    const etapas: Etapa[] = [];

    for (const etapa of duraciones) {
        const fechaInicio = formatearFecha(fechaActual);
        const fechaFinObj = sumarDias(fechaActual, etapa.dias);
        const fechaFin = formatearFecha(fechaFinObj);

        etapas.push({
            nombre: etapa.nombre,
            inicio: fechaInicio,
            fin: fechaFin,
            dias: etapa.dias
        });

        fechaActual = fechaFinObj;
    }

    return etapas;
}
