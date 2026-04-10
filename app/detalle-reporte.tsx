// app/detalle-reporte.tsx

import { Colors } from '@/src/theme/colors';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Importaciones extraídas
import { BackIcon } from '@/src/components/icons/BackIcon';
import { ImagePlaceholderIcon } from '@/src/components/icons/ImagePlaceholderIcon';
import { PlantCircleIcon } from '@/src/components/icons/PlantCircleIcon';
import { TabBar } from '@/src/components/ui/TabBar';

const { width } = Dimensions.get('window');

import { useDetalleReporte } from '@/src/hooks/useDetalleReporte';

// ── Pantalla ──────────────────────────────────────────────────────────────────

export default function DetalleReporteScreen() {
  const router = useRouter();
  const { reporte } = useDetalleReporte();
  const { idRef, idCultivo, tipo } = useLocalSearchParams<{ idRef: string; idCultivo: string; tipo: string }>();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openImage = (url: string) => {
    setSelectedImage(url);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>

      {/* ── Modal Visualizador de Imagen ── */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalCloseArea} 
            activeOpacity={1} 
            onPress={() => setModalVisible(false)} 
          />
          <View style={styles.modalContent}>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            )}
            <TouchableOpacity 
              style={styles.closeBtn} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeBtnText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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

          {reporte.detalles.map((item, index) => {
            const esTextoLargo = ['Descripción', 'Observaciones', 'Comentario'].includes(item.label);
            return (
              <View key={index}>
                {esTextoLargo ? (
                  <View style={styles.detalleBlock}>
                    <Text style={styles.detalleLabel}>{item.label}</Text>
                    <Text style={styles.detalleValueBlock}>{item.value}</Text>
                  </View>
                ) : (
                  <View style={styles.detalleRow}>
                    <Text style={styles.detalleLabel}>{item.label}</Text>
                    <Text style={styles.detalleValue}>{item.value}</Text>
                  </View>
                )}
                {index < reporte.detalles.length - 1 && (
                  <View style={styles.detalleDivider} />
                )}
              </View>
            );
          })}
        </View>

        {/* ── Card "Fotos del reporte" ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Fotos del reporte</Text>
          <View style={styles.fotosRow}>
            {reporte.fotos.length > 0 ? (
              reporte.fotos.map((url, index) => (
                <TouchableOpacity key={index} activeOpacity={0.9} onPress={() => url && openImage(url)}>
                  <Image
                    source={{ uri: url || undefined }}
                    style={styles.fotoImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.fotoPlaceholder}>
                <ImagePlaceholderIcon size={40} />
              </View>
            )}
          </View>
        </View>

        {String(tipo).toLowerCase() === 'irregularidad' && (
          <TouchableOpacity
            style={styles.iaBtn}
            onPress={() => router.push({ pathname: '/analisis-ia', params: { idCultivo: String(idCultivo || ''), idIrregularidad: String(idRef || '') } })}
            activeOpacity={0.85}
          >
            <Text style={styles.iaBtnText}>Analizar con IA</Text>
          </TouchableOpacity>
        )}

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
  detalleBlock: {
    paddingVertical: 10,
    gap: 6,
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
    flexShrink: 1,
    maxWidth: '60%',
    textAlign: 'right',
  },
  detalleValueBlock: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 14,
    color: Colors.textMedium,
    lineHeight: 20,
  },
  detalleDivider: {
    height: 1,
    backgroundColor: '#e8ede9',
  },

  // Fotos
  fotosRow: {
    flexDirection: 'row',
    gap: 12,
  },
  fotoImage: {
    width: (width - 44 - 36 - 12) / 2,
    height: 120,
    borderRadius: 14,
    backgroundColor: '#e8ede9',
  },
  fotoPlaceholder: {
    width: (width - 44 - 36 - 12) / 2,
    height: 120,
    backgroundColor: '#e8ede9',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iaBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  iaBtnText: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 16,
    color: '#fff',
  },

  // Modal Visualizador
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '95%',
    height: '100%',
    borderRadius: 8,
  },
  closeBtn: {
    position: 'absolute',
    bottom: -60,
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  closeBtnText: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 15,
    color: Colors.textDark,
  },
});
