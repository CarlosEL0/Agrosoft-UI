import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthService } from '@/src/services/authService';

export function useRegister() {
    const router = useRouter();
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [cargando, setCargando] = useState(false);

    const toggleShowPassword = () => setShowPassword((prev) => !prev);

    const handleRegister = async () => {
        if (!nombre || !apellidos || !email || !password) {
            Alert.alert('Error', 'Por favor llena todos los campos');
            return;
        }

        try {
            setCargando(true);
            await AuthService.register(nombre, apellidos, email, password);

            if (Platform.OS === 'web') {
                window.alert('Éxito: Te has registrado correctamente. Ahora puedes iniciar sesión.');
                router.replace('/(auth)/login');
            } else {
                Alert.alert('Éxito', 'Te has registrado correctamente. Ahora puedes iniciar sesión.', [
                    { text: 'OK', onPress: () => router.replace('/(auth)/login') }
                ]);
            }
        } catch (error: any) {
            console.error('Error al registrar usuario:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Hubo un problema con la conexión al servidor.';
            if (Platform.OS === 'web') window.alert('Error: ' + errorMsg);
            else Alert.alert('Error', errorMsg);
        } finally {
            setCargando(false);
        }
    };

    return {
        nombre,
        setNombre,
        apellidos,
        setApellidos,
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        toggleShowPassword,
        cargando,
        handleRegister,
    };
}
