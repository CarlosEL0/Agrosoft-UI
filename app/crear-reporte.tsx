import { Colors } from '@/src/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
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
import { NavBar } from '@/src/components/ui/NavBar';
import { useCrearReporte } from '@/src/hooks/useCrearReporte';
import { StepIndicator } from '@/src/components/ui/StepIndicator';

// Sub-componentes de pasos
import { Paso1 } from '@/src/components/crear-reporte/Paso1';
import { Paso2 } from '@/src/components/crear-reporte/Paso2';

const { width } = Dimensions.get('window');

export default function CrearReporteScreen() {
  const {
    paso,
    setPaso,
    tipoReporte,
    setTipoReporte,
    formData,
    fotos,
    titles,
    handleChange,
    handleBack,
    handleSubmit,
    handleAddFoto,
    handleRemoveFoto,
    etapaActual,
    isUploading,
    uploadProgress,
  } = useCrearReporte();

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        {/* ── Header ── */}
        <NavBar
          title={titles[paso - 1]}
          onBack={handleBack}
        />

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
            styles={styles}
          />
        )}

        {paso === 2 && (
          <Paso2
            tipo={tipoReporte}
            formData={formData}
            onChange={handleChange}
            fotos={fotos}
            onAddFoto={handleAddFoto}
            onRemoveFoto={handleRemoveFoto}
            onSubmit={handleSubmit}
            etapaActual={etapaActual}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            styles={styles}
          />
        )}

      </KeyboardAvoidingView>
    </View>
  );
}

// ── Estilos ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
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
  fotoImagen: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  fotoBorrar: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fotoBorrarText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Rubik_500Medium',
  },
  etapaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary + '18',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  etapaChipText: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 14,
    color: Colors.primary,
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
  progressBar: {
    height: 10,
    borderRadius: 8,
    backgroundColor: '#dfe6df',
    overflow: 'hidden',
  },
  progressInner: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  progressText: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 13,
    color: Colors.textDark,
  },
});
