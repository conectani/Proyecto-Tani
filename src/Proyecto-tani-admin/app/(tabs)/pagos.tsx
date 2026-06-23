import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAdminStore } from '@/stores/adminMothers';

const PRIMARY = '#006953';
const TEXT = '#1b1c1c';
const TEXT_SECONDARY = '#3e4945';

export default function AdminPaymentsScreen() {
  const { appointments, mothers, confirmPayment } = useAdminStore();

  // Filtrar citas que requieren atención de pago (Verificando o Pendiente)
  const pendingAppointments = appointments.filter(
    (a) => a.pagoEstado === 'Verificando' || a.pagoEstado === 'Pendiente'
  );

  const handleConfirmPayment = (appId: string, patientName: string, amount: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    confirmPayment(appId);
    Alert.alert(
      'Pago Confirmado',
      `Se ha verificado con éxito el pago de ${amount} por la consulta de ${patientName}.`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Verificación de Pagos</Text>
        <Text style={styles.headerSubtitle}>Revisión manual de transferencias (Yape, Plin, Banco)</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {pendingAppointments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={32} color={PRIMARY} />
            </View>
            <Text style={styles.emptyText}>¡Todo al día!</Text>
            <Text style={styles.emptySubtext}>No hay transferencias pendientes de verificación.</Text>
          </View>
        ) : (
          pendingAppointments.map((cita) => {
            const mom = mothers.find((m) => m.id === cita.motherId);
            const baby = mom?.babies.find((b) => b.id === cita.babyId);

            return (
              <View key={cita.id} style={styles.paymentCard}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.patientLabel}>PACIENTE</Text>
                    <Text style={styles.patientName}>{baby?.name || 'Bebé'}</Text>
                    <Text style={styles.momDetails}>Madre: {mom?.name} {mom?.surname} (DNI: {mom?.dni})</Text>
                  </View>
                  <View style={styles.amountBadge}>
                    <Text style={styles.amountText}>{cita.pagoMonto}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailRow}>
                  <Ionicons name="medical-outline" size={16} color={PRIMARY} />
                  <Text style={styles.detailText}>{cita.titulo} ({cita.tipo})</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={16} color={PRIMARY} />
                  <Text style={styles.detailText}>{cita.hora}</Text>
                </View>

                {/* Comprobante Info */}
                <View style={[styles.receiptBox, 
                  cita.pagoEstado === 'Verificando' ? styles.receiptVerifying : styles.receiptPending
                ]}>
                  <Ionicons 
                    name={cita.pagoEstado === 'Verificando' ? "document-text-outline" : "alert-circle-outline"} 
                    size={20} 
                    color={cita.pagoEstado === 'Verificando' ? '#765b00' : '#c62828'} 
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.receiptTitle, 
                      cita.pagoEstado === 'Verificando' ? { color: '#765b00' } : { color: '#c62828' }
                    ]}>
                      {cita.pagoEstado === 'Verificando' ? 'COMPROBANTE RECIBIDO' : 'PAGO PENDIENTE'}
                    </Text>
                    <Text style={styles.receiptDesc}>
                      {cita.pagoEstado === 'Verificando' 
                        ? 'Simulado: Yape_transferencia_20260522.jpg' 
                        : 'La madre aún no ha enviado el comprobante en su aplicativo.'}
                    </Text>
                  </View>
                </View>

                {/* Acciones */}
                <View style={styles.actions}>
                  {cita.pagoEstado === 'Verificando' ? (
                    <TouchableOpacity 
                      style={styles.confirmBtn}
                      onPress={() => handleConfirmPayment(cita.id, baby?.name || 'Bebé', cita.pagoMonto)}
                    >
                      <Ionicons name="checkmark-circle-outline" size={18} color="#FFF" />
                      <Text style={styles.confirmBtnText}>Confirmar Pago</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity 
                      style={[styles.confirmBtn, { backgroundColor: '#f0eded' }]}
                      onPress={() => {
                        Alert.alert('Cobro recordado', 'Se ha enviado una notificación recordatoria de pago a la madre.');
                      }}
                    >
                      <Ionicons name="notifications-outline" size={18} color={TEXT_SECONDARY} />
                      <Text style={[styles.confirmBtnText, { color: TEXT_SECONDARY }]}>Recordar Cobro</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        )}
        <View style={{ height: 40 }} />
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: PRIMARY,
  },
  headerSubtitle: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    marginTop: 2,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 16,
  },
  emptyContainer: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    marginTop: 40,
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e6f3ef',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '800',
    color: PRIMARY,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    textAlign: 'center',
  },
  paymentCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  patientLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: TEXT_SECONDARY,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '800',
    color: TEXT,
  },
  momDetails: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    marginTop: 2,
  },
  amountBadge: {
    backgroundColor: '#e6f3ef',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  amountText: {
    fontSize: 14,
    fontWeight: '800',
    color: PRIMARY,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0eded',
    marginVertical: 14,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    fontWeight: '500',
  },
  receiptBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    marginTop: 12,
    borderWidth: 1,
  },
  receiptVerifying: {
    backgroundColor: '#fff8e1',
    borderColor: 'rgba(211,165,0,0.15)',
  },
  receiptPending: {
    backgroundColor: '#ffebee',
    borderColor: 'rgba(198,40,40,0.1)',
  },
  receiptTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  receiptDesc: {
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
  actions: {
    marginTop: 16,
  },
  confirmBtn: {
    backgroundColor: PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
  },
  confirmBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
