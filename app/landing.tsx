import { Colors } from '@/src/theme/colors';
import { TopoPattern } from '@/src/components/ui/TopoPattern';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Landing() {
  const handleContinue = async () => {
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem('hasSeenLanding', 'true');
      } catch {}
    } else {
      try {
        await SecureStore.setItemAsync('hasSeenLanding', 'true');
      } catch {}
    }
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <View style={styles.container}>
        <TopoPattern />
        <View style={styles.content}>
          <View style={styles.hero}>
            <Text style={styles.title}>AgroSoft</Text>
            <Text style={styles.subtitle}>Seguimiento de cultivos inteligentes en tus manos</Text>
          </View>
          <TouchableOpacity onPress={handleContinue} style={styles.button} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Continuar  →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 22,
    paddingBottom: 32,
    gap: 24,
  },
  hero: {},
  title: {
    fontSize: 40,
    color: Colors.textDark,
    fontFamily: 'Rubik_600SemiBold',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: Colors.textLight,
    fontFamily: 'Rubik_400Regular',
    maxWidth: 280,
  },
  button: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 28,
  },
  buttonText: {
    color: Colors.buttonText,
    fontFamily: 'Rubik_500Medium',
    fontSize: 16,
  },
});
