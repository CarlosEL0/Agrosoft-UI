import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

export default function Index() {
  useEffect(() => {
    const run = async () => {
      let token: string | null = null;
      let seen: string | null = null;

      if (Platform.OS === 'web') {
        try {
          if (typeof localStorage !== 'undefined') {
            token = localStorage.getItem('userToken');
            seen = localStorage.getItem('hasSeenLanding');
          }
        } catch {}
      } else {
        try {
          token = await SecureStore.getItemAsync('userToken');
          seen = await SecureStore.getItemAsync('hasSeenLanding');
        } catch {}
      }

      if (token && token !== 'undefined' && token !== 'null') {
        router.replace('/(tabs)');
        return;
      }

      if (seen) {
        router.replace('/(auth)/login');
      } else {
        router.replace('/landing');
      }
    };
    run();
  }, []);
  return null;
}
