import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Image, KeyboardAvoidingView, Platform, ScrollView, Animated, Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { AnimatedButton } from '@/constants/animations';
import { useAuthStore } from '@/stores/auth';

const TANI_LOGO = require('@/assets/images/Tani Icon.png');

export default function LoginScreen() {
  const router = useRouter();
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Estados para alerta personalizada premium
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    icon: 'alert-circle-outline' as any,
    iconColor: '#C5A059',
    bgColor: 'rgba(197, 160, 89, 0.1)',
  });
  const alertScale = useRef(new Animated.Value(0.9)).current;

  const showAlert = (config: typeof alertConfig) => {
    setAlertConfig(config);
    setAlertVisible(true);
    alertScale.setValue(0.9);
    Animated.spring(alertScale, {
      toValue: 1,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const { login } = useAuthStore();

  const handleLogin = async () => {
    if (!dni.trim() || dni.length < 8) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      showAlert({
        title: 'DNI Inválido',
        message: 'Por favor, ingresa un número de DNI válido de 8 dígitos para continuar.',
        icon: 'card-outline',
        iconColor: '#C5A059',
        bgColor: 'rgba(197, 160, 89, 0.1)',
      });
      return;
    }
    if (!password.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      showAlert({
        title: 'Contraseña Requerida',
        message: 'Por favor, ingresa tu contraseña para poder ingresar.',
        icon: 'key-outline',
        iconColor: '#C5A059',
        bgColor: 'rgba(197, 160, 89, 0.1)',
      });
      return;
    }

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await login(dni.trim(), password.trim());
      router.replace('/(tabs)');
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      const errMsg = error.message || '';
      
      if (
        errMsg.includes('Invalid login credentials') || 
        errMsg.includes('invalid_credentials')
      ) {
        showAlert({
          title: 'Contraseña Incorrecta',
          message: 'La contraseña ingresada es incorrecta o tu cuenta no está registrada.\n\nPor favor, verifica tus credenciales de administrador e intenta nuevamente.',
          icon: 'lock-closed-outline',
          iconColor: '#C5A059',
          bgColor: 'rgba(197, 160, 89, 0.1)',
        });
      } else if (
        errMsg.includes('No se encontró el perfil de usuario registrado')
      ) {
        showAlert({
          title: 'Perfil no Encontrado',
          message: 'No logramos encontrar tu ficha de registro en nuestro sistema.\n\nPor favor, comunícate con el soporte clínico para validar tus datos.',
          icon: 'person-remove-outline',
          iconColor: '#C5A059',
          bgColor: 'rgba(197, 160, 89, 0.1)',
        });
      } else if (
        errMsg.includes('Acceso no autorizado') || 
        errMsg.includes('Acceso denegado')
      ) {
        showAlert({
          title: 'Acceso Restringido',
          message: errMsg,
          icon: 'shield-alert-outline',
          iconColor: '#E11D48',
          bgColor: 'rgba(225, 29, 72, 0.1)',
        });
      } else if (
        errMsg.includes('fetch failed') ||
        errMsg.includes('Network request failed') ||
        errMsg.includes('TypeError') ||
        errMsg.includes('database') ||
        errMsg.includes('connection')
      ) {
        showAlert({
          title: 'Inconvenientes de Conexión',
          message: 'Tuvimos unos inconvenientes para establecer conexión con el servidor.\n\nNo te preocupes, nuestro equipo técnico ya se encuentra trabajando para solucionarlo. Por favor, intenta de nuevo en unos momentos.',
          icon: 'cloud-offline-outline',
          iconColor: '#E11D48',
          bgColor: 'rgba(225, 29, 72, 0.1)',
        });
      } else {
        showAlert({
          title: 'Tuvimos un Inconveniente',
          message: 'Lo sentimos, estamos experimentando dificultades técnicas temporales.\n\nYa nos encontramos trabajando para solucionarlo. Por favor, intenta ingresar de nuevo.',
          icon: 'construct-outline',
          iconColor: '#E11D48',
          bgColor: 'rgba(225, 29, 72, 0.1)',
        });
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Fondo verde menta */}
      <View style={styles.bg} />
      {/* Radial gradient decorativo (simulado con círculos) */}
      <View style={styles.radial1} />
      <View style={styles.radial2} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoWrapper}>
          <Image source={TANI_LOGO} style={styles.logo} resizeMode="cover" />
        </View>

        {/* Slogan */}
        <Text style={styles.slogan}>
          Protegiendo y guiando cada paso de tu crianza
        </Text>

        {/* Glass Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Consola Clínica TANI</Text>
          <Text style={styles.cardSubtitle}>
            Ingresa tus credenciales del personal de Tani para acceder al panel administrativo.
          </Text>

          {/* DNI */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>DNI</Text>
            <View style={styles.inputRow}>
              <Ionicons name="card-outline" size={20} color="#C5A059" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu DNI"
                placeholderTextColor="#94a3b8"
                value={dni}
                onChangeText={setDni}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Contraseña */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>CONTRASEÑA</Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/recover-password')}>
                <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={20} color="#C5A059" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu contraseña"
                placeholderTextColor="#94a3b8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#94a3b8"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Botón con gradiente + animación */}
          <AnimatedButton
            containerStyle={styles.btnWrapper}
            onPress={handleLogin}
            scaleValue={0.97}
          >
            <LinearGradient
              colors={['#5BA39B', '#3A736C']}
              style={styles.btn}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <Text style={styles.btnText}>Iniciar Sesión</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" />
            </LinearGradient>
          </AnimatedButton>
        </View>

        {/* Registro */}
        <View style={styles.registerRow}>
          <Text style={styles.registerGray}>Las cuentas son asignadas por la administración de sistemas de TANI.</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>CUIDANDO EL FUTURO HOY</Text>
          <View style={styles.footerLinks}>
            <TouchableOpacity onPress={() => router.push('/politica')}>
              <Text style={styles.footerLink}>Privacidad</Text>
            </TouchableOpacity>
            <Text style={styles.footerDot}> • </Text>
            <TouchableOpacity onPress={() => router.push('/terminos')}>
              <Text style={styles.footerLink}>Términos</Text>
            </TouchableOpacity>
            <Text style={styles.footerDot}> • </Text>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Ayuda</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal de Alerta Tani Personalizado */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={alertVisible}
        onRequestClose={() => setAlertVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { transform: [{ scale: alertScale }] }]}>
            {/* Círculo del Icono con fondo decorativo */}
            <View style={[styles.alertIconCircle, { backgroundColor: alertConfig.bgColor }]}>
              <Ionicons name={alertConfig.icon} size={36} color={alertConfig.iconColor} />
            </View>

            {/* Título de la Alerta */}
            <Text style={styles.modalTitle}>{alertConfig.title}</Text>

            {/* Mensaje */}
            <Text style={styles.modalMessage}>{alertConfig.message}</Text>

            {/* Botón de Confirmación */}
            <TouchableOpacity
              style={styles.modalButton}
              activeOpacity={0.85}
              onPress={() => {
                Animated.timing(alertScale, {
                  toValue: 0.9,
                  duration: 120,
                  useNativeDriver: true,
                }).start(() => {
                  setAlertVisible(false);
                });
              }}
            >
              <LinearGradient
                colors={['#5BA39B', '#3A736C']}
                style={styles.modalButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                <Text style={styles.modalButtonText}>Entendido</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9F7',
  },
  bg: {
    ...StyleSheet.absoluteFillObject as any,
    backgroundColor: '#F0F9F7',
  },
  // Círculos decorativos (simulan el radial-gradient del HTML)
  radial1: {
    position: 'absolute',
    top: -80,
    left: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(74,148,140,0.05)',
  },
  radial2: {
    position: 'absolute',
    bottom: -80,
    right: -80,
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: 'rgba(74,148,140,0.08)',
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 40,
    alignItems: 'center',
  },

  // Logo — círculo teal con borde dorado
  logoWrapper: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: '#4A948C',
    borderWidth: 4,
    borderColor: '#C5A059',
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  logo: {
    width: '100%',
    height: '100%',
  },

  slogan: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2D5A54',
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 26,
    marginBottom: 32,
  },

  // Glass card
  card: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 40,
    padding: 32,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(197,160,89,0.2)',
    shadowColor: '#2D5A54',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 12,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#C5A059',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 28,
    lineHeight: 20,
  },

  fieldGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1e293b',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  forgot: {
    fontSize: 11,
    fontWeight: '500',
    color: '#4A948C',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 2,
    borderColor: '#B2EBF2',
    borderRadius: 16,
    height: 52,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#334155',
    height: '100%',
  },
  eyeBtn: {
    padding: 4,
  },

  // Botón gradiente
  btnWrapper: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#2D5A54',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },

  registerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  registerGray: {
    fontSize: 14,
    color: '#475569',
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A948C',
  },

  footer: {
    alignItems: 'center',
    gap: 12,
  },
  footerTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerLink: {
    fontSize: 12,
    color: '#475569',
  },
  footerDot: {
    fontSize: 12,
    color: '#cbd5e1',
    marginHorizontal: 2,
  },

  // Estilos para el Modal de Alerta Tani
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)', // Slate oscuro translúcido
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.25)', // Dorado muy tenue
    shadowColor: '#2D5A54',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 24,
  },
  alertIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D5A54',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  modalButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#2D5A54',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  modalButtonGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
});