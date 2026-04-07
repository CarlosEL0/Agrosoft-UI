// app/detalle-cultivo.tsx

import { Colors } from '@/src/theme/colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Importaciones extraídas
import { AlertCircleIcon } from '@/src/components/icons/AlertCircleIcon';
import { AlertTriangleIcon } from '@/src/components/icons/AlertTriangleIcon';
import { BackIcon } from '@/src/components/icons/BackIcon';
import { CheckCircleIcon } from '@/src/components/icons/CheckCircleIcon';
import { HistoryIcon } from '@/src/components/icons/HistoryIcon';
import { PlantCircleIcon } from '@/src/components/icons/PlantCircleIcon';
import { PlusIcon } from '@/src/components/icons/PlusIcon';
import { RobotIcon } from '@/src/components/icons/RobotIcon';
import { TreeCircleIcon } from '@/src/components/icons/TreeCircleIcon';
import { NavBar } from '@/src/components/ui/NavBar';
import { TabBar } from '@/src/components/ui/TabBar';
import { generarReporteCosechaIA } from '@/src/services/reporteService';
import { CultivoService } from '@/src/services/cultivoService';
import { TrashIcon } from '@/src/components/icons/TrashIcon';



function maskFechaInput(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function filterDecimal(text: string): string {
  const cleaned = text.replace(/[^0-9.]/g, '');
  const parts = cleaned.split('.');
  if (parts.length > 2) return parts[0] + '.' + parts.slice(1).join('');
  return cleaned;
}

// ── Barra de progreso ─────────────────────────────────────────────────────────

function ProgressBar({ progress }: { progress: number }) {
  return (
    <View style={styles.progressBg}>
      <View style={[styles.progressFill, { width: `${progress}%` }]} />
    </View>
  );
}

// ── Pantalla ──────────────────────────────────────────────────────────────────


import { useDetalleCultivo } from '@/src/hooks/useDetalleCultivo';

export default function DetalleCultivoScreen() {
  const router = useRouter();
  const { idCultivo } = useLocalSearchParams<{ idCultivo: string }>();
  const { cultivo, cargando } = useDetalleCultivo(idCultivo);
  const [fechaCosecha, setFechaCosecha] = useState('');
  const [cantidadCosechada, setCantidadCosechada] = useState('');
  const [calidadCultivo, setCalidadCultivo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [reporteCosecha, setReporteCosecha] = useState<any | null>(null);
  const [eliminando, setEliminando] = useState(false);

  const handleEliminar = async () => {
    if (!idCultivo) return;

    const confirmDelete = () => {
      Alert.alert(
        'Eliminar cultivo',
        '¿Estás seguro de que quieres eliminar este cultivo? Esta acción no se puede deshacer.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: async () => {
              try {
                setEliminando(true);
                await CultivoService.eliminarCultivo(idCultivo);
                Alert.alert('Éxito', 'Cultivo eliminado correctamente');
                router.replace('/(tabs)/cultivos');
              } catch (error) {
                console.error('Error al eliminar cultivo:', error);
                Alert.alert('Error', 'No se pudo eliminar el cultivo. Inténtalo de nuevo.');
              } finally {
                setEliminando(false);
              }
            },
          },
        ]
      );
    };

    if (Platform.OS === 'web') {
      if (window.confirm('¿Estás seguro de que quieres eliminar este cultivo?')) {
        try {
          setEliminando(true);
          await CultivoService.eliminarCultivo(idCultivo);
          router.replace('/(tabs)/cultivos');
        } catch (error) {
          window.alert('Error al eliminar el cultivo');
        } finally {
          setEliminando(false);
        }
      }
    } else {
      confirmDelete();
    }
  };

  // Cargar reporte persistido localmente si existe
  useEffect(() => {
    const loadPersisted = async () => {
      if (!cultivo?.idCiclo) return;
      const key = `harvestReport:${cultivo.idCiclo}`;
      try {
        let json: string | null = null;
        if (Platform.OS === 'web') {
          json = localStorage.getItem(key);
        } else {
          json = await SecureStore.getItemAsync(key);
        }
        if (json) {
          const parsed = JSON.parse(json);
          setReporteCosecha(parsed);
        }
      } catch {}
    };
    loadPersisted();
  }, [cultivo?.idCiclo]);

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <NavBar 
            title="Detalle cultivo" 
            onBack={() => router.back()} 
            rightElement={
              <TouchableOpacity onPress={handleEliminar} disabled={eliminando} style={{ padding: 8 }}>
                {eliminando ? (
                  <ActivityIndicator size="small" color={Colors.buttonBg} />
                ) : (
                  <TrashIcon color={Colors.buttonBg} size={24} />
                )}
              </TouchableOpacity>
            }
          />
          {/* ── Card principal cultivo ── */}
        <View style={styles.mainCard}>
          <View style={styles.mainCardInner}>
            {/* Imagen cultivo */}
            <View style={styles.cultivoImageBox}>
              <PlantCircleIcon size={64} />
              <Text style={styles.cultivoNombre}>{cultivo.nombre}</Text>
            </View>

            {/* Info ciclo */}
            <View style={styles.cicloInfo}>
              <Text style={styles.cicloNombre}>{cultivo.faseActual}</Text>
              <Text style={styles.cicloSubtitle}>{cultivo.ciclo}</Text>
              <Text style={styles.cicloDias}>
                Día {cultivo.diaActual} de {cultivo.diaTotal}{"  "}
                {cultivo.progreso}% completado
              </Text>
              <ProgressBar progress={cultivo.progreso} />
            </View>
          </View>
        </View>

        {/* ── Botones de acción 2x2 ── */}
        {/* ── Botones de acción ── */}
        <View style={styles.accionesContainer}>
          <View style={styles.accionesRow}>
            <TouchableOpacity
              style={[styles.accionBtnHalf, styles.accionBtnLight]}
              onPress={() => router.push({ pathname: './historial-cultivo', params: { idCultivo: idCultivo ?? '' } })}
            >
              <View style={styles.accionBtnContentCenter}>
                <HistoryIcon color={Colors.textDark} size={24} />
                <Text style={styles.accionBtnTextDark}>Historial</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.accionBtnHalf, styles.accionBtnLight]}
              onPress={() => router.push({ pathname: '/analisis-ia', params: { idCultivo: idCultivo ?? '' } })}
            >
              <View style={styles.accionBtnContentCenter}>
                <RobotIcon color={Colors.textDark} size={24} />
                <Text style={styles.accionBtnTextDark}>Ver análisis IA</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.accionBtnFull, styles.accionBtnDark]} onPress={() => router.push({ pathname: '/crear-reporte', params: { idCultivo: idCultivo ?? '', etapaActual: cultivo.faseActual } })}>
            <View style={styles.accionBtnContentCenter}>
              <PlusIcon />
              <Text style={styles.accionBtnTextLight}>Crear reporte</Text>
            </View>
          </TouchableOpacity>
        </View>

        {((cultivo.progreso >= 100 || cultivo.diaActual >= cultivo.diaTotal) && cultivo?.idCiclo && !reporteCosecha) && (
          <View style={styles.cierreCard}>
            <Text style={styles.cierreTitle}>Cierre del cultivo</Text>
            <Text style={styles.cierreSubtitle}>Genera el reporte de cosecha con IA</Text>
            <View style={{ gap: 10 }}>
              <Text style={styles.cierreLabel}>Fecha de cosecha (DD/MM/AAAA)</Text>
              <TextInput
                style={styles.cierreInput}
                placeholder="DD/MM/AAAA"
                placeholderTextColor={Colors.textLight}
                value={fechaCosecha}
                onChangeText={(v) => setFechaCosecha(maskFechaInput(v))}
                keyboardType="number-pad"
              />
              <Text style={styles.cierreLabel}>Cantidad cosechada (kg)</Text>
              <TextInput
                style={styles.cierreInput}
                placeholder="0.00"
                placeholderTextColor={Colors.textLight}
                keyboardType="decimal-pad"
                value={cantidadCosechada}
                onChangeText={(v) => setCantidadCosechada(filterDecimal(v))}
              />
              <Text style={styles.cierreLabel}>Calidad del cultivo</Text>
              <TextInput
                style={styles.cierreInput}
                placeholder="Alta / Media / Baja"
                placeholderTextColor={Colors.textLight}
                value={calidadCultivo}
                onChangeText={setCalidadCultivo}
              />
              <TouchableOpacity
                style={[styles.cierreBtn, (!fechaCosecha || !cantidadCosechada || !calidadCultivo || enviando) && { opacity: 0.6 }]}
                disabled={!fechaCosecha || !cantidadCosechada || !calidadCultivo || enviando}
                onPress={async () => {
                  try {
                    setEnviando(true);
                    if (!cultivo.idCiclo) throw new Error('Falta id del ciclo');
                    const dataResp = await generarReporteCosechaIA({
                      idCultivo: String(idCultivo || ''),
                      idCiclo: cultivo.idCiclo as string,
                      fechaCosecha,
                      cantidadCosechada,
                      calidadCultivo,
                    });
                    setReporteCosecha(dataResp || null);
                    // Persistir localmente para mostrarlo en próximas visitas
                    try {
                      const key = `harvestReport:${cultivo.idCiclo}`;
                      const json = JSON.stringify(dataResp || {});
                      if (Platform.OS === 'web') {
                        localStorage.setItem(key, json);
                      } else {
                        await SecureStore.setItemAsync(key, json);
                      }
                    } catch {}
                    Alert.alert('Éxito', 'Reporte de cosecha generado');
                  } catch (e: any) {
                    const msg = e?.response?.data?.message || e?.message || 'No se pudo generar el reporte';
                    Alert.alert('Error', msg);
                  } finally {
                    setEnviando(false);
                  }
                }}
              >
                <Text style={styles.cierreBtnText}>{enviando ? 'Generando...' : 'Generar reporte IA'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {reporteCosecha && (
          <View style={styles.cosechaCard}>
            <Text style={styles.cierreTitle}>Reporte de cosecha</Text>
            <View style={styles.cosechaRow}>
              <Text style={styles.cosechaLabel}>Fecha</Text>
              <Text style={styles.cosechaValue}>{String(reporteCosecha.fechaCosecha || '')}</Text>
            </View>
            <View style={styles.cosechaRow}>
              <Text style={styles.cosechaLabel}>Cantidad</Text>
              <Text style={styles.cosechaValue}>{String(reporteCosecha.cantidadCosechada || '')} kg</Text>
            </View>
            <View style={styles.cosechaRow}>
              <Text style={styles.cosechaLabel}>Calidad</Text>
              <Text style={styles.cosechaValue}>{String(reporteCosecha.calidadCultivo || '')}</Text>
            </View>
            <View style={styles.cosechaRow}>
              <Text style={styles.cosechaLabel}>Rendimiento esperado</Text>
              <Text style={styles.cosechaValue}>{String(reporteCosecha.rendimientoEsperado ?? '')}</Text>
            </View>
            <View style={styles.cosechaRow}>
              <Text style={styles.cosechaLabel}>Desviación rendimiento</Text>
              <Text style={styles.cosechaValue}>{String(reporteCosecha.desviacionRendimiento ?? '')}</Text>
            </View>
            <View style={styles.cosechaRow}>
              <Text style={styles.cosechaLabel}>Eficiencia riego</Text>
              <Text style={styles.cosechaValue}>{String(reporteCosecha.eficienciaRiego ?? '')}</Text>
            </View>
            <View style={styles.cosechaRow}>
              <Text style={styles.cosechaLabel}>Costo total</Text>
              <Text style={styles.cosechaValue}>{String(reporteCosecha.costoTotal ?? '')}</Text>
            </View>
            <View style={styles.cosechaRow}>
              <Text style={styles.cosechaLabel}>Costo por kg</Text>
              <Text style={styles.cosechaValue}>{String(reporteCosecha.costoPorKg ?? '')}</Text>
            </View>
            <Text style={styles.cierreTitle}>Resumen del ciclo</Text>
            <Text style={styles.cosechaText}>{String(reporteCosecha.resumenCiclo || '')}</Text>
            <Text style={styles.cierreTitle}>Factores de éxito</Text>
            <Text style={styles.cosechaText}>{String(reporteCosecha.factoresExito || '')}</Text>
            <Text style={styles.cierreTitle}>Áreas de mejora</Text>
            <Text style={styles.cosechaText}>{String(reporteCosecha.areasMejora || '')}</Text>
          </View>
        )}

        {/* ── Cards de estado ── */}
        {(() => {
          // Devuelve icono y color según el valor del estado
          const getEstadoVisual = (valor: string): { icon: React.ReactNode; color: string } => {
            const v = valor.toLowerCase();
            if (v === 'buena' || v === 'bajo') {
              return { icon: <CheckCircleIcon size={32} color={Colors.buttonBg} />, color: Colors.buttonBg };
            } else if (v === 'regular' || v === 'moderado') {
              return { icon: <AlertTriangleIcon color={Colors.warning} />, color: Colors.warning };
            } else if (v === 'mala' || v === 'alto') {
              return { icon: <AlertCircleIcon size={32} color={Colors.danger} />, color: Colors.danger };
            }
            // fallback (cargando, sin etapa, etc.)
            return { icon: <TreeCircleIcon size={32} />, color: Colors.textMedium };
          };

          const saludVisual = getEstadoVisual(cultivo.salud);
          const riesgoVisual = getEstadoVisual(cultivo.riesgo);

          return (
            <View style={styles.estadosRow}>
              <View style={styles.estadoCard}>
                <Text style={styles.estadoLabel}>Salud</Text>
                {saludVisual.icon}
                <Text style={[styles.estadoValue, { color: saludVisual.color, fontFamily: 'Rubik_500Medium' }]}>
                  {cultivo.salud}
                </Text>
              </View>
              <View style={styles.estadoCard}>
                <Text style={styles.estadoLabel}>Fase actual</Text>
                <TreeCircleIcon size={32} />
                <Text style={[styles.estadoValue, { fontFamily: 'Rubik_500Medium' }]}>{cultivo.faseActual}</Text>
              </View>
              <View style={styles.estadoCard}>
                <Text style={styles.estadoLabel}>Riesgo actual</Text>
                {riesgoVisual.icon}
                <Text style={[styles.estadoValue, { color: riesgoVisual.color, fontFamily: 'Rubik_500Medium' }]}>
                  {cultivo.riesgo}
                </Text>
              </View>
            </View>
          );
        })()}


        {/* ── Card IA ── */}
        <View style={styles.iaCard}>
          <View style={styles.iaHeader}>
            <RobotIcon color={Colors.textDark} />
            <View style={styles.iaTag}>
              <Text style={styles.iaTagText}>motor inteligente del cultivo</Text>
            </View>
          </View>

          <Text style={styles.iaResumen}>
            {cultivo.resumenIA}
          </Text>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>

      {/* ── Tab Bar ── */}
      <TabBar activeTab="cultivos" />
    </View>
  );
}

// ── Estilos ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f4f3',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 24,
    gap: 16,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingTop: 16,
    paddingBottom: 4,
  },
  headerTitle: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 20,
    color: Colors.textDark,
  },

  // Card principal
  mainCard: {
    backgroundColor: '#e8ede9',
    borderRadius: 20,
    padding: 16,
  },
  mainCardInner: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  cultivoImageBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    minWidth: 100,
  },
  cultivoNombre: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 15,
    color: Colors.textDark,
  },
  cicloInfo: {
    flex: 1,
    gap: 6,
  },
  cicloNombre: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 18,
    color: Colors.textDark,
  },
  cicloSubtitle: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 12,
    color: Colors.textMedium,
    marginTop: -2,
  },
  cicloDias: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 13,
    color: Colors.textMedium,
    lineHeight: 18,
  },
  progressBg: {
    height: 8,
    backgroundColor: '#c8d8cc',
    borderRadius: 4,
    marginTop: 4,
  },
  progressFill: {
    height: 8,
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },

  // Acciones 2x2
  // Acciones
  accionesContainer: {
    gap: 12,
  },
  accionesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  accionBtnHalf: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  accionBtnFull: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  accionBtnDark: {
    backgroundColor: Colors.primary,
  },
  accionBtnLight: {
    backgroundColor: '#e8ede9',
  },
  accionBtnContentCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  accionBtnTextLight: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 16,
    color: '#fff',
  },
  accionBtnTextDark: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 15,
    color: Colors.textDark,
  },

  // Cards de estado
  estadosRow: {
    flexDirection: 'row',
    gap: 10,
  },
  estadoCard: {
    flex: 1,
    backgroundColor: '#e8ede9',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 8,
  },
  estadoLabel: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 13,
    color: Colors.textDark,
    textAlign: 'center',
  },
  estadoValue: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 13,
    color: Colors.textDark,
    textAlign: 'center',
  },

  // Card IA
  iaCard: {
    backgroundColor: '#e8ede9',
    borderRadius: 20,
    padding: 18,
    gap: 14,
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
    color: Colors.textDark,
  },
  iaItems: {
    gap: 8,
  },
  iaItem: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 14,
    color: Colors.textDark,
    lineHeight: 22,
  },
  iaItemBold: {
    fontFamily: 'Rubik_600SemiBold',
  },
  iaResumen: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 14,
    color: Colors.textDark,
    lineHeight: 22,
  },
  cierreCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    gap: 10,
  },
  cierreTitle: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 16,
    color: Colors.textDark,
  },
  cierreSubtitle: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 12,
    color: Colors.textMedium,
  },
  cierreLabel: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 13,
    color: Colors.textDark,
  },
  cierreInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'Rubik_400Regular',
    fontSize: 14,
    color: Colors.textDark,
  },
  cierreBtn: {
    marginTop: 6,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cierreBtnText: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 15,
    color: '#fff',
  },
  cosechaCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    gap: 8,
  },
  cosechaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  cosechaLabel: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 13,
    color: Colors.textMedium,
  },
  cosechaValue: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 13,
    color: Colors.textDark,
  },
  cosechaText: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 14,
    color: Colors.textDark,
    lineHeight: 22,
  },
});
