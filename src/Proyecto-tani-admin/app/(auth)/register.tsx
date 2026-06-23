import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Image, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const TANI_LOGO = require('@/assets/images/Tani Icon.png');

export default function RegisterScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} bounces={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#006953" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Título */}
          <Text style={styles.title}>Bienvenida a la familia</Text>
          <Text style={styles.subtitle}>Crea tu cuenta para empezar a cuidar de tu bebé</Text>

          {/* Form */}
          <View style={styles.form}>
            {/* Nombre */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nombre Completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. Ana García"
                placeholderTextColor="rgba(27,28,28,0.4)"
                value={nombre}
                onChangeText={setNombre}
              />
            </View>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Correo Electrónico</Text>
              <TextInput
                style={styles.input}
                placeholder="tu@ejemplo.com"
                placeholderTextColor="rgba(27,28,28,0.4)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Contraseña */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  placeholder="••••••••"
                  placeholderTextColor="rgba(27,28,28,0.4)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color="#3e4945"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={() => router.push('/(auth)/verify-dni')}
              activeOpacity={0.85}
            >
              <Text style={styles.submitText}>Crear Cuenta</Text>
              <Ionicons name="arrow-forward" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Footer link */}
          <View style={styles.loginRow}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.loginLink}>
                ¿Ya tienes una cuenta?{' '}
                <Text style={styles.loginLinkBold}>Inicia sesión</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf9f8',
  },
  scroll: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingBottom: 16,
    backgroundColor: '#fbf9f8',
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1b1c1c',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#3e4945',
    lineHeight: 24,
    marginBottom: 32,
  },
  form: {
    gap: 0,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3e4945',
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#eae8e7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1b1c1c',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eae8e7',
    borderRadius: 12,
    overflow: 'hidden',
  },
  eyeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  submitBtn: {
    backgroundColor: '#006953',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginTop: 8,
    shadowColor: 'rgba(0,105,83,0.15)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  submitText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },
  loginRow: {
    alignItems: 'center',
    marginTop: 32,
  },
  loginLink: {
    fontSize: 15,
    color: '#006953',
    fontWeight: '600',
  },
  loginLinkBold: {
    fontWeight: '800',
  },
});