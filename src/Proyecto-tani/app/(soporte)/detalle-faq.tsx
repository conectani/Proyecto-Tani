import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const STEPS = [
  {
    num: '1',
    title: 'Navega a Cuidado',
    desc: 'Abre la app y toca la pestaña Cuidado en el menú inferior. Es el centro de mando para tu salud.',
    highlight: 'Cuidado',
    chips: [],
    isLast: false,
  },
  {
    num: '2',
    title: 'Elige a tu Especialista',
    desc: 'Filtra por disponibilidad y revisa los perfiles certificados. Selecciona al profesional que mejor conecte contigo.',
    chips: ['CERTIFICADOS'],
    isLast: false,
  },
  {
    num: '3',
    title: 'Verifica Requisitos',
    checks: ['Perfil de salud actualizado', 'Estudios previos cargados'],
    isLast: false,
  },
  {
    num: '4',
    title: '¡Agenda y Confirma!',
    desc: 'Selecciona fecha, hora y confirma. Recibirás un correo instantáneo con los detalles.',
    isLast: true,
  },
];

export default function DetalleFaqScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>(Apellido)</Text>
          <Text style={styles.headerSub}>(Apellido)</Text>
        </View>
        <View style={styles.headerAvatar}>
          <Image
            source={require('@/assets/images/Tani user icon.png')}
            style={styles.avatarImg}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Section badge + title */}
        <View style={styles.titleSection}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Guía de Acción</Text>
          </View>
          <Text style={styles.mainTitle}>Pasos para agendar tu consulta prenatal</Text>
          <Text style={styles.mainSubtitle}>
            Una secuencia rápida diseñada para padres ocupados. Sigue estos 4 pasos y asegura tu cita en minutos.
          </Text>
        </View>

        {/* Steps */}
        <View style={styles.stepsContainer}>
          {STEPS.map((step, idx) => (
            <View
              key={idx}
              style={[styles.stepCard, step.isLast && styles.stepCardHighlight]}
            >
              <View style={styles.stepLeft}>
                <View style={[styles.stepNumber, step.isLast && styles.stepNumberHighlight]}>
                  <Text style={styles.stepNumberText}>{step.num}</Text>
                </View>
                {!step.isLast && <View style={styles.stepLine} />}
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, step.isLast && styles.stepTitleHighlight]}>
                  {step.title}
                </Text>
                {step.desc && (
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                )}
                {step.chips && step.chips.length > 0 && (
                  <View style={styles.chipRow}>
                    {step.chips.map((chip) => (
                      <View key={chip} style={styles.chip}>
                        <Ionicons name="checkmark-circle" size={14} color={Colors.light.primary} />
                        <Text style={styles.chipText}>{chip}</Text>
                      </View>
                    ))}
                  </View>
                )}
                {step.checks && (
                  <View style={styles.checkList}>
                    {step.checks.map((check, i) => (
                      <View key={i} style={styles.checkItem}>
                        <Ionicons name="checkmark-circle" size={16} color={Colors.light.primary} />
                        <Text style={styles.checkText}>{check}</Text>
                      </View>
                    ))}
                  </View>
                )}
                {step.isLast && (
                  <TouchableOpacity
                    style={styles.agendarBtn}
                    onPress={() => router.push('/(citas)/confirmacion')}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="calendar" size={18} color="#FFF" />
                    <Text style={styles.agendarText}>Agendar Ahora</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Tip card */}
        <View style={styles.tipCard}>
          <View style={styles.tipIconBox}>
            <Ionicons name="bulb" size={24} color="#FFF" />
          </View>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Tip del Guardián</Text>
            <Text style={styles.tipText}>
              Prepara tu lista de preguntas con antelación. No hay dudas pequeñas para un nuevo comienzo.
            </Text>
          </View>
        </View>

        {/* Hero image */}
        <View style={styles.heroImageContainer}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYulMWniU5xLaKwv2w4G4jqrMxeFJn0Sx3je5aEihZEksl-k51Gy5CUPI0iclUPGoZ_TyvGd0dDRykA_iKTHYLH79aeP4-rkpB0Xn717n-kVK-U9Lt90RMNvmDl-x2FfeJrlQjr7pqzIwW-RDnPOSnC43ouUWAZdoCNwypIPwL14FibKKdkI1jPCyXh3th0mA4zz3SJbSGfosKUBDEl-ZPkZ-O9qLwbEY-_IEAyEQVFjZSnyBpk9cgNPEdX-b63Sx8XDnFrc7cK5Y' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroCaption}>Acompañándote en cada latido.</Text>
            <Text style={styles.heroCaption2}>Atención médica humana y tecnológica.</Text>
          </View>
        </View>

        {/* Footer feedback */}
        <View style={styles.feedbackSection}>
          <Text style={styles.feedbackLabel}>¿Fue útil esta guía?</Text>
          <View style={styles.feedbackRow}>
            <TouchableOpacity style={styles.feedbackBtn}>
              <Ionicons name="thumbs-up-outline" size={16} color={Colors.light.primary} />
              <Text style={styles.feedbackBtnText}>Sí</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.feedbackBtn}>
              <Ionicons name="thumbs-down-outline" size={16} color="#ba1a1a" />
              <Text style={styles.feedbackBtnText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
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
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fbf9f8',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    gap: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f5f3f3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.light.primary,
  },
  headerSub: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: '600',
    marginTop: -2,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#9df3d7',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
  },
  titleSection: {
    marginBottom: 28,
  },
  badge: {
    backgroundColor: '#9df3d7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#005140',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.light.primary,
    lineHeight: 32,
    letterSpacing: -0.3,
    marginBottom: 10,
  },
  mainSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 21,
  },
  stepsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  stepCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(190,201,195,0.3)',
  },
  stepCardHighlight: {
    backgroundColor: 'rgba(0,105,83,0.05)',
    borderColor: 'rgba(0,105,83,0.2)',
  },
  stepLeft: {
    alignItems: 'center',
    flexShrink: 0,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumberHighlight: {
    backgroundColor: Colors.light.primary,
  },
  stepNumberText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(129,215,187,0.3)',
    borderRadius: 1,
    minHeight: 20,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1b1c1c',
    marginBottom: 6,
  },
  stepTitleHighlight: {
    color: Colors.light.primary,
  },
  stepDesc: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 21,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f3f3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  chipText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.light.primary,
    letterSpacing: 0.5,
  },
  checkList: {
    gap: 8,
    marginTop: 8,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  agendarBtn: {
    marginTop: 16,
    backgroundColor: Colors.light.primary,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  agendarText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  tipCard: {
    backgroundColor: 'rgba(255,219,201,0.5)',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,182,142,1)',
  },
  tipIconBox: {
    backgroundColor: '#ff7f27',
    borderRadius: 14,
    padding: 10,
    height: 44,
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#612900',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: 'rgba(97,41,0,0.8)',
    lineHeight: 20,
  },
  heroImageContainer: {
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject as any,
    background: 'transparent',
    backgroundColor: 'rgba(0,105,83,0.6)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  heroCaption: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  heroCaption2: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
  },
  feedbackSection: {
    alignItems: 'center',
    paddingTop: 16,
  },
  feedbackLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  feedbackRow: {
    flexDirection: 'row',
    gap: 12,
  },
  feedbackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(190,201,195,1)',
    backgroundColor: '#FFF',
  },
  feedbackBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1b1c1c',
  },
});
