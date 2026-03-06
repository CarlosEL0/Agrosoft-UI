import { Colors } from '@/src/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlantPotIcon } from '@/src/components/icons/PlantPotIcon';
import { PlusIcon } from '@/src/components/icons/PlusIcon';
import { SearchIcon } from '@/src/components/icons/SearchIcon';
import { TreeIcon } from '@/src/components/icons/TreeIcon';
import { TabBar } from '@/src/components/ui/TabBar';
import { useCultivos } from '@/src/hooks/useCultivos';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 22 * 2 - 12) / 2;

const filtros = ['Todos', 'Activos', 'Hechos'];

export default function CultivosScreen() {
  const router = useRouter();
  const {
    filtroActivo,
    setFiltroActivo,
    busqueda,
    setBusqueda,
    cargando,
    cultivos,
    cultivosFiltrados
  } = useCultivos();

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
          <Text style={styles.totalBadgeNum}>{cultivos.length}</Text>
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
      {cargando ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        >
          {cultivosFiltrados.length === 0 ? (
            <View style={{ width: '100%', alignItems: 'center', marginTop: 20 }}>
              <Text style={{ fontFamily: 'Rubik_400Regular', color: Colors.textMedium }}>
                No tienes cultivos creados aún.
              </Text>
            </View>
          ) : (
            cultivosFiltrados.map((cultivo) => (
              <TouchableOpacity key={cultivo.id} style={styles.cultivoCard} onPress={() => router.push({ pathname: '/detalle-cultivo', params: { idCultivo: cultivo.id } })}>
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
            ))
          )}
        </ScrollView>
      )}

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/crear-cultivo')}>
        <PlusIcon />
      </TouchableOpacity>

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
    backgroundColor: Colors.primaryLight,
  },
  estadoText: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 11,
    color: Colors.primary,
  },
  estadoTextHecho: {
    color: Colors.surface,
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
});