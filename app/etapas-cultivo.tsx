// app/etapas-cultivo.tsx

import { Colors } from '@/src/theme/colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackIcon } from '@/src/components/icons/BackIcon';
import { CalendarIcon } from '@/src/components/icons/CalendarIcon';
import { PlantCircleIcon } from '@/src/components/icons/PlantCircleIcon';
import { NavBar } from '@/src/components/ui/NavBar';
import { TabBar } from '@/src/components/ui/TabBar';
import { useDetalleCultivo } from '@/src/hooks/useDetalleCultivo';

function formatFechaCorta(iso: string): string {
  if (!iso) return 'N/D';
  const [y, m, d] = iso.split('T')[0].split('-');
  return `${d}/${m}/${y.slice(-2)}`;
}

export default function EtapasCultivoScreen() {
  const router = useRouter();
  const { idCultivo } = useLocalSearchParams<{ idCultivo: string }>();
  const { cultivo, cargando } = useDetalleCultivo(idCultivo);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <NavBar title="Cronograma de Etapas" onBack={() => router.back()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabecera del Cultivo */}
        <View style={styles.cultivoHeader}>
          <PlantCircleIcon size={80} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.cultivoNombre}>{cultivo.nombre}</Text>
            <Text style={styles.cultivoCiclo}>{cultivo.ciclo}</Text>
          </View>
        </View>

        <View style={styles.infoBanner}>
          <CalendarIcon color={Colors.primary} size={20} />
          <Text style={styles.infoBannerText}>
            Estas son las etapas programadas para tu cultivo. 
            La etapa actual se marca en verde.
          </Text>
        </View>

        {/* Timeline de Etapas */}
        <View style={styles.timelineContainer}>
          {cultivo.etapas && cultivo.etapas.length > 0 ? (
            cultivo.etapas.map((etapa, index) => {
              const inicio = new Date(etapa.inicio);
              const fin = new Date(etapa.fin);
              const isCompletada = hoy > fin;
              const isActiva = hoy >= inicio && hoy <= fin;

              return (
                <View key={etapa.id || index} style={styles.etapaRow}>
                  {/* Columna Izquierda: Punto y Línea */}
                  <View style={styles.leftCol}>
                    <View style={[
                      styles.dot,
                      isCompletada && styles.dotCompletada,
                      isActiva && styles.dotActiva
                    ]}>
                        {isActiva && <View style={styles.dotInner} />}
                    </View>
                    {index < cultivo.etapas.length - 1 && (
                      <View style={[
                        styles.line,
                        isCompletada && styles.lineCompletada
                      ]} />
                    )}
                  </View>

                  {/* Columna Derecha: Contenido de la Etapa */}
                  <View style={[
                    styles.etapaCard,
                    isActiva && styles.etapaCardActiva,
                    isCompletada && styles.etapaCardCompletada
                  ]}>
                    <View style={styles.etapaHeader}>
                      <Text style={[
                        styles.etapaNombre,
                        isActiva && styles.etapaNombreActiva
                      ]}>
                        {etapa.nombre}
                      </Text>
                      <View style={[
                        styles.diasBadge,
                        isActiva && styles.diasBadgeActiva
                      ]}>
                        <Text style={[
                          styles.diasText,
                          isActiva && styles.diasTextActiva
                        ]}>
                          {etapa.dias} días
                        </Text>
                      </View>
                    </View>

                    <View style={styles.fechasContainer}>
                      <View style={styles.fechaBox}>
                        <Text style={styles.fechaLabel}>INICIO</Text>
                        <Text style={styles.fechaValor}>{formatFechaCorta(etapa.inicio)}</Text>
                      </View>
                      <View style={styles.fechaDivider} />
                      <View style={styles.fechaBox}>
                        <Text style={styles.fechaLabel}>FIN</Text>
                        <Text style={styles.fechaValor}>{formatFechaCorta(etapa.fin)}</Text>
                      </View>
                    </View>

                    {isActiva && (
                      <View style={styles.tagActiva}>
                        <Text style={styles.tagActivaText}>Etapa Actual</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No se han definido etapas para este ciclo todavía.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <TabBar activeTab="cultivos" />
    </SafeAreaView>
  );
}

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
    paddingTop: 10,
    paddingBottom: 40,
  },
  cultivoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
    gap: 16,
    elevation: 2,
    shadowColor: '#ffffffff',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  headerTextContainer: {
    flex: 1,
  },
  cultivoNombre: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 22,
    color: Colors.textDark,
  },
  cultivoCiclo: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 14,
    color: Colors.textMedium,
    marginTop: 2,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.primary + '10',
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  infoBannerText: {
    flex: 1,
    fontFamily: 'Rubik_400Regular',
    fontSize: 13,
    color: Colors.primary,
    lineHeight: 18,
  },
  timelineContainer: {
    paddingLeft: 4,
  },
  etapaRow: {
    flexDirection: 'row',
    minHeight: 120,
    gap: 12,
  },
  leftCol: {
    alignItems: 'center',
    width: 24,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#d1d1d1',
    zIndex: 2,
    marginTop: 4,
  },
  dotCompletada: {
    backgroundColor: Colors.primary,
  },
  dotActiva: {
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: Colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  line: {
    flex: 1,
    width: 3,
    backgroundColor: '#e0e0e0',
    marginVertical: -2,
  },
  lineCompletada: {
    backgroundColor: Colors.primary,
    opacity: 0.5,
  },
  etapaCard: {
    flex: 1,
    backgroundColor: '#ffffffff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'transparent',
    elevation: 1,
    shadowColor: '#ffffffff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  etapaCardActiva: {
    borderColor: Colors.primary,
    backgroundColor: '#f9fcf9',
    elevation: 3,
  },
  etapaCardCompletada: {
    opacity: 0.85,
  },
  etapaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  etapaNombre: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 17,
    color: Colors.textDark,
    flex: 1,
  },
  etapaNombreActiva: {
    color: Colors.primary,
    fontFamily: 'Rubik_600SemiBold',
  },
  diasBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  diasBadgeActiva: {
    backgroundColor: Colors.primary,
  },
  diasText: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 12,
    color: Colors.textMedium,
  },
  diasTextActiva: {
    color: '#fff',
  },
  fechasContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9f8',
    borderRadius: 12,
    padding: 10,
  },
  fechaBox: {
    flex: 1,
    alignItems: 'center',
  },
  fechaLabel: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 10,
    color: Colors.textLight,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  fechaValor: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 14,
    color: Colors.textDark,
  },
  fechaDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 10,
  },
  tagActiva: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tagActivaText: {
    color: '#fff',
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 15,
    color: Colors.textMedium,
    textAlign: 'center',
  },
});
