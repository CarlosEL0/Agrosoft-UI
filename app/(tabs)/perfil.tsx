import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePerfil } from '@/src/hooks/usePerfil';
import { Colors } from '@/src/theme/colors';
import { BackIcon } from '@/src/components/icons/BackIcon';

export default function PerfilScreen() {
    const router = useRouter();
    const { profile, loading, handleLogout } = usePerfil();

    const fullName = profile ? `${profile.nombre} ${profile.apellidos}` : '—';
    const initials = profile
        ? `${profile.nombre?.[0] ?? ''}${profile.apellidos?.[0] ?? ''}`.toUpperCase()
        : '?';

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>

            {/* ── Header (mismo estilo que cultivos / inicio) ── */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <BackIcon />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mi perfil</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* ── Avatar card (igual que activosCard en index) ── */}
                <View style={styles.avatarCard}>
                    <View style={styles.avatar}>
                        {loading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text style={styles.avatarInitials}>{initials}</Text>
                        )}
                    </View>
                    <View style={styles.avatarTexts}>
                        <Text style={styles.avatarName}>{loading ? '…' : fullName}</Text>
                        <Text style={styles.avatarEmail}>
                            {loading ? '…' : (profile?.correoElectronico || '—')}
                        </Text>
                    </View>
                </View>

                {/* ── Información personal ── */}
                <Text style={styles.sectionTitle}>Información personal</Text>

                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <View style={styles.infoIconBox}>
                            <Ionicons name="person-outline" size={20} color={Colors.primary} />
                        </View>
                        <View style={styles.infoTexts}>
                            <Text style={styles.infoLabel}>Nombre completo</Text>
                            <Text style={styles.infoValue}>{loading ? '…' : fullName}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <View style={styles.infoIconBox}>
                            <Ionicons name="mail-outline" size={20} color={Colors.primary} />
                        </View>
                        <View style={styles.infoTexts}>
                            <Text style={styles.infoLabel}>Correo electrónico</Text>
                            <Text style={styles.infoValue}>
                                {loading ? '…' : (profile?.correoElectronico || '—')}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* ── Cuenta ── */}
                <Text style={styles.sectionTitle}>Cuenta</Text>

                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <View style={[styles.infoIconBox, { backgroundColor: '#fdecea' }]}>
                            <MaterialCommunityIcons name="logout" size={20} color="#c0392b" />
                        </View>
                        <TouchableOpacity style={{ flex: 1 }} onPress={handleLogout} activeOpacity={0.7}>
                            <View style={styles.infoTexts}>
                                <Text style={[styles.infoLabel, { color: '#c0392b' }]}>Cerrar sesión</Text>
                                <Text style={styles.infoValue}>Salir de tu cuenta</Text>
                            </View>
                        </TouchableOpacity>
                        <Feather name="chevron-right" size={20} color="#c0392b" />
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f2f4f3',
    },

    // ── Header (idéntico a cultivos.tsx) ──
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 22,
        paddingTop: 16,
        paddingBottom: 12,
    },
    backBtn: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: 'Rubik_500Medium',
        fontSize: 22,
        color: Colors.textDark,
    },

    // ── Scroll ──
    scroll: {
        paddingHorizontal: 22,
        paddingBottom: 48,
        gap: 0,
    },

    // ── Avatar card (misma forma que activosCard en index) ──
    avatarCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e8ede9',
        borderRadius: 20,
        padding: 16,
        marginBottom: 24,
        gap: 16,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitials: {
        fontFamily: 'Rubik_600SemiBold',
        fontSize: 24,
        color: '#ffffff',
        letterSpacing: 1,
    },
    avatarTexts: {
        flex: 1,
    },
    avatarName: {
        fontFamily: 'Rubik_600SemiBold',
        fontSize: 17,
        color: Colors.textDark,
        marginBottom: 3,
    },
    avatarEmail: {
        fontFamily: 'Rubik_400Regular',
        fontSize: 13,
        color: Colors.textMedium,
    },

    // ── Sección título (idéntico a cultivos.tsx) ──
    sectionTitle: {
        fontFamily: 'Rubik_600SemiBold',
        fontSize: 13,
        color: '#7a9488',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        marginBottom: 10,
        marginTop: 4,
    },

    // ── Info Card (tarjeta blanca, idéntica al resto de la app) ──
    infoCard: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        paddingHorizontal: 16,
        marginBottom: 24,
        overflow: 'hidden',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    infoIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#e8ede9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    infoTexts: {
        flex: 1,
    },
    infoLabel: {
        fontFamily: 'Rubik_400Regular',
        fontSize: 12,
        color: Colors.textLight,
        marginBottom: 2,
    },
    infoValue: {
        fontFamily: 'Rubik_500Medium',
        fontSize: 15,
        color: Colors.textDark,
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f2f0',
        marginLeft: 54,
    },
});
