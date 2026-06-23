import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Image, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useBabyStore } from '@/stores/babies';
import { useAppointmentStore } from '@/stores/appointments';
import { useAuthStore } from '@/stores/auth';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

export default function AgendarCitaScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { babies, activeBabyId } = useBabyStore();
  const { addAppointment } = useAppointmentStore();

  const activeBaby = babies.find((b) => b.id === activeBabyId) || babies[0];

  const [specialty, setSpecialty] = useState('');
  const [establishment, setEstablishment] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [notes, setNotes] = useState('');
  const [doctor, setDoctor] = useState('');

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const currentDate = selectedDate;
      // Combinamos la fecha seleccionada con la hora actual en el estado
      const newDate = new Date(date);
      newDate.setFullYear(currentDate.getFullYear());
      newDate.setMonth(currentDate.getMonth());
      newDate.setDate(currentDate.getDate());
      setDate(newDate);
    }
  };

  const onTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      const currentTime = selectedTime;
      const newDate = new Date(date);
      newDate.setHours(currentTime.getHours());
      newDate.setMinutes(currentTime.getMinutes());
      setDate(newDate);
    }
  };

  const handleSave = () => {
    if (!specialty.trim()) {
      Alert.alert('Campo Obligatorio', 'Por favor ingresa la especialidad o sesión.');
      return;
    }
    if (!establishment.trim()) {
      Alert.alert('Campo Obligatorio', 'Por favor ingresa el establecimiento.');
      return;
    }

    // Formatear fecha y hora legible (ej: "24 Oct, 10:30 AM")
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // el número 0 debe ser 12
    const formattedTime = `${day} ${month}, ${hours}:${minutes} ${ampm}`;

    // Determinar color e ícono según la especialidad
    let color = '#499F86'; // Primario por defecto
    let tipoIcon = 'calendar-outline';
    let tipo = 'CITA EXTERNA';

    const specialtyLower = specialty.toLowerCase();
    if (specialtyLower.includes('pediat') || specialtyLower.includes('niñ') || specialtyLower.includes('vacun')) {
      color = '#9b4500';
      tipoIcon = 'medical-outline';
      tipo = 'PEDIATRÍA';
    } else if (specialtyLower.includes('rutina') || specialtyLower.includes('tani') || specialtyLower.includes('control')) {
      color = '#499F86';
      tipoIcon = 'calendar-outline';
      tipo = 'TANI CONSULTORÍA';
    } else {
      color = '#765b00';
      tipoIcon = 'calendar-number-outline';
    }

    addAppointment({
      tipo,
      color,
      titulo: specialty,
      hora: formattedTime,
      lugar: establishment,
      nota: notes.trim() ? notes : null,
      tipoIcon,
      bebeId: activeBaby?.id || 'baby-1',
      doctor: doctor.trim() ? doctor : undefined,
    });

    Alert.alert('Cita Guardada', 'La cita se ha registrado correctamente en tu calendario.', [
      {
        text: 'Aceptar',
        onPress: () => router.back(),
      },
    ]);
  };

  const getHeaderName = () => {
    if (user) return `${user.name} ${user.surname}`;
    return 'Mariana Sofia Garcia';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
          </TouchableOpacity>
          <View style={styles.profileBadge}>
            <Image 
              source={require('@/assets/images/Tani user icon.png')}
              style={styles.profileImage}
            />
            <Text style={styles.profileText} numberOfLines={1}>{getHeaderName()}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Agendar Cita</Text>
          <Text style={styles.pageSubtitle}>Registra una nueva consulta médica o terapia para {activeBaby?.name}.</Text>
        </View>

        {/* Input Cards */}
        <View style={styles.cardContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Especialidad o Sesión *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="medical-outline" size={20} color={Colors.light.textSecondary} style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                placeholder="Ej. Terapia Física, Pediatría"
                placeholderTextColor={Colors.light.textSecondary}
                value={specialty}
                onChangeText={setSpecialty}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Establecimiento o Sede *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="business-outline" size={20} color={Colors.light.textSecondary} style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                placeholder="Nombre de la clínica o consultorio"
                placeholderTextColor={Colors.light.textSecondary}
                value={establishment}
                onChangeText={setEstablishment}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Especialista / Médico (Opcional)</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color={Colors.light.textSecondary} style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                placeholder="Nombre del médico tratante"
                placeholderTextColor={Colors.light.textSecondary}
                value={doctor}
                onChangeText={setDoctor}
              />
            </View>
          </View>
        </View>

        {/* Date and Time Pickers */}
        <View style={styles.rowCards}>
          <TouchableOpacity style={styles.halfCard} onPress={() => setShowDatePicker(true)}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="calendar-outline" size={20} color={Colors.light.primary} />
              <Text style={styles.cardLabel}>Fecha</Text>
            </View>
            <Text style={styles.dateTimeText}>
              {date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.halfCard} onPress={() => setShowTimePicker(true)}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="time-outline" size={20} color={Colors.light.primary} />
              <Text style={styles.cardLabel}>Hora</Text>
            </View>
            <Text style={styles.dateTimeText}>
              {date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true })}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Native DateTimePicker components */}
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={date}
            mode="time"
            display="default"
            onChange={onTimeChange}
          />
        )}

        {/* Recurrence */}
        <View style={styles.recurrenceCard}>
          <View style={styles.recurrenceHeader}>
            <View style={styles.recurrenceLeft}>
              <View style={styles.iconCircle}>
                <Ionicons name="sync-outline" size={20} color="#763300" />
              </View>
              <View>
                <Text style={styles.recurrenceTitle}>Repetir cita</Text>
                <Text style={styles.recurrenceSubtitle}>Configura recordatorios periódicos</Text>
              </View>
            </View>
            <Switch 
              value={repeat} 
              onValueChange={setRepeat} 
              trackColor={{ false: '#e4e2e1', true: Colors.light.primary }}
              thumbColor="#FFF"
            />
          </View>

          {repeat && (
            <View style={styles.recurrenceSelector}>
              <Text style={styles.mockSelectText}>Semanalmente</Text>
              <Ionicons name="chevron-down" size={20} color={Colors.light.textSecondary} />
            </View>
          )}
        </View>

        {/* Notes */}
        <View style={styles.notesCard}>
          <Text style={styles.inputLabel}>Notas adicionales</Text>
          <TextInput 
            style={styles.textArea}
            placeholder="Instrucciones especiales, documentos a llevar..."
            placeholderTextColor={Colors.light.textSecondary}
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            textAlignVertical="top"
          />
        </View>

      </ScrollView>

      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={handleSave}>
          <Ionicons name="checkmark-circle" size={24} color="#FFF" />
          <Text style={styles.fabText}>Guardar Cita</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'rgba(251, 249, 248, 0.9)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#f5f3f3',
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 8,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  profileText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.primary,
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 100,
  },
  titleSection: {
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.light.text,
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },
  cardContainer: {
    backgroundColor: '#f5f3f3',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    gap: 20,
  },
  inputGroup: {},
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eae8e7',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.light.text,
  },
  rowCards: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  halfCard: {
    flex: 1,
    backgroundColor: '#f5f3f3',
    borderRadius: 24,
    padding: 20,
    gap: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  dateTimeText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    backgroundColor: '#eae8e7',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    textAlign: 'center',
    overflow: 'hidden',
  },
  recurrenceCard: {
    backgroundColor: '#f5f3f3',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
  },
  recurrenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recurrenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffdbc9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recurrenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  recurrenceSubtitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  recurrenceSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    backgroundColor: '#eae8e7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  mockSelectText: {
    fontSize: 15,
    color: Colors.light.text,
  },
  notesCard: {
    backgroundColor: '#f5f3f3',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
  },
  textArea: {
    backgroundColor: '#eae8e7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.light.text,
    minHeight: 100,
    marginTop: 8,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 32,
    backgroundColor: 'rgba(251, 249, 248, 0.9)',
    alignItems: 'center',
  },
  fab: {
    flexDirection: 'row',
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  fabText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});