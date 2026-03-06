// app/(tabs)/index.tsx

import { TabBar } from '@/src/components/ui/TabBar';
import { Colors } from '@/src/theme/colors';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BellIcon } from '@/src/components/icons/BellIcon';
import { HomeIcon } from '@/src/components/icons/HomeIcon';
import { PlantPotIcon } from '@/src/components/icons/PlantPotIcon';
import { PlantPotSmallIcon } from '@/src/components/icons/PlantPotSmallIcon';
import { RobotIcon } from '@/src/components/icons/RobotIcon';
import { useInicio } from '@/src/hooks/useInicio';

// ── Pantalla Home ─────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const { cargando, cultivos, cultivoEnRiesgo } = useInicio();
  const scrollX = useRef(new Animated.Value(0)).current;
  const CARD_WIDTH = 220;
  const CARD_SPACING = 12;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <HomeIcon />
            <Text style={styles.headerTitle}>Inicio</Text>
          </View>
          <TouchableOpacity>
            <BellIcon />
          </TouchableOpacity>
        </View>

        {/* ── Card cultivos activos ── */}
        <View style={styles.activosCard}>
          <View style={styles.activosBadge}>
            <Text style={styles.activosBadgeNum}>{cultivos.length}</Text>
          </View>
          <Text style={styles.activosLabel}>Cultivos activos</Text>
        </View>

        {/* ── Tus cultivos ── */}
        <Text style={styles.sectionTitle}>Tus cultivos</Text>

        {/* Lista horizontal de cultivos */}
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: CARD_SPACING }}
          style={{ marginBottom: 20 }}
          snapToInterval={CARD_WIDTH + CARD_SPACING}
          decelerationRate="fast"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        >
          {cultivos.map((c, i) => {
            const inputRange = [
              (i - 1) * (CARD_WIDTH + CARD_SPACING),
              i * (CARD_WIDTH + CARD_SPACING),
              (i + 1) * (CARD_WIDTH + CARD_SPACING),
            ];
            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.92, 1.05, 0.92],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.8, 1, 0.8],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View key={c.id} style={{ transform: [{ scale }], opacity }}>
                <TouchableOpacity
                  style={[styles.cultivoCard, { width: CARD_WIDTH }]}
                  onPress={() => router.push({ pathname: '/detalle-cultivo', params: { idCultivo: c.id } })}
                  activeOpacity={0.85}
                >
                  <View style={{ alignItems: 'center', width: '100%' }}>
                    <Text style={styles.cultivoNombre}>{c.nombre}</Text>
                    <PlantPotIcon size={72} />
                    <Text style={styles.cultivoDias}>Día {c.dia}</Text>
                    <View style={styles.etapasRow}>
                      <View style={styles.etapaGrayTag}>
                        <Text style={styles.etapaGrayText}>Estado</Text>
                      </View>
                      <View style={[styles.etapaGreenTag, c.estado === 'Hecho' && { backgroundColor: Colors.textMedium }]}>
                        <Text style={styles.etapaGreenText}>{c.estado}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
          )})}
        </Animated.ScrollView>


        {/* ── ¿Qué deseas hacer? ── */}
        <Text style={styles.actionTitle}>Que deseas hacer?</Text>
        <View style={styles.actionsContainer}>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionPill} onPress={() => router.push('./crear-cultivo')}>
              <Text style={styles.actionPillText}>Crear cultivo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionPill} onPress={() => router.push('./(tabs)/cultivos')}>
              <Text style={styles.actionPillText}>ver cultivos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionPill, styles.actionPill]} onPress={() => router.push('./historial-general')}>
              <Text style={styles.actionPillText}>Historial</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Card alerta ── */}
        <View style={styles.alertCard}>
          <View style={styles.alertLeft}>
            <PlantPotSmallIcon size={52} />
            <Text style={styles.alertCultivoNombre}>{cultivoEnRiesgo ? cultivoEnRiesgo.nombre : 'IA'}</Text>
          </View>
          <View style={styles.alertDivider} />
          <View style={styles.alertRight}>
            <Text style={styles.alertTitle}>Cultivo en riesgo</Text>
            <View style={styles.alertMsgRow}>
              <RobotIcon />
              <Text style={styles.alertMsg}>
                {cultivoEnRiesgo
                  ? `Irregularidades activas: ${cultivoEnRiesgo.irregularidades}\nRiesgo: ${cultivoEnRiesgo.riesgo}`
                  : 'No hay cultivos en riesgo'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.alertBtn}
              onPress={() =>
                cultivoEnRiesgo
                  ? router.push({ pathname: '/detalle-cultivo', params: { idCultivo: cultivoEnRiesgo.id } })
                  : router.push('/(tabs)/cultivos')
              }
            >
              <Text style={styles.alertBtnText}>{cultivoEnRiesgo ? 'Ver cultivo' : 'Ver cultivos'}</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>

      {/* ── Tab Bar ── */}
      <TabBar activeTab="inicio" />
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
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 16,
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

  // Card cultivos activos
  activosCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8ede9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    gap: 14,
  },
  activosBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activosBadgeNum: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 22,
    color: '#fff',
  },
  activosLabel: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 17,
    color: Colors.textDark,
  },

  // Sección título
  sectionTitle: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 19,
    color: Colors.textDark,
    marginBottom: 14,
  },

  // Card cultivo principal
  cultivoCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  cultivoNombre: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 18,
    color: Colors.textDark,
  },
  cultivoDias: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 13,
    color: Colors.textLight,
    marginTop: 4,
  },
  etapasRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  etapaGrayTag: {
    backgroundColor: '#e8ede9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 5,
  },
  etapaGrayText: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 13,
    color: Colors.textMedium,
  },
  etapaGreenTag: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 5,
  },
  etapaGreenText: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 13,
    color: '#fff',
  },

  // Acciones
  actionsContainer: {
    backgroundColor: '#e8ede9',
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionPill: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionPillText: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 12,
    color: Colors.textDark,
  },
  actionTitle: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 17,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 12,
  },

  // Card alerta
  alertCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  alertLeft: {
    alignItems: 'center',
    gap: 4,
    minWidth: 64,
  },
  alertDivider: {
    width: 1,
    height: 80,
    backgroundColor: '#d8ddd9',
  },
  alertCultivoNombre: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 13,
    color: Colors.textMedium,
  },
  alertRight: {
    flex: 1,
    gap: 6,
  },
  alertTitle: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 15,
    color: Colors.textDark,
  },
  alertMsgRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  alertMsg: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 13,
    color: Colors.textMedium,
    flexShrink: 1,
    lineHeight: 18,
  },
  alertBtn: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginTop: 4,
  },
  alertBtnText: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 13,
    color: '#fff',
  },
});
