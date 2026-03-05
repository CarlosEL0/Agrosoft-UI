import { Colors } from '@/src/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { api } from '@/src/api/axiosConfig';
import { SafeAreaView } from 'react-native-safe-area-context';

// Importaciones extraídas
import { EyeIcon } from '@/src/components/icons/EyeIcon';
import { LockIcon } from '@/src/components/icons/LockIcon';
import { MailIcon } from '@/src/components/icons/MailIcon';
import { UserIcon } from '@/src/components/icons/UserIcon';
import { InputField } from '@/src/components/ui/InputField';
import { TopoPattern } from '@/src/components/ui/TopoPattern';

// ── Pantalla Register ─────────────────────────────────────────────────────────

export default function RegisterScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!nombre || !apellidos || !email || !password) {
      Alert.alert('Error', 'Por favor llena todos los campos');
      return;
    }

    try {
      const payload = {
        nombre: nombre,
        apellido: apellidos,
        correoElectronico: email,
        password: password
      };

      const response = await api.post('/users', payload);

      if (response.status === 201 || response.status === 200) {
        if (Platform.OS === 'web') {
          window.alert('Éxito: Te has registrado correctamente. Ahora puedes iniciar sesión.');
          router.replace('/login');
        } else {
          Alert.alert('Éxito', 'Te has registrado correctamente. Ahora puedes iniciar sesión.', [
            { text: 'OK', onPress: () => router.replace('/login') }
          ]);
        }
      } else {
        const errorMsg = response.data?.message || 'Hubo un problema al registrarte';
        if (Platform.OS === 'web') window.alert('Error: ' + errorMsg);
        else Alert.alert('Error', errorMsg);
      }
    } catch (error: any) {
      console.error('Error al registrar usuario:', error);
      const errorMsg = error.response?.data?.message || 'Hubo un problema con la conexión al servidor.';
      Alert.alert('Error', errorMsg);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header topográfico más compacto */}
          <View style={styles.header}>
            <TopoPattern />
          </View>

          {/* Contenido */}
          <View style={styles.content}>
            <Text style={styles.title}>Registrarse</Text>
            <View style={styles.titleUnderline} />

            <InputField
              label="Nombre"
              placeholder="Ingresa tu nombre"
              value={nombre}
              onChangeText={setNombre}
              icon={<UserIcon />}
            />

            <InputField
              label="Apellidos"
              placeholder="Ingresa tus apellidos"
              value={apellidos}
              onChangeText={setApellidos}
              icon={<UserIcon />}
            />

            <InputField
              label="Correo"
              placeholder="demo@email.com"
              value={email}
              onChangeText={setEmail}
              icon={<MailIcon />}
              keyboardType="email-address"
            />

            <InputField
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChangeText={setPassword}
              icon={<LockIcon />}
              secureTextEntry={!showPassword}
              rightElement={
                <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
                  <EyeIcon off={!showPassword} />
                </Pressable>
              }
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister} activeOpacity={0.85}>
              <Text style={styles.buttonText}>Crear cuenta</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Ya cuentas con una cuenta? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.footerLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Estilos ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  scroll: {
    flexGrow: 1,
    backgroundColor: Colors.background,
  },

  // Header
  header: {
    width: '100%',
    height: 220,
    backgroundColor: Colors.primary,
    overflow: 'hidden',
  },

  // Contenido
  content: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 25,
    paddingTop: 24,
    paddingBottom: 32,
  },
  title: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 32,
    color: Colors.textDark,
    lineHeight: 36,
    marginBottom: 6,
  },
  titleUnderline: {
    width: 78,
    height: 2.5,
    backgroundColor: Colors.primary,
    marginBottom: 28,
    borderRadius: 2,
  },

  // Campos
  fieldGroup: {
    marginBottom: 22,
  },
  label: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 16,
    color: Colors.textMedium,
    letterSpacing: 0.2,
    marginBottom: 8,
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

  // Botón
  button: {
    backgroundColor: Colors.buttonBg,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 22,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 18,
    color: Colors.buttonText,
    letterSpacing: 0.2,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 14,
    color: Colors.textLight,
    letterSpacing: 0.2,
  },
  footerLink: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 14,
    color: Colors.primary,
    letterSpacing: 0.2,
  },
});