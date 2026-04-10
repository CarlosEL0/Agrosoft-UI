import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// 1. Definimos baseURL con fallback inteligente según plataforma
const envBaseUrl = process.env.EXPO_PUBLIC_API_URL;
let computedBaseUrl = envBaseUrl;

if (!computedBaseUrl || computedBaseUrl === 'undefined' || computedBaseUrl === 'null') {
  if (__DEV__) {
    if (Platform.OS === 'web') {
      computedBaseUrl = 'http://localhost:8080/api/v1';
      console.warn('EXPO_PUBLIC_API_URL no está definido. Usando fallback web http://localhost:8080/api/v1');
    } else if (Platform.OS === 'android') {
      computedBaseUrl = 'http://10.0.2.2:8080/api/v1';
      console.warn('EXPO_PUBLIC_API_URL no está definido. Usando fallback Android http://10.0.2.2:8080/api/v1');
    } else {
      computedBaseUrl = 'http://localhost:8080/api/v1';
      console.warn('EXPO_PUBLIC_API_URL no está definido. Usando fallback iOS http://localhost:8080/api/v1');
    }
  } else {
    computedBaseUrl = 'https://agrosoft-api-production.up.railway.app/api/v1';
    console.warn('EXPO_PUBLIC_API_URL no está definido en release. Usando API de producción https://agrosoft-api-production.up.railway.app/api/v1');
  }
}

export const api = axios.create({
  baseURL: computedBaseUrl,
  // No ponemos Content-Type por defecto para que axios lo maneje según el body (JSON o FormData)
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
