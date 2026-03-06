import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export function useCrearReporte() {
    const router = useRouter();
    const { idCultivo, etapaActual } = useLocalSearchParams<{ idCultivo: string; etapaActual: string }>();

    const [paso, setPaso] = useState(1);
    const [tipoReporte, setTipoReporte] = useState('');
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [fotos, setFotos] = useState<string[]>([]); // URIs de imágenes seleccionadas

    const titles = ['Crear reporte', `Reporte de ${tipoReporte.toLowerCase()}`];

    const handleChange = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleBack = () => {
        if (paso === 1) router.back();
        else setPaso(1);
    };

    const handleSubmit = async () => {
        try {
            // TODO: Conectar con API para crear reporte
            console.log('Enviando reporte:', { idCultivo, etapaActual, tipoReporte, formData, fotos });

            // Simulación de éxito
            router.back();
        } catch (error) {
            console.error('Error al enviar reporte:', error);
        }
    };

    const handleAddFoto = async () => {
        // Solicitar permiso de galería
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso requerido', 'Necesitas permitir el acceso a la galería para agregar fotos.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
            allowsMultipleSelection: false,
        });

        if (!result.canceled && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            setFotos((prev) => [...prev, uri]);
        }
    };

    const handleRemoveFoto = (index: number) => {
        setFotos((prev) => prev.filter((_, i) => i !== index));
    };

    return {
        paso,
        setPaso,
        tipoReporte,
        setTipoReporte,
        formData,
        fotos,
        titles,
        idCultivo,
        etapaActual: etapaActual || 'Sin etapa detectada',
        handleChange,
        handleBack,
        handleSubmit,
        handleAddFoto,
        handleRemoveFoto,
    };
}
