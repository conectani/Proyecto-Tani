import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const PRIMARY = '#006953';
const TEXT = '#1b1c1c';
const TEXT_SUB = '#3e4945';
const BG = '#fbf9f8';
const CARD = '#ffffff';
const CARD_LOW = '#f5f3f3';
const AMBER = '#765b00';

const SECTIONS = [
  {
    icon: 'information-circle-outline' as const,
    title: '1. Información que Recopilamos',
    text: 'Recopilamos información que usted nos proporciona directamente, como nombre, DNI, correo electrónico, número de teléfono y datos sobre su bebé (nombre, fecha de nacimiento, peso, talla).\n\nTambién recopilamos datos de uso de la aplicación, información del dispositivo y, con su permiso, datos de ubicación para conectarle con servicios de salud cercanos.',
    bg: CARD,
    accent: PRIMARY,
  },
  {
    icon: 'analytics-outline' as const,
    title: '2. Cómo Usamos su Información',
    text: 'Utilizamos su información para: proporcionar y mejorar nuestros servicios, personalizar su experiencia en la aplicación, enviarle recordatorios de citas y vacunas, ofrecerle contenido educativo relevante para la etapa de desarrollo de su bebé, y conectarle con profesionales de la salud.\n\nNunca utilizaremos su información con fines publicitarios de terceros sin su consentimiento explícito.',
    bg: CARD_LOW,
    accent: PRIMARY,
  },
  {
    icon: 'lock-closed-outline' as const,
    title: '3. Seguridad de los Datos',
    text: 'La seguridad de sus datos es nuestra máxima prioridad. Implementamos medidas técnicas y organizativas de seguridad de nivel médico, incluyendo:\n\n• Encriptación AES-256 en reposo\n• Comunicaciones TLS 1.3 en tránsito\n• Acceso restringido por roles\n• Auditorías de seguridad periódicas\n• Copias de seguridad automáticas cifradas',
    bg: CARD,
    accent: PRIMARY,
  },
  {
    icon: 'share-social-outline' as const,
    title: '4. Compartición de Datos',
    text: 'No vendemos, comercializamos ni transferimos sus datos personales a terceros. Solo compartimos información en los siguientes casos:\n\n• Con profesionales de salud que usted autorice explícitamente\n• Con proveedores de servicios que nos asisten en la operación de la app (bajo acuerdos de confidencialidad estrictos)\n• Cuando lo exija la ley o autoridades competentes',
    bg: CARD_LOW,
    accent: PRIMARY,
  },
  {
    icon: 'person-outline' as const,
    title: '5. Sus Derechos',
    text: 'Usted tiene derecho a:\n\n• Acceder a toda la información que tenemos sobre usted\n• Rectificar datos incorrectos o incompletos\n• Solicitar la eliminación de su cuenta y datos\n• Oponerse al procesamiento de sus datos\n• Exportar sus datos en formato portátil\n• Retirar el consentimiento en cualquier momento\n\nEjercite estos derechos desde Perfil → Configuración → Privacidad.',
    bg: CARD,
    accent: PRIMARY,
  },
  {
    icon: 'phone-portrait-outline' as const,
    title: '6. Cookies y Tecnologías Similares',
    text: 'Utilizamos tecnologías de seguimiento propias para mejorar su experiencia, recordar sus preferencias y analizar el uso de la aplicación. Estas tecnologías no recopilan información de identificación personal sin su conocimiento.\n\nPuede gestionar sus preferencias de seguimiento en cualquier momento desde la configuración de la aplicación.',
    bg: CARD_LOW,
    accent: PRIMARY,
  },
  {
    icon: 'happy-outline' as const,
    title: '7. Datos de Menores',
    text: 'TANI está diseñado específicamente para el cuidado de bebés y niños pequeños. Los datos de los menores (nombre, edad, salud) son proporcionados por sus padres o tutores legales y son tratados con el más alto nivel de protección.\n\nNunca recopilamos datos directamente de menores de edad. Los padres pueden solicitar la eliminación de los datos de sus hijos en cualquier momento.',
    bg: 'rgba(157,243,215,0.15)',
    accent: PRIMARY,
  },
  {
    icon: 'refresh-outline' as const,
    title: '8. Cambios a esta Política',
    text: 'Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos cualquier cambio significativo mediante una notificación en la aplicación y/o por correo electrónico al menos 15 días antes de que los cambios entren en vigor.\n\nLe recomendamos revisar esta política periódicamente para mantenerse informado sobre cómo protegemos su información.',
    bg: CARD_LOW,
    accent: PRIMARY,
  },
  {
    icon: 'mail-outline' as const,
    title: '9. Contacto',
    text: 'Si tiene preguntas sobre esta Política de Privacidad o sobre el manejo de sus datos personales, puede contactarnos en:\n\n📧 privacidad@tani.app\n📞 +51 1 234-5678\n🏢 Av. Javier Prado Este 4200, Lima, Perú\n\nNuestro Delegado de Protección de Datos responderá en un plazo máximo de 72 horas hábiles.',
    bg: CARD,
    accent: PRIMARY,
  },
];

