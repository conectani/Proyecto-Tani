import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Image, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const TANI_LOGO = require('@/assets/images/Tani Icon.png');

export default function RecoverPasswordScreen() {
  const router = useRouter();
  const [identificacion, setIdentificacion] = useState('');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#006953" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tani</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} bounces={false}>
        {/* Logo + Badge */}
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Image source={TANI_LOGO} style={styles.logo} resizeMode="cover" />
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>FAMILIA TANI</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
          <Text style={styles.subtitle}>
            No te preocupes, sucede. Ingresa tu DNI o correo electrónico y te enviaremos un enlace para crear una nueva de forma segura.
          </Text>
        </View>

        {/* Form card */}
        <View style={styles.card}>
          <Text style={styles.inputLabel}>Identificación</Text>
          <View style={styles.inputRow}>
            <Ionicons name="person-outline" size={22} color="#6e7a74" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="DNI o Correo Electrónico"
              placeholderTextColor="#6e7a74"
              value={identificacion}
              onChangeText={setIdentificacion}
            />
          </View>

          <TouchableOpacity style={styles.submitBtn} activeOpacity={0.85}>
            <Text style={styles.submitText}>Enviar Enlace de Recuperación</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginGray}>¿Recordaste tu clave? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.loginLink}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Info cards */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Ionicons name="shield-checkmark" size={24} color="#006953" />
            <Text style={styles.infoText}>Acceso{'\n'}Protegido</Text>
          </View>
          <View style={[styles.infoCard, { backgroundColor: 'rgba(255,223,147,0.3)' }]}>
            <Ionicons name="person-circle-outline" size={24} color="#765b00" />
            <Text style={[styles.infoText, { color: '#594400' }]}>Identidad{'\n'}Validada</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>CUIDANDO EL FUTURO HOY</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf9f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 56 : 24,
    paddingBottom: 16,
    backgroundColor: 'rgba(251,249,248,0.8)',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#006953',
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 40,
  },
  logoCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#28826b',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 16,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  badge: {
    backgroundColor: '#9b4500',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 24,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 28,
    maxWidth: 360,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1b1c1c',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 15,
    color: '#3e4945',
    textAlign: 'center',
    lineHeight: 23,
    paddingHorizontal: 8,
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 28,
    marginBottom: 24,
    shadowColor: 'rgba(0,0,0,0.04)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 4,
    gap: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1b1c1c',
    marginLeft: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f3f3',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1b1c1c',
    height: '100%',
  },
  submitBtn: {
    backgroundColor: '#006953',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
    shadowColor: 'rgba(0,105,83,0.12)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 6,
  },
  submitText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  loginGray: {
    fontSize: 14,
    color: '#3e4945',
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#006953',
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  infoCard: {
    flex: 1,
    backgroundColor: 'rgba(129,215,187,0.2)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#005140',
    lineHeight: 16,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6e7a74',
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
});