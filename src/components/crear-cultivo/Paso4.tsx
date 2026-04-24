import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, Platform, ActivityIndicator, Alert } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Colors } from '@/src/theme/colors';
import { RobotIcon } from '@/src/components/icons/RobotIcon';
import { TrashIcon } from '@/src/components/icons/TrashIcon';
import { CultivoFormData, Etapa, generarEtapasPreview } from '@/src/utils/formSchemas';
import { formatFecha } from '@/src/utils/dateUtils';
import { CultivoService } from '@/src/services/cultivoService';

interface Paso4Props {
  data: CultivoFormData;
  onChange: (key: keyof CultivoFormData, value: any) => void;
  onNext: () => void;
  styles: any;
}

export function Paso4({ data, onChange, onNext, styles }: Paso4Props) {
  const [localEtapas, setLocalEtapas] = React.useState<Etapa[]>(() =>
    data.etapas.length > 0 ? data.etapas : generarEtapasPreview(data.fechaSiembra)
  );
  const [cargandoIA, setCargandoIA] = useState(false);
  const [activePicker, setActivePicker] = useState<{ index: number; campo: 'inicio' | 'fin' } | null>(null);

  const updateStore = (nv: Etapa[]) => {
    setLocalEtapas(nv);
    onChange('etapas', nv);
  };

  React.useEffect(() => {
    if (data.etapas.length === 0) {
      onChange('etapas', localEtapas);
    }
  }, []);

  const handleGenerarConIA = async () => {
    try {
      setCargandoIA(true);
      const nombre = data.tipoCultivo === 'Otro' ? data.nombrePersonalizado : data.tipoCultivo;
      const predicciones = await CultivoService.predecirEtapasIA(nombre, data.tipoCultivoDetalle, data.region);
      
      const nombresEtapas = ['Germinación', 'Plántula', 'Crecimiento', 'Floración', 'Cosecha'];
      const clavesBackend = ['germinacion', 'plantula', 'crecimiento', 'floracion', 'cosecha'];
      
      let fechaActual = parseFechaEtapa(data.fechaSiembra);
      const nuevasEtapas: Etapa[] = [];

      clavesBackend.forEach((clave, idx) => {
        const dias = predicciones[clave] || 15;
        const inicio = formatFecha(fechaActual);
        const fechaFin = new Date(fechaActual);
        fechaFin.setDate(fechaFin.getDate() + dias);
        const fin = formatFecha(fechaFin);
        
        nuevasEtapas.push({
          nombre: nombresEtapas[idx],
          inicio,
          fin,
          dias
        });
        
        fechaActual = fechaFin;
      });

      updateStore(nuevasEtapas);
      onChange('usarIA', true);
    } catch (error) {
      console.error('Error prediciendo etapas:', error);
      Alert.alert('Error', 'No se pudo conectar con la IA. Intenta manualmente.');
    } finally {
      setCargandoIA(false);
    }
  };

  const handleAdd = () => {
    updateStore([...localEtapas, { nombre: 'Nueva etapa', inicio: '', fin: '', dias: 0 }]);
  };

  const handleRemove = (i: number) => {
    updateStore(localEtapas.filter((_, idx) => idx !== i));
  };

  const parseFechaEtapa = (value: string): Date => {
    if (!value) return new Date();
    const parts = value.split('/');
    if (parts.length === 3) {
      const d = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      let y = parts[2];
      if (y.length === 2) y = '20' + y;
      const yy = parseInt(y, 10);
      if (!Number.isNaN(d) && !Number.isNaN(m) && !Number.isNaN(yy)) {
        const dt = new Date(yy, m, d);
        if (!Number.isNaN(dt.getTime())) return dt;
      }
    }
    return new Date();
  };

  const parseFechaEtapaONull = (value: string): Date | null => {
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
    const di = parseFechaEtapaONull(inicio);
    const df = parseFechaEtapaONull(fin);
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

  const handlePickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (!activePicker) return;
    setActivePicker(null);
    if (selectedDate) {
      const formatted = formatFecha(selectedDate);
      handleChangeEtapa(activePicker.index, activePicker.campo, formatted);
    }
  };

  const pickerValue = activePicker
    ? parseFechaEtapa(
      activePicker.campo === 'inicio'
        ? localEtapas[activePicker.index]?.inicio
        : localEtapas[activePicker.index]?.fin
    )
    : new Date();

  return (
    <ScrollView 
       contentContainerStyle={styles.pasoContent} 
       showsVerticalScrollIndicator={false}
       keyboardShouldPersistTaps="handled"
     >
      <View style={styles.pasoCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Text style={[styles.pasoQuestion, { marginBottom: 0 }]}>Configura las etapas</Text>
          <TouchableOpacity 
            style={{ 
              backgroundColor: data.usarIA ? '#2D3E35' : '#DDE6DF', 
              paddingHorizontal: 12, 
              paddingVertical: 6, 
              borderRadius: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6
            }}
            onPress={handleGenerarConIA}
            disabled={cargandoIA}
          >
            {cargandoIA ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <RobotIcon size={16} color={data.usarIA ? '#fff' : '#2D3E35'} />
            )}
            <Text style={{ 
              fontFamily: 'Rubik_500Medium', 
              fontSize: 12, 
              color: data.usarIA ? '#fff' : '#2D3E35' 
            }}>
              {cargandoIA ? 'Calculando...' : data.usarIA ? 'Actualizar con IA' : 'Generar con IA'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 16 }}>
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
                            style={{ padding: 0, width: Math.max(10, String(etapa.dias).length * 9), fontSize: 13, color: '#1A2521', fontFamily: 'Rubik_500Medium', textAlign: 'left' }}
                            value={String(etapa.dias)}
                            keyboardType="numeric"
                            onChangeText={(val) => handleChangeEtapa(index, 'dias', parseInt(val) || 0)}
                          />
                          <Text style={{ color: '#1A2521', fontSize: 13, fontFamily: 'Rubik_500Medium', marginLeft: 2 }}>Días)</Text>
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
                        <TouchableOpacity
                          style={{ backgroundColor: '#DDE6DF', borderRadius: 8, paddingVertical: 5, paddingHorizontal: 4, flex: 1, alignItems: 'center' }}
                          onPress={() => setActivePicker({ index, campo: 'inicio' })}
                          activeOpacity={0.75}
                        >
                          <Text style={{ color: etapa.inicio ? '#1A2521' : '#a0b8aa', fontSize: 13, fontFamily: 'Rubik_400Regular' }}>
                            {etapa.inicio || 'DD/MM/AA'}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <Text style={{ fontFamily: 'Rubik_600SemiBold', fontSize: 13, color: '#1A2521', marginRight: 4, width: 22 }}>Fin</Text>
                        <TouchableOpacity
                          style={{ backgroundColor: '#2D3E35', borderRadius: 8, paddingVertical: 5, paddingHorizontal: 4, flex: 1, alignItems: 'center' }}
                          onPress={() => setActivePicker({ index, campo: 'fin' })}
                          activeOpacity={0.75}
                        >
                          <Text style={{ color: etapa.fin ? '#fff' : '#a0b8aa', fontSize: 13, fontFamily: 'Rubik_400Regular' }}>
                            {etapa.fin || 'DD/MM/AA'}
                          </Text>
                        </TouchableOpacity>
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
      </View>

      <TouchableOpacity style={styles.continueBtn} onPress={onNext} activeOpacity={0.85}>
        <Text style={styles.continueBtnText}>Continuar &gt;</Text>
      </TouchableOpacity>

      {activePicker !== null && Platform.OS !== 'web' && (
        <DateTimePicker
          value={pickerValue}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handlePickerChange}
        />
      )}
    </ScrollView>
  );
}
