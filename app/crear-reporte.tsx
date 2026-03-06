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
import { ImageIcon } from '@/src/components/icons/ImageIcon';
import { PlantCircleIcon } from '@/src/components/icons/PlantCircleIcon';
import { PlusIcon } from '@/src/components/icons/PlusIcon';
import { Campo } from '@/src/components/ui/Campo';
import { NavBar } from '@/src/components/ui/NavBar';
import { useCrearReporte } from '@/src/hooks/useCrearReporte';
import { StepIndicator } from '@/src/components/ui/StepIndicator';
import { camposPorTipo, tiposReporte } from '@/src/utils/formSchemas';

const { width } = Dimensions.get('window');

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
  } = useCrearReporte();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
          />
        )}

        {paso === 2 && (
          <Paso2
            tipo={tipoReporte}
            formData={formData}
            onChange={handleChange}
            fotos={fotos}
            onAddFoto={handleAddFoto}
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
