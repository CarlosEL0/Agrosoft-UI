import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BackIcon } from '../src/components/icons/BackIcon';
import { RobotIcon } from '../src/components/icons/RobotIcon';
import { Colors } from '../src/theme/colors';

// Mock de la respuesta de la API (AnalisisIaResponseDTO)
const MOCK_API_RESPONSE = {
    resultadoAnalisis: "Basado en los registros del cultivo y las anomalías reportadas, se detectan signos claros consistentes con una infestación temprana de Mosca Blanca. El alto nivel de humedad reciente ha favorecido su rápida propagación en el envés de las hojas. El cultivo se encuentra sometido a estrés, lo cual podría impactar la próxima etapa de floración si no se toman medidas correctivas inmediatas.",
    recomendaciones: [
        {
            idRecomendacion: '1',
            titulo: 'Aplicación Tratar con Jabón Potásico',
            descripcion: 'Preparar una solución de 20ml de jabón potásico por litro de agua. Rociar abundantemente prestando especial atención al envés de las hojas, preferiblemente al atardecer para evitar quemaduras solares.',
            prioridad: 'alta'
        },
        {
            idRecomendacion: '2',
            titulo: 'Podas de Aclareo y Ventilación',
            descripcion: 'Realizar una poda leve en el tercio inferior del cultivo. Esto facilitará la circulación de aire, reduciendo la humedad estancada que favorece la plaga.',
            prioridad: 'media'
        },
        {
            idRecomendacion: '3',
            titulo: 'Trampas Cromáticas Amarillas',
            descripcion: 'Instalar trampas adhesivas amarillas a 20cm por encima del dosel del cultivo para capturar adultos voladores e ir monitoreando la población durante las próximas 2 semanas.',
            prioridad: 'baja'
        }
    ]
};

export default function AnalisisIAScreen() {
    const { idCultivo } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<typeof MOCK_API_RESPONSE | null>(null);

    // Simular la carga de datos del backend
    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            // Simula retraso de red
            await new Promise(resolve => setTimeout(resolve, 1500));
            if (isMounted) {
                setData(MOCK_API_RESPONSE);
                setLoading(false);
            }
        };
        fetchData();
        return () => { isMounted = false; };
    }, []);

    const getPriorityBadgeColor = (prioridad: string) => {
        switch (prioridad.toLowerCase()) {
            case 'alta': return { bg: Colors.danger, text: Colors.surface };
            case 'media': return { bg: Colors.warning, text: Colors.surface };
            case 'baja': return { bg: Colors.success, text: Colors.surface };
            default: return { bg: '#f5f5f5', text: '#9e9e9e' };
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <BackIcon />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Análisis IA</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView style={styles.container} contentContainerStyle={styles.contentPad}>
                {loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                        <Text style={styles.loadingText}>Procesando diagnóstico agrícola...</Text>
                    </View>
                ) : (
                    <>
                        {/* Header de Análisis General */}
                        <View style={styles.resumenContainer}>
                            <View style={styles.resumenHeader}>
                                <View style={styles.iconCircle}>
                                    <RobotIcon color={Colors.surface} size={28} />
                                </View>
                                <Text style={styles.resumenTitle}>Diagnóstico General</Text>
                            </View>
                            <Text style={styles.resumenText}>
                                {data?.resultadoAnalisis}
                            </Text>
                        </View>

                        {/* Lista de Recomendaciones */}
                        <Text style={styles.sectionTitle}>Recomendaciones de Acción</Text>

                        <View style={styles.recomendacionesList}>
                            {data?.recomendaciones.map((rec) => {
                                const colors = getPriorityBadgeColor(rec.prioridad);

                                return (
                                    <View key={rec.idRecomendacion} style={styles.card}>
                                        <View style={styles.cardHeader}>
                                            <Text style={styles.cardTitle}>{rec.titulo}</Text>
                                            <View style={[styles.badge, { backgroundColor: colors.bg }]}>
                                                <Text style={[styles.badgeText, { color: colors.text }]}>
                                                    Prioridad {rec.prioridad}
                                                </Text>
                                            </View>
                                        </View>
                                        <Text style={styles.cardDesc}>{rec.descripcion}</Text>
                                    </View>
                                );
                            })}
                        </View>

                        <View style={styles.footerInfo}>
                            <Text style={styles.footerText}>Análisis generado por AgroSoft AI (Groq Engine)</Text>
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f2f4f3',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 22,
        paddingVertical: 16,
        backgroundColor: '#f2f4f3',
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: 'Rubik_500Medium',
        fontSize: 20,
        color: Colors.textDark,
    },
    container: {
        flex: 1,
        backgroundColor: '#f2f4f3',
    },
    contentPad: {
        paddingHorizontal: 22,
        paddingBottom: 40,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    loadingText: {
        marginTop: 16,
        fontFamily: 'Rubik_400Regular',
        fontSize: 15,
        color: Colors.textMedium,
    },
    resumenContainer: {
        backgroundColor: '#e8ede9',
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
    },
    resumenHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
        gap: 12,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resumenTitle: {
        fontFamily: 'Rubik_600SemiBold',
        fontSize: 17,
        color: Colors.textDark,
    },
    resumenText: {
        fontFamily: 'Rubik_400Regular',
        fontSize: 14,
        color: Colors.textDark,
        lineHeight: 22,
    },
    sectionTitle: {
        fontFamily: 'Rubik_600SemiBold',
        fontSize: 18,
        color: Colors.textDark,
        marginBottom: 16,
    },
    recomendacionesList: {
        gap: 14,
    },
    card: {
        backgroundColor: '#e8ede9',
        borderRadius: 16,
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    cardTitle: {
        fontFamily: 'Rubik_500Medium',
        fontSize: 16,
        color: Colors.textDark,
        flex: 1,
        marginRight: 12,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    badgeText: {
        fontFamily: 'Rubik_500Medium',
        fontSize: 11,
        textTransform: 'capitalize',
    },
    cardDesc: {
        fontFamily: 'Rubik_400Regular',
        fontSize: 14,
        color: Colors.textMedium,
        lineHeight: 22,
    },
    footerInfo: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 32,
        opacity: 0.7,
    },
    footerText: {
        fontFamily: 'Rubik_400Regular',
        fontSize: 12,
        color: Colors.textMedium,
        marginLeft: 8,
    }
});
