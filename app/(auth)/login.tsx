import { EyeIcon } from '@/src/components/icons/EyeIcon';
import { LockIcon } from '@/src/components/icons/LockIcon';
import { MailIcon } from '@/src/components/icons/MailIcon';
import { InputField } from '@/src/components/ui/InputField';
import { TopoPattern } from '@/src/components/ui/TopoPattern';
import { Colors } from '@/src/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';
import {
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLogin } from '@/src/hooks/useLogin';

export default function LoginScreen() {
  const router = useRouter();
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    toggleShowPassword,
    cargando,
    handleLogin,
  } = useLogin();

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
          <View style={styles.header}>
            <TopoPattern />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Login</Text>
            <View style={styles.titleUnderline} />

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
                <Pressable onPress={toggleShowPassword} hitSlop={8}>
                  <EyeIcon off={!showPassword} />
                </Pressable>
              }
            />

            <TouchableOpacity
              style={[styles.button, cargando && { opacity: 0.7 }]}
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={cargando}
            >
              <Text style={styles.buttonText}>
                {cargando ? 'Iniciando sesión...' : 'Login'}
              </Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>No tienes una cuenta? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                <Text style={styles.footerLink}>Crea una</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.primary },
  scroll: { flexGrow: 1, backgroundColor: Colors.background },
  header: { width: '100%', height: 300, backgroundColor: Colors.primary, overflow: 'hidden' },
  content: { flex: 1, backgroundColor: Colors.background, paddingHorizontal: 25, paddingTop: 28, paddingBottom: 32 },
  title: { fontFamily: 'Rubik_500Medium', fontSize: 38, color: Colors.textDark, lineHeight: 44, marginBottom: 6 },
  titleUnderline: { width: 78, height: 2.5, backgroundColor: Colors.primary, marginBottom: 36, borderRadius: 2 },
  fieldGroup: { marginBottom: 28 },
  label: { fontFamily: 'Rubik_500Medium', fontSize: 16, color: Colors.textMedium, letterSpacing: 0.2, marginBottom: 10 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  inputIcon: { marginRight: 2 },
  inputDivider: { width: 1, height: 18, backgroundColor: Colors.inputDivider, marginHorizontal: 10 },
  input: { flex: 1, fontFamily: 'Rubik_400Regular', fontSize: 14, color: Colors.textDark, letterSpacing: 0.2, paddingVertical: 6 },
  inputRight: { paddingLeft: 10 },
  inputLine: { height: 1, backgroundColor: Colors.inputLine, marginTop: 8, opacity: 0.6 },
  button: { backgroundColor: Colors.buttonBg, borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginTop: 12, marginBottom: 22, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  buttonText: { fontFamily: 'Rubik_600SemiBold', fontSize: 18, color: Colors.buttonText, letterSpacing: 0.2 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontFamily: 'Rubik_400Regular', fontSize: 14, color: Colors.textLight, letterSpacing: 0.2 },
  footerLink: { fontFamily: 'Rubik_500Medium', fontSize: 14, color: Colors.primary, letterSpacing: 0.2 },
});