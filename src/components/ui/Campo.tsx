import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Colors } from '../../theme/colors';
import { CampoFormulario } from '../../utils/formSchemas';

interface CampoProps {
    campo: CampoFormulario;
    value: string;
    onChange: (v: string) => void;
}

function formatFecha(date: Date): string {
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const anio = String(date.getFullYear());
    return `${dia}/${mes}/${anio}`;
}

function parseFecha(value: string): Date {
    const hoy = new Date();
    if (!value) return hoy;
    const soloDigitos = value.replace(/\D/g, '');
    if (soloDigitos.length >= 8) {
        const d = parseInt(soloDigitos.slice(0, 2), 10);
        const m = parseInt(soloDigitos.slice(2, 4), 10) - 1;
        const y = parseInt(soloDigitos.slice(4, 8), 10);
        const dt = new Date(y, m, d);
        if (!isNaN(dt.getTime())) return dt;
    }
    const parts = value.split('/');
    if (parts.length === 3) {
        const d = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        let y = parts[2];
        if (y.length === 2) y = '20' + y;
        const yy = parseInt(y, 10);
        const dt = new Date(yy, m, d);
        if (!isNaN(dt.getTime())) return dt;
    }
    return hoy;
}

function maskFechaInput(text: string): string {
    const digits = text.replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function Campo({ campo, value, onChange }: CampoProps) {
    const [showFechaPicker, setShowFechaPicker] = React.useState(false);

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

    if (campo.key === 'fecha_deteccion') {
        const handleChangeTexto = (v: string) => {
            onChange(maskFechaInput(v));
        };

        const handlePickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
            setShowFechaPicker(false);
            if (selectedDate) {
                const formatted = formatFecha(selectedDate);
                onChange(formatted);
            }
        };

        return (
            <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>{campo.label}</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder={campo.placeholder}
                    placeholderTextColor={Colors.textPlaceholder}
                    value={value}
                    onChangeText={handleChangeTexto}
                    keyboardType="numeric"
                    onFocus={() => {
                        setShowFechaPicker(true);
                    }}
                />
                {showFechaPicker && Platform.OS !== 'web' && (
                    <DateTimePicker
                        value={parseFecha(value)}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handlePickerChange}
                    />
                )}
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
