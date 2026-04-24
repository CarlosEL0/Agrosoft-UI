import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { PlantCircleIcon } from '@/src/components/icons/PlantCircleIcon';
import { tiposReporte } from '@/src/utils/formSchemas';

interface Paso1Props {
  tipoSeleccionado: string;
  onSelect: (tipo: string) => void;
  onNext: () => void;
  styles: any;
}

export function Paso1({ tipoSeleccionado, onSelect, onNext, styles }: Paso1Props) {
  const filas = [
    tiposReporte.slice(0, 2),
    tiposReporte.slice(2, 4),
    tiposReporte.slice(4),
  ];

  return (
    <ScrollView 
      contentContainerStyle={styles.pasoContent} 
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
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
