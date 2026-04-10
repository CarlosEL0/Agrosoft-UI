import { useEffect } from 'react';
import { Stack, SplashScreen } from 'expo-router';
import { useFonts, Rubik_400Regular, Rubik_500Medium, Rubik_600SemiBold } from '@expo-google-fonts/rubik';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({ Rubik_400Regular, Rubik_500Medium, Rubik_600SemiBold });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      
      // Configuración de la barra de navegación de Android
      if (Platform.OS === 'android') {
        NavigationBar.setPositionAsync('absolute');
        NavigationBar.setBackgroundColorAsync('#ffffff00'); // Transparente
        NavigationBar.setButtonStyleAsync('dark');
      }
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#ffffff' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="landing" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="crear-cultivo" />  
        <Stack.Screen name="detalle-cultivo" />
        <Stack.Screen name="historial-cultivo" />
        <Stack.Screen name="detalle-reporte" />
        <Stack.Screen name="historial-general" />
        <Stack.Screen name="crear-reporte" />
        <Stack.Screen name="perfil" />
      </Stack>
    </SafeAreaProvider>
  );
}
