import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Platform,
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
const CARD_GREEN = '#006953';
const AMBER = '#765b00';

const SECTIONS = [
  {
    icon: 'document-text-outline' as const,
    title: '1. Aceptación de Términos',
    text: 'Al acceder y utilizar la plataforma de Familia TANI, usted acepta estar legalmente vinculado por estos Términos y Condiciones. Este acuerdo constituye un contrato vinculante entre el usuario y TANI.\n\nSi no está de acuerdo con alguno de estos términos, le solicitamos amablemente que se abstenga de utilizar nuestros servicios. El uso continuo de la aplicación se considerará como una aceptación de cualquier modificación futura.',
    accent: PRIMARY,
    bg: CARD,
  },
  {
    icon: 'phone-portrait-outline' as const,
    title: '2. Uso de la Plataforma',
    text: 'La plataforma está diseñada para proporcionar acompañamiento y recursos para la maternidad y el cuidado infantil. El usuario se compromete a proporcionar información veraz y mantener la confidencialidad de su cuenta.\n\nQueda estrictamente prohibido el uso de la plataforma para fines ilícitos o que atenten contra la integridad de otros miembros de la comunidad TANI.',
    accent: PRIMARY,
    bg: CARD_LOW,
  },
  {
    icon: 'shield-checkmark-outline' as const,
    title: '3. Privacidad y Datos',
    text: 'Tu privacidad es sagrada. En Familia TANI utilizamos protocolos de encriptación de grado médico para asegurar que tus datos personales y los de tu bebé permanezcan privados y seguros en todo momento.\n\nSus datos nunca serán vendidos ni compartidos con terceros sin su consentimiento explícito. Puede ejercer sus derechos de acceso, rectificación y eliminación en cualquier momento desde su perfil.',
    accent: '#ffffff',
    bg: CARD_GREEN,
    light: true,
  },
  {
    icon: 'ribbon-outline' as const,
    title: '4. Propiedad Intelectual',
    text: 'Todo el contenido disponible en Familia TANI, incluyendo textos, gráficos, logotipos, iconos, imágenes y software, es propiedad exclusiva de TANI o de sus proveedores de contenido y está protegido por las leyes internacionales de derechos de autor.\n\nSe prohíbe la reproducción, distribución o modificación de cualquier contenido sin autorización expresa y por escrito de TANI.',
    accent: PRIMARY,
    bg: CARD,
  },
  {
    icon: 'warning-outline' as const,
    title: '5. Limitación de Responsabilidad',
    text: 'Si bien nos esforzamos por proporcionar información precisa y oportuna, Familia TANI no sustituye el consejo médico profesional. Siempre busque el consejo de su médico u otro proveedor de salud calificado para cualquier pregunta relacionada con una condición médica.\n\nTANI no será responsable por decisiones médicas tomadas basándose exclusivamente en la información proporcionada por la plataforma.',
    accent: AMBER,
    bg: 'rgba(255,223,147,0.15)',
  },
  {
    icon: 'refresh-outline' as const,
    title: '6. Modificaciones del Servicio',
    text: 'TANI se reserva el derecho de modificar o interrumpir el servicio (o cualquier parte del mismo) con o sin previo aviso en cualquier momento. No seremos responsables ante usted ni ante terceros por cualquier modificación, suspensión o interrupción del servicio.\n\nCualquier cambio sustancial en los términos será comunicado con al menos 15 días de anticipación a través de notificaciones en la aplicación.',
    accent: PRIMARY,
    bg: CARD_LOW,
  },
  {
    icon: 'card-outline' as const,
    title: '7. Suscripciones y Pagos',
    text: 'Algunos servicios de TANI pueden requerir el pago de una suscripción. Los cargos se realizarán de forma automática al inicio de cada período de facturación hasta que cancele la suscripción.\n\nLas cancelaciones deben realizarse con al menos 24 horas de anticipación al siguiente ciclo de facturación para evitar cargos adicionales. No se realizan reembolsos por períodos ya iniciados.',
    accent: PRIMARY,
    bg: CARD,
  },
  {
    icon: 'location-outline' as const,
    title: '8. Legislación Aplicable',
    text: 'Estos términos se regirán e interpretarán de acuerdo con las leyes de la República del Perú. Cualquier disputa que surja en relación con estos términos será sometida a la jurisdicción exclusiva de los tribunales competentes de Lima.\n\nSi alguna disposición de estos términos se considera inválida o inaplicable, las disposiciones restantes continuarán en plena vigencia.',
    accent: PRIMARY,
    bg: CARD_LOW,
  },
];

export default function TerminosScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={PRIMARY} />
        </TouchableOpacity>
        <Text style={s.headerBrand}>Familia TANI</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={s.hero}>
          <Text style={s.heroTitle}>Términos y{'\n'}Condiciones</Text>
          <Text style={s.heroSub}>
            Nuestra prioridad es la seguridad de tu familia. Por favor, lee cuidadosamente cómo trabajamos juntos para proteger tu bienestar.
          </Text>
        </View>

        {/* Sections */}
        {SECTIONS.map((sec, i) => (
          <View
            key={i}
            style={[s.card, { backgroundColor: sec.bg }]}
          >
            <View style={s.cardHead}>
              <Ionicons
                name={sec.icon}
                size={22}
                color={sec.light ? '#ffffff' : sec.accent}
              />
              <Text style={[s.cardTitle, sec.light && { color: '#FFF' }]}>
                {sec.title}
              </Text>
            </View>
            <Text style={[s.cardText, sec.light && { color: 'rgba(255,255,255,0.88)' }]}>
              {sec.text}
            </Text>
          </View>
        ))}

        {/* Footer */}
        <View style={s.footer}>
          <View style={s.footerLine} />
          <Text style={s.footerText}>
            Última actualización: 24 de Mayo, 2024.{'\n'}
            Al registrarte, confirmaste que leíste y comprendiste estos términos.
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: 'rgba(251,249,248,0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(190,201,195,0.15)',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
  },
  headerBrand: {
    fontSize: 17, fontWeight: '800', color: PRIMARY,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
    gap: 12,
  },
  hero: {
    paddingVertical: 24,
    gap: 10,
  },
  heroTitle: {
    fontSize: 38, fontWeight: '800', color: PRIMARY,
    letterSpacing: -1, lineHeight: 44,
  },
  heroSub: {
    fontSize: 15, color: TEXT_SUB, lineHeight: 22,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardTitle: {
    fontSize: 16, fontWeight: '700', color: TEXT, flex: 1,
  },
  cardText: {
    fontSize: 14, color: TEXT_SUB, lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  footerLine: {
    width: 48, height: 4, borderRadius: 2,
    backgroundColor: '#bec9c3', opacity: 0.4,
  },
  footerText: {
    fontSize: 13, color: TEXT_SUB, textAlign: 'center', lineHeight: 20,
  },
  footerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(0,105,83,0.08)',
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
  },
  footerBadgeText: {
    fontSize: 13, fontWeight: '600', color: PRIMARY,
  },
});