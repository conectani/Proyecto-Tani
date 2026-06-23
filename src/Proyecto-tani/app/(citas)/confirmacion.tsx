import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function ConfirmacionCitaScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Confirmación y Pago</Text>
        </View>
        <View style={{ width: 40 }} /> {/* Spacer */}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Date Header Section */}
        <View style={styles.dateHeaderSection}>
          <View style={styles.dateHeaderCard}>
            <View style={styles.dateHeaderGlow} />
            <Text style={styles.dateHeaderLabel}>TU PRÓXIMA CITA</Text>
            <Text style={styles.dateHeaderTitle}>Viernes, 24 de Octubre - 10:30 AM</Text>
          </View>
        </View>

        {/* Service Summary Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Resumen del Servicio</Text>
          
          <View style={styles.bentoGrid}>
            {/* Service Detail Card */}
            <View style={styles.bentoCard}>
              <View style={styles.iconBoxPrimary}>
                <Ionicons name="medical-outline" size={24} color={Colors.light.primary} />
              </View>
              <View style={styles.bentoTextCol}>
                <Text style={styles.bentoSubtitle}>Servicio</Text>
                <Text style={styles.bentoTitle}>Control Pediátrico</Text>
              </View>
            </View>

            {/* Practitioner Card */}
            <View style={styles.bentoCard}>
              <View style={styles.doctorImageBox}>
                <Image 
                  source={require('@/assets/images/doctor_elena.png')}
                  style={styles.doctorImage}
                />
              </View>
              <View style={styles.bentoTextCol}>
                <Text style={styles.bentoSubtitle}>Especialista</Text>
                <Text style={styles.bentoTitle}>Dra. Elena Quiroga</Text>
              </View>
            </View>

            {/* Location Card Full Width */}
            <View style={[styles.bentoCard, styles.fullWidthCard]}>
              <View style={styles.locationRow}>
                <View style={styles.iconBoxSecondary}>
                  <Ionicons name="location-outline" size={24} color={Colors.light.secondary} />
                </View>
                <View style={styles.bentoTextCol}>
                  <Text style={styles.bentoSubtitle}>Ubicación</Text>
                  <Text style={styles.bentoTitle}>Sede Principal - Jesús María</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={Colors.light.textSecondary} opacity={0.4} />
            </View>
          </View>
        </View>

        {/* Payment Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Método de Pago</Text>
          
          {/* Saved Card */}
          <View style={styles.savedCard}>
            <View style={styles.savedCardLeft}>
              <View style={styles.cardLogoBox}>
                <Text style={styles.cardLogoText}>VISA</Text>
              </View>
              <View>
                <Text style={styles.cardNumber}>•••• •••• •••• 4582</Text>
                <Text style={styles.cardExpiry}>Expira 09/27</Text>
              </View>
            </View>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={16} color="#FFF" />
            </View>
          </View>

          {/* Add New Payment */}
          <TouchableOpacity style={styles.addPaymentButton}>
            <View style={styles.addPaymentIconBox}>
              <Ionicons name="add" size={20} color={Colors.light.textSecondary} />
            </View>
            <Text style={styles.addPaymentText}>Agregar nuevo método de pago</Text>
          </TouchableOpacity>
        </View>

        {/* Summary Calculation */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Consulta Pediátrica</Text>
            <Text style={styles.summaryValue}>S/ 120.00</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Cargos por reserva</Text>
            <Text style={styles.summaryValue}>S/ 5.00</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total a pagar</Text>
            <Text style={styles.totalValue}>S/ 125.00</Text>
          </View>
        </View>

      </ScrollView>

      {/* Fixed Bottom Action */}
      <View style={styles.bottomActionArea}>
        <TouchableOpacity style={styles.payButton} onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); router.push('/(tabs)/citas'); }}>
          <Text style={styles.payButtonText}>Pagar Ahora</Text>
          <Ionicons name="lock-closed" size={20} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.secureTextRow}>
          <Ionicons name="shield-checkmark" size={14} color={Colors.light.textSecondary} opacity={0.6} />
          <Text style={styles.secureText}>Pago encriptado y seguro por SSL</Text>
        </View>
      </View>

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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#Fbf9f8',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    borderRadius: 20,
    backgroundColor: '#f5f3f3',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginLeft: 16,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 140, // Space for fixed bottom action
  },
  dateHeaderSection: {
    marginBottom: 32,
    marginTop: 16,
  },
  dateHeaderCard: {
    backgroundColor: 'rgba(73,159,134,0.12)',
    borderRadius: 24,
    padding: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  dateHeaderGlow: {
    position: 'absolute',
    top: -48,
    right: -48,
    width: 192,
    height: 192,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 96,
  },
  dateHeaderLabel: {
    color: Colors.light.primary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  dateHeaderTitle: {
    color: '#002018',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  sectionContainer: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 16,
  },
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  bentoCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
    minWidth: '45%',
  },
  fullWidthCard: {
    width: '100%',
    minWidth: '100%',
    justifyContent: 'space-between',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBoxPrimary: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 105, 83, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBoxSecondary: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 127, 39, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorImageBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    overflow: 'hidden',
  },
  doctorImage: {
    width: '100%',
    height: '100%',
  },
  bentoTextCol: {
    justifyContent: 'center',
    flex: 1,
  },
  bentoSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  bentoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  savedCard: {
    backgroundColor: 'rgba(228, 226, 225, 0.4)',
    padding: 20,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  savedCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cardLogoBox: {
    width: 56,
    height: 36,
    backgroundColor: '#303030',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardLogoText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  cardNumber: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  cardExpiry: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.light.outlineVariant,
    borderStyle: 'dashed',
  },
  addPaymentIconBox: {
    width: 56,
    height: 36,
    backgroundColor: '#f0eded',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(190, 201, 195, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPaymentText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  summaryCard: {
    backgroundColor: 'rgba(245, 243, 243, 0.5)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: Colors.light.textSecondary,
  },
  summaryValue: {
    fontSize: 15,
    color: Colors.light.textSecondary,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.light.primary,
  },
  bottomActionArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(251, 249, 248, 0.9)',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  payButton: {
    backgroundColor: Colors.light.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 24,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  payButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secureTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
  },
  secureText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    opacity: 0.6,
  },
});