import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AnimatedButton } from '@/constants/animations';
import { useAuthStore } from '@/stores/auth';

export default function SoporteScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const getHeaderName = () => {
    if (user) return `${user.name} ${user.surname}`;
    return 'Mariana Sofia Garcia';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerProfile} onPress={() => router.push('/perfil')}>
          <View style={styles.avatarContainer}>
            <Image 
              source={require('@/assets/images/Tani user icon.png')} 
              style={styles.avatar} 
            />
          </View>
          <Text style={styles.headerName} numberOfLines={1}>{getHeaderName()}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/notificaciones')}>
          <Ionicons name="notifications-outline" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Header Title */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Centro de Soporte</Text>
          <Text style={styles.mainSubtitle}>Acompañamos cada paso de tu camino.</Text>
        </View>

        {/* Mission / Donations Card */}
        <View style={styles.missionCard}>
          <View style={styles.missionHeader}>
            <View style={styles.missionIconBox}>
              <Ionicons name="heart-half" size={32} color="#FFF" />
            </View>
            <View style={styles.missionTitleBox}>
              <Text style={styles.missionTitle}>Misión Tani</Text>
              <Text style={styles.missionTag}>ORGANIZACIÓN SIN FINES DE LUCRO</Text>
            </View>
          </View>
          
          <View style={styles.quoteBlock}>
            <Ionicons name="chatbox" size={32} color="rgba(73, 159, 134, 0.1)" style={styles.quoteIconLeft} />
            <Text style={styles.quoteText}>
              Nacimos para garantizar que cada madre y cada niño en situaciones vulnerables reciban el cuidado de la más alta calidad, con dignidad y respeto.
            </Text>
          </View>

          <View style={styles.donationsSection}>
            <View style={styles.donationsHeader}>
              <Ionicons name="gift-outline" size={20} color={Colors.light.primary} />
              <Text style={styles.donationsTitle}>Apoya nuestra labor</Text>
            </View>
            
            <View style={styles.accountRow}>
              <View>
                <Text style={styles.accountLabel}>BANCO NACIONAL</Text>
                <Text style={styles.accountNumber}>191-2345678-0-91</Text>
              </View>
              <TouchableOpacity style={styles.copyButton}>
                <Ionicons name="copy-outline" size={18} color={Colors.light.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.accountRowLast}>
              <View>
                <Text style={styles.accountLabel}>CUENTA INTERBANCARIA (CCI)</Text>
                <Text style={styles.accountNumber}>002-191234567809154</Text>
              </View>
              <TouchableOpacity style={styles.copyButton}>
                <Ionicons name="copy-outline" size={18} color={Colors.light.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Sugerencias Button */}
        <View style={styles.sugerenciaSection}>
          <View style={styles.sugerenciaLeft}>
            <View style={styles.sugerenciaIcon}>
              <Ionicons name="bulb-outline" size={20} color="#ff7f27" />
            </View>
            <View>
              <Text style={styles.sugerenciaTitle}>Sugerencias</Text>
              <Text style={styles.sugerenciaSubtitle}>Ayúdanos a mejorar el cuidado.</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.sugerenciaButton} onPress={() => router.push('/(soporte)/sugerencia')}>
            <Ionicons name="send" size={16} color="#FFF" />
            <Text style={styles.sugerenciaBtnText}>Enviar</Text>
          </TouchableOpacity>
        </View>

        {/* Preguntas Frecuentes Section */}
        <View style={styles.faqSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
            <TouchableOpacity onPress={() => router.push('/(soporte)/faq')}>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.faqList}>
            {/* FAQ 1 */}
            <TouchableOpacity style={styles.faqItem} onPress={() => router.push('/(soporte)/detalle-faq')}>
              <View style={styles.faqIconBox}>
                <Ionicons name="medical-outline" size={20} color={Colors.light.primary} />
              </View>
              <View style={styles.faqContent}>
                <Text style={styles.faqTitle}>Citas Médicas</Text>
                <Text style={styles.faqDesc}>¿Cómo agendar mi primera consulta prenatal?</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.light.textSecondary} />
            </TouchableOpacity>

            {/* FAQ 2 */}
            <TouchableOpacity style={styles.faqItem} onPress={() => router.push('/(soporte)/detalle-faq')}>
              <View style={styles.faqIconBox}>
                <Ionicons name="nutrition-outline" size={20} color={Colors.light.primary} />
              </View>
              <View style={styles.faqContent}>
                <Text style={styles.faqTitle}>Programas Nutricionales</Text>
                <Text style={styles.faqDesc}>Requisitos para recibir suplementos de Tani.</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.light.textSecondary} />
            </TouchableOpacity>

            {/* FAQ 3 */}
            <TouchableOpacity style={styles.faqItem} onPress={() => router.push('/(soporte)/detalle-faq')}>
              <View style={styles.faqIconBox}>
                <Ionicons name="school-outline" size={20} color={Colors.light.primary} />
              </View>
              <View style={styles.faqContent}>
                <Text style={styles.faqTitle}>Talleres de Crianza</Text>
                <Text style={styles.faqDesc}>Fechas y ubicaciones próximas.</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footerDecoration}>
          <Ionicons name="heart" size={24} color={Colors.light.primary} style={{ opacity: 0.4 }} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#Fbf9f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#eae8e7',
    marginRight: 12,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  headerName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  iconButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.light.text,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  mainSubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  missionCard: {
    backgroundColor: '#FFF',
    borderRadius: 32,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  missionIconBox: {
    width: 64,
    height: 64,
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  missionTitleBox: {
    flex: 1,
  },
  missionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.light.text,
  },
  missionTag: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.light.primary,
    letterSpacing: 2,
    marginTop: 4,
  },
  quoteBlock: {
    position: 'relative',
    marginBottom: 32,
  },
  quoteIconLeft: {
    position: 'absolute',
    top: -12,
    left: -8,
  },
  quoteText: {
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'italic',
    lineHeight: 24,
    color: Colors.light.text,
    paddingLeft: 12,
  },
  donationsSection: {
    backgroundColor: '#f5f3f3',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  donationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  donationsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginLeft: 8,
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  accountRowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.light.textSecondary,
    letterSpacing: 1,
    marginBottom: 2,
  },
  accountNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.light.text,
    letterSpacing: 1,
  },
  copyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sugerenciaSection: {
    backgroundColor: '#f5f3f3',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  sugerenciaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sugerenciaIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#ffeae0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sugerenciaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 2,
  },
  sugerenciaSubtitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  sugerenciaButton: {
    backgroundColor: Colors.light.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  sugerenciaBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 8,
  },
  faqSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  faqList: {
    gap: 12,
  },
  faqItem: {
    backgroundColor: '#f5f3f3',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  faqIconBox: {
    backgroundColor: 'rgba(73, 159, 134, 0.1)',
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  faqContent: {
    flex: 1,
    paddingRight: 12,
  },
  faqTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 2,
  },
  faqDesc: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  footerDecoration: {
    alignItems: 'center',
    paddingVertical: 24,
  }
});