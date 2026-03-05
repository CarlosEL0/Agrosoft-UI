// app/detalle-reporte.tsx

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
import { BackIcon } from '@/src/components/icons/BackIcon';
import { ImagePlaceholderIcon } from '@/src/components/icons/ImagePlaceholderIcon';
import { PlantCircleIcon } from '@/src/components/icons/PlantCircleIcon';
import { TabBar } from '@/src/components/ui/TabBar';

const { width } = Dimensions.get('window');

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
});