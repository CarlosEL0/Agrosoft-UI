export const tiposReporte = ['Riego', 'Poda', 'Plagas', 'Crecimiento', 'Fertilizacion'];

export type CampoFormulario = {
    key: string;
    label: string;
    placeholder: string;
    tipo?: string;
    opciones?: string[];
};

export const camposPorTipo: Record<string, CampoFormulario[]> = {
    Riego: [
        { key: 'cantidad_agua', label: 'Cantidad de agua (litros)', placeholder: 'Ej: 10' },
        { key: 'metodo_riego', label: 'Método de riego', placeholder: 'goteo, aspersion, manual, inundación', tipo: 'select', opciones: ['Goteo', 'Aspersión', 'Manual', 'Inundación'] },
        { key: 'duracion_minutos', label: 'Duración (minutos)', placeholder: 'Ej: 30' },
        { key: 'descripcion', label: 'Descripción', placeholder: 'Descripción del riego' },
        { key: 'observaciones', label: 'Observaciones', placeholder: 'Observaciones adicionales' },
    ],
    Poda: [
        { key: 'tipo_poda', label: 'Tipo de poda', placeholder: 'Selecciona tipo', tipo: 'select', opciones: ['Formación', 'Mantenimiento', 'Sanitaria', 'Rejuvenecimiento'] },
        { key: 'partes_podadas', label: 'Partes podadas', placeholder: 'Ej: hojas, ramas, flores' },
        { key: 'porcentaje_podado', label: 'Porcentaje podado (%)', placeholder: 'Ej: 25' },
        { key: 'herramientas', label: 'Herramientas utilizadas', placeholder: 'Ej: tijeras, serrucho' },
        { key: 'estado_planta', label: 'Estado planta después', placeholder: 'Selecciona estado', tipo: 'select', opciones: ['Buena', 'Regular', 'Estresada'] },
        { key: 'observaciones', label: 'Observaciones', placeholder: 'Observaciones adicionales' },
    ],
    Plagas: [
        { key: 'tipo_irregularidad', label: 'Tipo de irregularidad', placeholder: 'Selecciona tipo', tipo: 'select', opciones: ['Plaga', 'Enfermedad', 'Crecimiento anormal'] },
        { key: 'nombre_plaga', label: 'Nombre de la plaga', placeholder: 'Ej: pulgón, mosca blanca' },
        { key: 'nivel_dano', label: 'Nivel de daño', placeholder: 'Selecciona nivel', tipo: 'select', opciones: ['Leve', 'Moderado', 'Severo', 'Crítico'] },
        { key: 'severidad', label: 'Severidad', placeholder: 'Selecciona severidad', tipo: 'select', opciones: ['Baja', 'Media', 'Alta'] },
        { key: 'fecha_deteccion', label: 'Fecha de detección', placeholder: 'DD/MM/AAAA' },
        { key: 'estado', label: 'Estado', placeholder: 'Selecciona estado', tipo: 'select', opciones: ['Activa', 'En tratamiento', 'Resuelta'] },
        { key: 'comentario', label: 'Comentario del agricultor', placeholder: 'Describe la situación' },
        { key: 'descripcion', label: 'Descripción', placeholder: 'Descripción detallada' },
    ],
    Crecimiento: [
        { key: 'altura_planta', label: 'Altura de la planta (cm)', placeholder: 'Ej: 45.5' },
        { key: 'grosor_tallo', label: 'Grosor del tallo (cm)', placeholder: 'Ej: 2.3' },
        { key: 'diametro', label: 'Diámetro (cm)', placeholder: 'Ej: 5.0' },
        { key: 'estado_salud', label: 'Estado de salud', placeholder: 'Selecciona estado', tipo: 'select', opciones: ['Excelente', 'Bueno', 'Regular', 'Malo'] },
        { key: 'observaciones', label: 'Observaciones', placeholder: 'Observaciones del registro' },
    ],
    Fertilizacion: [
        { key: 'tipo_fertilizante', label: 'Tipo de fertilizante', placeholder: 'Selecciona tipo', tipo: 'select', opciones: ['Orgánico', 'Químico', 'Foliar'] },
        { key: 'nombre_fertilizante', label: 'Nombre del fertilizante', placeholder: 'Ej: Nitrato de amonio' },
        { key: 'cantidad_aplicada', label: 'Cantidad aplicada', placeholder: 'Ej: 5' },
        { key: 'unidad_medida', label: 'Unidad de medida', placeholder: 'Selecciona unidad', tipo: 'select', opciones: ['kg', 'l', 'g'] },
        { key: 'metodo_aplicacion', label: 'Método de aplicación', placeholder: 'Selecciona método', tipo: 'select', opciones: ['Edáfico', 'Foliar', 'Fertirriego'] },
        { key: 'costo', label: 'Costo ($)', placeholder: 'Ej: 150.00' },
        { key: 'observaciones', label: 'Observaciones', placeholder: 'Observaciones adicionales' },
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
    etapas: Etapa[];
    nombrePersonalizado: string;
}

export const tiposCultivo = ['Maiz', 'Frijol', 'Lechuga', 'Otro'];

export const etapasDefault: Etapa[] = [
    { nombre: 'Germinación', inicio: '25/06/24', fin: '25/06/24', dias: 10 },
    { nombre: 'Plántula', inicio: '25/06/24', fin: '25/06/24', dias: 10 },
    { nombre: 'Crecimiento', inicio: '25/06/24', fin: '25/06/24', dias: 10 },
    { nombre: 'Floración', inicio: '25/06/24', fin: '25/06/24', dias: 10 },
    { nombre: 'Cosecha', inicio: '25/06/24', fin: '25/06/24', dias: 10 },
];
