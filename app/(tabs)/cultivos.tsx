// app/(tabs)/cultivos.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Svg, Path, Circle, Rect, Ellipse } from 'react-native-svg';
import { Colors } from '@/src/theme/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 22 * 2 - 12) / 2;

// ── Íconos ───────────────────────────────────────────────────────────────────

function TreeIcon() {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22v-6" stroke={Colors.primary} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M5 16l7-6 7 6H5z" stroke={Colors.primary} strokeWidth={1.8} strokeLinejoin="round" fill="none" />
      <Path d="M7 10l5-5 5 5H7z" stroke={Colors.primary} strokeWidth={1.8} strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

function SearchIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={8} stroke={Colors.textLight} strokeWidth={1.8} />
      <Path d="M21 21l-4.35-4.35" stroke={Colors.textLight} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function PlantPotIcon({ size = 52 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <Path d="M16 36h24l-3 10H19L16 36z" fill={Colors.textDark} />
      <Rect x={14} y={32} width={28} height={6} rx={2} fill={Colors.textDark} />
      <Path d="M28 32V20" stroke={Colors.textDark} strokeWidth={2} strokeLinecap="round" />
      <Path d="M28 26C28 26 20 24 18 16C18 16 26 12 30 20"
        stroke={Colors.textDark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M28 22C28 22 34 18 38 22C38 22 36 30 28 28"
        stroke={Colors.textDark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

function PlusIcon() {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
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

// ── Datos mock ───────────────────────────────────────────────────────────────

const cultivosMock = [
  { id: '1', nombre: 'Maiz rojo', dia: 25, estado: 'Activo' },
  { id: '2', nombre: 'Frijol bayo', dia: 255, estado: 'Hecho' },
  { id: '3', nombre: 'Lechuga', dia: 255, estado: 'Activo' },
  { id: '4', nombre: 'Tomate', dia: 14, estado: 'Activo' },
];

const filtros = ['Todos', 'Activos', 'Hechos'];

// ── Pantalla ─────────────────────────────────────────────────────────────────

export default function CultivosScreen() {
  const router = useRouter();
  const [filtroActivo, setFiltroActivo] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  const cultivosFiltrados = cultivosMock.filter((c) => {
    const matchFiltro =
      filtroActivo === 'Todos' ||
      (filtroActivo === 'Activos' && c.estado === 'Activo') ||
      (filtroActivo === 'Hechos' && c.estado === 'Hecho');
    const matchBusqueda = c.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return matchFiltro && matchBusqueda;
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TreeIcon />
          <Text style={styles.headerTitle}>Mis cultivos</Text>
        </View>
      </View>

      {/* ── Barra de búsqueda ── */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <SearchIcon />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar cultivo"
            placeholderTextColor={Colors.textLight}
            value={busqueda}
            onChangeText={setBusqueda}
          />
        </View>
      </View>

      {/* ── Badge total ── */}
      <View style={styles.totalCard}>
        <View style={styles.totalBadge}>
          <Text style={styles.totalBadgeNum}>9</Text>
        </View>
        <Text style={styles.totalLabel}>Cultivos en total</Text>
      </View>

      {/* ── Filtros ── */}
      <View style={styles.filtrosRow}>
        {filtros.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filtroPill, filtroActivo === f && styles.filtroPillActive]}
            onPress={() => setFiltroActivo(f)}
          >
            <Text style={[styles.filtroPillText, filtroActivo === f && styles.filtroPillTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Grid de cultivos ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {cultivosFiltrados.map((cultivo) => (
          <TouchableOpacity key={cultivo.id} style={styles.cultivoCard} activeOpacity={0.85}>
            <PlantPotIcon size={56} />
            <Text style={styles.cultivoNombre}>{cultivo.nombre}</Text>
            <View style={styles.cultivoFooter}>
              <Text style={styles.cultivoDia}>Dia {cultivo.dia}</Text>
              <View style={[
                styles.estadoBadge,
                cultivo.estado === 'Hecho' && styles.estadoBadgeHecho
              ]}>
                <Text style={[
                  styles.estadoText,
                  cultivo.estado === 'Hecho' && styles.estadoTextHecho
                ]}>
                  {cultivo.estado}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Botón flotante + ── */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/crear-cultivo')}>
        <PlusIcon />
      </TouchableOpacity>

      {/* ── Tab Bar ── */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/(tabs)')}>
          <HomeTabIcon />
          <Text style={styles.tabLabel}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
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
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 22,
    color: Colors.textDark,
  },

  // Búsqueda
  searchContainer: {
    paddingHorizontal: 22,
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Rubik_400Regular',
    fontSize: 14,
    color: Colors.textDark,
  },

  // Badge total
  totalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8ede9',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 22,
    marginBottom: 14,
    gap: 14,
  },
  totalBadge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalBadgeNum: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 20,
    color: '#fff',
  },
  totalLabel: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 16,
    color: Colors.textDark,
  },

  // Filtros
  filtrosRow: {
    flexDirection: 'row',
    paddingHorizontal: 22,
    gap: 8,
    marginBottom: 16,
  },
  filtroPill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
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

  // Grid
  scroll: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 22,
    gap: 12,
    paddingBottom: 100,
  },

  // Card cultivo
  cultivoCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  cultivoNombre: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 15,
    color: Colors.textDark,
    textAlign: 'center',
  },
  cultivoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  cultivoDia: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 12,
    color: Colors.textLight,
  },
  estadoBadge: {
    backgroundColor: Colors.primary + '20',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  estadoBadgeHecho: {
    backgroundColor: '#e0e0e0',
  },
  estadoText: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 11,
    color: Colors.primary,
  },
  estadoTextHecho: {
    color: Colors.textMedium,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 22,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
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