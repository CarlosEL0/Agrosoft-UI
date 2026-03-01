// app/(tabs)/index.tsx

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
import { Svg, Path, Circle, Ellipse, Rect, G } from 'react-native-svg';
import { Colors } from '@/src/theme/colors';

const { width } = Dimensions.get('window');

// ── Íconos ───────────────────────────────────────────────────────────────────

function HomeIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
        stroke={Colors.primary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 21V12h6v9"
        stroke={Colors.primary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function BellIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"
        stroke={Colors.textDark} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M13.73 21a2 2 0 01-3.46 0"
        stroke={Colors.textDark} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={18} cy={5} r={4} fill={Colors.textDark} />
      <Path d="M18 3v4M16 5h4" stroke="#fff" strokeWidth={1.2} strokeLinecap="round" />
    </Svg>
  );
}

function PlantPotIcon({ size = 56 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      {/* Maceta */}
      <Path d="M16 36h24l-3 10H19L16 36z" fill={Colors.textDark} />
      <Rect x={14} y={32} width={28} height={6} rx={2} fill={Colors.textDark} />
      {/* Planta */}
      <Path d="M28 32V20" stroke={Colors.textDark} strokeWidth={2} strokeLinecap="round" />
      {/* Hoja izquierda */}
      <Path d="M28 26C28 26 20 24 18 16C18 16 26 12 30 20"
        stroke={Colors.textDark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Hoja derecha */}
      <Path d="M28 22C28 22 34 18 38 22C38 22 36 30 28 28"
        stroke={Colors.textDark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

function PlantPotSmallIcon({ size = 44 }: { size?: number }) {
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

function RobotIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={8} width={18} height={13} rx={2} stroke={Colors.textDark} strokeWidth={1.5} />
      <Path d="M12 8V4" stroke={Colors.textDark} strokeWidth={1.5} strokeLinecap="round" />
      <Circle cx={12} cy={3} r={1} fill={Colors.textDark} />
      <Circle cx={8.5} cy={13} r={1.5} fill={Colors.textDark} />
      <Circle cx={15.5} cy={13} r={1.5} fill={Colors.textDark} />
      <Path d="M9 17h6" stroke={Colors.textDark} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function TreeTabIcon({ active = false }: { active?: boolean }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22v-6" stroke={active ? Colors.primary : Colors.textLight} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M5 16l7-6 7 6H5z" stroke={active ? Colors.primary : Colors.textLight} strokeWidth={1.8} strokeLinejoin="round" fill="none" />
      <Path d="M7 10l5-5 5 5H7z" stroke={active ? Colors.primary : Colors.textLight} strokeWidth={1.8} strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

function UserTabIcon({ active = false }: { active?: boolean }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
        stroke={active ? Colors.primary : Colors.textLight} strokeWidth={1.8} strokeLinecap="round" />
      <Circle cx={12} cy={7} r={4}
        stroke={active ? Colors.primary : Colors.textLight} strokeWidth={1.8} />
    </Svg>
  );
}

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
            <TouchableOpacity style={styles.actionPill}>
              <Text style={styles.actionPillText}>Crear cultivo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionPill}>
              <Text style={styles.actionPillText}>ver cultivos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionPill}>
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
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <HomeIcon />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <TreeTabIcon />
          <Text style={styles.tabLabel}>Cultivos</Text>
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