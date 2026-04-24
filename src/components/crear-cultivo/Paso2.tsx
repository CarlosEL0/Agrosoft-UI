import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Colors } from '@/src/theme/colors';
import { PlantCircleIcon } from '@/src/components/icons/PlantCircleIcon';
import { CalendarIcon } from '@/src/components/icons/CalendarIcon';
import { CultivoFormData } from '@/src/utils/formSchemas';
import { formatFecha, parseFecha, maskFechaInput } from '@/src/utils/dateUtils';

interface Paso2Props {
  data: CultivoFormData;
  onChange: (key: keyof CultivoFormData, value: any) => void;
  onNext: () => void;
  styles: any;
  filterNumeric: (text: string) => string;
  filterDecimal: (text: string) => string;
}

export function Paso2({ data, onChange, onNext, styles, filterNumeric, filterDecimal }: Paso2Props) {
  const [showSiembraPicker, setShowSiembraPicker] = useState(false);
  const [intentoContinuar, setIntentoContinuar] = React.useState(false);

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

  const handleContinuar2 = () => {
    if (!data.region) {
      setIntentoContinuar(true);
    } else {
      onNext();
    }
  };

  return (
    <ScrollView 
       contentContainerStyle={styles.pasoContent} 
       showsVerticalScrollIndicator={false}
       keyboardShouldPersistTaps="handled"
     >
      <View style={styles.pasoCard}>
        {/* Preview cultivo seleccionado */}
        <View style={styles.cultivoPreview}>
          <PlantCircleIcon size={72} />
          <Text style={styles.cultivoPreviewNombre}>
            {data.tipoCultivo === 'Otro' ? data.nombrePersonalizado : data.tipoCultivo}
          </Text>
        </View>

        {/* Categoría */}
        <View>
          <Text style={styles.fieldLabel}>Categoría del cultivo</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ej: Hortaliza, Cereal, Legumbre..."
            placeholderTextColor={Colors.textPlaceholder}
            value={data.tipoCultivoDetalle}
            onChangeText={(v) => onChange('tipoCultivoDetalle', v)}
          />
        </View>

        {/* Región — obligatorio */}
        <View>
          <Text style={styles.fieldLabel}>
            Región / Ubicación{' '}
            <Text style={{ color: '#C0392B', fontFamily: 'Rubik_600SemiBold' }}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.textInput,
              intentoContinuar && !data.region && { borderColor: '#C0392B', borderWidth: 1.5 },
            ]}
            placeholder="Ej: Jalisco, Valle de México..."
            placeholderTextColor={Colors.textPlaceholder}
            value={data.region}
            onChangeText={(v) => { onChange('region', v); setIntentoContinuar(false); }}
          />
          {intentoContinuar && !data.region && (
            <Text style={styles.errorMsg}>La región es requerida por el sistema.</Text>
          )}
        </View>

        <View>
          <Text style={styles.fieldLabel}>Tamaño de terreno (m²)</Text>
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

        {/* pH Suelo en fila */}
        <View>
          <Text style={styles.fieldLabel}>pH del suelo (Opcional)</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <TextInput
                style={styles.textInput}
                placeholder="Mín  Ej: 5.5"
                placeholderTextColor={Colors.textPlaceholder}
                value={data.phSueloMin}
                onChangeText={(v) => onChange('phSueloMin', filterDecimal(v))}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={{ flex: 1 }}>
              <TextInput
                style={styles.textInput}
                placeholder="Máx  Ej: 7.0"
                placeholderTextColor={Colors.textPlaceholder}
                value={data.phSueloMax}
                onChangeText={(v) => onChange('phSueloMax', filterDecimal(v))}
                keyboardType="decimal-pad"
              />
            </View>
          </View>
        </View>

        {/* Fecha siembra */}
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
              onFocus={() => setShowSiembraPicker(true)}
            />
            <TouchableOpacity
              style={styles.calendarIcon}
              onPress={() => setShowSiembraPicker(true)}
              activeOpacity={0.7}
            >
              <CalendarIcon />
            </TouchableOpacity>
          </View>
        </View>

        {/* Notas generales */}
        <View>
          <Text style={styles.fieldLabel}>Notas generales (Opcional)</Text>
          <TextInput
            style={[styles.textInput, { minHeight: 80, textAlignVertical: 'top', paddingTop: 10 }]}
            placeholder="Observaciones sobre el suelo, clima, historial del terreno..."
            placeholderTextColor={Colors.textPlaceholder}
            value={data.notasGenerales}
            onChangeText={(v) => onChange('notasGenerales', v)}
            multiline
            numberOfLines={3}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.continueBtn, !data.region && styles.continueBtnDisabled]}
        onPress={handleContinuar2}
        activeOpacity={0.85}
      >
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
