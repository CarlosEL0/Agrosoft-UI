import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, Image, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Colors } from '@/src/theme/colors';
import { PlantCircleIcon } from '@/src/components/icons/PlantCircleIcon';
import { PlusIcon } from '@/src/components/icons/PlusIcon';
import { Campo } from '@/src/components/ui/Campo';
import { camposPorTipo } from '@/src/utils/formSchemas';
import { formatFecha, parseFecha, maskFechaInput } from '@/src/utils/dateUtils';

interface Paso2Props {
  tipo: string;
  formData: Record<string, string>;
  onChange: (key: string, value: string) => void;
  fotos: string[];
  onAddFoto: () => void;
  onRemoveFoto: (index: number) => void;
  onSubmit: () => void;
  etapaActual: string;
  isUploading: boolean;
  uploadProgress: number;
  styles: any;
}

export function Paso2({
  tipo,
  formData,
  onChange,
  fotos,
  onAddFoto,
  onRemoveFoto,
  onSubmit,
  etapaActual,
  isUploading,
  uploadProgress,
  styles,
}: Paso2Props) {
  const campos = camposPorTipo[tipo] || [];
  const [showFechaEventoPicker, setShowFechaEventoPicker] = useState(false);

  const handleChangeFechaEvento = (v: string) => {
    onChange('fecha_evento', maskFechaInput(v));
  };

  const handlePickerFechaEventoChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowFechaEventoPicker(false);
    if (selectedDate) {
      const formatted = formatFecha(selectedDate);
      onChange('fecha_evento', formatted);
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.pasoContent} 
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
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
            onChangeText={handleChangeFechaEvento}
            keyboardType="numeric"
            onFocus={() => {
              setShowFechaEventoPicker(true);
            }}
          />
        </View>

        {/* Etapa detectada automáticamente (solo lectura) */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Etapa del cultivo</Text>
          <View style={styles.etapaChip}>
            <PlantCircleIcon size={20} />
            <Text style={styles.etapaChipText}>{etapaActual}</Text>
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
          {fotos.map((uri, i) => (
            <View key={i} style={styles.fotoPlaceholder}>
              <Image source={{ uri }} style={styles.fotoImagen} />
              <TouchableOpacity style={styles.fotoBorrar} onPress={() => onRemoveFoto(i)}>
                <Text style={styles.fotoBorrarText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.fotoAdd} onPress={onAddFoto}>
            <PlusIcon />
            <Text style={styles.fotoAddText}>Agregar foto</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isUploading && (
        <View style={styles.pasoCard}>
          <Text style={styles.pasoQuestion}>Subiendo evidencias</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressInner, { width: `${uploadProgress}%` }]} />
          </View>
          <Text style={styles.progressText}>{uploadProgress}%</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.continueBtn, isUploading && styles.continueBtnDisabled]}
        onPress={onSubmit}
        disabled={isUploading}
        activeOpacity={0.85}
      >
        <Text style={styles.continueBtnText}>{isUploading ? 'Subiendo...' : 'Guardar reporte'}</Text>
      </TouchableOpacity>

      {showFechaEventoPicker && Platform.OS !== 'web' && (
        <DateTimePicker
          value={parseFecha(formData['fecha_evento'] || '')}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handlePickerFechaEventoChange}
        />
      )}
    </ScrollView>
  );
}
