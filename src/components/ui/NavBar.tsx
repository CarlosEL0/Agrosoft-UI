import { BackIcon } from '@/src/components/icons/BackIcon';
import { Colors } from '@/src/theme/colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface NavBarProps {
    title: string;
    onBack?: () => void;
    showBack?: boolean;
}

export function NavBar({ title, onBack, showBack = true }: NavBarProps) {
    const insets = useSafeAreaInsets();
    
    return (
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
            {showBack && (
                <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
                    <BackIcon />
                </TouchableOpacity>
            )}
            <Text style={styles.headerTitle}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingHorizontal: 22,
        paddingBottom: 8,
    },
    headerTitle: {
        fontFamily: 'Rubik_500Medium',
        fontSize: 20,
        color: Colors.textDark,
        textTransform: 'capitalize',
    },
});
