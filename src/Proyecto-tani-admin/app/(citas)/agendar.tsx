import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAdminStore } from '@/stores/adminMothers';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

const PRIMARY = '#006953';
const TEXT = '#1b1c1c';
const TEXT_SECONDARY = '#3e4945';

const CITAS_TYPES = [
  { id: 'LACTANCIA', label: 'Asesoría Lactancia', color: '#006953', icon: 'happy-outline' },
  { id: 'PIEL A PIEL', label: 'Sesión Piel a Piel', color: '#C5A059', icon: 'people-outline' },
  { id: 'CRED', label: 'Control CRED', color: '#499F86', icon: 'calendar-outline' },
  { id: 'DESARROLLO', label: 'Ev. Desarrollo', color: '#9b4500', icon: 'analytics-outline' },
  { id: 'MÉDICO', label: 'Médico Especialista', color: '#c62828', icon: 'medkit-outline' }
];

export default function AdminAgendarCitaScreen() {
  const router = useRouter();
  const { mothers, addAppointment } = useAdminStore();

  const [selectedMotherId, setSelectedMotherId] = useState('');
  const [selectedBabyId, setSelectedBabyId] = useState('');
  const [selectedType, setSelectedType] = useState('CRED');
  const [doctor, setDoctor] = useState('');
  const [establishment, setEstablishment] = useState('Tani Center - Sede Principal');
  const [amount, setAmount] = useState('S/. 30.00');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notes, setNotes] = useState('');

  // Dropdown states
  const [showMothersDropdown, setShowMothersDropdown] = useState(false);
  const [showBabiesDropdown, setShowBabiesDropdown] = useState(false);

  const selectedMother = mothers.find(m => m.id === selectedMotherId);
  const selectedBaby = selectedMother?.babies.find(b => b.id === selectedBabyId);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const newDate = new Date(date);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setDate(newDate);
    }
  };

  const onTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDate(newDate);
    }
  };

  const handleSave = () => {
    if (!selectedMotherId) {
      Alert.alert('Campo Obligatorio', 'Por favor selecciona una Madre.');
      return;
    }
    if (!selectedBabyId) {
      Alert.alert('Campo Obligatorio', 'Por favor selecciona un Bebé.');
      return;
    }
    if (!doctor.trim()) {
      Alert.alert('Campo Obligatorio', 'Por favor ingresa el nombre del especialista.');
      return;
    }

    // Formatear fecha y hora legible (ej: "22 May, 03:45 PM")
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    const formattedTime = `${day} ${month}, ${hours}:${minutes} ${ampm}`;

    // Obtener color e ícono correspondientes
    const activeType = CITAS_TYPES.find(t => t.id === selectedType) || CITAS_TYPES[2];

    addAppointment({
      motherId: selectedMotherId,
      babyId: selectedBabyId,
      tipo: selectedType,
      color: activeType.color,
      titulo: activeType.label,
      hora: formattedTime,
      lugar: establishment,
      nota: notes.trim() ? notes : null,
      tipoIcon: activeType.icon,
      doctor: doctor.trim(),
      pagoEstado: 'Pendiente', // El flujo inicial se agenda como Pendiente de Pago
      pagoMonto: amount.trim(),
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Cita Guardada', 'La cita multidisciplinaria ha sido registrada correctamente en el calendario del paciente.', [
      {
        text: 'Aceptar',
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agendar Cita Multidisciplinaria</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Selector de Madre */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Seleccionar Madre / Familia *</Text>
          <TouchableOpacity 
            style={styles.dropdownSelector}
            onPress={() => {
              setShowMothersDropdown(!showMothersDropdown);
              setShowBabiesDropdown(false);
            }}
          >
            <Text style={[styles.selectorText, !selectedMother && { color: TEXT_SECONDARY }]}>
              {selectedMother ? `${selectedMother.name} ${selectedMother.surname} (DNI: ${selectedMother.dni})` : 'Selecciona una madre de la base de datos...'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={TEXT_SECONDARY} />
          </TouchableOpacity>

          {showMothersDropdown && (
            <View style={styles.dropdownList}>
              {mothers.map(mother => (
                <TouchableOpacity
                  key={mother.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedMotherId(mother.id);
                    setSelectedBabyId(''); // Resetear bebe
                    setShowMothersDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{mother.name} {mother.surname} (DNI: {mother.dni})</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Selector de Bebé */}
        {selectedMother && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Seleccionar Bebé Paciente *</Text>
            <TouchableOpacity 
              style={styles.dropdownSelector}
              onPress={() => {
                setShowBabiesDropdown(!showBabiesDropdown);
                setShowMothersDropdown(false);
              }}
            >
              <Text style={[styles.selectorText, !selectedBaby && { color: TEXT_SECONDARY }]}>
                {selectedBaby ? `${selectedBaby.name} (${selectedBaby.weightText})` : 'Seleccionar bebé asociado...'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={TEXT_SECONDARY} />
            </TouchableOpacity>

            {showBabiesDropdown && (
              <View style={styles.dropdownList}>
                {selectedMother.babies.map(baby => (
                  <TouchableOpacity
                    key={baby.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedBabyId(baby.id);
                      setShowBabiesDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{baby.name} (Peso: {baby.weightText})</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Selector de Tipo de Cita */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Especialidad de la Consulta *</Text>
          <View style={styles.typeGrid}>
            {CITAS_TYPES.map(type => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeCard,
                  selectedType === type.id && { backgroundColor: type.color, borderColor: type.color }
                ]}
                onPress={() => {
                  setSelectedType(type.id);
                  // Autocompletar especialista sugerido
                  if (type.id === 'LACTANCIA' || type.id === 'PIEL A PIEL') setDoctor('Lic. Gladys Torres');
                  else if (type.id === 'CRED') setDoctor('Dr. Ramírez');
                  else if (type.id === 'DESARROLLO') setDoctor('Dr. Alejandro Peña');
                  else if (type.id === 'MÉDICO') setDoctor('Dra. Patricia Valdivia');
                }}
              >
                <Ionicons 
                  name={type.icon as any} 
                  size={20} 
                  color={selectedType === type.id ? '#FFF' : type.color} 
                />
                <Text style={[
                  styles.typeLabel,
                  selectedType === type.id && { color: '#FFF' }
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Formulario de Especialista, Establecimiento y Monto */}
        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Especialista / Médico Tratante *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color={TEXT_SECONDARY} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre del médico o terapeuta..."
                placeholderTextColor={TEXT_SECONDARY}
                value={doctor}
                onChangeText={setDoctor}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Sede / Establecimiento *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="business-outline" size={20} color={TEXT_SECONDARY} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Lugar de atención"
                placeholderTextColor={TEXT_SECONDARY}
                value={establishment}
                onChangeText={setEstablishment}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Costo del Servicio (S/.) *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="cash-outline" size={20} color={TEXT_SECONDARY} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Monto a pagar"
                placeholderTextColor={TEXT_SECONDARY}
                value={amount}
                onChangeText={setAmount}
              />
            </View>
          </View>
        </View>

        {/* Date and Time Pickers */}
        <View style={styles.rowCards}>
          <TouchableOpacity style={styles.halfCard} onPress={() => setShowDatePicker(true)}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="calendar-outline" size={20} color={PRIMARY} />
              <Text style={styles.cardLabel}>Fecha</Text>
            </View>
            <Text style={styles.dateTimeText}>
              {date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.halfCard} onPress={() => setShowTimePicker(true)}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="time-outline" size={20} color={PRIMARY} />
              <Text style={styles.cardLabel}>Hora</Text>
            </View>
            <Text style={styles.dateTimeText}>
              {date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true })}
            </Text>
          </TouchableOpacity>
        </View>

        {/* DateTimePicker components */}
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

        {/* Notes */}
        <View style={styles.formCard}>
          <Text style={styles.inputLabel}>Motivo de Consulta / Indicaciones Iniciales</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Instrucciones clínicas, documentos de control que debe traer la madre..."
            placeholderTextColor={TEXT_SECONDARY}
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="checkmark-circle" size={22} color="#FFF" />
          <Text style={styles.saveButtonText}>Guardar y Programar Cita</Text>
        </TouchableOpacity>

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
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    backgroundColor: '#FFF',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f5f3f3',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PRIMARY,
  },
  content: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT,
    marginBottom: 8,
  },
  dropdownSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#eae8e7',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  selectorText: {
    fontSize: 14,
    color: TEXT,
    flex: 1,
  },
  dropdownList: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#eae8e7',
    borderRadius: 12,
    marginTop: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f3f3',
  },
  dropdownItemText: {
    fontSize: 14,
    color: TEXT,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeCard: {
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 6,
    flexDirection: 'row',
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: TEXT,
  },
  formCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    marginBottom: 20,
    gap: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f3f3',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: TEXT,
  },
  rowCards: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  halfCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    gap: 8,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: TEXT_SECONDARY,
  },
  dateTimeText: {
    fontSize: 14,
    fontWeight: '800',
    color: TEXT,
    backgroundColor: '#f5f3f3',
    paddingVertical: 8,
    borderRadius: 8,
    textAlign: 'center',
    overflow: 'hidden',
  },
  textArea: {
    backgroundColor: '#f5f3f3',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: TEXT,
    minHeight: 80,
  },
  saveButton: {
    backgroundColor: PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 20,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});