import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Colors } from '@/src/theme/colors';
import { PlantCircleIcon } from '@/src/components/icons/PlantCircleIcon';
import { CultivoFormData, tiposCultivo } from '@/src/utils/formSchemas';

interface Paso1Props {
  data: CultivoFormData;
  onChange: (key: keyof CultivoFormData, value: any) => void;
  onNext: () => void;
  styles: any;
}

export function Paso1({ data, onChange, onNext, styles }: Paso1Props) {
  const [intentoContinuar, setIntentoContinuar] = React.useState(false);
  const disabled = !data.tipoCultivo || (data.tipoCultivo === 'Otro' && !data.nombrePersonalizado);

  const handleContinuar = () => {
    if (disabled) {
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
        <Text style={styles.pasoQuestion}>Que tipo de cultivo realizaras?</Text>

        <View style={styles.cultivoGrid}>
          {tiposCultivo.map((tipo) => (
            <TouchableOpacity
              key={tipo}
              style={[
                styles.cultivoOption,
                data.tipoCultivo === tipo && styles.cultivoOptionActive,
              ]}
              onPress={() => { onChange('tipoCultivo', tipo); setIntentoContinuar(false); }}
              activeOpacity={0.8}
            >
              <PlantCircleIcon size={56} />
              <Text style={styles.cultivoOptionText}>{tipo}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {intentoContinuar && disabled && (
          <Text style={styles.errorMsg}>Selecciona un tipo de cultivo para continuar.</Text>
        )}

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
      </View>

      <TouchableOpacity
        style={styles.continueBtn}
        onPress={handleContinuar}
        activeOpacity={0.85}
      >
        <Text style={styles.continueBtnText}>Continuar &gt;</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
