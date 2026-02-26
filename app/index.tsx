// app/index.tsx
// Redirige automáticamente al Login al abrir la app

import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/(auth)/login" />;
}