export default function PoliticaScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={PRIMARY} />
        </TouchableOpacity>
        <Text style={s.headerBrand}>Familia TANI</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.hero}>
          <Text style={s.heroTitle}>Política de{'\n'}Privacidad</Text>
          <Text style={s.heroSub}>
            Tu privacidad es sagrada para nosotros. Aquí te explicamos exactamente qué datos recopilamos, para qué los usamos y cómo los protegemos.
          </Text>
          {/* Privacy badge */}
          <View style={s.heroBadge}>
            <Ionicons name="shield-checkmark" size={18} color={PRIMARY} />
            <Text style={s.heroBadgeText}>Protección de nivel médico · GDPR compliant</Text>
          </View>
        </View>

        {SECTIONS.map((sec, i) => (
          <View key={i} style={[s.card, { backgroundColor: sec.bg }]}>
            <View style={s.cardHead}>
              <View style={s.iconBox}>
                <Ionicons name={sec.icon} size={20} color={sec.accent} />
              </View>
              <Text style={s.cardTitle}>{sec.title}</Text>
            </View>
            <Text style={s.cardText}>{sec.text}</Text>
          </View>
        ))}

        <View style={s.footer}>
          <View style={s.footerLine} />
          <Text style={s.footerText}>
            Última actualización: 24 de Mayo, 2024.{'\n'}
            Al registrarte aceptaste esta política de privacidad.
          </Text>
          <View style={s.footerBadge}>
            <Ionicons name="shield-checkmark" size={16} color={PRIMARY} />
            <Text style={s.footerBadgeText}>Protegido por TANI</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: 'rgba(251,249,248,0.95)',
    borderBottomWidth: 1, borderBottomColor: 'rgba(190,201,195,0.15)',
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  headerBrand: { fontSize: 17, fontWeight: '800', color: PRIMARY },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32, gap: 12 },
  hero: { paddingVertical: 24, gap: 12 },
  heroTitle: { fontSize: 38, fontWeight: '800', color: PRIMARY, letterSpacing: -1, lineHeight: 44 },
  heroSub: { fontSize: 15, color: TEXT_SUB, lineHeight: 22 },
  heroBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(0,105,83,0.08)',
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, alignSelf: 'flex-start',
  },
  heroBadgeText: { fontSize: 12, fontWeight: '600', color: PRIMARY },
  card: { borderRadius: 16, padding: 20, gap: 12 },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(0,105,83,0.1)',
    justifyContent: 'center', alignItems: 'center',
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: TEXT, flex: 1, lineHeight: 20 },
  cardText: { fontSize: 14, color: TEXT_SUB, lineHeight: 22 },
  footer: { alignItems: 'center', paddingVertical: 16, gap: 12 },
  footerLine: { width: 48, height: 4, borderRadius: 2, backgroundColor: '#bec9c3', opacity: 0.4 },
  footerText: { fontSize: 13, color: TEXT_SUB, textAlign: 'center', lineHeight: 20 },
  footerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(0,105,83,0.08)',
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
  },
  footerBadgeText: { fontSize: 13, fontWeight: '600', color: PRIMARY },
});