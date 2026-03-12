// app/crear-cultivo.tsx
// Flujo de 4 pasos para crear un cultivo

import { Colors } from '@/src/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
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
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';

// Importaciones extraídas
import { BackIcon } from '@/src/components/icons/BackIcon';
import { CalendarIcon } from '@/src/components/icons/CalendarIcon';
import { CheckIcon } from '@/src/components/icons/CheckIcon';
import { PlantCircleIcon } from '@/src/components/icons/PlantCircleIcon';
import { RobotIcon } from '@/src/components/icons/RobotIcon';
import { TrashIcon } from '@/src/components/icons/TrashIcon';
import { StepIndicator } from '@/src/components/ui/StepIndicator';
import { CultivoFormData, generarEtapasPreview, tiposCultivo, Etapa } from '@/src/utils/formSchemas';
import { useCrearCultivo } from '@/src/hooks/useCrearCultivo';

const { width } = Dimensions.get('window');

function formatFecha(date: Date): string {
  const dia = String(date.getDate()).padStart(2, '0');
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const anio = String(date.getFullYear());
  return `${dia}/${mes}/${anio}`;
}

function parseFecha(value: string): Date {
  const hoy = new Date();
  if (!value) return hoy;
  const soloDigitos = value.replace(/\D/g, '');
  if (soloDigitos.length >= 8) {
    const d = parseInt(soloDigitos.slice(0, 2), 10);
    const m = parseInt(soloDigitos.slice(2, 4), 10) - 1;
    const y = parseInt(soloDigitos.slice(4, 8), 10);
    const dt = new Date(y, m, d);
    if (!isNaN(dt.getTime())) return dt;
  }
  const parts = value.split('/');
  if (parts.length === 3) {
    const d = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    let y = parts[2];
    if (y.length === 2) y = '20' + y;
    const yy = parseInt(y, 10);
    const dt = new Date(yy, m, d);
    if (!isNaN(dt.getTime())) return dt;
  }
  return hoy;
}

function maskFechaInput(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}
function filterNumeric(text: string): string {
  return text.replace(/[^0-9]/g, '');
}

function filterDecimal(text: string): string {
  const cleaned = text.replace(/[^0-9.]/g, '');
  const parts = cleaned.split('.');
  if (parts.length > 2) return parts[0] + '.' + parts.slice(1).join('');
  return cleaned;
}

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

        <View>
          <Text style={styles.fieldLabel}>Variedad (Opcional)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ingrese la variedad"
            placeholderTextColor={Colors.textPlaceholder}
            value={data.variedad}
            onChangeText={(v) => onChange('variedad', v)}
          />
        </View>
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


function Paso2({
  data,
  onChange,
  onNext,
}: {
  data: CultivoFormData;
  onChange: (key: keyof CultivoFormData, value: any) => void;
  onNext: () => void;
}) {
  const [showSiembraPicker, setShowSiembraPicker] = useState(false);

  const handleChangeFechaSiembra = (v: string) => {
    onChange('fechaSiembra', maskFechaInput(v));
  };

  const handlePickerSiembraChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowSiembraPicker(false);
    if (selectedDate) {
      const formatted = formatFecha(selectedDate);
      onChange('fechaSiembra', formatted);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.pasoContent} showsVerticalScrollIndicator={false}>
      <View style={styles.pasoCard}>
        {/* Preview cultivo seleccionado */}
        <View style={styles.cultivoPreview}>
          <PlantCircleIcon size={72} />
          <Text style={styles.cultivoPreviewNombre}>{data.tipoCultivo}</Text>
        </View>

        {/* Campos */}
        <View>
          <Text style={styles.fieldLabel}>Tipo de cultivo</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Hortaliza"
            placeholderTextColor={Colors.textPlaceholder}
            value={data.tipoCultivoDetalle}
            onChangeText={(v) => onChange('tipoCultivoDetalle', v)}
          />
        </View>

        <View>
          <Text style={styles.fieldLabel}>Tamaño de terreno</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ej: 100"
            placeholderTextColor={Colors.textPlaceholder}
            value={data.tamanoTerreno}
            onChangeText={(v) => onChange('tamanoTerreno', filterNumeric(v))}
            keyboardType="number-pad"
          />
        </View>

        <View>
          <Text style={styles.fieldLabel}>Cantidad de semillas (kg)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ej: 30"
            placeholderTextColor={Colors.textPlaceholder}
            value={data.cantidadSemillas}
            onChangeText={(v) => onChange('cantidadSemillas', filterDecimal(v))}
            keyboardType="decimal-pad"
          />
        </View>

        <View>
          <Text style={styles.fieldLabel}>Fecha de siembra</Text>
          <View style={styles.dateInput}>
            <TextInput
              style={[styles.textInput, { flex: 1, marginBottom: 0 }]}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={Colors.textPlaceholder}
              value={data.fechaSiembra}
              onChangeText={handleChangeFechaSiembra}
              keyboardType="numeric"
              onFocus={() => {
                setShowSiembraPicker(true);
              }}
            />
            <TouchableOpacity
              style={styles.calendarIcon}
              onPress={() => {
                setShowSiembraPicker(true);
              }}
              activeOpacity={0.7}
            >
              <CalendarIcon />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.continueBtn} onPress={onNext} activeOpacity={0.85}>
        <Text style={styles.continueBtnText}>Continuar &gt;</Text>
      </TouchableOpacity>
      {showSiembraPicker && Platform.OS !== 'web' && (
        <DateTimePicker
          value={parseFecha(data.fechaSiembra)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handlePickerSiembraChange}
        />
      )}
    </ScrollView>
  );
}

