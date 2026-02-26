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

// SVG íconos inline (no requieren assets externos)
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
          <Path
            d="M1 1l22 22"
            stroke={Colors.textLight}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
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

// ── Componente campo de texto reutilizable ────────────────────────────────────

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

// ── Pantalla Login ────────────────────────────────────────────────────────────

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // TODO: lógica de autenticación
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
          {/* ── Header verde topográfico ── */}
          <View style={styles.header}>
            {/* Patrón topográfico simulado con círculos concéntricos */}
            <TopoPattern />
          </View>

          {/* ── Contenido ── */}
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
                <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
                  <EyeIcon off={!showPassword} />
                </Pressable>
              }
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.85}>
              <Text style={styles.buttonText}>Login</Text>
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

// ── Patrón topográfico (SVG inline) ──────────────────────────────────────────

function TopoPattern() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" viewBox="0 0 412 300" preserveAspectRatio="xMidYMid slice">
        {/* Fondo base */}
        <Path d="M0 0h412v300H0z" fill={Colors.primary} />
        {/* Líneas topográficas decorativas */}
        <G opacity={0.15} stroke="#a5c5b0" strokeWidth={1.2} fill="none">
          <Path d="M-30 180 Q80 120 160 160 Q240 200 340 140 Q400 110 450 150" />
          <Path d="M-30 200 Q90 140 170 180 Q250 220 350 155 Q410 125 460 170" />
          <Path d="M-30 160 Q70 100 150 140 Q230 185 330 120 Q395 90 445 135" />
          <Path d="M-30 220 Q100 155 180 200 Q260 240 360 170 Q420 140 470 185" />
          <Path d="M-30 140 Q60 80 140 120 Q220 165 320 100 Q385 70 440 115" />
          <Path d="M50 260 Q130 200 210 240 Q290 280 390 215 Q440 185 490 225" />
          <Path d="M-10 100 Q70 40 160 80 Q250 125 350 60 Q415 30 465 75" />
          <Path d="M20 60 Q100 0 185 40 Q275 85 375 20 Q435 -10 485 35" />
          {/* Formas cerradas / manchas topográficas */}
          <Path d="M100 100 Q150 60 200 80 Q250 100 230 140 Q200 180 150 160 Q100 145 100 100Z" />
          <Path d="M250 60 Q310 30 350 60 Q380 90 360 120 Q330 150 290 135 Q250 115 250 60Z" />
          <Path d="M30 200 Q80 170 120 190 Q150 210 140 240 Q110 265 70 250 Q30 235 30 200Z" />
          <Path d="M320 180 Q370 155 400 180 Q420 205 400 230 Q375 255 340 240 Q310 220 320 180Z" />
        </G>
        {/* Ola blanca en la parte inferior */}
        <Path
          d="M0 240 Q60 210 120 230 Q200 255 280 220 Q350 190 412 215 L412 300 L0 300Z"
          fill={Colors.background}
          opacity={1}
        />
      </Svg>
    </View>
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
    height: 300,
    backgroundColor: Colors.primary,
    overflow: 'hidden',
  },

  // Contenido
  content: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 25,
    paddingTop: 28,
    paddingBottom: 32,
  },
  title: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 38,
    color: Colors.textDark,
    lineHeight: 44,
    marginBottom: 6,
  },
  titleUnderline: {
    width: 78,
    height: 2.5,
    backgroundColor: Colors.primary,
    marginBottom: 36,
    borderRadius: 2,
  },

  // Campos
  fieldGroup: {
    marginBottom: 28,
  },
  label: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 16,
    color: Colors.textMedium,
    letterSpacing: 0.2,
    marginBottom: 10,
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
    marginTop: 12,
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