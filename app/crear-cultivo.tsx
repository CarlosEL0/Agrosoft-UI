// app/crear-cultivo.tsx
// Flujo de 5 pasos para crear un cultivo

import { Colors } from '@/src/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
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
import { NavBar } from '@/src/components/ui/NavBar';
import { StepIndicator } from '@/src/components/ui/StepIndicator';
import { CultivoFormData } from '@/src/utils/formSchemas';
import { useCrearCultivo } from '@/src/hooks/useCrearCultivo';
import { formatFecha, parseFecha, maskFechaInput } from '@/src/utils/dateUtils';

// Sub-componentes de pasos
import { Paso1 } from '@/src/components/crear-cultivo/Paso1';
import { Paso2 } from '@/src/components/crear-cultivo/Paso2';
import { Paso3 } from '@/src/components/crear-cultivo/Paso3';
import { Paso4 } from '@/src/components/crear-cultivo/Paso4';
import { Paso5 } from '@/src/components/crear-cultivo/Paso5';

const { width } = Dimensions.get('window');

function filterNumeric(text: string): string {
  return text.replace(/[^0-9]/g, '');
}

function filterDecimal(text: string): string {
  const cleaned = text.replace(/[^0-9.]/g, '');
  const parts = cleaned.split('.');
  if (parts.length > 2) return parts[0] + '.' + parts.slice(1).join('');
  return cleaned;
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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <NavBar title={title} onBack={handleBack} />

        <View style={styles.stepRow}>
          <Text style={styles.stepText}>Paso {paso} de 5</Text>
          <StepIndicator current={paso} total={5} />
        </View>

        {paso === 1 && <Paso1 data={formData} onChange={handleChange} onNext={handleNext} styles={styles} />}
        {paso === 2 && <Paso2 data={formData} onChange={handleChange} onNext={handleNext} styles={styles} filterNumeric={filterNumeric} filterDecimal={filterDecimal} />}
        {paso === 3 && <Paso3 data={formData} onChange={handleChange} onNext={handleNext} styles={styles} />}
        {paso === 4 && <Paso4 data={formData} onChange={handleChange} onNext={handleNext} styles={styles} />}
        {paso === 5 && <Paso5 data={formData} onEdit={handleEditSteps} onCreate={handleCreate} styles={styles} />}
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
    backgroundColor: '#ffffff',
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
  errorMsg: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 13,
    color: '#e05252',
    marginTop: -4,
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
    alignItems: 'flex-start',
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
    width: 3,
    height: 20,
    backgroundColor: Colors.primary,
    marginLeft: 34,  // padding(16) + badge center(18)
    borderRadius: 2,
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
