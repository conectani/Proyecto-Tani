import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { AnimatedButton } from '@/constants/animations';
import { useAuthStore } from '@/stores/auth';
import { useAppointmentStore } from '@/stores/appointments';

export default function AnadirNotaScreen() {
  const router = useRouter();
  const { appointmentId } = useLocalSearchParams<{ appointmentId: string }>();

  const { user } = useAuthStore();
  const { appointments, addNote, notes } = useAppointmentStore();

  const linkedAppointment = appointments.find((a) => a.id === appointmentId);

  const [priority, setPriority] = useState<'normal' | 'important'>('normal');
  const [mood, setMood] = useState<string | null>(null);
  
  // Lista de detalles dinámica
  const [items, setItems] = useState<Array<{ id: string; text: string; completed: boolean }>>([
    { id: '1', text: '', completed: false }
  ]);

  const MOODS = [
    { key: 'great',  emoji: '😊', label: 'Bien',    color: '#006953' },
    { key: 'ok',     emoji: '😐', label: 'Normal',  color: '#765b00' },
    { key: 'tired',  emoji: '😴', label: 'Cansada', color: '#3e4945' },
    { key: 'sad',    emoji: '😢', label: 'Triste',  color: '#9b4500' },
    { key: 'mom',    emoji: '🤱', label: 'Mamá',    color: '#499F86' },
  ];

  const handleAddItem = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setItems([...items, { id: Date.now().toString(), text: '', completed: false }]);
  };

  const handleTextChange = (id: string, text: string) => {
    setItems(items.map(item => item.id === id ? { ...item, text } : item));
  };

  const handleToggleComplete = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setItems(items.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const handleRemoveItem = (id: string) => {
    if (items.length === 1) return; // Mantener al menos uno
    setItems(items.filter(item => item.id !== id));
  };

  const handleSave = () => {
    // Validar que al menos haya un detalle con texto
    const validItems = items.filter(item => item.text.trim() !== '');
    if (validItems.length === 0) {
      Alert.alert('Falta Información', 'Por favor ingresa al menos un síntoma o pregunta.');
      return;
    }

    if (!appointmentId) {
      Alert.alert('Error', 'No se ha proporcionado una cita vinculada válida.');
      return;
    }

    addNote({
      appointmentId,
      mood,
      priority,
      details: validItems,
      date: new Date().toISOString().split('T')[0],
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Nota Guardada', 'La nota ha sido asociada a tu cita correctamente.', [
      { text: 'Aceptar', onPress: () => router.back() }
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
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <Image 
            source={require('@/assets/images/Tani user icon.png')}
            style={styles.profileImage}
          />
          <Text style={styles.headerProfileText} numberOfLines={1}>{getHeaderName()}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Agregar Nota</Text>
          <Text style={styles.pageSubtitle}>Registra síntomas o preguntas para tu próxima consulta.</Text>
        </View>

        {/* Estado de Ánimo */}
        <View style={styles.moodSection}>
          <Text style={styles.sectionLabel}>¿Cómo te sientes hoy?</Text>
          <View style={styles.moodRow}>
            {MOODS.map(m => (
              <TouchableOpacity
                key={m.key}
                style={[
                  styles.moodBtn,
                  mood === m.key && { borderColor: m.color, backgroundColor: m.color + '18' },
                ]}
                onPress={() => { setMood(m.key); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
              >
                <Text style={styles.moodEmoji}>{m.emoji}</Text>
                <Text style={[styles.moodLabel, mood === m.key && { color: m.color, fontWeight: '700' }]}>
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Cita vinculada */}
        {linkedAppointment && (
          <View style={styles.appointmentCard}>
            <View style={styles.iconCircle}>
              <Ionicons name="calendar" size={20} color={Colors.light.primary} />
            </View>
            <View style={styles.appointmentInfo}>
              <Text style={styles.appointmentEyebrow}>CITA VINCULADA</Text>
              <Text style={styles.appointmentTitle}>{linkedAppointment.titulo}</Text>
              <View style={styles.appointmentDetailRow}>
                <Ionicons name="time-outline" size={14} color={Colors.light.textSecondary} />
                <Text style={styles.appointmentDetailText}>{linkedAppointment.hora}</Text>
              </View>
              <View style={styles.appointmentDetailRow}>
                <Ionicons name="location-outline" size={14} color={Colors.light.textSecondary} />
                <Text style={styles.appointmentDetailText}>{linkedAppointment.lugar}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Checklist Area */}
        <View style={styles.checklistSection}>
          <Text style={styles.sectionLabel}>Detalles / Lista de chequeo</Text>
          <View style={styles.checklistCard}>
            
            {items.map((item, idx) => (
              <View key={item.id} style={styles.checklistItem}>
                <TouchableOpacity onPress={() => handleToggleComplete(item.id)}>
                  <View style={[styles.checkbox, item.completed && styles.checkboxActive]}>
                    {item.completed && <Ionicons name="checkmark" size={16} color={Colors.light.text} />}
                  </View>
                </TouchableOpacity>
                <TextInput 
                  style={[styles.checklistInput, item.completed && styles.textCompleted]}
                  placeholder={idx === 0 ? "Escribe un síntoma o pregunta importante..." : "Añadir otro detalle..."}
                  placeholderTextColor="rgba(62, 73, 69, 0.5)"
                  value={item.text}
                  onChangeText={(text) => handleTextChange(item.id, text)}
                />
                {items.length > 1 && (
                  <TouchableOpacity onPress={() => handleRemoveItem(item.id)} style={styles.removeBtn}>
                    <Ionicons name="trash-outline" size={20} color="#ba1a1a" />
                  </TouchableOpacity>
                )}
              </View>
            ))}

            <TouchableOpacity style={styles.addMoreBtn} onPress={handleAddItem}>
              <Ionicons name="add-circle-outline" size={20} color={Colors.light.primary} />
              <Text style={styles.addMoreText}>Añadir ítem a la lista</Text>
            </TouchableOpacity>

          </View>
        </View>

        {/* Priority Area */}
        <View style={styles.prioritySection}>
          <Text style={styles.sectionLabel}>Prioridad</Text>
          <View style={styles.priorityChips}>
            
            <TouchableOpacity 
              style={[
                styles.chip, 
                priority === 'normal' && styles.chipNormalActive
              ]}
              onPress={() => setPriority('normal')}
            >
              <Ionicons 
                name="checkmark" 
                size={16} 
                color={priority === 'normal' ? '#002018' : Colors.light.textSecondary} 
              />
              <Text style={[
                styles.chipText,
                priority === 'normal' && styles.chipTextActiveNormal
              ]}>Normal</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.chip, 
                priority === 'important' && styles.chipImportantActive
              ]}
              onPress={() => setPriority('important')}
            >
              <Ionicons 
                name="alert" 
                size={16} 
                color={priority === 'important' ? '#612900' : Colors.light.textSecondary} 
              />
              <Text style={[
                styles.chipText,
                priority === 'important' && styles.chipTextActiveImportant
              ]}>Importante</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.priorityHint}>Las notas importantes se resaltarán durante tu consulta.</Text>
        </View>

      </ScrollView>

      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        <AnimatedButton
          containerStyle={styles.fab}
          onPress={handleSave}
          scaleValue={0.97}
        >
          <Ionicons name="save" size={20} color="#FFF" />
          <Text style={styles.fabText}>Guardar Nota</Text>
        </AnimatedButton>
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
  backButton: {
    padding: 8,
    marginLeft: -8,
    borderRadius: 20,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    justifyContent: 'flex-end',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 105, 83, 0.2)',
  },
  headerProfileText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.primary,
    maxWidth: 150,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 120, // Space for FAB
  },
  titleSection: {
    marginBottom: 32,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.light.text,
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    opacity: 0.8,
  },
  appointmentCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(190, 201, 195, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(40, 130, 107, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentEyebrow: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.primary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  appointmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  appointmentDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  appointmentDetailText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  checklistSection: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 12,
  },
  checklistCard: {
    backgroundColor: '#eae8e7',
    borderRadius: 24,
    padding: 20,
    gap: 16,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(62, 73, 69, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  checkboxActive: {
    borderColor: Colors.light.text,
    backgroundColor: '#eae8e7',
  },
  checklistInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  textCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  removeBtn: {
    padding: 4,
  },
  addMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    paddingVertical: 4,
  },
  addMoreText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  prioritySection: {
    marginBottom: 32,
  },
  moodSection: {
    marginBottom: 28,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 8,
  },
  moodBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#f5f3f3',
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 4,
  },
  moodEmoji: {
    fontSize: 22,
  },
  moodLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6e7a74',
  },
  priorityChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#Fbf9f8',
    borderWidth: 1,
    borderColor: 'rgba(190, 201, 195, 0.3)',
  },
  chipNormalActive: {
    backgroundColor: '#9df3d7',
    borderColor: '#9df3d7',
  },
  chipImportantActive: {
    backgroundColor: '#ff7f27',
    borderColor: '#ff7f27',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.textSecondary,
  },
  chipTextActiveNormal: {
    color: '#002018',
  },
  chipTextActiveImportant: {
    color: '#612900',
  },
  priorityHint: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    opacity: 0.7,
    marginTop: 4,
    marginLeft: 4,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 32,
    paddingTop: 40,
    backgroundColor: 'rgba(251, 249, 248, 0.9)',
    alignItems: 'center',
  },
  fab: {
    flexDirection: 'row',
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 6,
  },
  fabText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});