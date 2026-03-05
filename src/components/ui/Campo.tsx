import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../theme/colors';
import { CampoFormulario } from '../../utils/formSchemas';

interface CampoProps {
    campo: CampoFormulario;
    value: string;
    onChange: (v: string) => void;
}

export function Campo({ campo, value, onChange }: CampoProps) {
    if (campo.tipo === 'select' && campo.opciones) {
        return (
            <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>{campo.label}</Text>
                <View style={styles.opcionesRow}>
                    {campo.opciones.map((op) => (
                        <TouchableOpacity
                            key={op}
                            style={[styles.opcionPill, value === op && styles.opcionPillActive]}
                            onPress={() => onChange(op)}
                        >
                            <Text style={[styles.opcionText, value === op && styles.opcionTextActive]}>
                                {op}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
    }

    return (
        <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{campo.label}</Text>
            <TextInput
                style={styles.textInput}
                placeholder={campo.placeholder}
                placeholderTextColor={Colors.textPlaceholder}
                value={value}
                onChangeText={onChange}
                keyboardType={
                    [
                        'cantidad_agua',
                        'duracion_minutos',
                        'altura_planta',
                        'grosor_tallo',
                        'diametro',
                        'cantidad_aplicada',
                        'costo',
                        'porcentaje_podado',
                    ].includes(campo.key)
                        ? 'numeric'
                        : 'default'
                }
                multiline={['descripcion', 'observaciones', 'comentario'].includes(campo.key)}
                numberOfLines={['descripcion', 'observaciones', 'comentario'].includes(campo.key) ? 3 : 1}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    fieldGroup: {
        gap: 8,
    },
    fieldLabel: {
        fontFamily: 'Rubik_500Medium',
        fontSize: 14,
        color: Colors.textDark,
    },
    textInput: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 13,
        fontFamily: 'Rubik_400Regular',
        fontSize: 14,
        color: Colors.textDark,
        textAlignVertical: 'top',
    },
    opcionesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    opcionPill: {
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 7,
    },
    opcionPillActive: {
        backgroundColor: Colors.primary,
    },
    opcionText: {
        fontFamily: 'Rubik_400Regular',
        fontSize: 13,
        color: Colors.textDark,
    },
    opcionTextActive: {
        fontFamily: 'Rubik_500Medium',
        color: '#fff',
    },
});
