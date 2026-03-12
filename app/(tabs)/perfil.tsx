import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePerfil } from '@/src/hooks/usePerfil';

export default function PerfilScreen() {
    const router = useRouter();
    const { profile, loading, handleLogout } = usePerfil();

    const fullName = profile ? `${profile.nombre} ${profile.apellidos}` : '—';
    const initials = profile
        ? `${profile.nombre?.[0] ?? ''}${profile.apellidos?.[0] ?? ''}`.toUpperCase()
        : '?';

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor="#1F2E23" />

            <View style={styles.hero}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
                    <Feather name="arrow-left" size={22} color="#ffffff" />
                </TouchableOpacity>

                <View style={styles.avatarRing}>
                    <View style={styles.avatar}>
                        {loading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text style={styles.avatarInitials}>{initials}</Text>
                        )}
                    </View>
                </View>

                {!loading && (
                    <>
                        <Text style={styles.heroName}>{fullName}</Text>
                        <Text style={styles.heroEmail}>{profile?.correoElectronico || '—'}</Text>
                    </>
                )}
            </View>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.sectionTitle}>Información personal</Text>

                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <View style={styles.infoIconBox}>
                            <Ionicons name="person-outline" size={20} color="#1F2E23" />
                        </View>
                        <View style={styles.infoTexts}>
                            <Text style={styles.infoLabel}>Nombre completo</Text>
                            <Text style={styles.infoValue}>{loading ? '…' : fullName}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <View style={styles.infoIconBox}>
                            <Ionicons name="mail-outline" size={20} color="#1F2E23" />
                        </View>
                        <View style={styles.infoTexts}>
                            <Text style={styles.infoLabel}>Correo electrónico</Text>
                            <Text style={styles.infoValue}>
                                {loading ? '…' : (profile?.correoElectronico || '—')}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* ── Sección: Cuenta ── */}
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
        backgroundColor: '#1F2E23',
    },

    // ── Hero ──
    hero: {
        backgroundColor: '#1F2E23',
        alignItems: 'center',
        paddingTop: 16,
        paddingBottom: 36,
        paddingHorizontal: 24,
    },
    backBtn: {
        alignSelf: 'flex-start',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.12)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarRing: {
        width: 108,
        height: 108,
        borderRadius: 54,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#3a5c45',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitials: {
        fontFamily: 'Rubik_600SemiBold',
        fontSize: 36,
        color: '#ffffff',
        letterSpacing: 2,
    },
    heroName: {
        fontFamily: 'Rubik_600SemiBold',
        fontSize: 22,
        color: '#ffffff',
        marginBottom: 4,
        textAlign: 'center',
    },
    heroEmail: {
        fontFamily: 'Rubik_400Regular',
        fontSize: 14,
        color: 'rgba(255,255,255,0.65)',
        textAlign: 'center',
    },

    // ── Scroll body ──
    scroll: {
        backgroundColor: '#f4f6f4',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingTop: 28,
        paddingHorizontal: 20,
        paddingBottom: 48,
        flexGrow: 1,
    },
    sectionTitle: {
        fontFamily: 'Rubik_600SemiBold',
        fontSize: 13,
        color: '#7a9488',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        marginBottom: 10,
        marginTop: 4,
    },

    // ── Info Card ──
    infoCard: {
        backgroundColor: '#ffffff',
        borderRadius: 18,
        paddingHorizontal: 16,
        marginBottom: 28,
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
        backgroundColor: '#e8f0ea',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    infoTexts: {
        flex: 1,
    },
    infoLabel: {
        fontFamily: 'Rubik_500Medium',
        fontSize: 12,
        color: '#9aadaa',
        marginBottom: 2,
    },
    infoValue: {
        fontFamily: 'Rubik_500Medium',
        fontSize: 15,
        color: '#1F2E23',
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f2f0',
        marginLeft: 54,
    },
});
