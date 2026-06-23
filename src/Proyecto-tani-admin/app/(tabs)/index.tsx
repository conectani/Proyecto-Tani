import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAdminStore, calculateAgeInMonths } from '@/stores/adminMothers';
import { useAuthStore } from '@/stores/auth';

const PRIMARY = '#006953';
const TEXT = '#1b1c1c';
const TEXT_SECONDARY = '#3e4945';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { mothers, appointments, announcements, loadAdminData } = useAdminStore();

  React.useEffect(() => {
    loadAdminData();
  }, []);

  // Calcular métricas
  const totalMothers = mothers.length;
  
  // Citas de hoy (22 May 2026 es nuestra fecha simulada)
  const todayAppointments = appointments.filter(a => a.hora.includes('22 May'));
  
  // Pagos pendientes por verificar
  const pendingPayments = appointments.filter(a => a.pagoEstado === 'Verificando');

  // Distribución de bebés por edad
  let cat_0_3 = 0;
  let cat_4_6 = 0;
  let cat_7_12 = 0;
  let cat_12_plus = 0;

  mothers.forEach(m => {
    m.babies.forEach(b => {
      const age = calculateAgeInMonths(b.birthDate);
      if (age <= 3) cat_0_3++;
      else if (age <= 6) cat_4_6++;
      else if (age <= 12) cat_7_12++;
      else cat_12_plus++;
    });
  });

  const getClinicGreeting = () => {
    if (user) return `Hola, ${user.name}`;
    return 'Hola, Administrador';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>{getClinicGreeting()}</Text>
          <Text style={styles.headerSubtitle}>{user?.role || 'Personal de TANI'}</Text>
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={() => {
          useAuthStore.getState().logout();
          router.replace('/(auth)/login');
        }}>
          <Ionicons name="log-out-outline" size={24} color="#c62828" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Banner de Bienvenida */}
        <View style={styles.welcomeBanner}>
          <Text style={styles.bannerTitle}>Centro de Monitoreo TANI</Text>
          <Text style={styles.bannerText}>
            Gestiona citas médicas, verifica transferencias y envía anuncios de crianza de forma oportuna.
          </Text>
        </View>

        {/* Bento Grid de Métricas */}
        <Text style={styles.sectionTitle}>Métricas de la ONG</Text>
        <View style={styles.bentoGrid}>
          {/* Fila 1 */}
          <View style={styles.bentoRow}>
            <TouchableOpacity style={styles.bentoCard} onPress={() => router.push('/madres' as any)}>
              <View style={[styles.iconBox, { backgroundColor: '#e6f3ef' }]}>
                <Ionicons name="people" size={24} color={PRIMARY} />
              </View>
              <Text style={styles.bentoValue}>{totalMothers}</Text>
              <Text style={styles.bentoLabel}>Madres Registradas</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.bentoCard} onPress={() => router.push('/pagos' as any)}>
              <View style={[styles.iconBox, { backgroundColor: '#ffebee' }]}>
                <Ionicons name="card" size={24} color="#c62828" />
              </View>
              <Text style={[styles.bentoValue, { color: '#c62828' }]}>{pendingPayments.length}</Text>
              <Text style={styles.bentoLabel}>Pagos por Verificar</Text>
            </TouchableOpacity>
          </View>

          {/* Fila 2 */}
          <View style={styles.bentoRow}>
            <View style={styles.bentoCard}>
              <View style={[styles.iconBox, { backgroundColor: '#fff8e1' }]}>
                <Ionicons name="calendar" size={24} color="#765b00" />
              </View>
              <Text style={[styles.bentoValue, { color: '#765b00' }]}>{todayAppointments.length}</Text>
              <Text style={styles.bentoLabel}>Citas para Hoy</Text>
            </View>

            <View style={styles.bentoCard}>
              <View style={[styles.iconBox, { backgroundColor: '#fff3e0' }]}>
                <Ionicons name="megaphone" size={24} color="#9b4500" />
              </View>
              <Text style={[styles.bentoValue, { color: '#9b4500' }]}>{announcements.length}</Text>
              <Text style={styles.bentoLabel}>Anuncios Activos</Text>
            </View>
          </View>
        </View>

        {/* Distribución por Edades */}
        <Text style={styles.sectionTitle}>Bebés por Rango de Edad</Text>
        <View style={styles.ageDistributionCard}>
          <View style={styles.distRow}>
            <View style={styles.distItem}>
              <Text style={styles.distLabel}>0-3 meses</Text>
              <Text style={styles.distCount}>{cat_0_3}</Text>
            </View>
            <View style={styles.distItem}>
              <Text style={styles.distLabel}>4-6 meses</Text>
              <Text style={styles.distCount}>{cat_4_6}</Text>
            </View>
            <View style={styles.distItem}>
              <Text style={styles.distLabel}>7-12 meses</Text>
              <Text style={styles.distCount}>{cat_7_12}</Text>
            </View>
            <View style={styles.distItem}>
              <Text style={styles.distLabel}>12m+</Text>
              <Text style={styles.distCount}>{cat_12_plus}</Text>
            </View>
          </View>
        </View>

        {/* Accesos Rápidos */}
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/(citas)/agendar')}>
            <Ionicons name="calendar-outline" size={20} color="#FFF" />
            <Text style={styles.actionBtnText}>Agendar Cita</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#9b4500' }]} onPress={() => router.push('/anuncios' as any)}>
            <Ionicons name="megaphone-outline" size={20} color="#FFF" />
            <Text style={styles.actionBtnText}>Nuevo Anuncio</Text>
          </TouchableOpacity>
        </View>

        {/* Citas de Hoy */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Citas de Hoy (22 de Mayo)</Text>
        </View>

        {todayAppointments.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="calendar-outline" size={32} color={TEXT_SECONDARY} style={{ opacity: 0.5, marginBottom: 8 }} />
            <Text style={styles.emptyText}>No hay citas programadas para hoy.</Text>
          </View>
        ) : (
          todayAppointments.map((cita) => {
            const mom = mothers.find(m => m.id === cita.motherId);
            const baby = mom?.babies.find(b => b.id === cita.babyId);
            return (
              <View key={cita.id} style={[styles.citaCard, { borderLeftColor: cita.color }]}>
                <View style={styles.citaMain}>
                  <Text style={[styles.citaTipo, { color: cita.color }]}>{cita.tipo}</Text>
                  <Text style={styles.citaTitle}>{cita.titulo}</Text>
                  <Text style={styles.citaPatient}>Paciente: {baby?.name} (Madre: {mom?.name} {mom?.surname})</Text>
                  <View style={styles.metaRow}>
                    <Ionicons name="time-outline" size={14} color={TEXT_SECONDARY} />
                    <Text style={styles.metaText}>{cita.hora.split(',')[1] || cita.hora}</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Ionicons name="medkit-outline" size={14} color={TEXT_SECONDARY} />
                    <Text style={styles.metaText}>Médico: {cita.doctor || 'Por asignar'}</Text>
                  </View>
                </View>
                <View style={styles.citaStatus}>
                  <View style={[styles.statusBadge, 
                    cita.pagoEstado === 'Confirmado' && { backgroundColor: '#e6f3ef' },
                    cita.pagoEstado === 'Verificando' && { backgroundColor: '#fff8e1' },
                    cita.pagoEstado === 'Pendiente' && { backgroundColor: '#ffebee' }
                  ]}>
                    <Text style={[styles.statusBadgeText,
                      cita.pagoEstado === 'Confirmado' && { color: PRIMARY },
                      cita.pagoEstado === 'Verificando' && { color: '#765b00' },
                      cita.pagoEstado === 'Pendiente' && { color: '#c62828' }
                    ]}>
                      {cita.pagoEstado}
                    </Text>
                  </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerLeft: {
    flex: 1,
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
  iconButton: {
    padding: 8,
    backgroundColor: '#ffebee',
    borderRadius: 20,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  welcomeBanner: {
    backgroundColor: '#004d3c',
    borderRadius: 24,
    padding: 24,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  bannerText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 14,
    marginTop: 8,
  },
  bentoGrid: {
    gap: 12,
    marginBottom: 24,
  },
  bentoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  bentoCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  bentoValue: {
    fontSize: 28,
    fontWeight: '800',
    color: PRIMARY,
  },
  bentoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: TEXT_SECONDARY,
    marginTop: 4,
  },
  ageDistributionCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    marginBottom: 24,
  },
  distRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  distItem: {
    alignItems: 'center',
    flex: 1,
  },
  distLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: TEXT_SECONDARY,
    marginBottom: 6,
  },
  distCount: {
    fontSize: 20,
    fontWeight: '800',
    color: PRIMARY,
    backgroundColor: '#e6f3ef',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: TEXT_SECONDARY,
    fontSize: 14,
    fontWeight: '500',
  },
  citaCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    borderLeftWidth: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  citaMain: {
    flex: 1,
    paddingRight: 8,
  },
  citaTipo: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  citaTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 4,
  },
  citaPatient: {
    fontSize: 13,
    color: PRIMARY,
    fontWeight: '600',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  metaText: {
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
  citaStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
});