import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const PROFILE_IMG = require('@/assets/images/Tani user icon.png');

const DAYS = [
  { day: 'Lun', date: '13', active: false, past: true },
  { day: 'Mar', date: '14', active: true, dot: true },
  { day: 'Mié', date: '15', active: false },
  { day: 'Jue', date: '16', active: false },
  { day: 'Vie', date: '17', active: false },
];

const CITAS = [
  {
    tipo: 'TANI CONSULTORÍA',
    color: '#499F86',
    titulo: 'Control Prenatal de Rutina',
    hora: '14 May, 09:30 AM',
    lugar: 'Tani Center - Sede Principal',
    nota: null,
    tipoIcon: 'calendar-outline',
  },
  {
    tipo: 'CITA EXTERNA',
    color: '#765b00',
    titulo: 'Ecografía Morfológica',
    hora: '16 May, 11:00 AM',
    lugar: 'Clínica San Felipe',
    nota: 'Preguntar por los resultados del examen de sangre anterior.',
    tipoIcon: 'calendar-number-outline',
  },
  {
    tipo: 'PEDIATRÍA',
    color: '#9b4500',
    titulo: 'Vacunación 2 Meses',
    hora: '22 May, 03:45 PM',
    lugar: 'Centro de Salud Miraflores',
    nota: null,
    tipoIcon: 'medical-outline',
  },
];

export default function CitasScreen() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState(1);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarWrap}>
            <Image source={PROFILE_IMG} style={styles.avatar} />
          </View>
          <Text style={styles.headerName}>(Apellido)</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/(citas)/agendar')}>
            <Ionicons name="calendar-outline" size={23} color="#499F86" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/notificaciones')}>
            <Ionicons name="notifications-outline" size={23} color="#499F86" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Título */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Citas y Seguimiento</Text>
          <Text style={styles.subtitle}>Organiza tu bienestar y el de tu bebé.</Text>
        </View>

        {/* Calendar strip */}
        <View style={styles.calSection}>
          <TouchableOpacity style={styles.monthRow}>
            <Text style={styles.monthText}>Mayo 2024</Text>
            <Ionicons name="chevron-down" size={18} color="#3e4945" />
          </TouchableOpacity>
          <View style={styles.daysRow}>
            {DAYS.map((d, i) => (
              <TouchableOpacity
                key={`${d.day}-${d.date}`}
                style={[
                  styles.dayPill,
                  d.active && styles.dayPillActive,
                  d.past && styles.dayPillPast,
                  selectedDay === i && !d.active && styles.dayPillSelected,
                ]}
                onPress={() => setSelectedDay(i)}
              >
                <Text style={[styles.dayLabel, (d.active) && styles.dayLabelActive, d.past && styles.dayLabelPast]}>
                  {d.day}
                </Text>
                <Text style={[styles.dayNum, (d.active) && styles.dayNumActive, d.past && styles.dayLabelPast]}>
                  {d.date}
                </Text>
                {d.dot && <View style={styles.dot} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Mi Calendario */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Mi Calendario</Text>
          <Text style={styles.listSub}>Próximas citas</Text>
        </View>

        {/* Citas */}
        {CITAS.map((cita, i) => (
          <TouchableOpacity
            key={cita.titulo + '-' + i}
            style={[styles.citaCard, { borderLeftColor: cita.color }]}
            onPress={() => router.push('/(citas)/detalle')}
            activeOpacity={0.9}
          >
            <View style={styles.citaTop}>
              <View style={styles.citaInfo}>
                <Text style={[styles.citaTipo, { color: cita.color }]}>{cita.tipo}</Text>
                <Text style={styles.citaTitulo}>{cita.titulo}</Text>
                <View style={styles.citaMeta}>
                  <Ionicons name="time-outline" size={13} color="#6e7a74" />
                  <Text style={styles.citaMetaText}>{cita.hora}</Text>
                </View>
                <View style={styles.citaMeta}>
                  <Ionicons name="location-outline" size={13} color="#6e7a74" />
                  <Text style={styles.citaMetaText}>{cita.lugar}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.editBtn}>
                <Ionicons name="create-outline" size={19} color="#1b1c1c" />
              </TouchableOpacity>
            </View>

            {cita.nota && (
              <View style={styles.notaBox}>
                <Ionicons name="document-text-outline" size={14} color="#6e7a74" />
                <Text style={styles.notaText}>{cita.nota}</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.addNota}
              onPress={() => router.push('/(notas)/anadir')}
            >
              <Ionicons name="add-circle-outline" size={15} color={cita.color} />
              <Text style={[styles.addNotaText, { color: cita.color }]}>
                {cita.nota ? 'Editar notas' : 'Agregar nota para esta cita'}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/(citas)/agendar')}>
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fbf9f8' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#fbf9f8',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarWrap: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden' },
  avatar: { width: '100%', height: '100%' },
  headerName: { fontSize: 18, fontWeight: '700', color: '#499F86' },
  headerRight: { flexDirection: 'row', gap: 4 },
  iconBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  content: { paddingHorizontal: 24, paddingTop: 4 },
  titleSection: { marginBottom: 20 },
  title: { fontSize: 30, fontWeight: '800', color: '#1b1c1c', letterSpacing: -0.5, marginBottom: 4 },
  subtitle: { fontSize: 14, fontWeight: '500', color: '#3e4945' },
  calSection: { marginBottom: 24 },
  monthRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  monthText: { fontSize: 15, fontWeight: '700', color: '#1b1c1c' },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayPill: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
    backgroundColor: '#f5f3f3',
    minWidth: 56,
  },
  dayPillActive: {
    backgroundColor: '#499F86',
    shadowColor: '#499F86',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  dayPillPast: { opacity: 0.4 },
  dayPillSelected: { backgroundColor: '#eae8e7' },
  dayLabel: { fontSize: 10, fontWeight: '800', color: '#1b1c1c', textTransform: 'uppercase', marginBottom: 4 },
  dayLabelActive: { color: '#FFF' },
  dayLabelPast: { color: '#6e7a74' },
  dayNum: { fontSize: 18, fontWeight: '800', color: '#1b1c1c' },
  dayNumActive: { color: '#FFF' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#FFF', marginTop: 4 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 },
  listTitle: { fontSize: 20, fontWeight: '700', color: '#1b1c1c' },
  listSub: { fontSize: 13, fontWeight: '600', color: '#499F86' },
  citaCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    borderLeftWidth: 4,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  citaTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  citaInfo: { flex: 1, paddingRight: 12 },
  citaTipo: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, marginBottom: 6, textTransform: 'uppercase' },
  citaTitulo: { fontSize: 18, fontWeight: '700', color: '#1b1c1c', marginBottom: 8, lineHeight: 22 },
  citaMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  citaMetaText: { fontSize: 13, color: '#3e4945' },
  editBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#f5f3f3',
    justifyContent: 'center', alignItems: 'center',
  },
  notaBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: '#f5f3f3',
    borderRadius: 12, padding: 12, marginBottom: 12,
  },
  notaText: { flex: 1, fontSize: 12, color: '#1b1c1c', lineHeight: 18 },
  addNota: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingTop: 12,
    borderTopWidth: 1, borderTopColor: 'rgba(190,201,195,0.2)',
  },
  addNotaText: { fontSize: 12, fontWeight: '700' },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#499F86',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#499F86',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
});