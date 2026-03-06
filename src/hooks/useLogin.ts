import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthService } from '@/src/services/authService';

export function useLogin() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [cargando, setCargando] = useState(false);

    const toggleShowPassword = () => setShowPassword((prev) => !prev);

    const handleLogin = async () => {
        if (!email || !password) {
            if (Platform.OS === 'web') {
                window.alert('Por favor ingresa tu correo y contraseña.');
            } else {
                Alert.alert('Datos incompletos', 'Por favor ingresa tu correo y contraseña.');
            }
            return;
        }

        try {
            setCargando(true);
            await AuthService.login(email, password);
            router.replace('/(tabs)');
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            if (Platform.OS === 'web') {
                window.alert('Correo o contraseña incorrectos, o no hay conexión con el servidor.');
            } else {
                Alert.alert('Error de Autenticación', 'Correo o contraseña incorrectos, o no hay conexión con el servidor.');
            }
        } finally {
            setCargando(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        toggleShowPassword,
        cargando,
        handleLogin,
    };
}
