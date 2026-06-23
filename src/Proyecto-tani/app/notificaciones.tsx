import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFadeIn } from '@/constants/animations';

const NOTIFS = [
  {
    id: 1,
    tipo: 'cita',
    titulo: 'Cita Pediátrica Mañana',
    texto: 'Recuerda tu cita con la Dra. Méndez para la revisión de los 6 meses de Mateo a las 10:00 AM.',
    tiempo: 'Hace 10 min',
    leida: false,
    icon: 'calendar' as const,
    iconColor: '#499F86',
    iconBg: 'rgba(73,159,134,0.12)',
    accent: '#499F86',
  },
  {
    id: 2,
    tipo: 'vacuna',
    titulo: 'Vacunación Próxima',
    texto: 'Es hora de agendar la vacuna contra el rotavirus. El centro de salud local tiene disponibilidad esta semana.',
    tiempo: 'Hace 2 horas',
    leida: false,
    icon: 'medical' as const,
    iconColor: '#9b4500',
    iconBg: 'rgba(155,69,0,0.12)',
    accent: '#9b4500',
  },
  {
    id: 3,
    tipo: 'tip',
    titulo: 'Tip de Nutrición',
    texto: 'Conoce nuevas recetas ricas en hierro ideales para el inicio de la alimentación complementaria.',
    tiempo: 'Ayer',
    leida: true,
    icon: 'nutrition' as const,
    iconColor: '#6e7a74',
    iconBg: '#eae8e7',
    accent: '#6e7a74',
  },
  {
    id: 4,
    tipo: 'comunidad',
    titulo: 'Nueva Charla Comunitaria',
    texto: 'Únete a nuestra sesión virtual sobre desarrollo temprano infantil este sábado. Registro gratuito.',
    tiempo: 'Ayer',
    leida: true,
    icon: 'people' as const,
    iconColor: '#6e7a74',
    iconBg: '#eae8e7',
    accent: '#6e7a74',
  },
  {
    id: 5,
    tipo: 'logro',
    titulo: '¡Primer mes completado!',
    texto: 'Mateo cumplió su primer mes con todas las consultas al día. ¡Familia TANI te felicita!',
    tiempo: 'Hace 3 días',
    leida: true,
    icon: 'ribbon' as const,
    iconColor: '#765b00',
    iconBg: 'rgba(211,165,0,0.12)',
    accent: '#765b00',
  },
];

function NotifCard({ notif, delay }: { notif: typeof NOTIFS[0]; delay: number }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 350, delay, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, delay, useNativeDriver: true, speed: 20, bounciness: 3 }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <TouchableOpacity
        style={[s.card, notif.leida && s.cardRead]}
        activeOpacity={0.85}
      >
        {!notif.leida && (
          <View style={[s.unreadDot, { backgroundColor: notif.accent }]} />
        )}
        <View style={[s.iconBox, { backgroundColor: notif.iconBg }]}>
          <Ionicons name={notif.icon} size={22} color={notif.iconColor} />
        </View>
        <View style={s.cardBody}>
          <View style={s.cardTop}>
            <Text style={[s.cardTitle, notif.leida && s.cardTitleRead]} numberOfLines={1}>
              {notif.titulo}
            </Text>
            <Text style={s.cardTime}>{notif.tiempo}</Text>
          </View>
          <Text style={s.cardText} numberOfLines={2}>{notif.texto}</Text>
          {/* Tag de tipo */}
          <View style={[s.tag, { backgroundColor: notif.iconBg }]}>
            <Text style={[s.tagText, { color: notif.iconColor }]}>
              {notif.tipo.toUpperCase()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function NotificacionesScreen() {
  const router = useRouter();
  const headerFade = useFadeIn(0, 400);

  const hoy = NOTIFS.filter(n => !n.leida);
  const antes = NOTIFS.filter(n => n.leida);

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <Animated.View style={[s.header, { opacity: headerFade }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1b1c1c" />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <View style={s.avatarWrap}>
            <Image source={require('@/assets/images/Tani user icon.png')} style={s.avatar} />
          </View>
          <Text style={s.headerName}>(Apellido)</Text>
        </View>
        <TouchableOpacity style={s.markAllBtn}>
          <Ionicons name="checkmark-done" size={20} color="#499F86" />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Título */}
        <View style={s.titleRow}>
          <Text style={s.title}>Notificaciones</Text>
          <View style={s.badge}>
            <Text style={s.badgeText}>{hoy.length} nuevas</Text>
          </View>
        </View>

        {/* HOY — sin leer */}
        {hoy.length > 0 && (
          <>
            <View style={s.divider}>
              <View style={s.divLine} />
              <Text style={s.divLabel}>HOY</Text>
              <View style={s.divLine} />
            </View>
            {hoy.map((n, i) => <NotifCard key={n.id} notif={n} delay={i * 100} />)}
          </>
        )}

        {/* ANTERIORES */}
        <View style={s.divider}>
          <View style={s.divLine} />
          <Text style={s.divLabel}>ANTERIORES</Text>
          <View style={s.divLine} />
        </View>
        {antes.map((n, i) => <NotifCard key={n.id} notif={n} delay={200 + i * 80} />)}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fbf9f8' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: 'rgba(255,255,255,0.9)', borderBottomWidth: 1, borderBottomColor: 'rgba(190,201,195,0.12)' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f5f3f3', justifyContent: 'center', alignItems: 'center' },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarWrap: { width: 36, height: 36, borderRadius: 18, overflow: 'hidden' },
  avatar: { width: '100%', height: '100%' },
  headerName: { fontSize: 16, fontWeight: '700', color: '#499F86' },
  markAllBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(73,159,134,0.1)', justifyContent: 'center', alignItems: 'center' },
  content: { paddingHorizontal: 20, paddingTop: 20, gap: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  title: { fontSize: 32, fontWeight: '800', color: '#1b1c1c', letterSpacing: -0.5 },
  badge: { backgroundColor: '#499F86', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  badgeText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 4 },
  divLine: { flex: 1, height: 1, backgroundColor: '#eae8e7' },
  divLabel: { fontSize: 10, fontWeight: '800', color: '#6e7a74', letterSpacing: 1.5 },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'flex-start', gap: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, position: 'relative' },
  cardRead: { backgroundColor: '#f9f8f7', shadowOpacity: 0, elevation: 0, opacity: 0.8 },
  unreadDot: { position: 'absolute', left: 8, top: 20, width: 7, height: 7, borderRadius: 3.5 },
  iconBox: { width: 46, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center', flexShrink: 0, marginLeft: 6 },
  cardBody: { flex: 1, gap: 4 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1b1c1c', flex: 1, lineHeight: 18 },
  cardTitleRead: { fontWeight: '600', color: '#3e4945' },
  cardTime: { fontSize: 11, fontWeight: '500', color: '#6e7a74', marginLeft: 8 },
  cardText: { fontSize: 13, color: '#3e4945', lineHeight: 19 },
  tag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginTop: 2 },
  tagText: { fontSize: 9, fontWeight: '800', letterSpacing: 1 },
});