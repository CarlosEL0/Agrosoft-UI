import { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/src/api/axiosConfig';
import { useFocusEffect } from 'expo-router';

interface UserProfile {
    nombre: string;
    apellidos: string;
    correoElectronico: string;
}

export function usePerfil() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            let userId: string | null = null;
            let token: string | null = null;

            if (Platform.OS === 'web') {
                userId = localStorage.getItem('userId');
                token = localStorage.getItem('userToken');
            } else {
                userId = await SecureStore.getItemAsync('userId');
                token = await SecureStore.getItemAsync('userToken');
            }

            if (!userId || !token) {
                throw new Error('No hay sesión activa.');
            }

            // Re-fetch users list to get the current profile from springboot
            const response = await api.get('/users', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const users = response.data?.data || [];
            const currentUser = users.find((u: any) => String(u.id) === String(userId));

            if (currentUser) {
                setProfile({
                    nombre: currentUser.nombre || '',
                    apellidos: currentUser.apellido || '',
                    correoElectronico: currentUser.correoElectronico || ''
                });
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchUserProfile();
        }, [])
    );

    const handleLogout = async () => {
        try {
            if (Platform.OS === 'web') {
                localStorage.removeItem('userToken');
                localStorage.removeItem('userId');
            } else {
                await SecureStore.deleteItemAsync('userToken');
                await SecureStore.deleteItemAsync('userId');
            }
        } catch (error) {
            console.error('Error al borrar sesión:', error);
        } finally {
            router.replace('/(auth)/login');
        }
    };

    return {
        profile,
        loading,
        handleLogout
    };
}
