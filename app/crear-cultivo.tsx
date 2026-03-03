// app/crear-cultivo.tsx
// Flujo de 4 pasos para crear un cultivo

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
import { Svg, Path, Circle, Rect, G } from 'react-native-svg';
import { Colors } from '@/src/theme/colors';

const { width } = Dimensions.get('window');

// ── Íconos ───────────────────────────────────────────────────────────────────

function BackIcon() {
  return (
    <Svg width={44} height={44} viewBox="0 0 44 44" fill="none">
      <Circle cx={22} cy={22} r={22} fill={Colors.buttonSecundary} />
      <Path d="M25 14l-8 8 8 8" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function PlantCircleIcon({ size = 64 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Circle cx={32} cy={32} r={32} fill={Colors.primary} />
      <Path d="M32 44V32" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
      <Path d="M32 38C32 38 24 35 22 27C22 27 30 23 34 31"
        stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M32 33C32 33 38 29 42 33C42 33 40 41 32 39"
        stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Rect x={26} y={44} width={12} height={8} rx={2} fill="#fff" opacity={0.9} />
      <Path d="M24 44h16l-2 6H26l-2-6z" fill="#fff" opacity={0.7} />
    </Svg>
  );
}

function CalendarIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={4} width={18} height={18} rx={2} stroke={Colors.textLight} strokeWidth={1.5} />
      <Path d="M16 2v4M8 2v4M3 10h18" stroke={Colors.textLight} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function RobotIcon() {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={8} width={18} height={13} rx={2} stroke="#fff" strokeWidth={1.5} />
      <Path d="M12 8V4" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" />
      <Circle cx={12} cy={3} r={1} fill="#fff" />
      <Circle cx={8.5} cy={13} r={1.5} fill="#fff" />
      <Circle cx={15.5} cy={13} r={1.5} fill="#fff" />
      <Path d="M9 17h6" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function CheckIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} fill="#fff" />
      <Path d="M8 12l3 3 5-5" stroke={Colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ── Indicador de pasos ────────────────────────────────────────────────────────

function StepIndicator({ current, total = 4 }: { current: number; total?: number }) {
  return (
    <View style={styles.stepIndicator}>
      {Array.from({ length: total }).map((_, i) => {
        const isCompleted = i < current - 1;
        const isActive = i === current - 1;
        return (
          <React.Fragment key={i}>
            <View style={[
              styles.stepDot,
              isCompleted && styles.stepDotCompleted,
              isActive && styles.stepDotActive,
            ]} />
            {i < total - 1 && (
              <View style={[
                styles.stepLine,
                isCompleted && styles.stepLineCompleted,
              ]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

// ── Tipos ─────────────────────────────────────────────────────────────────────

interface Etapa {
  nombre: string;
  inicio: string;
  fin: string;
  dias: number;
}

interface FormData {
  tipoCultivo: string;
  variedad: string;
  tipoCultivoDetalle: string;
  tamanoTerreno: string;
  cantidadSemillas: string;
  fechaSiembra: string;
  etapas: Etapa[];
  nombrePersonalizado: string;

}

// ── Paso 1: Tipo de cultivo ───────────────────────────────────────────────────

const tiposCultivo = ['Maiz', 'Frijol', 'Lechuga', 'Otro'];

function Paso1({
  data,
  onChange,
  onNext,
}: {
  data: FormData;
  onChange: (key: keyof FormData, value: any) => void;
  onNext: () => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.pasoContent} showsVerticalScrollIndicator={false}>
      <View style={styles.pasoCard}>
        <Text style={styles.pasoQuestion}>Que tipo de cultivo realizaras?</Text>

        {/* Grid 2x2 */}
        <View style={styles.cultivoGrid}>
          {tiposCultivo.map((tipo) => (
            <TouchableOpacity
              key={tipo}
              style={[
                styles.cultivoOption,
                data.tipoCultivo === tipo && styles.cultivoOptionActive,
              ]}
              onPress={() => onChange('tipoCultivo', tipo)}
              activeOpacity={0.8}
            >
              <PlantCircleIcon size={56} />
              <Text style={styles.cultivoOptionText}>{tipo}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Si selecciona "Otro" pide el nombre */}
        {data.tipoCultivo === 'Otro' && (
          <View>
            <Text style={styles.fieldLabel}>Nombre del cultivo</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ej: Tomate, Zanahoria..."
              placeholderTextColor={Colors.textPlaceholder}
              value={data.nombrePersonalizado}
              onChangeText={(v) => onChange('nombrePersonalizado', v)}
              autoFocus
            />
          </View>
        )}

        {/* Variedad opcional */}
        <Text style={styles.fieldLabel}>Variedad (Opcional)</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Ingrese la variedad"
          placeholderTextColor={Colors.textPlaceholder}
          value={data.variedad}
          onChangeText={(v) => onChange('variedad', v)}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.continueBtn,
          (!data.tipoCultivo || (data.tipoCultivo === 'Otro' && !data.nombrePersonalizado)) &&
            styles.continueBtnDisabled,
        ]}
        onPress={onNext}
        disabled={
          !data.tipoCultivo ||
          (data.tipoCultivo === 'Otro' && !data.nombrePersonalizado)
        }
        activeOpacity={0.85}
      >
        <Text style={styles.continueBtnText}>Continuar &gt;</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ── Paso 2: Datos del cultivo ─────────────────────────────────────────────────

function Paso2({
  data,
  onChange,
  onNext,
}: {
  data: FormData;
  onChange: (key: keyof FormData, value: any) => void;
  onNext: () => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.pasoContent} showsVerticalScrollIndicator={false}>
      <View style={styles.pasoCard}>
        {/* Preview cultivo seleccionado */}
        <View style={styles.cultivoPreview}>
          <PlantCircleIcon size={72} />
          <Text style={styles.cultivoPreviewNombre}>{data.tipoCultivo}</Text>
        </View>

        {/* Campos */}
        <Text style={styles.fieldLabel}>Tipo de cultivo</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Hortaliza"
          placeholderTextColor={Colors.textPlaceholder}
          value={data.tipoCultivoDetalle}
          onChangeText={(v) => onChange('tipoCultivoDetalle', v)}
        />

        <Text style={styles.fieldLabel}>Tamaño de terreno</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Ej: 100 M2"
          placeholderTextColor={Colors.textPlaceholder}
          value={data.tamanoTerreno}
          onChangeText={(v) => onChange('tamanoTerreno', v)}
          keyboardType="numeric"
        />

        <Text style={styles.fieldLabel}>Cantidad de semillas</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Ej: 30 Kg"
          placeholderTextColor={Colors.textPlaceholder}
          value={data.cantidadSemillas}
          onChangeText={(v) => onChange('cantidadSemillas', v)}
        />

        <Text style={styles.fieldLabel}>Fecha de siembra</Text>
        <View style={styles.dateInput}>
          <TextInput
            style={[styles.textInput, { flex: 1, marginBottom: 0 }]}
            placeholder="DD/MM/AAAA"
            placeholderTextColor={Colors.textPlaceholder}
            value={data.fechaSiembra}
            onChangeText={(v) => onChange('fechaSiembra', v)}
            keyboardType="numeric"
          />
          <View style={styles.calendarIcon}>
            <CalendarIcon />
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.continueBtn} onPress={onNext} activeOpacity={0.85}>
        <Text style={styles.continueBtnText}>Continuar &gt;</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ── Paso 3: Etapas del ciclo ──────────────────────────────────────────────────

const etapasDefault: Etapa[] = [
  { nombre: 'Germinacion', inicio: '25/06/24', fin: '25/06/24', dias: 10 },
  { nombre: 'Plántula', inicio: '25/06/24', fin: '25/06/24', dias: 10 },
  { nombre: 'Crecimiento', inicio: '25/06/24', fin: '25/06/24', dias: 10 },
  { nombre: 'Floración', inicio: '25/06/24', fin: '25/06/24', dias: 10 },
  { nombre: 'Cosecha', inicio: '25/06/24', fin: '25/06/24', dias: 10 },
];

function Paso3({
  data,
  onChange,
  onNext,
}: {
  data: FormData;
  onChange: (key: keyof FormData, value: any) => void;
  onNext: () => void;
}) {
  const etapas = data.etapas.length > 0 ? data.etapas : etapasDefault;

  return (
    <ScrollView contentContainerStyle={styles.pasoContent} showsVerticalScrollIndicator={false}>
      <View style={styles.pasoCard}>
        <Text style={styles.pasoQuestion}>Configura las etapas</Text>

        {etapas.map((etapa, index) => (
          <View key={index} style={styles.etapaWrapper}>
            {/* Card blanca por etapa */}
            <View style={styles.etapaCard}>
              <View style={styles.etapaLeft}>
                <View style={styles.etapaNumBadge}>
                  <Text style={styles.etapaNum}>{index + 1}</Text>
                </View>
              </View>
              <View style={styles.etapaInfo}>
                <View style={styles.etapaHeader}>
                  <Text style={styles.etapaNombre}>{etapa.nombre}</Text>
                  <Text style={styles.etapaDias}>({etapa.dias} Dias)</Text>
                </View>
                <View style={styles.etapaFechas}>
                  <Text style={styles.etapaFechaLabel}>Inicio</Text>
                  <View style={styles.etapaFechaBox}>
                    <Text style={styles.etapaFechaText}>{etapa.inicio}</Text>
                  </View>
                  <Text style={styles.etapaFechaLabel}>Fin</Text>
                  <View style={styles.etapaFechaBox}>
                    <Text style={styles.etapaFechaText}>{etapa.fin}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Línea conectora entre etapas */}
            {index < etapas.length - 1 && (
              <View style={styles.etapaConnector} />
            )}
          </View>
        ))}

        {/* Botones agregar / editar */}
        <View style={styles.etapaActions}>
          <TouchableOpacity style={styles.etapaActionBtn}>
            <Text style={styles.etapaActionText}>+ Agregar etapa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.etapaActionBtn}>
            <Text style={styles.etapaActionText}>✎ Editar etapa</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.continueBtn} onPress={onNext} activeOpacity={0.85}>
        <Text style={styles.continueBtnText}>Continuar &gt;</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
// ── Paso 4: Confirmar cultivo ─────────────────────────────────────────────────

function Paso4({
  data,
  onEdit,
  onCreate,
}: {
  data: FormData;
  onEdit: () => void;
  onCreate: () => void;
}) {
  const etapas = data.etapas.length > 0 ? data.etapas : etapasDefault;
  const resumen = [
    { label: 'Siembra', value: data.fechaSiembra || '24/02/25' },
    { label: 'Semillas', value: data.cantidadSemillas || '80 kg' },
    { label: 'Etapas', value: String(etapas.length) },
    { label: 'Cosecha estm.', value: '31/06/25' },
    { label: 'Terreno', value: data.tamanoTerreno || '15 m2' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.pasoContent} showsVerticalScrollIndicator={false}>
      <View style={styles.pasoCard}>
        <Text style={styles.pasoQuestion}>Finaliza tu cultivo</Text>

        {/* Card resumen */}
        <View style={styles.resumenCard}>
          <PlantCircleIcon size={64} />
          <Text style={styles.resumenNombre}>{data.tipoCultivo || 'Maiz'}</Text>

          {resumen.map((item, i) => (
            <View key={i}>
              <View style={styles.resumenRow}>
                <Text style={styles.resumenLabel}>{item.label}</Text>
                <Text style={styles.resumenValue}>{item.value}</Text>
              </View>
              {i < resumen.length - 1 && <View style={styles.resumenDivider} />}
            </View>
          ))}
        </View>

        {/* Card IA */}
        <View style={styles.iaCard}>
          <View style={styles.iaHeader}>
            <RobotIcon />
            <View style={styles.iaTag}>
              <Text style={styles.iaTagText}>Primera inspeccion</Text>
            </View>
          </View>
          <View style={styles.iaBody}>
            <Text style={styles.iaText}>Comenzaré a monitorear tu cultivo desde hoy.</Text>
            <CheckIcon />
          </View>
        </View>
      </View>

      {/* Botones */}
      <TouchableOpacity style={styles.editBtn} onPress={onEdit} activeOpacity={0.85}>
        <Text style={styles.editBtnText}>← Editar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.continueBtn} onPress={onCreate} activeOpacity={0.85}>
        <Text style={styles.continueBtnText}>Crear cultivo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ── Pantalla principal ────────────────────────────────────────────────────────

export default function CrearCultivoScreen() {
  const router = useRouter();
  const [paso, setPaso] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    tipoCultivo: '',
    variedad: '',
    tipoCultivoDetalle: '',
    tamanoTerreno: '',
    cantidadSemillas: '',
    fechaSiembra: '',
    etapas: [],
    nombrePersonalizado: '',
  });

  const titles = ['Crear cultivo', 'Datos del cultivo', 'Etapas del ciclo', 'Confirmar cultivo'];

  const handleChange = (key: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleBack = () => {
    if (paso === 1) router.back();
    else setPaso(paso - 1);
  };

  const handleNext = () => setPaso(paso + 1);

  const handleCreate = () => {
    // TODO: guardar cultivo
    router.replace('/(tabs)/cultivos');
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
          <Text style={styles.stepText}>Paso {paso} de 4</Text>
          <StepIndicator current={paso} />
        </View>

        {/* ── Contenido por paso ── */}
        {paso === 1 && <Paso1 data={formData} onChange={handleChange} onNext={handleNext} />}
        {paso === 2 && <Paso2 data={formData} onChange={handleChange} onNext={handleNext} />}
        {paso === 3 && <Paso3 data={formData} onChange={handleChange} onNext={handleNext} />}
        {paso === 4 && <Paso4 data={formData} onEdit={() => setPaso(3)} onCreate={handleCreate} />}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Estilos ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#d0d8d2',
  },
  stepDotActive: {
    backgroundColor: Colors.primary,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stepDotCompleted: {
    backgroundColor: Colors.primary,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#d0d8d2',
    marginHorizontal: 2,
  },
  stepLineCompleted: {
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

  // Paso 1 - Grid cultivos
  cultivoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cultivoOption: {
    width: (width - 44 - 40 - 12) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  cultivoOptionActive: {
    backgroundColor: '#c8dace',
  },
  cultivoOptionText: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 15,
    color: Colors.textDark,
  },

  // Paso 2 - Preview
  cultivoPreview: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  cultivoPreviewNombre: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 24,
    color: Colors.textDark,
  },

  // Campos
  fieldLabel: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 15,
    color: Colors.textDark,
    marginBottom: -6,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Rubik_400Regular',
    fontSize: 14,
    color: Colors.textDark,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingRight: 14,
  },
  calendarIcon: {
    paddingLeft: 8,
  },

  // Paso 3 - Etapas
  etapaWrapper: {
  alignItems: 'center',
},
  etapaCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  etapaConnector: {
    width: 2,
    height: 20,
    backgroundColor: Colors.primary,
    opacity: 0.4,
  },
  etapaFechas: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  etapaFechaLabel: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 12,
    color: Colors.textMedium,
  },
  etapaFechaBox: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  etapaFechaText: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 11,
    color: '#fff',
  },
  etapaRow: {
    flexDirection: 'row',
    gap: 12,
    minHeight: 90,
  },
  etapaLeft: {
    alignItems: 'center',
    width: 36,
  },
  etapaNumBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  etapaNum: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  etapaLine: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.primary,
    opacity: 0.3,
    marginTop: 4,
  },
  etapaInfo: {
    flex: 1,
    paddingBottom: 16,
    gap: 6,
  },
  etapaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  etapaNombre: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 15,
    color: Colors.textDark,
  },
  etapaDias: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 12,
    color: Colors.textLight,
  },

  etapaFechaGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  
  etapaActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  etapaActionBtn: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  etapaActionText: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 13,
    color: Colors.textDark,
  },
  

  // Paso 4 - Resumen
  resumenCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  resumenNombre: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 20,
    color: Colors.textDark,
    marginBottom: 8,
  },
  resumenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 6,
  },
  resumenLabel: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 14,
    color: Colors.textDark,
  },
  resumenValue: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 14,
    color: Colors.textMedium,
  },
  resumenDivider: {
    height: 1,
    backgroundColor: '#e8e8e8',
    width: '100%',
  },

  // Card IA
  iaCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 18,
    gap: 12,
  },
  iaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iaTag: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  iaTagText: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 13,
    color: Colors.primary,
  },
  iaBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iaText: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 14,
    color: '#fff',
    flex: 1,
    lineHeight: 20,
  },

  // Botones
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
  editBtn: {
    backgroundColor: Colors.buttonSecundary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  editBtnText: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 17,
    color: '#fff',
  },
});