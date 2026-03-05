import { Colors } from '@/src/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { HomeTabIcon } from '@/src/components/icons/HomeTabIcon';
import { TreeTabIcon } from '@/src/components/icons/TreeTabIcon';
import { UserTabIcon } from '@/src/components/icons/UserTabIcon';

interface TabBarProps {
    activeTab?: 'inicio' | 'cultivos' | 'perfil';
}

export function TabBar({ activeTab = 'inicio' }: TabBarProps) {
    const router = useRouter();

    return (
        <View style={styles.tabBar}>
            <TouchableOpacity
                style={styles.tabItem}
                onPress={() => router.push('/(tabs)')}
                activeOpacity={0.7}
            >
                <HomeTabIcon active={activeTab === 'inicio'} />
                <Text style={[styles.tabLabel, activeTab === 'inicio' && styles.tabLabelActive]}>
                    Inicio
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.tabItem}
                onPress={() => router.push('/(tabs)/cultivos')}
                activeOpacity={0.7}
            >
                <TreeTabIcon active={activeTab === 'cultivos'} />
                <Text style={[styles.tabLabel, activeTab === 'cultivos' && styles.tabLabelActive]}>
                    Cultivos
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.tabItem}
                onPress={() => router.push('./(tabs)/perfil')}
                activeOpacity={0.7}
            >
                <UserTabIcon active={activeTab === 'perfil'} />
                <Text style={[styles.tabLabel, activeTab === 'perfil' && styles.tabLabelActive]}>
                    Perfil
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e8e8e8',
        paddingVertical: 10,
        paddingBottom: 16,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        gap: 3,
    },
    tabLabel: {
        fontFamily: 'Rubik_400Regular',
        fontSize: 12,
        color: Colors.textLight,
    },
    tabLabelActive: {
        fontFamily: 'Rubik_500Medium',
        color: Colors.primary,
    },
});
