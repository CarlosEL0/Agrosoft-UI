// app/(auth)/register.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/theme/colors';
import { Svg, Path, Circle, G } from 'react-native-svg';

// ── Íconos ────────────────────────────────────────────────────────────────────

function MailIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        stroke={Colors.textMedium}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 6l-10 7L2 6"
        stroke={Colors.textMedium}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function LockIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z"
        stroke={Colors.textMedium}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 11V7a5 5 0 0110 0v4"
        stroke={Colors.textMedium}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function UserIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
        stroke={Colors.textMedium}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle
        cx="12"
        cy="7"
        r="4"
        stroke={Colors.textMedium}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function EyeIcon({ off }: { off: boolean }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      {off ? (
        <>
          <Path
            d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"
            stroke={Colors.textLight}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <Path
            d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"
            stroke={Colors.textLight}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <Path d="M1 1l22 22" stroke={Colors.textLight} strokeWidth={1.5} strokeLinecap="round" />
        </>
      ) : (
        <>
          <Path
            d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
            stroke={Colors.textLight}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <Circle cx="12" cy="12" r="3" stroke={Colors.textLight} strokeWidth={1.5} />
        </>
      )}
    </Svg>
  );
}

// ── InputField reutilizable ───────────────────────────────────────────────────

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  icon: React.ReactNode;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  rightElement?: React.ReactNode;
}

function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  secureTextEntry = false,
  keyboardType = 'default',
  rightElement,
}: InputFieldProps) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <View style={styles.inputIcon}>{icon}</View>
        <View style={styles.inputDivider} />
        <TextInput
          style={[styles.input, rightElement ? { flex: 1 } : {}]}
          placeholder={placeholder}
          placeholderTextColor={Colors.textPlaceholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize="none"
        />
        {rightElement && <View style={styles.inputRight}>{rightElement}</View>}
      </View>
      <View style={styles.inputLine} />
    </View>
  );
}

// ── Patrón topográfico (idéntico al Login pero más compacto) ──────────────────

function TopoPattern() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" viewBox="0 0 412 220" preserveAspectRatio="xMidYMid slice">
        <Path d="M0 0h412v220H0z" fill={Colors.primary} />
        <G opacity={0.15} stroke="#a5c5b0" strokeWidth={1.2} fill="none">
          <Path d="M-30 120 Q80 70 160 110 Q240 150 340 90 Q400 60 450 100" />
          <Path d="M-30 140 Q90 90 170 130 Q250 170 350 105 Q410 75 460 120" />
          <Path d="M-30 100 Q70 50 150 90 Q230 135 330 70 Q395 40 445 85" />
          <Path d="M-30 160 Q100 105 180 150 Q260 190 360 120 Q420 90 470 135" />
          <Path d="M-30 80 Q60 30 140 70 Q220 115 320 50 Q385 20 440 65" />
          <Path d="M100 60 Q150 20 200 40 Q250 60 230 100 Q200 135 150 115 Q100 100 100 60Z" />
          <Path d="M280 30 Q330 5 365 30 Q390 55 370 85 Q345 110 305 95 Q270 75 280 30Z" />
        </G>
        <Path
          d="M0 165 Q60 140 130 158 Q210 178 290 148 Q360 122 412 145 L412 220 L0 220Z"
          fill={Colors.background}
        />
      </Svg>
    </View>
  );
}

// ── Pantalla Register ─────────────────────────────────────────────────────────

export default function RegisterScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {
    // TODO: lógica de registro
    router.replace('/(tabs)');
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