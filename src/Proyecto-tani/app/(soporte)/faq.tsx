import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const FAQS = [
  {
    pregunta: '¿Cómo agendo mi primera consulta prenatal?',
    respuesta: "Puedes hacerlo desde la pestaña 'Citas' seleccionando a tu especialista preferido o la fecha más cercana.",
  },
  {
    pregunta: '¿Puedo cancelar una cita el mismo día?',
    respuesta: 'Recomendamos cancelar con al menos 24 horas de anticipación para permitir que otra madre tome el espacio.',
  },
  {
    pregunta: '¿Cómo cambio mi contraseña?',
    respuesta: "Accede a tu perfil, selecciona 'Seguridad' y sigue los pasos para restablecer tu clave.",
  },
  {
    pregunta: '¿Puedo usar la app sin internet?',
    respuesta: 'Ciertas funciones como el calendario de citas están disponibles offline, pero los chats requieren conexión.',
  },
];

export default function FaqScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('@/assets/images/Tani user icon.png')}
            style={styles.logo}
          />
          <View>
            <Text style={styles.headerTitle}>Tani</Text>
            <Text style={styles.headerSub}>Mateo</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Preguntas Frecuentes Completas</Text>
          <Text style={styles.heroSubtitle}>
            Encuentra respuestas rápidas sobre cuidados maternales, citas y el uso de tu plataforma Tani.
          </Text>
        </View>

        {/* FAQ List */}
        <View style={styles.faqList}>
          {FAQS.map((faq, idx) => (
            <View key={idx} style={styles.faqItem}>
              <Text style={styles.faqQuestion}>{faq.pregunta}</Text>
              <Text style={styles.faqAnswer}>{faq.respuesta}</Text>
              {idx < FAQS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Support Section */}
        <View style={styles.supportSection}>
          <Text style={styles.supportTitle}>Apoya a Familia Tani</Text>
          <Text style={styles.supportSubtitle}>Tu contribución ayuda a que más madres reciban atención de calidad.</Text>
          <View style={styles.supportButtons}>
            <TouchableOpacity style={styles.supportBtn}>
              <Ionicons name="heart-outline" size={20} color={Colors.light.primary} />
              <Text style={styles.supportBtnText}>¿A dónde va mi donación?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.supportBtn}>
              <Ionicons name="gift-outline" size={20} color={Colors.light.primary} />
              <Text style={styles.supportBtnText}>Donar equipamiento</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* WhatsApp FAB area */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* WhatsApp-style FAB */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="chatbubble-ellipses" size={28} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fbf9f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fbf9f8',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1b1c1c',
  },
  headerSub: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginTop: -2,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f5f3f3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  hero: {
    marginBottom: 32,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1b1c1c',
    lineHeight: 36,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    lineHeight: 24,
  },
  faqList: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  faqItem: {
    marginBottom: 4,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1b1c1c',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(190,201,195,0.3)',
    marginBottom: 16,
  },
  supportSection: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  supportTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1b1c1c',
    marginBottom: 6,
  },
  supportSubtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 16,
  },
  supportButtons: {
    gap: 12,
  },
  supportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  supportBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
