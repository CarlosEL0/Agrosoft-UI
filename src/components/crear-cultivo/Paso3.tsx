import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Colors } from '@/src/theme/colors';
import { PlantCircleIcon } from '@/src/components/icons/PlantCircleIcon';
import { CalendarIcon } from '@/src/components/icons/CalendarIcon';
import { CultivoFormData } from '@/src/utils/formSchemas';
import { formatFecha, parseFecha, maskFechaInput } from '@/src/utils/dateUtils';

interface Paso3Props {
  data: CultivoFormData;
  onChange: (key: keyof CultivoFormData, value: any) => void;
  onNext: () => void;
  styles: any;
}

export function Paso3({ data, onChange, onNext, styles }: Paso3Props) {
  const [showInicioPicker, setShowInicioPicker] = useState(false);
  const [showFinPicker, setShowFinPicker] = useState(false);
  const [intentoContinuar3, setIntentoContinuar3] = React.useState(false);
  const [errorFecha, setErrorFecha] = React.useState('');

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
      // Validar que fin sea posterior a inicio
      const dInicio = parseFecha(data.fechaInicioCiclo);
      if (selectedDate < dInicio) {
        setErrorFecha('La fecha de fin debe ser posterior a la de inicio.');
      } else {
        setErrorFecha('');
      }
      onChange('fechaFinCiclo', formatted);
    }
  };

  return (
    <ScrollView 
       contentContainerStyle={styles.pasoContent} 
       showsVerticalScrollIndicator={false}
       keyboardShouldPersistTaps="handled"
     >
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
        {errorFecha !== '' && (
          <Text style={styles.errorMsg}>{errorFecha}</Text>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.continueBtn,
          (!data.nombreCiclo || !data.fechaInicioCiclo || !data.fechaFinCiclo || errorFecha !== '') && styles.continueBtnDisabled,
        ]}
        onPress={() => {
          if (!data.nombreCiclo || !data.fechaInicioCiclo || !data.fechaFinCiclo) {
            setIntentoContinuar3(true);
          } else if (errorFecha === '') {
            onNext();
          }
        }}
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