function Paso3({
  data,
  onChange,
  onNext,
}: {
  data: CultivoFormData;
  onChange: (key: keyof CultivoFormData, value: any) => void;
  onNext: () => void;
}) {
  const [showInicioPicker, setShowInicioPicker] = useState(false);
  const [showFinPicker, setShowFinPicker] = useState(false);

  const handleChangeFechaInicio = (v: string) => {
    onChange('fechaInicioCiclo', maskFechaInput(v));
  };

  const handleChangeFechaFin = (v: string) => {
    onChange('fechaFinCiclo', maskFechaInput(v));
  };

  const handlePickerInicioChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowInicioPicker(false);
    if (selectedDate) {
      const formatted = formatFecha(selectedDate);
      onChange('fechaInicioCiclo', formatted);
    }
  };

  const handlePickerFinChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowFinPicker(false);
    if (selectedDate) {
      const formatted = formatFecha(selectedDate);
      onChange('fechaFinCiclo', formatted);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.pasoContent} showsVerticalScrollIndicator={false}>
      <View style={styles.pasoCard}>
        <View style={styles.cultivoPreview}>
          <PlantCircleIcon size={72} />
          <Text style={styles.cultivoPreviewNombre}>Fase Agrícola</Text>
        </View>

        <View>
          <Text style={styles.fieldLabel}>Nombre del ciclo</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ej: Temporada 2026, Ciclo Inicial..."
            placeholderTextColor={Colors.textPlaceholder}
            value={data.nombreCiclo}
            onChangeText={(v) => onChange('nombreCiclo', v)}
          />
        </View>

        <View>
          <Text style={styles.fieldLabel}>Fecha de inicio</Text>
          <View style={styles.dateInput}>
            <TextInput
              style={[styles.textInput, { flex: 1, marginBottom: 0 }]}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={Colors.textPlaceholder}
              value={data.fechaInicioCiclo}
              onChangeText={handleChangeFechaInicio}
              keyboardType="numeric"
              onFocus={() => {
                setShowInicioPicker(true);
              }}
            />
            <TouchableOpacity
              style={styles.calendarIcon}
              onPress={() => {
                setShowInicioPicker(true);
              }}
              activeOpacity={0.7}
            >
              <CalendarIcon />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginTop: 14 }}>
          <Text style={styles.fieldLabel}>Fecha de fin estimada</Text>
          <View style={styles.dateInput}>
            <TextInput
              style={[styles.textInput, { flex: 1, marginBottom: 0 }]}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={Colors.textPlaceholder}
              value={data.fechaFinCiclo}
              onChangeText={handleChangeFechaFin}
              keyboardType="numeric"
              onFocus={() => {
                setShowFinPicker(true);
              }}
            />
            <TouchableOpacity
              style={styles.calendarIcon}
              onPress={() => {
                setShowFinPicker(true);
              }}
              activeOpacity={0.7}
            >
              <CalendarIcon />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.continueBtn,
          (!data.nombreCiclo || !data.fechaInicioCiclo || !data.fechaFinCiclo) && styles.continueBtnDisabled,
        ]}
        onPress={onNext}
        disabled={!data.nombreCiclo || !data.fechaInicioCiclo || !data.fechaFinCiclo}
        activeOpacity={0.85}
      >
        <Text style={styles.continueBtnText}>Continuar &gt;</Text>
      </TouchableOpacity>
      {showInicioPicker && Platform.OS !== 'web' && (
        <DateTimePicker
          value={parseFecha(data.fechaInicioCiclo)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handlePickerInicioChange}
        />
      )}
      {showFinPicker && Platform.OS !== 'web' && (
        <DateTimePicker
          value={parseFecha(data.fechaFinCiclo)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handlePickerFinChange}
        />
      )}
    </ScrollView>
  );
}


