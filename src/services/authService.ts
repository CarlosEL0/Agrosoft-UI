import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/src/api/axiosConfig';

export class AuthService {
    static async login(correoElectronico: string, password: string): Promise<void> {
        // 1. Petición POST a tu Spring Boot
        const respuesta = await api.post('/auth/login', {
            correoElectronico,
            password,
        });

        // 2. Extraemos el token y el ID de la respuesta
        const token = respuesta.data?.data?.token;
        let userId = respuesta.data?.data?.usuarioId;

        if (!token) {
            throw new Error('No se recibió un token válido del servidor.');
        }

        // 3. Fallback: buscar userId si no viene en el login
        if (!userId) {
            try {
                const usersRes = await api.get('/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const listaUsuarios = usersRes.data?.data || [];
                const usuarioEncontrado = listaUsuarios.find((u: any) => u.correoElectronico === correoElectronico);

                if (usuarioEncontrado) {
                    userId = usuarioEncontrado.id;
                } else {
                    console.warn('El correo no se encontró en la lista de usuarios.');
                }
            } catch (err) {
                console.error('Error al obtener la lista de usuarios para extraer el ID:', err);
            }
        }

        if (!userId) {
            throw new Error('No se pudo obtener el ID de usuario del servidor.');
        }

        // 4. Guardamos dependiendo de la plataforma
        if (Platform.OS === 'web') {
            localStorage.setItem('userToken', token);
            localStorage.setItem('userId', userId);
        } else {
            await SecureStore.setItemAsync('userToken', token);
            await SecureStore.setItemAsync('userId', userId);
        }
    }

    static async register(nombre: string, apellidos: string, correoElectronico: string, password: string): Promise<void> {
        const payload = {
            nombre,
            apellido: apellidos,
            correoElectronico,
            password
        };

        const response = await api.post('/users', payload);

        if (response.status === 201 || response.status === 200) {
            // Guardamos el ID del usuario recién creado
            const usuarioId = response.data?.data?.id;
            if (usuarioId) {
                if (Platform.OS === 'web') {
                    localStorage.setItem('userId', usuarioId);
                } else {
                    await SecureStore.setItemAsync('userId', usuarioId);
                }
            }
        } else {
            throw new Error(response.data?.message || 'Hubo un problema al registrarte');
        }
    }
}
