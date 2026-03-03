// app/detalle-cultivo.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Svg, Path, Circle, Rect, G } from 'react-native-svg';
import { Colors } from '@/src/theme/colors';

const { width } = Dimensions.get('window');

// ── Íconos ───────────────────────────────────────────────────────────────────

function BackIcon() {
  return (
    <Svg width={44} height={44} viewBox="0 0 44 44" fill="none">
      <Circle cx={22} cy={22} r={22} fill={Colors.textDark} />
      <Path d="M25 14l-8 8 8 8" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function PlantCircleIcon({ size = 56 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Circle cx={32} cy={32} r={32} fill={Colors.primary} />
      <Path d="M32 44V32" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
      <Path d="M32 38C32 38 24 35 22 27C22 27 30 23 34 31"
        stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M32 33C32 33 38 29 42 33C42 33 40 41 32 39"
        stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Rect x={26} y={44} width={12} height={8} rx={2} fill="#fff" opacity={0.9} />
      <Path d="M24 44h16l-2 6H26l-2-6z" fill="#fff" opacity={0.7} />
    </Svg>
  );
}

function PlusIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
    </Svg>
  );
}

function RobotIcon({ color = Colors.textDark }: { color?: string }) {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={8} width={18} height={13} rx={2} stroke={color} strokeWidth={1.5} />
      <Path d="M12 8V4" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Circle cx={12} cy={3} r={1} fill={color} />
      <Circle cx={8.5} cy={13} r={1.5} fill={color} />
      <Circle cx={15.5} cy={13} r={1.5} fill={color} />
      <Path d="M9 17h6" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function HistoryIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M3 3v5h5" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 7v5l4 2" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function AlertTriangleIcon({ color = Colors.textDark }: { color?: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        stroke={color} strokeWidth={1.8} fill="none" />
      <Path d="M12 9v4M12 17h.01" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function CheckCircleIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} fill={Colors.primary} />
      <Path d="M8 12l3 3 5-5" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function TreeCircleIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} fill={Colors.primary} />
      <Path d="M12 18v-4" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M8 14l4-4 4 4H8z" stroke="#fff" strokeWidth={1.5} strokeLinejoin="round" fill="none" />
      <Path d="M9 10l3-3 3 3H9z" stroke="#fff" strokeWidth={1.5} strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

function AlertCircleIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} fill="#d32f2f" />
      <Path d="M12 8v4M12 16h.01" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function HomeTabIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
        stroke={Colors.textLight} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 21V12h6v9"
        stroke={Colors.textLight} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function TreeTabIcon({ active = false }: { active?: boolean }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22v-6" stroke={active ? Colors.primary : Colors.textLight} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M5 16l7-6 7 6H5z" stroke={active ? Colors.primary : Colors.textLight} strokeWidth={1.8} strokeLinejoin="round" fill="none" />
      <Path d="M7 10l5-5 5 5H7z" stroke={active ? Colors.primary : Colors.textLight} strokeWidth={1.8} strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

function UserTabIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
        stroke={Colors.textLight} strokeWidth={1.8} strokeLinecap="round" />
      <Circle cx={12} cy={7} r={4} stroke={Colors.textLight} strokeWidth={1.8} />
    </Svg>
  );
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
        <View style={styles.accionesGrid}>
          <TouchableOpacity style={[styles.accionBtn, styles.accionBtnDark]}>
            <View style={styles.accionBtnContent}>
              <PlusIcon />
              <Text style={styles.accionBtnTextLight}>Crear reporte</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.accionBtn, styles.accionBtnLight]}>
            <View style={styles.accionBtnContent}>
              <RobotIcon color={Colors.textDark} />
              <Text style={styles.accionBtnTextDark}>Ver análisis IA</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.accionBtn, styles.accionBtnDark]}>
            <View style={styles.accionBtnContent}>
              <HistoryIcon />
              <Text style={styles.accionBtnTextLight}>Historial</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.accionBtn, styles.accionBtnLight]}>
            <View style={styles.accionBtnContent}>
              <AlertTriangleIcon color={Colors.textDark} />
              <Text style={styles.accionBtnTextDark}>Alertas</Text>
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
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/(tabs)')}>
          <HomeTabIcon />
          <Text style={styles.tabLabel}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/(tabs)/cultivos')}>
          <TreeTabIcon active />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Cultivos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <UserTabIcon />
          <Text style={styles.tabLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>
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
  accionesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  accionBtn: {
    width: (width - 44 - 12) / 2,
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
  accionBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accionBtnTextLight: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 15,
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

  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
    paddingVertical: 10,
    paddingBottom: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  tabLabel: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 12,
    color: Colors.textLight,
  },
  tabLabelActive: {
    fontFamily: 'Rubik_500Medium',
    color: Colors.primary,
  },
});