function Paso4({
  data,
  onChange,
  onNext,
}: {
  data: CultivoFormData;
  onChange: (key: keyof CultivoFormData, value: any) => void;
  onNext: () => void;
}) {
  const [localEtapas, setLocalEtapas] = React.useState<Etapa[]>(() =>
    data.etapas.length > 0 ? data.etapas : generarEtapasPreview(data.fechaSiembra)
  );

  const updateStore = (nv: Etapa[]) => {
    setLocalEtapas(nv);
    onChange('etapas', nv);
  };

  React.useEffect(() => {
    if (data.etapas.length === 0) {
      onChange('etapas', localEtapas);
    }
  }, []);

  const handleAdd = () => {
    updateStore([...localEtapas, { nombre: 'Nueva etapa', inicio: '', fin: '', dias: 0 }]);
  };

  const handleRemove = (i: number) => {
    updateStore(localEtapas.filter((_, idx) => idx !== i));
  };

  const parseFechaEtapa = (value: string): Date | null => {
    if (!value) return null;
    const parts = value.split('/');
    if (parts.length !== 3) return null;
    const d = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    let y = parts[2];
    if (y.length === 2) y = '20' + y;
    const yy = parseInt(y, 10);
    if (Number.isNaN(d) || Number.isNaN(m) || Number.isNaN(yy)) return null;
    const dt = new Date(yy, m, d);
    if (Number.isNaN(dt.getTime())) return null;
    return dt;
  };

  const calcularDiasEtapa = (inicio: string, fin: string): number | null => {
    const di = parseFechaEtapa(inicio);
    const df = parseFechaEtapa(fin);
    if (!di || !df) return null;
    const diffMs = df.getTime() - di.getTime();
    const diffDias = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (diffDias < 0) return null;
    return diffDias;
  };

  const handleChangeEtapa = (i: number, field: keyof Etapa, val: any) => {
    const arr = [...localEtapas];
    const etapaActual = { ...arr[i], [field]: val };
    if (field === 'inicio' || field === 'fin') {
      const diasCalculados = calcularDiasEtapa(etapaActual.inicio, etapaActual.fin);
      if (diasCalculados !== null) {
        etapaActual.dias = diasCalculados;
      }
    }
    arr[i] = etapaActual;
    updateStore(arr);
  };

  return (
    <ScrollView contentContainerStyle={styles.pasoContent} showsVerticalScrollIndicator={false}>
      <View style={styles.pasoCard}>
        <Text style={styles.pasoQuestion}>Configura las etapas</Text>

        {localEtapas.map((etapa, index) => (
          <View key={index} style={styles.etapaWrapper}>
            <View style={styles.etapaCard}>
              <View style={styles.etapaLeft}>
                <View style={styles.etapaNumBadge}>
                  <Text style={styles.etapaNum}>{index + 1}</Text>
                </View>
              </View>
              <View style={[styles.etapaInfo, { flex: 1, paddingLeft: 10 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 1 }}>
                    <TextInput
                      style={[styles.etapaNombre, { padding: 0, fontSize: 17, color: '#1A2521', fontFamily: 'Rubik_600SemiBold', marginRight: 4, width: Math.max(70, etapa.nombre.length * 9.5) }]}
                      value={etapa.nombre}
                      onChangeText={(val) => handleChangeEtapa(index, 'nombre', val)}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ color: '#1A2521', fontSize: 13, fontFamily: 'Rubik_500Medium' }}>(</Text>
                      <TextInput
                        style={{ padding: 0, width: 15, textAlign: 'center', fontSize: 13, color: '#1A2521', fontFamily: 'Rubik_500Medium' }}
                        value={String(etapa.dias)}
                        keyboardType="numeric"
                        onChangeText={(val) => handleChangeEtapa(index, 'dias', parseInt(val) || 0)}
                      />
                      <Text style={{ color: '#1A2521', fontSize: 13, fontFamily: 'Rubik_500Medium' }}>Días)</Text>
                    </View>
                  </View>

                  {localEtapas.length > 1 && (
                    <TouchableOpacity onPress={() => handleRemove(index)} style={{ paddingLeft: 8 }}>
                      <TrashIcon size={22} color="#4A5D54" />
                    </TouchableOpacity>
                  )}
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1.1 }}>
                    <Text style={{ fontFamily: 'Rubik_600SemiBold', fontSize: 13, color: '#1A2521', marginRight: 4, width: 38 }}>Inicio</Text>
                    <View style={{ backgroundColor: '#DDE6DF', borderRadius: 8, paddingVertical: 4, paddingHorizontal: 2, flex: 1 }}>
                      <TextInput
                        style={{ padding: 0, color: '#1A2521', textAlign: 'center', fontSize: 13, fontFamily: 'Rubik_400Regular' }}
                        value={etapa.inicio}
                        placeholder="DD/MM/AA"
                        placeholderTextColor="#a0b8aa"
                        onChangeText={(val) => handleChangeEtapa(index, 'inicio', val)}
                      />
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <Text style={{ fontFamily: 'Rubik_600SemiBold', fontSize: 13, color: '#1A2521', marginRight: 4, width: 22 }}>Fin</Text>
                    <View style={{ backgroundColor: '#2D3E35', borderRadius: 8, paddingVertical: 4, paddingHorizontal: 2, flex: 1 }}>
                      <TextInput
                        style={{ padding: 0, color: '#fff', textAlign: 'center', fontSize: 13, fontFamily: 'Rubik_400Regular' }}
                        value={etapa.fin}
                        placeholder="DD/MM/AA"
                        placeholderTextColor="#a0b8aa"
                        onChangeText={(val) => handleChangeEtapa(index, 'fin', val)}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {index < localEtapas.length - 1 && (
              <View style={styles.etapaConnector} />
            )}
          </View>
        ))}

        <View style={styles.etapaActions}>
          <TouchableOpacity style={styles.etapaActionBtn} onPress={handleAdd}>
            <Text style={styles.etapaActionText}>+ Agregar etapa</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.continueBtn} onPress={onNext} activeOpacity={0.85}>
        <Text style={styles.continueBtnText}>Continuar &gt;</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


