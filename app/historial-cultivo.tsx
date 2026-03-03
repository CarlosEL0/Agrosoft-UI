// app/historial-cultivo.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Svg, Path, Circle, Rect } from 'react-native-svg';
import { Colors } from '@/src/theme/colors';

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

function PlantCircleIcon({ size = 48 }: { size?: number }) {
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

function ImageIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
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

// ── Datos mock ────────────────────────────────────────────────────────────────

const reportesMock = [
  { id: '1', tipo: 'Riego', etapa: 'Germinacion', fecha: '25/06/24' },
  { id: '2', tipo: 'Podacion', etapa: 'Cosecha', fecha: '25/06/24' },
  { id: '3', tipo: 'Riego', etapa: 'Germinacion', fecha: '25/06/24' },
  { id: '4', tipo: 'Riego', etapa: 'Germinacion', fecha: '25/06/24' },
  { id: '5', tipo: 'Crecimiento', etapa: 'Germinacion', fecha: '25/06/24' },
];

const filtros = ['Todos', 'Riego', 'Poda', 'fertiliza'];

// ── Pantalla ──────────────────────────────────────────────────────────────────

export default function HistorialCultivoScreen() {
  const router = useRouter();
  const [filtroActivo, setFiltroActivo] = useState('Todos');

  const reportesFiltrados = reportesMock.filter((r) => {
    if (filtroActivo === 'Todos') return true;
    return r.tipo.toLowerCase().includes(filtroActivo.toLowerCase());
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reportes</Text>
      </View>

      {/* ── Subtítulo ── */}
      <Text style={styles.subTitle}>Historial de tu cultivo</Text>

      {/* ── Filtros ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtrosRow}
        style={{ maxHeight: 52, marginBottom: 16 }}
        >
        {filtros.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filtroPill, filtroActivo === f && styles.filtroPillActive]}
            onPress={() => setFiltroActivo(f)}
          >
            <Text style={[
              styles.filtroPillText,
              filtroActivo === f && styles.filtroPillTextActive,
            ]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Lista de reportes ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {reportesFiltrados.map((reporte) => (
          <TouchableOpacity key={reporte.id} style={styles.reporteCard} activeOpacity={0.85}>
            {/* Ícono planta */}
            <View style={styles.reporteIcono}>
              <PlantCircleIcon size={50} />
            </View>

            {/* Info */}
            <View style={styles.reporteInfo}>
              <Text style={styles.reporteTipo}>Tipo: {reporte.tipo}</Text>
              <View style={styles.reporteFechaRow}>
                <Text style={styles.reporteFechaLabel}>Fecha</Text>
                <View style={styles.reporteFechaBox}>
                  <Text style={styles.reporteFechaText}>{reporte.fecha}</Text>
                </View>
              </View>
              <Text style={styles.reporteEtapa}>Etapa: {reporte.etapa}</Text>
            </View>

            {/* Foto placeholder */}
            <View style={styles.reporteFoto}>
              <ImageIcon />
            </View>
          </TouchableOpacity>
        ))}
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
    paddingBottom: 8,
  },
  headerTitle: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 20,
    color: Colors.textDark,
  },

  // Subtítulo
  subTitle: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 16,
    color: Colors.textDark,
    paddingHorizontal: 22,
    marginBottom: 12,
  },

 filtrosRow: {
  paddingHorizontal: 22,
  gap: 8,
  marginBottom: 6,
  flexDirection: 'row',
},
filtroPill: {
  paddingHorizontal: 18,
  paddingVertical: 8,
  borderRadius: 20,
  backgroundColor: '#fff',
  height: 36,
  justifyContent: 'center',
},
  filtroPillActive: {
    backgroundColor: Colors.primary,
  },
  filtroPillText: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 13,
    color: Colors.textMedium,
  },
  filtroPillTextActive: {
    fontFamily: 'Rubik_500Medium',
    color: '#fff',
  },

  // Lista
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
    gap: 12,
    paddingBottom: 24,
  },

  // Card reporte
  reporteCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reporteIcono: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  reporteInfo: {
    flex: 1,
    gap: 6,
  },
  reporteTipo: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 14,
    color: Colors.textDark,
  },
  reporteFechaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reporteFechaLabel: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 12,
    color: Colors.textMedium,
  },
  reporteFechaBox: {
    backgroundColor: Colors.textDark,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  reporteFechaText: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 11,
    color: '#fff',
  },
  reporteEtapa: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 12,
    color: Colors.textMedium,
  },

  // Foto placeholder
  reporteFoto: {
    width: 52,
    height: 52,
    backgroundColor: '#e8ede9',
    borderRadius: 12,
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