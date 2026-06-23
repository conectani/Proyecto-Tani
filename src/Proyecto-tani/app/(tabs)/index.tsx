import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { AnimatedButton, usePulse, useSlideIn } from '@/constants/animations';
import { useAuthStore } from '@/stores/auth';
import { useBabyStore, getAgeText } from '@/stores/babies';
import { useAppointmentStore } from '@/stores/appointments';

const PROFILE_IMG = require('@/assets/images/Tani user icon.png');

export default function HomeScreen() {
  const router = useRouter();
  const notifPulse = usePulse(1000);
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const slide1 = useSlideIn(100);
  const slide2 = useSlideIn(220);
  const slide3 = useSlideIn(340);
  const slide4 = useSlideIn(460);

  const { user } = useAuthStore();
  const { babies, activeBabyId, setActiveBaby, loadBabies } = useBabyStore();
  const { appointments, loadAppointments } = useAppointmentStore();

  const activeBaby = babies.find((b) => b.id === activeBabyId) || babies[0];
  const babyAppointments = appointments.filter((a) => a.bebeId === activeBaby?.id);
  const nextAppointment = babyAppointments[0];

  useEffect(() => {
    Animated.timing(headerOpacity, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    loadBabies();
    loadAppointments();
  }, []);

  const getHeaderName = () => {
    if (user) {
      return `${user.name} ${user.surname}`;
    }
    return 'Mariana Sofia Garcia';
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <Animated.View style={[s.header, { opacity: headerOpacity }]}>
        <TouchableOpacity style={s.headerLeft} onPress={() => router.push('/perfil')}>
          <View style={s.avatarWrap}><Image source={PROFILE_IMG} style={s.avatar} /></View>
          <Text style={s.headerName} numberOfLines={1}>{getHeaderName()}</Text>
        </TouchableOpacity>
        <View style={s.headerRight}>
          <TouchableOpacity style={s.iconBtn}>
            <Ionicons name="ribbon-outline" size={24} color="rgba(27,28,28,0.7)" />
          </TouchableOpacity>
          <TouchableOpacity style={s.iconBtn} onPress={() => router.push('/notificaciones')}>
            <Ionicons name="notifications-outline" size={24} color="rgba(27,28,28,0.7)" />
            <Animated.View style={[s.notifRing, { transform: [{ scale: notifPulse }], opacity: 0.35 }]} />
            <View style={s.notifDot} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Próxima Cita — gradiente real */}
        {nextAppointment ? (
          <Animated.View style={{ opacity: slide1.opacity, transform: [{ translateY: slide1.translateY }] }}>
            <AnimatedButton containerStyle={s.appointmentCard} onPress={() => router.push({ pathname: '/(citas)/detalle', params: { id: nextAppointment.id } })}>
              <LinearGradient colors={['#499F86', '#2D7A66']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
              <View style={s.appointmentLeft}>
                <View style={s.calBox}><Ionicons name="calendar-outline" size={24} color="#FFF" /></View>
                <View style={s.appointmentInfo}>
                  <Text style={s.appointmentTag}>PRÓXIMA CITA ({nextAppointment.tipo})</Text>
                  <Text style={s.appointmentTitle}>{nextAppointment.titulo} — {activeBaby?.name}</Text>
                  <View style={s.timeRow}>
                    <Ionicons name="time-outline" size={13} color="rgba(255,255,255,0.9)" />
                    <Text style={s.appointmentTime}>{nextAppointment.hora}</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.5)" />
            </AnimatedButton>
          </Animated.View>
        ) : (
          <Animated.View style={{ opacity: slide1.opacity, transform: [{ translateY: slide1.translateY }] }}>
            <AnimatedButton containerStyle={s.appointmentCard} onPress={() => router.navigate('/(tabs)/citas')}>
              <LinearGradient colors={['#499F86', '#2D7A66']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
              <View style={s.appointmentLeft}>
                <View style={s.calBox}><Ionicons name="calendar-outline" size={24} color="#FFF" /></View>
                <View style={s.appointmentInfo}>
                  <Text style={s.appointmentTag}>SIN CITAS PROGRAMADAS</Text>
                  <Text style={s.appointmentTitle}>No hay citas para {activeBaby?.name}</Text>
                  <Text style={s.appointmentTime}>Organiza el seguimiento médico aquí</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.5)" />
            </AnimatedButton>
          </Animated.View>
        )}

        {/* Reservar Cita — gradiente naranja */}
        <Animated.View style={{ opacity: slide1.opacity, transform: [{ translateY: slide1.translateY }] }}>
          <AnimatedButton containerStyle={s.reservarBtn} onPress={() => router.push('/(citas)/agendar')}>
            <LinearGradient colors={['#b85a00', '#9b4500']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[StyleSheet.absoluteFill, { borderRadius: 14 }]} />
            <Ionicons name="add-circle-outline" size={22} color="#FFF" />
            <Text style={s.reservarText}>Reservar Cita Médica</Text>
          </AnimatedButton>
        </Animated.View>

        {/* Mis Bebés */}
        <Animated.View style={[s.section, { opacity: slide2.opacity, transform: [{ translateY: slide2.translateY }] }]}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Mis Bebés</Text>
            <Text style={s.sectionSub}>Gestión de perfiles familiares</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.babyScroll}>
            {babies.map((baby) => {
              const isActive = baby.id === activeBabyId;
              return (
                <TouchableOpacity
                  key={baby.id}
                  style={[s.babyCard, !isActive && s.babyInactive]}
                  onPress={() => {
                    setActiveBaby(baby.id);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }}
                >
                  <View style={s.babyAvatarWrap}>
                    {baby.imageUri ? (
                      <Image source={{ uri: baby.imageUri }} style={s.babyAvatar} />
                    ) : (
                      <View style={[s.babyAvatar, s.babyAvatarEmpty]}><Ionicons name="happy-outline" size={28} color="#6e7a74" style={{ opacity: 0.5 }} /></View>
                    )}
                    {baby.isFavorite && (
                      <View style={s.favBadge}><Ionicons name="heart" size={10} color="#FFF" /></View>
                    )}
                  </View>
                  <View>
                    <Text style={[s.babyName, !isActive && { color: '#6e7a74' }]}>{baby.name}</Text>
                    <Text style={s.babyDetail}>{getAgeText(baby.birthDate)} • {baby.weightText}</Text>
                    {isActive ? (
                      <View style={s.alDia}>
                        <Ionicons name="checkmark-circle" size={13} color="#499F86" />
                        <Text style={s.alDiaText}>Activo</Text>
                      </View>
                    ) : (
                      <Text style={s.verPerfil}>Activar perfil</Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* Mi Carnet QR */}
        <Animated.View style={{ opacity: slide3.opacity, transform: [{ translateY: slide3.translateY }] }}>
          <AnimatedButton containerStyle={s.qrCard} onPress={() => router.push('/mi-carnet')}>
            <View style={s.qrIconBox}><Ionicons name="qr-code" size={36} color="#499F86" /></View>
            <View style={s.qrText}>
              <Text style={s.qrTitle}>Mi Carnet QR</Text>
              <Text style={s.qrSub}>Escanea para identificación rápida en clínica</Text>
            </View>
            <View style={s.chevronCircle}><Ionicons name="chevron-forward" size={18} color="#6e7a74" /></View>
          </AnimatedButton>
        </Animated.View>

        {/* Consejos */}
        <Animated.View style={[s.section, { opacity: slide4.opacity, transform: [{ translateY: slide4.translateY }] }]}>
          <Text style={s.sectionTitle}>Consejos del día</Text>
          <AnimatedButton containerStyle={s.tipCard} onPress={() => router.push('/(aprende)/guia')}>
            <View style={s.tipIconBox}><Ionicons name="bulb-outline" size={28} color="#765b00" /></View>
            <View style={s.tipContent}>
              <Text style={s.tipTitle}>Alimentación complementaria</Text>
              <Text style={s.tipText}>Descubre los mejores alimentos para iniciar la dieta de <Text style={{ fontWeight: '700' }}>{activeBaby?.name || 'tu bebé'}</Text> a sus {activeBaby ? getAgeText(activeBaby.birthDate) : '8 meses'}.</Text>
              <View style={s.tipLink}>
                <Text style={s.tipLinkText}>Leer guía completa</Text>
                <Ionicons name="arrow-forward" size={13} color="#499F86" />
              </View>
            </View>
          </AnimatedButton>
        </Animated.View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fbf9f8' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: 'rgba(255,255,255,0.85)', borderBottomWidth: 1, borderBottomColor: 'rgba(190,201,195,0.1)' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarWrap: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden', borderWidth: 1.5, borderColor: 'rgba(73,159,134,0.2)' },
  avatar: { width: '100%', height: '100%' },
  headerName: { fontSize: 20, fontWeight: '800', color: '#499F86', letterSpacing: -0.3 },
  headerRight: { flexDirection: 'row', gap: 4 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  notifDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#ba1a1a', borderWidth: 2, borderColor: '#FFF' },
  notifRing: { position: 'absolute', top: 6, right: 6, width: 12, height: 12, borderRadius: 6, backgroundColor: '#ba1a1a' },
  content: { paddingHorizontal: 20, paddingTop: 20, gap: 16 },
  appointmentCard: { borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden', shadowColor: '#499F86', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
  appointmentLeft: { flexDirection: 'row', alignItems: 'center', gap: 16, flex: 1 },
  calBox: { width: 48, height: 48, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  appointmentInfo: { flex: 1 },
  appointmentTag: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: 1.5, marginBottom: 4 },
  appointmentTitle: { fontSize: 18, fontWeight: '700', color: '#FFF', marginBottom: 4 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  appointmentTime: { fontSize: 13, fontWeight: '500', color: 'rgba(255,255,255,0.9)' },
  reservarBtn: { borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8, overflow: 'hidden', shadowColor: '#9b4500', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 },
  reservarText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  section: { gap: 12 },
  sectionHeader: { gap: 2 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#1b1c1c', letterSpacing: -0.3 },
  sectionSub: { fontSize: 12, color: '#3e4945' },
  babyScroll: { gap: 16, paddingRight: 4, paddingBottom: 4 },
  babyCard: { width: 260, backgroundColor: '#FFF', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16, borderWidth: 1, borderColor: 'rgba(190,201,195,0.1)', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 },
  babyInactive: { backgroundColor: 'rgba(245,243,243,0.5)', opacity: 0.75 },
  babyAvatarWrap: { width: 64, height: 64, borderRadius: 16, overflow: 'hidden' },
  babyAvatarEmpty: { backgroundColor: '#f0eded', justifyContent: 'center', alignItems: 'center' },
  babyAvatar: { width: '100%', height: '100%' },
  favBadge: { position: 'absolute', bottom: -4, right: -4, width: 22, height: 22, borderRadius: 11, backgroundColor: '#d3a500', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  babyName: { fontSize: 18, fontWeight: '800', color: '#1b1c1c', marginBottom: 2 },
  babyDetail: { fontSize: 13, color: '#3e4945', fontWeight: '500', marginBottom: 6 },
  alDia: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f0fdf9', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start' },
  alDiaText: { fontSize: 11, fontWeight: '700', color: '#499F86', textTransform: 'uppercase', letterSpacing: 0.5 },
  verPerfil: { fontSize: 11, fontWeight: '600', color: 'rgba(62,73,69,0.7)' },
  qrCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16, borderWidth: 1, borderColor: 'rgba(73,159,134,0.1)', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.04, shadowRadius: 20, elevation: 2 },
  qrIconBox: { width: 56, height: 56, backgroundColor: 'rgba(73,159,134,0.1)', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  qrText: { flex: 1 },
  qrTitle: { fontSize: 17, fontWeight: '700', color: '#1b1c1c', marginBottom: 4 },
  qrSub: { fontSize: 13, color: '#3e4945', lineHeight: 18 },
  chevronCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f0eded', justifyContent: 'center', alignItems: 'center' },
  tipCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, flexDirection: 'row', gap: 16, borderWidth: 1, borderColor: 'rgba(190,201,195,0.1)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 },
  tipIconBox: { width: 56, height: 56, backgroundColor: 'rgba(211,165,0,0.1)', borderRadius: 16, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  tipContent: { flex: 1, gap: 6 },
  tipTitle: { fontSize: 15, fontWeight: '800', color: '#1b1c1c', lineHeight: 20 },
  tipText: { fontSize: 13, color: '#3e4945', lineHeight: 20 },
  tipLink: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  tipLinkText: { fontSize: 13, fontWeight: '700', color: '#499F86' },
});