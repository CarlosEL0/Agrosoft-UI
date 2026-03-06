import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { enviarReporte, uploadImagen } from '@/src/services/reporteService';

export function useCrearReporte() {
    const router = useRouter();
    const { idCultivo, etapaActual } = useLocalSearchParams<{ idCultivo: string; etapaActual: string }>();

    const [paso, setPaso] = useState(1);
    const [tipoReporte, setTipoReporte] = useState('');
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [fotos, setFotos] = useState<string[]>([]); // URIs de imágenes seleccionadas
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

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
            if (!tipoReporte) {
                Alert.alert('Selecciona un tipo', 'Debes elegir un tipo de reporte.');
                return;
            }
            if (!idCultivo) {
                Alert.alert('Cultivo requerido', 'Falta el id del cultivo.');
                return;
            }

            const res = await enviarReporte(tipoReporte, idCultivo as string, formData);

            const data = res?.data?.data || {};
            let idRef: string | undefined;
            let tipoBackend: 'RIEGO' | 'FERTILIZACION' | 'FUMIGACION' | 'PODA' | 'IRREGULARIDAD' | 'CRECIMIENTO' | undefined;

            switch (tipoReporte) {
                case 'Riego':
                    idRef = data.idRiego;
                    tipoBackend = 'RIEGO';
                    break;
                case 'Poda':
                    idRef = data.idPoda;
                    tipoBackend = 'PODA';
                    break;
                case 'Fertilizacion':
                    idRef = data.idFertilizacion;
                    tipoBackend = 'FERTILIZACION';
                    break;
                case 'Fumigacion':
                    idRef = data.idFumigacion;
                    tipoBackend = 'FUMIGACION';
                    break;
                case 'Irregularidad':
                    idRef = data.id;
                    tipoBackend = 'IRREGULARIDAD';
                    break;
                case 'Crecimiento':
                    idRef = data.id;
                    tipoBackend = 'CRECIMIENTO';
                    break;
            }

            if (idRef && tipoBackend && fotos.length > 0) {
                setIsUploading(true);
                setUploadProgress(0);
                for (let i = 0; i < fotos.length; i++) {
                    const uri = fotos[i];
                    await uploadImagen(
                        uri,
                        idRef,
                        tipoBackend,
                        `Evidencia de ${tipoReporte.toLowerCase()}`,
                        (pct) => {
                            const global = Math.round(((i + pct / 100) / fotos.length) * 100);
                            setUploadProgress(global);
                        }
                    );
                    const done = Math.round(((i + 1) / fotos.length) * 100);
                    setUploadProgress(done);
                }
                setIsUploading(false);
            }
            router.back();
        } catch (error) {
            console.error('Error al enviar reporte:', error);
            Alert.alert('Error', 'No se pudo enviar el reporte. Intenta nuevamente.');
            setIsUploading(false);
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
        isUploading,
        uploadProgress,
    };
}
