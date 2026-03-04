// app/detalle-reporte.tsx

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
import { Svg, Path, Circle, Rect } from 'react-native-svg';
import { Colors } from '@/src/theme/colors';

const { width } = Dimensions.get('window');

// ── Íconos ───────────────────────────────────────────────────────────────────

function BackIcon() {
  return (
    <Svg width={44} height={44} viewBox="0 0 44 44" fill="none">
      <Circle cx={22} cy={22} r={22} fill={Colors.textDark} />
      <Path d="M25 14l-8 8 8 8" stroke="#fff" strokeWidth={2.5}
        strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function PlantCircleIcon({ size = 50 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Circle cx={32} cy={32} r={32} fill={Colors.primary} />
      <Path d="M32 44V32" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
      <Path d="M32 38C32 38 24 35 22 27C22 27 30 23 34 31"
        stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M32 33C32 33 38 29 42 33C42 33 40 41 32 39"
        stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Rect x={26} y={44} width={12} height={8} rx={2} fill="#fff" opacity={0.9} />
    </Svg>
  );
}

function ImagePlaceholderIcon({ size = 40 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={3} width={18} height={18} rx={2} stroke={Colors.textLight} strokeWidth={1.5} />
      <Circle cx={8.5} cy={8.5} r={1.5} fill={Colors.textLight} />
      <Path d="M21 15l-5-5L5 21" stroke={Colors.textLight} strokeWidth={1.5}
        strokeLinecap="round" strokeLinejoin="round" />
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
      <Path d="M12 22v-6"
        stroke={active ? Colors.primary : Colors.textLight} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M5 16l7-6 7 6H5z"
        stroke={active ? Colors.primary : Colors.textLight} strokeWidth={1.8} strokeLinejoin="round" fill="none" />
      <Path d="M7 10l5-5 5 5H7z"
        stroke={active ? Colors.primary : Colors.textLight} strokeWidth={1.8} strokeLinejoin="round" fill="none" />
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

// ── Pantalla ──────────────────────────────────────────────────────────────────

export default function DetalleReporteScreen() {
  const router = useRouter();

  // Mock data — luego vendrá de la API
  const reporte = {
    tipo: 'Riego',
    etapa: 'Germinacion',
    fecha: '25/06/24',
    detalles: [
        { label: 'Humedad del suelo', value: 'Baja' },
    ],
    fotos: [null, null], // placeholders
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reporte de {reporte.tipo.toLowerCase()}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Card "Tu reporte" ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tu reporte</Text>

          {/* Info principal */}
          <View style={styles.reporteMain}>
            {/* Ícono planta */}
            <View style={styles.reporteIcono}>
              <PlantCircleIcon size={50} />
            </View>

            {/* Tipo + Etapa */}
            <View style={styles.reporteInfoLeft}>
              <Text style={styles.reporteTipo}>Tipo: {reporte.tipo}</Text>
              <Text style={styles.reporteEtapa}>Etapa: {reporte.etapa}</Text>
            </View>

            {/* Fecha */}
            <View style={styles.reporteFechaGroup}>
              <Text style={styles.reporteFechaLabel}>Fecha</Text>
              <View style={styles.reporteFechaBox}>
                <Text style={styles.reporteFechaText}>{reporte.fecha}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Card "Detalles del reporte" ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Detalles del reporte</Text>

          {reporte.detalles.map((item, index) => (
            <View key={index}>
              <View style={styles.detalleRow}>
                <Text style={styles.detalleLabel}>{item.label}</Text>
                <Text style={styles.detalleValue}>{item.value}</Text>
              </View>
              {index < reporte.detalles.length - 1 && (
                <View style={styles.detalleDivider} />
              )}
            </View>
          ))}
        </View>

        {/* ── Card "Fotos del reporte" ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Fotos del reporte</Text>
          <View style={styles.fotosRow}>
            {reporte.fotos.map((_, index) => (
              <View key={index} style={styles.fotoPlaceholder}>
                <ImagePlaceholderIcon size={40} />
              </View>
            ))}
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

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 20,
    color: Colors.textDark,
    textTransform: 'capitalize',
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 22,
    gap: 16,
    paddingBottom: 24,
  },

  // Cards
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    gap: 14,
  },
  cardTitle: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 16,
    color: Colors.textDark,
  },

  // Reporte main
  reporteMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reporteIcono: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  reporteInfoLeft: {
    flex: 1,
    gap: 4,
  },
  reporteTipo: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 15,
    color: Colors.textDark,
  },
  reporteEtapa: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 13,
    color: Colors.textMedium,
  },
  reporteFechaGroup: {
    alignItems: 'center',
    gap: 4,
  },
  reporteFechaLabel: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 12,
    color: Colors.textMedium,
  },
  reporteFechaBox: {
    backgroundColor: Colors.textDark,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  reporteFechaText: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 12,
    color: '#fff',
  },

  // Detalles
  detalleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  detalleLabel: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 14,
    color: Colors.textDark,
  },
  detalleValue: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 14,
    color: Colors.textMedium,
  },
  detalleDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },

  // Fotos
  fotosRow: {
    flexDirection: 'row',
    gap: 12,
  },
  fotoPlaceholder: {
    width: (width - 44 - 36 - 12) / 2,
    height: 120,
    backgroundColor: '#e8ede9',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
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