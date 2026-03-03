import { useEffect } from 'react';
import { Stack, SplashScreen } from 'expo-router';
import { useFonts, Rubik_400Regular, Rubik_500Medium, Rubik_600SemiBold } from '@expo-google-fonts/rubik';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({ Rubik_400Regular, Rubik_500Medium, Rubik_600SemiBold });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="crear-cultivo" />  
      <Stack.Screen name="detalle-cultivo" />
      <Stack.Screen name="historial-cultivo" />
    </Stack>
  );
}