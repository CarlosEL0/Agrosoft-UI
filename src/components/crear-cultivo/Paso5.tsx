import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { PlantCircleIcon } from '@/src/components/icons/PlantCircleIcon';
import { RobotIcon } from '@/src/components/icons/RobotIcon';
import { CheckIcon } from '@/src/components/icons/CheckIcon';
import { CultivoFormData, generarEtapasPreview } from '@/src/utils/formSchemas';

interface Paso5Props {
  data: CultivoFormData;
  onEdit: () => void;
  onCreate: () => void;
  styles: any;
}

export function Paso5({ data, onEdit, onCreate, styles }: Paso5Props) {
  const etapas = data.etapas.length > 0 ? data.etapas : generarEtapasPreview(data.fechaSiembra);
  const resumen = [
    { label: 'Siembra', value: data.fechaSiembra || 'Seleccionada hoy' },
    { label: 'Semillas', value: data.cantidadSemillas || '80 kg' },
    { label: 'Etapas', value: String(etapas.length) },
    { label: 'Cosecha estimada', value: etapas[etapas.length - 1].fin },
    { label: 'Terreno', value: data.tamanoTerreno || '15 m2' },
  ];

  return (
    <ScrollView 
      contentContainerStyle={styles.pasoContent} 
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.pasoCard}>
        <Text style={styles.pasoQuestion}>Finaliza tu cultivo</Text>

        <View style={styles.resumenCard}>
          <PlantCircleIcon size={64} />
          <Text style={styles.resumenNombre}>
            {data.tipoCultivo === 'Otro' ? data.nombrePersonalizado : data.tipoCultivo || 'Maiz'}
          </Text>

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
            <Text style={styles.iaText}>
              Comenzaré a monitorear tu {data.tipoCultivo === 'Otro' ? data.nombrePersonalizado : data.tipoCultivo || 'cultivo'} desde hoy.
            </Text>
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
