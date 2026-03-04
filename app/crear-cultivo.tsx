// app/crear-cultivo.tsx
// Flujo de 4 pasos para crear un cultivo

import { Colors } from '@/src/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Importaciones extraídas
import { BackIcon } from '@/src/components/icons/BackIcon';
import { CalendarIcon } from '@/src/components/icons/CalendarIcon';
import { CheckIcon } from '@/src/components/icons/CheckIcon';
import { PlantCircleIcon } from '@/src/components/icons/PlantCircleIcon';
import { RobotIcon } from '@/src/components/icons/RobotIcon';
import { StepIndicator } from '@/src/components/ui/StepIndicator';
import {
  CultivoFormData,
  etapasDefault,
  tiposCultivo
} from '@/src/utils/formSchemas';

const { width } = Dimensions.get('window');

// ── Paso 1: Tipo de cultivo ───────────────────────────────────────────────────

function Paso1({
  data,
  onChange,
  onNext,
}: {
  data: CultivoFormData;
  onChange: (key: keyof CultivoFormData, value: any) => void;
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
  data: CultivoFormData;
  onChange: (key: keyof CultivoFormData, value: any) => void;
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

function Paso3({
  data,
  onNext,
}: {
  data: CultivoFormData;
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
  data: CultivoFormData;
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
  const [formData, setFormData] = useState<CultivoFormData>({
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

  const handleChange = (key: keyof CultivoFormData, value: any) => {
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
          <StepIndicator current={paso} total={4} />
        </View>

        {/* ── Contenido por paso ── */}
        {paso === 1 && <Paso1 data={formData} onChange={handleChange} onNext={handleNext} />}
        {paso === 2 && <Paso2 data={formData} onChange={handleChange} onNext={handleNext} />}
        {paso === 3 && <Paso3 data={formData} onNext={handleNext} />}
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
