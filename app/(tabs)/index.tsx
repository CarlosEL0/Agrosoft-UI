// app/(tabs)/index.tsx

import { TabBar } from '@/src/components/ui/TabBar';
import { Colors } from '@/src/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BellIcon } from '@/src/components/icons/BellIcon';
import { HomeIcon } from '@/src/components/icons/HomeIcon';
import { PlantPotIcon } from '@/src/components/icons/PlantPotIcon';
import { PlantPotSmallIcon } from '@/src/components/icons/PlantPotSmallIcon';
import { RobotIcon } from '@/src/components/icons/RobotIcon';

// ── Pantalla Home ─────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();

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
            <Text style={styles.activosBadgeNum}>3</Text>
          </View>
          <Text style={styles.activosLabel}>Cultivos activos</Text>
        </View>

        {/* ── Tus cultivos ── */}
        <Text style={styles.sectionTitle}>Tus cultivos</Text>

        {/* Card principal cultivo */}
        <View style={styles.cultivoCard}>
          <Text style={styles.cultivoNombre}>Maiz rojo</Text>
          <PlantPotIcon size={72} />
          <Text style={styles.cultivoDias}>365 Días</Text>
          <View style={styles.etapasRow}>
            <View style={styles.etapaGrayTag}>
              <Text style={styles.etapaGrayText}>Etapa</Text>
            </View>
            <View style={styles.etapaGreenTag}>
              <Text style={styles.etapaGreenText}>Floración</Text>
            </View>
          </View>
        </View>

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

        {/* ── Card alerta IA ── */}
        <View style={styles.alertCard}>
          {/* Izquierda: planta + nombre */}
          <View style={styles.alertLeft}>
            <PlantPotSmallIcon size={52} />
            <Text style={styles.alertCultivoNombre}>Lechuga</Text>
          </View>

          {/* Divisor vertical */}
          <View style={styles.alertDivider} />

          {/* Derecha: alerta */}
          <View style={styles.alertRight}>
            <Text style={styles.alertTitle}>Cultivo en riesgo</Text>
            <View style={styles.alertMsgRow}>
              <RobotIcon />
              <Text style={styles.alertMsg}>Tu cultivo carece{'\n'}de riego</Text>
            </View>
            <TouchableOpacity style={styles.alertBtn}>
              <Text style={styles.alertBtnText}>Ver cultivo</Text>
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