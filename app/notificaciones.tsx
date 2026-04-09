import { Colors } from '@/src/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackIcon } from '@/src/components/icons/BackIcon';
import { RobotIcon } from '@/src/components/icons/RobotIcon';
import { TabBar } from '@/src/components/ui/TabBar';
import { useNotificaciones } from '@/src/hooks/useNotificaciones';

export default function NotificacionesScreen() {
  const router = useRouter();
  const { cargando, items, markAsRead, refresh } = useNotificaciones();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <TouchableOpacity style={styles.refreshBtn} onPress={refresh} activeOpacity={0.8}>
          <Text style={styles.refreshText}>Actualizar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {cargando ? (
          <View style={{ padding: 22 }}>
            <Text style={{ color: Colors.textMedium, fontFamily: 'Rubik_400Regular' }}>Cargando...</Text>
          </View>
        ) : items.length === 0 ? (
          <View style={{ padding: 22 }}>
            <Text style={{ color: Colors.textMedium, fontFamily: 'Rubik_400Regular' }}>No tienes notificaciones</Text>
          </View>
        ) : (
          items.map((n) => (
            <View key={n.idNotificacion} style={[styles.itemCard, !n.leido && styles.itemCardUnread]}>
              <View style={styles.itemLeft}>
                <RobotIcon />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{n.titulo}</Text>
                <Text style={styles.itemMsg}>{n.mensaje}</Text>
                <View style={styles.itemFooter}>
                  <Text style={styles.itemFooterText}>{new Date(n.fechaEnvio).toLocaleString()}</Text>
                  {!n.leido && (
                    <TouchableOpacity style={styles.markBtn} onPress={() => markAsRead(n.idNotificacion)} activeOpacity={0.8}>
                      <Text style={styles.markText}>Marcar leída</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <TabBar activeTab="inicio" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f2f4f3' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: { fontFamily: 'Rubik_500Medium', fontSize: 20, color: Colors.textDark },
  refreshBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#fff' },
  refreshText: { fontFamily: 'Rubik_500Medium', color: Colors.textDark, fontSize: 12 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 22, paddingBottom: 24, gap: 12 },
  itemCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14, padding: 14, gap: 12 },
  itemCardUnread: {  },
  itemLeft: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#e8ede9', alignItems: 'center', justifyContent: 'center' },
  itemInfo: { flex: 1, gap: 4 },
  itemTitle: { fontFamily: 'Rubik_500Medium', color: Colors.textDark, fontSize: 16 },
  itemMsg: { fontFamily: 'Rubik_400Regular', color: Colors.textMedium, fontSize: 14 },
  itemFooter: { marginTop: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemFooterText: { fontFamily: 'Rubik_400Regular', color: Colors.textLight, fontSize: 12 },
  markBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: Colors.primary },
  markText: { fontFamily: 'Rubik_500Medium', color: '#fff', fontSize: 12 },
});
