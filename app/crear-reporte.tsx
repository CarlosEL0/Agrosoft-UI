// app/crear-reporte.tsx
// Flujo de 2 pasos para crear reportes de cultivo
// Tipos: Riego, Poda, Plagas, Crecimiento, Fertilizacion

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Svg, Path, Circle, Rect } from 'react-native-svg';
import { Colors } from '@/src/theme/colors';

const { width } = Dimensions.get('window');

// ── Íconos ───────────────────────────────────────────────────────────────────

function BackIcon() {
  return (
    <Svg width={44} height={44} viewBox="0 0 44 44" fill="none">
      <Circle cx={22} cy={22} r={22} fill={Colors.buttonSecundary} />
      <Path d="M25 14l-8 8 8 8" stroke="#fff" strokeWidth={2.5}
        strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function PlantCircleIcon({ size = 56 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Circle cx={32} cy={32} r={32} fill={Colors.primary} />
      <Path d="M32 44V32" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
      <Path d="M32 38C32 38 24 35 22 27C22 27 30 23 34 31"
        stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M32 33C32 33 38 29 42 33C42 33 40 41 32 39"
        stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Rect x={26} y={44} width={12} height={8} rx={2} fill="#fff" opacity={0.9} />
    </Svg>
  );
}

function ImageIcon() {
  return (
    <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={3} width={18} height={18} rx={2} stroke={Colors.textLight} strokeWidth={1.5} />
      <Circle cx={8.5} cy={8.5} r={1.5} fill={Colors.textLight} />
      <Path d="M21 15l-5-5L5 21" stroke={Colors.textLight} strokeWidth={1.5}
        strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function PlusIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={Colors.textLight} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

// ── Indicador de pasos ────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  return (
    <View style={styles.stepIndicator}>
      {[1, 2].map((step, i) => (
        <React.Fragment key={step}>
          <View style={[
            styles.stepDot,
            current >= step && styles.stepDotActive,
          ]} />
          {i < 1 && (
            <View style={[
              styles.stepLine,
              current > 1 && styles.stepLineActive,
            ]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

// ── Tipos de reporte ──────────────────────────────────────────────────────────

const tiposReporte = ['Riego', 'Poda', 'Plagas', 'Crecimiento', 'Fertilizacion'];

// ── Campos dinámicos por tipo de reporte ─────────────────────────────────────

// Basado en el schema de la BD
const camposPorTipo: Record<string, { key: string; label: string; placeholder: string; tipo?: string; opciones?: string[] }[]> = {
  Riego: [
    { key: 'cantidad_agua',     label: 'Cantidad de agua (litros)',  placeholder: 'Ej: 10' },
    { key: 'metodo_riego',      label: 'Método de riego',            placeholder: 'goteo, aspersion, manual, inundación',
      tipo: 'select', opciones: ['Goteo', 'Aspersión', 'Manual', 'Inundación'] },
    { key: 'duracion_minutos',  label: 'Duración (minutos)',         placeholder: 'Ej: 30' },
    { key: 'descripcion',       label: 'Descripción',                placeholder: 'Descripción del riego' },
    { key: 'observaciones',     label: 'Observaciones',              placeholder: 'Observaciones adicionales' },
  ],
  Poda: [
    { key: 'tipo_poda',           label: 'Tipo de poda',             placeholder: 'Selecciona tipo',
      tipo: 'select', opciones: ['Formación', 'Mantenimiento', 'Sanitaria', 'Rejuvenecimiento'] },
    { key: 'partes_podadas',      label: 'Partes podadas',           placeholder: 'Ej: hojas, ramas, flores' },
    { key: 'porcentaje_podado',   label: 'Porcentaje podado (%)',    placeholder: 'Ej: 25' },
    { key: 'herramientas',        label: 'Herramientas utilizadas',  placeholder: 'Ej: tijeras, serrucho' },
    { key: 'estado_planta',       label: 'Estado planta después',    placeholder: 'Selecciona estado',
      tipo: 'select', opciones: ['Buena', 'Regular', 'Estresada'] },
    { key: 'observaciones',       label: 'Observaciones',            placeholder: 'Observaciones adicionales' },
  ],
  Plagas: [
    { key: 'tipo_irregularidad',  label: 'Tipo de irregularidad',    placeholder: 'Selecciona tipo',
      tipo: 'select', opciones: ['Plaga', 'Enfermedad', 'Crecimiento anormal'] },
    { key: 'nombre_plaga',        label: 'Nombre de la plaga',       placeholder: 'Ej: pulgón, mosca blanca' },
    { key: 'nivel_dano',          label: 'Nivel de daño',            placeholder: 'Selecciona nivel',
      tipo: 'select', opciones: ['Leve', 'Moderado', 'Severo', 'Crítico'] },
    { key: 'severidad',           label: 'Severidad',                placeholder: 'Selecciona severidad',
      tipo: 'select', opciones: ['Baja', 'Media', 'Alta'] },
    { key: 'fecha_deteccion',     label: 'Fecha de detección',        placeholder: 'DD/MM/AAAA' }, 
    { key: 'estado',              label: 'Estado',                   placeholder: 'Selecciona estado',
      tipo: 'select', opciones: ['Activa', 'En tratamiento', 'Resuelta'] },
    { key: 'comentario',          label: 'Comentario del agricultor', placeholder: 'Describe la situación' },
    { key: 'descripcion',         label: 'Descripción',              placeholder: 'Descripción detallada' },
  ],
  Crecimiento: [
    { key: 'altura_planta',     label: 'Altura de la planta (cm)',   placeholder: 'Ej: 45.5' },
    { key: 'grosor_tallo',      label: 'Grosor del tallo (cm)',      placeholder: 'Ej: 2.3' },
    { key: 'diametro',          label: 'Diámetro (cm)',              placeholder: 'Ej: 5.0' },
    { key: 'estado_salud',      label: 'Estado de salud',            placeholder: 'Selecciona estado',
      tipo: 'select', opciones: ['Excelente', 'Bueno', 'Regular', 'Malo'] },
    { key: 'observaciones',     label: 'Observaciones',              placeholder: 'Observaciones del registro' },
  ],
  Fertilizacion: [
    { key: 'tipo_fertilizante',   label: 'Tipo de fertilizante',     placeholder: 'Selecciona tipo',
      tipo: 'select', opciones: ['Orgánico', 'Químico', 'Foliar'] },
    { key: 'nombre_fertilizante', label: 'Nombre del fertilizante',  placeholder: 'Ej: Nitrato de amonio' },
    { key: 'cantidad_aplicada',   label: 'Cantidad aplicada',        placeholder: 'Ej: 5' },
    { key: 'unidad_medida',       label: 'Unidad de medida',         placeholder: 'Selecciona unidad',
      tipo: 'select', opciones: ['kg', 'l', 'g'] },
    { key: 'metodo_aplicacion',   label: 'Método de aplicación',     placeholder: 'Selecciona método',
      tipo: 'select', opciones: ['Edáfico', 'Foliar', 'Fertirriego'] },
    { key: 'costo',               label: 'Costo ($)',                placeholder: 'Ej: 150.00' },
    { key: 'observaciones',       label: 'Observaciones',            placeholder: 'Observaciones adicionales' },
  ],
};

// ── Componente campo ──────────────────────────────────────────────────────────

function Campo({
  campo,
  value,
  onChange,
}: {
  campo: { key: string; label: string; placeholder: string; tipo?: string; opciones?: string[] };
  value: string;
  onChange: (v: string) => void;
}) {
  if (campo.tipo === 'select' && campo.opciones) {
    return (
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>{campo.label}</Text>
        <View style={styles.opcionesRow}>
          {campo.opciones.map((op) => (
            <TouchableOpacity
              key={op}
              style={[styles.opcionPill, value === op && styles.opcionPillActive]}
              onPress={() => onChange(op)}
            >
              <Text style={[styles.opcionText, value === op && styles.opcionTextActive]}>
                {op}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{campo.label}</Text>
      <TextInput
        style={styles.textInput}
        placeholder={campo.placeholder}
        placeholderTextColor={Colors.textPlaceholder}
        value={value}
        onChangeText={onChange}
        keyboardType={
          ['cantidad_agua', 'duracion_minutos', 'altura_planta',
           'grosor_tallo', 'diametro', 'cantidad_aplicada', 'costo', 'porcentaje_podado'].includes(campo.key)
            ? 'numeric' : 'default'
        }
        multiline={['descripcion', 'observaciones', 'comentario'].includes(campo.key)}
        numberOfLines={['descripcion', 'observaciones', 'comentario'].includes(campo.key) ? 3 : 1}
      />
    </View>
  );
}

// ── Paso 1: Tipo de reporte ───────────────────────────────────────────────────

function Paso1({
  tipoSeleccionado,
  onSelect,
  onNext,
}: {
  tipoSeleccionado: string;
  onSelect: (tipo: string) => void;
  onNext: () => void;
}) {
  // Grid 2x2 + 1 centrado (igual al diseño Figma)
  const filas = [
    tiposReporte.slice(0, 2),
    tiposReporte.slice(2, 4),
    tiposReporte.slice(4),
  ];

  return (
    <ScrollView contentContainerStyle={styles.pasoContent} showsVerticalScrollIndicator={false}>
      <View style={styles.pasoCard}>
        <Text style={styles.pasoQuestion}>Que tipo de reporte realizaras?</Text>

        {filas.map((fila, fi) => (
          <View key={fi} style={styles.tiposRow}>
            {fila.map((tipo) => (
              <TouchableOpacity
                key={tipo}
                style={[
                  styles.tipoOption,
                  fila.length === 1 && styles.tipoOptionSolo,
                  tipoSeleccionado === tipo && styles.tipoOptionActive,
                ]}
                onPress={() => onSelect(tipo)}
                activeOpacity={0.8}
              >
                <PlantCircleIcon size={56} />
                <Text style={styles.tipoOptionText}>{tipo}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.continueBtn, !tipoSeleccionado && styles.continueBtnDisabled]}
        onPress={onNext}
        disabled={!tipoSeleccionado}
        activeOpacity={0.85}
      >
        <Text style={styles.continueBtnText}>Continuar &gt;</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ── Paso 2: Formulario + Fotos ────────────────────────────────────────────────

function Paso2({
  tipo,
  formData,
  onChange,
  fotos,
  onAddFoto,
  onSubmit,
}: {
  tipo: string;
  formData: Record<string, string>;
  onChange: (key: string, value: string) => void;
  fotos: null[];
  onAddFoto: () => void;
  onSubmit: () => void;
}) {
  const campos = camposPorTipo[tipo] || [];

  return (
    <ScrollView contentContainerStyle={styles.pasoContent} showsVerticalScrollIndicator={false}>

      {/* Campos del formulario */}
      <View style={styles.pasoCard}>
        <Text style={styles.pasoQuestion}>Reporte de {tipo.toLowerCase()}</Text>

        {/* Campos comunes del evento */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Fecha del evento</Text>
          <TextInput
            style={styles.textInput}
            placeholder="DD/MM/AAAA"
            placeholderTextColor={Colors.textPlaceholder}
            value={formData['fecha_evento'] || ''}
            onChangeText={(v) => onChange('fecha_evento', v)}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Etapa del cultivo</Text>
          <View style={styles.opcionesRow}>
            {['Germinacion', 'Plántula', 'Crecimiento', 'Floración', 'Cosecha'].map((etapa) => (
              <TouchableOpacity
                key={etapa}
                style={[
                  styles.opcionPill,
                  formData['etapa'] === etapa && styles.opcionPillActive,
                ]}
                onPress={() => onChange('etapa', etapa)}
              >
                <Text style={[
                  styles.opcionText,
                  formData['etapa'] === etapa && styles.opcionTextActive,
                ]}>
                  {etapa}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Campos específicos del tipo */}
        {campos.map((campo) => (
          <Campo
            key={campo.key}
            campo={campo}
            value={formData[campo.key] || ''}
            onChange={(v) => onChange(campo.key, v)}
          />
        ))}
      </View>

      {/* Fotos del reporte */}
      <View style={styles.pasoCard}>
        <Text style={styles.pasoQuestion}>Fotos del reporte</Text>
        <View style={styles.fotosGrid}>
          {fotos.map((_, i) => (
            <View key={i} style={styles.fotoPlaceholder}>
              <ImageIcon />
            </View>
          ))}
          {/* Botón agregar foto */}
          <TouchableOpacity style={styles.fotoAdd} onPress={onAddFoto}>
            <PlusIcon />
            <Text style={styles.fotoAddText}>Agregar foto</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.continueBtn} onPress={onSubmit} activeOpacity={0.85}>
        <Text style={styles.continueBtnText}>Guardar reporte</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

// ── Pantalla principal ────────────────────────────────────────────────────────

export default function CrearReporteScreen() {
  const router = useRouter();
  const [paso, setPaso] = useState(1);
  const [tipoReporte, setTipoReporte] = useState('');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [fotos, setFotos] = useState<null[]>([]);

  const titles = ['Crear reporte', `Reporte de ${tipoReporte.toLowerCase()}`];

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleBack = () => {
    if (paso === 1) router.back();
    else setPaso(1);
  };

  const handleSubmit = () => {
    // TODO: conectar con API
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <BackIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{titles[paso - 1]}</Text>
        </View>

        {/* ── Indicador de pasos ── */}
        <View style={styles.stepRow}>
          <Text style={styles.stepText}>Paso {paso} de 2</Text>
          <StepIndicator current={paso} />
        </View>

        {paso === 1 && (
          <Paso1
            tipoSeleccionado={tipoReporte}
            onSelect={setTipoReporte}
            onNext={() => setPaso(2)}
          />
        )}

        {paso === 2 && (
          <Paso2
            tipo={tipoReporte}
            formData={formData}
            onChange={handleChange}
            fotos={fotos}
            onAddFoto={() => setFotos((prev) => [...prev, null])}
            onSubmit={handleSubmit}
          />
        )}

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Estilos ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f4f3',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 20,
    color: Colors.textDark,
    textTransform: 'capitalize',
  },

  // Step indicator
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingBottom: 16,
    gap: 16,
  },
  stepText: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 14,
    color: Colors.textDark,
  },
  stepIndicator: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#d0d8d2',
  },
  stepDotActive: {
    backgroundColor: Colors.primary,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#d0d8d2',
    marginHorizontal: 4,
  },
  stepLineActive: {
    backgroundColor: Colors.primary,
  },

  // Paso contenido
  pasoContent: {
    paddingHorizontal: 22,
    paddingBottom: 32,
    gap: 16,
  },
  pasoCard: {
    backgroundColor: '#e8ede9',
    borderRadius: 20,
    padding: 20,
    gap: 14,
  },
  pasoQuestion: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 18,
    color: Colors.textDark,
    marginBottom: 4,
  },

  // Paso 1 - Tipos
  tiposRow: {
    flexDirection: 'row',
    gap: 12,
  },
  tipoOption: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  tipoOptionSolo: {
    flex: 0,
    width: (width - 44 - 40 - 12) / 2,
  },
  tipoOptionActive: {
    backgroundColor: '#c8dace',
  },
  tipoOptionText: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 15,
    color: Colors.textDark,
  },

  // Campos
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 14,
    color: Colors.textDark,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontFamily: 'Rubik_400Regular',
    fontSize: 14,
    color: Colors.textDark,
    textAlignVertical: 'top',
  },

  // Opciones tipo select
  opcionesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  opcionPill: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  opcionPillActive: {
    backgroundColor: Colors.primary,
  },
  opcionText: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 13,
    color: Colors.textDark,
  },
  opcionTextActive: {
    fontFamily: 'Rubik_500Medium',
    color: '#fff',
  },

  // Fotos
  fotosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  fotoPlaceholder: {
    width: (width - 44 - 40 - 10) / 2,
    height: 110,
    backgroundColor: '#fff',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fotoAdd: {
    width: (width - 44 - 40 - 10) / 2,
    height: 110,
    backgroundColor: '#fff',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#d0d8d2',
    borderStyle: 'dashed',
  },
  fotoAddText: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 12,
    color: Colors.textLight,
  },

  // Botón
  continueBtn: {
    backgroundColor: Colors.buttonSecundary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueBtnDisabled: {
    opacity: 0.4,
  },
  continueBtnText: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 17,
    color: '#fff',
  },
});