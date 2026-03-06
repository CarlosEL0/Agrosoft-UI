import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { usePerfil } from '@/src/hooks/usePerfil';

export default function PerfilScreen() {
    const router = useRouter();
    const { profile, loading, handleLogout } = usePerfil();

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Header ── */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                        activeOpacity={0.8}
                    >
                        <Feather name="arrow-left" size={24} color="#ffffff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Perfil</Text>
                </View>

                {/* ── Main Title ── */}
                <Text style={styles.mainTitle}>Mira tus datos</Text>

                {/* ── User Card ── */}
                <View style={styles.card}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person" size={50} color="#ffffff" />
                    </View>

                    {loading ? (
                        <ActivityIndicator size="large" color="#1E201E" />
                    ) : (
                        <>
                            <Text style={styles.label}>Usuario:</Text>
                            <Text style={styles.value}>
                                {profile ? `${profile.nombre} ${profile.apellidos}` : 'No disponible'}
                            </Text>

                            <Text style={[styles.label, { marginTop: 16 }]}>Correo</Text>
                            <Text style={styles.value}>
                                {profile?.correoElectronico || 'No disponible'}
                            </Text>
                        </>
                    )}
                </View>

                {/* ── Logout Button ── */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    activeOpacity={0.85}
                >
                    <MaterialCommunityIcons name="logout" size={24} color="#ffffff" style={styles.logoutIcon} />
                    <Text style={styles.logoutButtonText}>Cerrar sesion</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scroll: {
        flexGrow: 1,
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 32,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#1E201E', // Dark roughly black circle
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    headerTitle: {
        fontFamily: 'Rubik_600SemiBold',
        fontSize: 20,
        color: '#1E201E',
    },
    mainTitle: {
        fontFamily: 'Rubik_600SemiBold',
        fontSize: 22,
        color: '#000000',
        marginBottom: 32,
    },
    card: {
        width: '100%',
        backgroundColor: '#F3F5F4',
        borderRadius: 20,
        paddingVertical: 32,
        paddingHorizontal: 16,
        alignItems: 'center',
        marginBottom: 40,
    },
    avatarContainer: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#1E201E',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    label: {
        fontFamily: 'Rubik_600SemiBold',
        fontSize: 16,
        color: '#333333',
        marginBottom: 4,
        textAlign: 'center',
    },
    value: {
        fontFamily: 'Rubik_600SemiBold',
        fontSize: 16,
        color: '#000000',
        textAlign: 'center',
    },
    logoutButton: {
        width: '100%',
        backgroundColor: '#1F2E23', // Dark green like in the image
        borderRadius: 16,
        paddingVertical: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutIcon: {
        marginRight: 10,
    },
    logoutButtonText: {
        fontFamily: 'Rubik_600SemiBold',
        fontSize: 18,
        color: '#ffffff',
    },
});
