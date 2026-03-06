// app/detalle-cultivo.tsx

import { Colors } from '@/src/theme/colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
import { TabBar } from '@/src/components/ui/TabBar';

const { width } = Dimensions.get('window');

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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <BackIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalle cultivo</Text>
        </View>

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

      {/* ── Tab Bar ── */}
      <TabBar activeTab="cultivos" />
    </SafeAreaView>
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
    fontSize: 12,
    color: Colors.textDark,
    textAlign: 'center',
  },
  estadoValue: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 12,
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
});
