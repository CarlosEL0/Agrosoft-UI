import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
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
        if (!tipoReporte) {
            Alert.alert('Selecciona un tipo', 'Debes elegir un tipo de reporte.');
            return;
        }
        if (!idCultivo) {
            Alert.alert('Cultivo requerido', 'Falta el id del cultivo.');
            return;
        }

        let idRef: string | undefined;
        let tipoBackend: 'RIEGO' | 'FERTILIZACION' | 'FUMIGACION' | 'PODA' | 'IRREGULARIDAD' | 'CRECIMIENTO' | undefined;

        try {
            const res = await enviarReporte(tipoReporte, idCultivo as string, formData);
            const data = res?.data?.data || {};

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
        } catch (error) {
            console.error('Error al enviar reporte:', error);
            Alert.alert('Error', 'No se pudo enviar el reporte. Intenta nuevamente.');
            return;
        }

        if (idRef && tipoBackend && fotos.length > 0) {
            setIsUploading(true);
            setUploadProgress(0);
            const urlsSubidas: string[] = [];
            let algunErrorImagen = false;
            for (let i = 0; i < fotos.length; i++) {
                const uri = fotos[i];
                try {
                    const resImg = await uploadImagen(
                        uri,
                        idRef,
                        tipoBackend,
                        `Evidencia de ${tipoReporte.toLowerCase()}`,
                        (pct) => {
                            const global = Math.round(((i + pct / 100) / fotos.length) * 100);
                            setUploadProgress(global);
                        }
                    );
                    const url = resImg?.data?.data?.urlArchivo;
                    if (url) {
                        urlsSubidas.push(url);
                    }
                } catch (err) {
                    console.error('Error subiendo imagen de reporte:', err);
                    algunErrorImagen = true;
                }
                const done = Math.round(((i + 1) / fotos.length) * 100);
                setUploadProgress(done);
            }
            try {
                if (urlsSubidas.length > 0) {
                    // Expo SecureStore no permite ':' en las llaves. Usamos '.' en su lugar.
                    const keySingle = `reportPhoto.${tipoBackend}.${idRef}`;
                    const keyMulti = `reportPhotos.${tipoBackend}.${idRef}`;
                    if (Platform.OS === 'web') {
                        localStorage.setItem(keySingle, urlsSubidas[0]);
                        localStorage.setItem(keyMulti, JSON.stringify(urlsSubidas));
                    } else {
                        await SecureStore.setItemAsync(keySingle, urlsSubidas[0]);
                        await SecureStore.setItemAsync(keyMulti, JSON.stringify(urlsSubidas));
                    }
                }
            } catch (err) {
                console.error('Error guardando URLs de fotos localmente:', err);
                algunErrorImagen = true;
            }
            if (algunErrorImagen) {
                Alert.alert('Aviso', 'El reporte se guardó, pero hubo errores al subir algunas fotos.');
            }
            setIsUploading(false);
        }

        router.back();
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
            allowsMultipleSelection: true,
        });

        if (!result.canceled && result.assets.length > 0) {
            const uris = result.assets.map(a => a.uri).filter(Boolean) as string[];
            setFotos((prev) => [...prev, ...uris]);
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
