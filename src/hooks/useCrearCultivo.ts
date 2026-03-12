import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { CultivoFormData } from '@/src/utils/formSchemas';
import { CultivoService } from '@/src/services/cultivoService';

export function useCrearCultivo() {
    const router = useRouter();
    const [paso, setPaso] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<CultivoFormData>({
        tipoCultivo: '',
        variedad: '',
        tipoCultivoDetalle: '',
        tamanoTerreno: '',
        cantidadSemillas: '',
        fechaSiembra: '',
        etapas: [],
        nombreCiclo: '',
        fechaInicioCiclo: '',
        fechaFinCiclo: '',
        nombrePersonalizado: '',
        region: '',
        notasGenerales: '',
        phSueloMin: '',
        phSueloMax: '',
    });

    const titles = ['Crear cultivo', 'Datos del cultivo', 'Datos del ciclo', 'Etapas del ciclo', 'Confirmar cultivo'];
    const title = titles[paso - 1];

    const handleChange = (key: keyof CultivoFormData, value: any) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleBack = () => {
        if (paso === 1) router.back();
        else setPaso((prev) => prev - 1);
    };

    const handleNext = () => setPaso((prev) => prev + 1);

    const handleEditSteps = () => setPaso(4);

    const handleCreate = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            // 1. Obtener ID del usuario guardado en el Login
            let userId: string | null = null;
            if (Platform.OS === 'web') {
                userId = localStorage.getItem('userId');
            } else {
                const SecureStore = require('expo-secure-store');
                userId = await SecureStore.getItemAsync('userId');
            }

            if (!userId) {
                Alert.alert('Error', 'No se encontró la sesión del usuario. Vuelve a iniciar sesión.');
                setIsSubmitting(false);
                return;
            }

            // 2. Delegamos la lógica al CultivoService
            await CultivoService.crearCultivoCompleto(formData, userId);

            // 3. Éxito y navegación
            if (Platform.OS === 'web') {
                window.alert('Éxito: Tu cultivo ha sido creado correctamente.');
            } else {
                Alert.alert('Éxito', 'Tu cultivo ha sido creado correctamente.');
            }

            router.replace('/(tabs)/cultivos');

        } catch (error: any) {
            console.error('Error al crear cultivo:', error);
            const errorMsg = error.response?.data?.message || 'Error al conectar con el servidor para crear el cultivo.';
            if (Platform.OS === 'web') {
                window.alert('Error: ' + errorMsg);
            } else {
                Alert.alert('Error', errorMsg);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        paso,
        title,
        formData,
        isSubmitting,
        handleChange,
        handleBack,
        handleNext,
        handleEditSteps,
        handleCreate,
    };
}
