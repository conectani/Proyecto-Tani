import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Alert } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppointmentStore } from '@/stores/appointments';
import { useBabyStore, getAgeText } from '@/stores/babies';

export default function DetalleCitaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { appointments, deleteAppointment, updateAppointment } = useAppointmentStore();
  const { babies } = useBabyStore();

  const appointment = appointments.find((a) => a.id === id);
  const baby = babies.find((b) => b.id === appointment?.bebeId) || babies[0];

  const handleCancel = () => {
    if (!appointment) return;
    Alert.alert(
      'Cancelar Cita',
      '¿Estás segura de que deseas cancelar y eliminar esta cita médica?',
      [
        { text: 'No, mantener', style: 'cancel' },
        { 
          text: 'Sí, cancelar', 
          style: 'destructive',
          onPress: () => {
            deleteAppointment(appointment.id);
            router.back();
          }
        }
      ]
    );
  };

  const handleConfirm = () => {
    Alert.alert('Asistencia Confirmada', '¡Gracias por confirmar tu asistencia a esta cita!');
  };

  if (!appointment) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalles de Cita</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Cita no encontrada</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalles de Cita</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Hero Information Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroLabel}>{appointment.tipo}</Text>
          <Text style={styles.heroTitle}>{appointment.titulo}</Text>
        </View>

        <View style={styles.gridContainer}>
          {/* Patient Card */}
          <View style={styles.patientCard}>
            <View style={styles.patientAvatarBox}>
              {baby?.imageUri ? (
                <Image source={{ uri: baby.imageUri }} style={styles.patientAvatar} />
              ) : (
                <View style={[styles.patientAvatar, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#9df3d7' }]}>
                  <Ionicons name="happy-outline" size={28} color="#005140" />
                </View>
              )}
            </View>
            <View style={styles.patientInfo}>
              <Text style={styles.cardEyebrow}>PACIENTE</Text>
              <Text style={styles.patientName}>{baby?.name || 'Mateo'} <Text style={styles.patientAge}>({baby ? getAgeText(baby.birthDate) : '8 meses'})</Text></Text>
            </View>
          </View>

          {/* Specialty Card */}
          <View style={styles.specialtyCard}>
            <Text style={styles.specialtyEyebrow}>ESTABLECIMIENTO</Text>
            <Text style={styles.specialtyTitle}>{appointment.lugar}</Text>
          </View>
        </View>

        {/* Tarjeta de Pago Bento */}
        {appointment.pagoEstado && (
          <View style={styles.paymentCard}>
            <View style={[styles.paymentIconBox, 
              appointment.pagoEstado === 'Confirmado' && { backgroundColor: '#e6f3ef' },
              appointment.pagoEstado === 'Verificando' && { backgroundColor: '#fff8e1' },
              appointment.pagoEstado === 'Pendiente' && { backgroundColor: '#ffebee' },
            ]}>
              <Ionicons 
                name={appointment.pagoEstado === 'Confirmado' ? 'checkmark-circle' : appointment.pagoEstado === 'Verificando' ? 'time' : 'alert-circle'} 
                size={24} 
                color={appointment.pagoEstado === 'Confirmado' ? '#006953' : appointment.pagoEstado === 'Verificando' ? '#765b00' : '#c62828'} 
              />
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.cardEyebrow}>CONTROL DE PAGO ({appointment.pagoMonto || 'Costo 0'})</Text>
              <Text style={[styles.paymentStatusText, 
                appointment.pagoEstado === 'Confirmado' && { color: '#006953' },
                appointment.pagoEstado === 'Verificando' && { color: '#765b00' },
                appointment.pagoEstado === 'Pendiente' && { color: '#c62828' },
              ]}>
                {appointment.pagoEstado === 'Confirmado' && 'Confirmado (Verificado por Tani)'}
                {appointment.pagoEstado === 'Verificando' && 'En Verificación (Comprobante enviado)'}
                {appointment.pagoEstado === 'Pendiente' && 'Pendiente de Pago'}
              </Text>
            </View>
            {appointment.pagoEstado === 'Pendiente' && (
              <TouchableOpacity 
                style={styles.payButton}
                onPress={() => {
                  Alert.alert(
                    'Pagar Consulta',
                    '¿Deseas adjuntar tu comprobante de pago simulado (Transferencia Yape/Plin)?',
                    [
                      { text: 'Cancelar', style: 'cancel' },
                      { 
                        text: 'Enviar Comprobante', 
                        onPress: () => {
                          updateAppointment(appointment.id, { pagoEstado: 'Verificando' });
                          Alert.alert('Comprobante Enviado', 'El comprobante ha sido enviado a revisión. El administrador lo verificará pronto.');
                        } 
                      }
                    ]
                  );
                }}
              >
                <Text style={styles.payButtonText}>Pagar</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* DateTime & Doctor Details */}
        <View style={styles.dateTimeContainer}>
          <View style={styles.infoBoxRow}>
            {/* Date Time */}
            <View style={styles.infoBox}>
              <View style={[styles.iconWrapper, { backgroundColor: '#ffdf93' }]}>
                <Ionicons name="calendar" size={24} color="#503d00" />
              </View>
              <View style={styles.infoTextWrapper}>
                <Text style={styles.infoSubtitle}>Fecha y Hora</Text>
                <Text style={styles.infoTitle}>{appointment.hora}</Text>
              </View>
            </View>
          </View>
          {appointment.doctor && (
            <View style={styles.infoBoxRow}>
              {/* Specialist */}
              <View style={styles.infoBox}>
                <View style={[styles.iconWrapper, { backgroundColor: '#ffdbc9' }]}>
                  <Ionicons name="medkit" size={24} color="#612900" />
                </View>
                <View style={styles.infoTextWrapper}>
                  <Text style={styles.infoSubtitle}>Especialista</Text>
                  <Text style={styles.infoTitle}>{appointment.doctor}</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Location Section */}
        <View style={styles.locationContainer}>
          <View style={styles.locationHeader}>
            <View style={styles.locationHeaderLeft}>
              <Ionicons name="location" size={24} color={Colors.light.primary} />
              <Text style={styles.locationTitle}>Ubicación</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.linkText}>Abrir en Mapas</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.locationSubtitle}>{appointment.lugar}</Text>
          <Text style={styles.locationAddress}>Av. Salaverry 1234, Jesús María (Sede Central)</Text>
          
          <View style={styles.mapContainer}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnzuXVTnVXmvPhSp3GaolpV4WNsN-YLqEodQecZ9C8PZEqt0ZLnUfdqWd0qFg-jpaFiemsMYjryjEO6xYbkIAP9MxvkmKxaTlcLNK_FG2NRgT2UJqRP2SJ41bhSfPe3UH6NC8r-w5JJPCDQ2BTo1LIWVRaLy-jChNAjO8_20ECqhfEJc7HIulXQHlNERyLl0EWMmi1RnTSmlscAe66Z7DPmuFtnf5wL_luCfFdVPJK9szbAB1SHEDugwP1haSRKa-HPVtJ5-5xCVA' }}
              style={styles.mapImage}
            />
            <View style={styles.mapOverlay} />
          </View>
        </View>

        {/* Notes (if exist) */}
        {appointment.nota && (
          <View style={[styles.preparationContainer, { backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)', marginBottom: 32 }]}>
            <Text style={[styles.sectionHeading, { fontSize: 20, marginBottom: 12 }]}>Notas del Paciente</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
              <Ionicons name="document-text" size={20} color={Colors.light.primary} />
              <Text style={{ flex: 1, fontSize: 15, color: '#3e4945', lineHeight: 22 }}>{appointment.nota}</Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleConfirm}>
            <Text style={styles.primaryButtonText}>Confirmar Asistencia</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleCancel}>
            <Text style={styles.secondaryButtonText}>Cancelar Cita</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#Fbf9f8',
    ...Platform.select({
      ios: { zIndex: 10 },
      android: { elevation: 10 }
    })
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    borderRadius: 20,
    backgroundColor: '#eae8e7',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginLeft: 12,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  heroSection: {
    marginBottom: 24,
  },
  heroLabel: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.light.text,
    lineHeight: 40,
  },
  gridContainer: {
    gap: 16,
    marginBottom: 32,
  },
  patientCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  patientAvatarBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#9df3d7',
    overflow: 'hidden',
  },
  patientAvatar: {
    width: '100%',
    height: '100%',
  },
  patientInfo: {
    flex: 1,
  },
  cardEyebrow: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  patientAge: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.textSecondary,
  },
  specialtyCard: {
    backgroundColor: Colors.light.primary,
    padding: 24,
    borderRadius: 24,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  specialtyEyebrow: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 4,
  },
  specialtyTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  dateTimeContainer: {
    backgroundColor: '#f5f3f3',
    borderRadius: 28,
    padding: 4,
    gap: 4,
    marginBottom: 32,
  },
  infoBoxRow: {},
  infoBox: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  iconWrapper: {
    padding: 12,
    borderRadius: 16,
  },
  infoTextWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  infoSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.light.text,
  },
  locationContainer: {
    backgroundColor: '#FFF',
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    marginBottom: 40,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  locationHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  linkText: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  locationSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    paddingHorizontal: 24,
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: Colors.light.text,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  mapContainer: {
    height: 180,
    width: '100%',
    position: 'relative',
    backgroundColor: '#eae8e7',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 105, 83, 0.1)',
  },
  preparationContainer: {
    marginBottom: 40,
  },
  sectionHeading: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.light.text,
    marginBottom: 16,
  },
  prepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  prepIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eae8e7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  prepText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
  },
  actionsContainer: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 20,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    color: Colors.light.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  paymentCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    marginBottom: 32,
  },
  paymentIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentStatusText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  payButton: {
    backgroundColor: '#006953',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  payButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  }
});