function Paso5({
  data,
  onEdit,
  onCreate,
}: {
  data: CultivoFormData;
  onEdit: () => void;
  onCreate: () => void;
}) {
  const etapas = data.etapas.length > 0 ? data.etapas : generarEtapasPreview(data.fechaSiembra);
  const resumen = [
    { label: 'Siembra', value: data.fechaSiembra || 'Seleccionada hoy' },
    { label: 'Semillas', value: data.cantidadSemillas || '80 kg' },
    { label: 'Etapas', value: String(etapas.length) },
    { label: 'Cosecha estimada', value: etapas[etapas.length - 1].fin },
    { label: 'Terreno', value: data.tamanoTerreno || '15 m2' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.pasoContent} showsVerticalScrollIndicator={false}>
      <View style={styles.pasoCard}>
        <Text style={styles.pasoQuestion}>Finaliza tu cultivo</Text>

        <View style={styles.resumenCard}>
          <PlantCircleIcon size={64} />
          <Text style={styles.resumenNombre}>{data.tipoCultivo || 'Maiz'}</Text>

          {resumen.map((item, i) => (
            <View key={i} style={{ width: '100%' }}>
              <View style={styles.resumenRow}>
                <Text style={styles.resumenLabel}>{item.label}</Text>
                <Text style={styles.resumenValue}> {item.value}</Text>
              </View>
              {i < resumen.length - 1 && <View style={styles.resumenDivider} />}
            </View>
          ))}
        </View>

        <View style={styles.iaCard}>
          <View style={styles.iaHeader}>
            <RobotIcon color="#ffffff" />
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

      <TouchableOpacity style={styles.editBtn} onPress={onEdit} activeOpacity={0.85}>
        <Text style={styles.editBtnText}>← Editar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.continueBtn} onPress={onCreate} activeOpacity={0.85}>
        <Text style={styles.continueBtnText}>Crear cultivo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


export default function CrearCultivoScreen() {
  const {
    paso,
    title,
    formData,
    isSubmitting,
    handleChange,
    handleBack,
    handleNext,
    handleEditSteps,
    handleCreate
  } = useCrearCultivo();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <BackIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>

        <View style={styles.stepRow}>
          <Text style={styles.stepText}>Paso {paso} de 5</Text>
          <StepIndicator current={paso} total={5} />
        </View>

        {paso === 1 && <Paso1 data={formData} onChange={handleChange} onNext={handleNext} />}
        {paso === 2 && <Paso2 data={formData} onChange={handleChange} onNext={handleNext} />}
        {paso === 3 && <Paso3 data={formData} onChange={handleChange} onNext={handleNext} />}
        {paso === 4 && <Paso4 data={formData} onChange={handleChange} onNext={handleNext} />}
        {paso === 5 && <Paso5 data={formData} onEdit={handleEditSteps} onCreate={handleCreate} />}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


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
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  cultivoOption: {
    width: '47%',
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
    marginBottom: 6,
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
    alignItems: 'center',
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  resumenLabel: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 15,
    color: Colors.textDark,
  },
  resumenValue: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 15,
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
