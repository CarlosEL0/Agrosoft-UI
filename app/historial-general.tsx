// app/historial-general.tsx

import { Colors } from '@/src/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Importaciones extraídas
import { BackIcon } from '@/src/components/icons/BackIcon';
import { ImageIcon } from '@/src/components/icons/ImageIcon';
import { PlantCircleIcon } from '@/src/components/icons/PlantCircleIcon';
import { TabBar } from '@/src/components/ui/TabBar';



import { useHistorialGeneral } from '@/src/hooks/useHistorialGeneral';

// ── Pantalla ──────────────────────────────────────────────────────────────────

export default function HistorialGeneralScreen() {
  const router = useRouter();
  const { filtros, filtroActivo, setFiltroActivo, reportesFiltrados } = useHistorialGeneral();

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
      <Text style={styles.subTitle}>Historial de todos los cultivos</Text>

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

      {/* ── Lista ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {reportesFiltrados.map((reporte) => (
          <TouchableOpacity
            key={reporte.id}
            style={styles.reporteCard}
            activeOpacity={0.85}
            onPress={() => router.push({
              pathname: '/detalle-reporte',
              params: {
                idRef: reporte.id,
                idEvento: reporte.eventId ?? '',
                tipo: reporte.tipo,
                idCultivo: reporte.idCultivo,
                fecha: reporte.fecha,
                etapa: reporte.etapa
              }
            })}
          >
            {/* Ícono */}
            <View style={styles.reporteIcono}>
              <PlantCircleIcon size={50} />
            </View>

            {/* Info */}
            <View style={styles.reporteInfo}>
              {/* Nombre del cultivo — diferencia vs historial individual */}
              <View style={styles.cultivoTag}>
                <Text style={styles.cultivoTagText}>{reporte.cultivo}</Text>
              </View>
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
              {reporte.fotoUrl ? (
                <Image
                  source={{ uri: reporte.fotoUrl }}
                  style={{ width: 60, height: 60, borderRadius: 10, backgroundColor: '#e8ede9' }}
                  resizeMode="cover"
                />
              ) : (
                <ImageIcon />
              )}
            </View>
          </TouchableOpacity>
        ))}
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

  // Filtros
  filtrosRow: {
    paddingHorizontal: 22,
    gap: 8,
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
  scroll: { flex: 1 },
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
    gap: 5,
  },

  // Tag nombre cultivo
  cultivoTag: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary + '20',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 2,
  },
  cultivoTagText: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 11,
    color: Colors.primary,
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
});
