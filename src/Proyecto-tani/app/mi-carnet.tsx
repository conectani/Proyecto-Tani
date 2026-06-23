import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import { AnimatedButton, useFadeIn } from '@/constants/animations';
import { Animated } from 'react-native';
import { useAuthStore } from '@/stores/auth';
import { useBabyStore } from '@/stores/babies';

export default function MiCarnetScreen() {
  const router = useRouter();
  const fadeOpacity = useFadeIn(200, 500);

  const { user } = useAuthStore();
  const { babies, activeBabyId } = useBabyStore();

  const activeBaby = babies.find((b) => b.id === activeBabyId) || babies[0];
  const babyName = activeBaby ? activeBaby.name : 'Mateo';
  const momSurname = user ? user.surname : 'García';
  const fullName = `${babyName} ${momSurname}`;
  const historyNum = user ? user.id.replace('TN-', '') : '98932';
  const qrCodeValue = `TANI-PE-${historyNum}-${babyName.toUpperCase()}-${momSurname.toUpperCase()}`;

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Mi Carnet</Text>
        <View style={{ width: 40 }} />
      </View>

      <Animated.View style={[s.content, { opacity: fadeOpacity }]}>
        {/* Foto perfil */}
        <View style={s.profileSection}>
          <LinearGradient
            colors={['#499F86', '#006953']}
            style={s.avatarGradient}
          >
            <View style={s.avatarInner}>
              <Image
                source={require('@/assets/images/Tani user icon.png')}
                style={s.avatar}
              />
            </View>
          </LinearGradient>
          <View style={s.familyBadge}>
            <Text style={s.familyBadgeText}>FAMILIA TANI</Text>
          </View>
        </View>

        {/* Info */}
        <View style={s.infoSection}>
          <Text style={s.nameText}>{fullName}</Text>
          <View style={s.historyBadge}>
            <Text style={s.historyText}>Nro. Historia: {historyNum}</Text>
          </View>
        </View>

        {/* QR Card con borde gradiente */}
        <View style={s.qrCardContainer}>
          <LinearGradient
            colors={['#499F86', '#006953', '#d3a500']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.qrGradientBorder}
          >
            <View style={s.qrCard}>
              {/* QR real generado */}
              <View style={s.qrBox}>
                <QRCode
                  value={qrCodeValue}
                  size={200}
                  color="#006953"
                  backgroundColor="white"
                  logo={require('@/assets/images/Tani Icon.png')}
                  logoSize={36}
                  logoBackgroundColor="white"
                  logoBorderRadius={8}
                />
              </View>
              <View style={s.instructionBox}>
                <Ionicons name="information-circle" size={20} color={Colors.light.primary} />
                <Text style={s.instructionText}>
                  Muestra este código en la recepción para registrar tu ingreso
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Footer */}
        <Text style={s.footerText}>TANI PERÚ {new Date().getFullYear()}</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fbf9f8' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f0eded', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#006953' },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 8 },
  profileSection: { position: 'relative', marginBottom: 24, alignItems: 'center' },
  avatarGradient: { width: 136, height: 136, borderRadius: 68, padding: 4, shadowColor: '#499F86', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 20, elevation: 8 },
  avatarInner: { flex: 1, borderRadius: 64, overflow: 'hidden', backgroundColor: '#FFF' },
  avatar: { width: '100%', height: '100%' },
  familyBadge: { position: 'absolute', bottom: -10, backgroundColor: '#006953', paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20, borderWidth: 2, borderColor: '#fbf9f8' },
  familyBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  infoSection: { alignItems: 'center', marginBottom: 28, marginTop: 8 },
  nameText: { fontSize: 28, fontWeight: '800', color: '#1b1c1c', marginBottom: 8 },
  historyBadge: { backgroundColor: 'rgba(73,159,134,0.12)', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  historyText: { color: '#002018', fontSize: 14, fontWeight: '600' },
  qrCardContainer: { width: '100%', maxWidth: 320 },
  qrGradientBorder: { borderRadius: 32, padding: 3, shadowColor: '#499F86', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 24, elevation: 8 },
  qrCard: { backgroundColor: '#FFF', borderRadius: 30, padding: 28, alignItems: 'center', gap: 20 },
  qrBox: { alignItems: 'center', justifyContent: 'center', padding: 8, borderRadius: 16, backgroundColor: '#fff' },
  instructionBox: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: 'rgba(73,159,134,0.08)', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, width: '100%', gap: 10 },
  instructionText: { flex: 1, fontSize: 13, fontWeight: '500', color: '#002018', lineHeight: 18 },
  footerText: { marginTop: 24, fontSize: 13, fontWeight: '800', color: '#499F86', letterSpacing: 2, textTransform: 'uppercase' },
});