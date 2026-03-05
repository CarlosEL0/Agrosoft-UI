import { Colors } from '@/src/theme/colors';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export interface InputFieldProps {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    icon: React.ReactNode;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address';
    rightElement?: React.ReactNode;
}

export function InputField({
    label,
    placeholder,
    value,
    onChangeText,
    icon,
    secureTextEntry = false,
    keyboardType = 'default',
    rightElement,
}: InputFieldProps) {
    return (
        <View style={styles.fieldGroup}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputRow}>
                <View style={styles.inputIcon}>{icon}</View>
                <View style={styles.inputDivider} />
                <TextInput
                    style={[styles.input, rightElement ? { flex: 1 } : {}]}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.textPlaceholder}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    autoCapitalize="none"
                />
                {rightElement && <View style={styles.inputRight}>{rightElement}</View>}
            </View>
            <View style={styles.inputLine} />
        </View>
    );
}

const styles = StyleSheet.create({
    fieldGroup: {
        marginBottom: 28,
    },
    label: {
        fontFamily: 'Rubik_500Medium',
        fontSize: 16,
        color: Colors.textMedium,
        letterSpacing: 0.2,
        marginBottom: 10,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputIcon: {
        marginRight: 2,
    },
    inputDivider: {
        width: 1,
        height: 18,
        backgroundColor: Colors.inputDivider,
        marginHorizontal: 10,
    },
    input: {
        flex: 1,
        fontFamily: 'Rubik_400Regular',
        fontSize: 14,
        color: Colors.textDark,
        letterSpacing: 0.2,
        paddingVertical: 6,
    },
    inputRight: {
        paddingLeft: 10,
    },
    inputLine: {
        height: 1,
        backgroundColor: Colors.inputLine,
        marginTop: 8,
        opacity: 0.6,
    },
});
