// app/detalle-cultivo.tsx

import { Colors } from '@/src/theme/colors';
import { useRouter } from 'expo-router';
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


export default function DetalleCultivoScreen() {
  const router = useRouter();

  // Mock data — luego vendrá de la API
  const cultivo = {
    nombre: 'Maiz',
    ciclo: 'Ciclo floracion',
    diaActual: 45,
    diaTotal: 90,
    progreso: 35,
    salud: 'Buena',
    faseActual: 'Germinacion',
    riesgo: 'Bajo',
    ia: {
      riego: 'Óptimo',
      nutricion: 'Adecuada',
      plagas: 'Sin indicios',
    },
  };

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
          <Text style={styles.headerTitle}>Crear cultivo</Text>
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
              <Text style={styles.cicloNombre}>{cultivo.ciclo}</Text>
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
            <TouchableOpacity style={[styles.accionBtnHalf, styles.accionBtnLight]} onPress={() => router.push('./historial-cultivo')}>
              <View style={styles.accionBtnContentCenter}>
                <HistoryIcon color={Colors.textDark} size={24} />
                <Text style={styles.accionBtnTextDark}>Historial</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.accionBtnHalf, styles.accionBtnLight]}
              onPress={() => router.push({ pathname: '/analisis-ia', params: { idCultivo: '123' } })}
            >
              <View style={styles.accionBtnContentCenter}>
                <RobotIcon color={Colors.textDark} size={24} />
                <Text style={styles.accionBtnTextDark}>Ver análisis IA</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.accionBtnFull, styles.accionBtnDark]} onPress={() => router.push('./crear-reporte')}>
            <View style={styles.accionBtnContentCenter}>
              <PlusIcon />
              <Text style={styles.accionBtnTextLight}>Crear reporte</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Cards de estado ── */}
        <View style={styles.estadosRow}>
          <View style={styles.estadoCard}>
            <Text style={styles.estadoLabel}>Salud</Text>
            <CheckCircleIcon size={32} />
            <Text style={styles.estadoValue}>{cultivo.salud}</Text>
          </View>
          <View style={styles.estadoCard}>
            <Text style={styles.estadoLabel}>Fase actual</Text>
            <TreeCircleIcon size={32} />
            <Text style={styles.estadoValue}>{cultivo.faseActual}</Text>
          </View>
          <View style={styles.estadoCard}>
            <Text style={styles.estadoLabel}>Riesgo actual</Text>
            <AlertCircleIcon size={32} />
            <Text style={styles.estadoValue}>{cultivo.riesgo}</Text>
          </View>
        </View>

        {/* ── Card IA ── */}
        <View style={styles.iaCard}>
          <View style={styles.iaHeader}>
            <RobotIcon color={Colors.textDark} />
            <View style={styles.iaTag}>
              <Text style={styles.iaTagText}>motor inteligente del cultivo</Text>
            </View>
          </View>

          <View style={styles.iaItems}>
            <Text style={styles.iaItem}>💧 <Text style={styles.iaItemBold}>Riego:</Text> {cultivo.ia.riego} ✓</Text>
            <Text style={styles.iaItem}>🌱 <Text style={styles.iaItemBold}>Nutrición:</Text> {cultivo.ia.nutricion} ✓</Text>
            <Text style={styles.iaItem}>🛡️ <Text style={styles.iaItemBold}>Plagas:</Text> {cultivo.ia.plagas} ✓</Text>
          </View>
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
});