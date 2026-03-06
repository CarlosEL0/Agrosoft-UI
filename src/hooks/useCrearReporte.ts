import { useState } from 'react';
import { useRouter } from 'expo-router';

export function useCrearReporte() {
    const router = useRouter();
    const [paso, setPaso] = useState(1);
    const [tipoReporte, setTipoReporte] = useState('');
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [fotos, setFotos] = useState<null[]>([]);

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
            console.log('Enviando reporte:', { tipoReporte, formData, fotos });

            // Simulación de éxito
            router.back();
        } catch (error) {
            console.error('Error al enviar reporte:', error);
        }
    };

    const handleAddFoto = () => {
        setFotos((prev) => [...prev, null]);
    };

    return {
        paso,
        setPaso,
        tipoReporte,
        setTipoReporte,
        formData,
        fotos,
        titles,
        handleChange,
        handleBack,
        handleSubmit,
        handleAddFoto,
    };
}
