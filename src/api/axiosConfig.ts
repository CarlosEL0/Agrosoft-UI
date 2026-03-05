import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// 1. Creamos la instancia de Axios apuntando a la variable de entorno
export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Interceptor: Se ejecuta mágicamente ANTES de cada petición al servidor
api.interceptors.request.use(
  async (config) => {
    try {
      // 🛑 REGLA DE ORO: Si es login o registro, dejamos pasar la petición limpia (sin token)
      if (config.url && (config.url.includes('/auth/login') || config.url.includes('/users'))) {
        return config;
      }

      let token = null;

      if (Platform.OS === 'web') {
        token = localStorage.getItem('userToken');
      } else {
        token = await SecureStore.getItemAsync('userToken');
      }

      // Si el token existe y NO dice la palabra mágica "undefined" o "null"
      if (token && token !== 'undefined' && token !== 'null') {
        console.log('Token encontrado en almacenamiento, inyectando en headers...');
        // Axios v1+ requiere usar set()
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        console.warn('Axios interceptor: No se encontró token válido.');
      }

      return config;
    } catch (error) {
      console.error('Error al obtener el token:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);