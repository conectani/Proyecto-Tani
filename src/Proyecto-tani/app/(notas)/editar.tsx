import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Platform, Alert } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '@/stores/auth';
import { useAppointmentStore } from '@/stores/appointments';

export default function EditarNotaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { user } = useAuthStore();
  const { notes, updateNote, appointments } = useAppointmentStore();

  const note = notes.find((n) => n.id === id) || notes[0];
  const linkedAppointment = note ? appointments.find((a) => a.id === note.appointmentId) : null;

  const [priority, setPriority] = useState<'normal' | 'important'>('normal');
  const [mood, setMood] = useState<string | null>(null);
  const [items, setItems] = useState<Array<{ id: string; text: string; completed: boolean }>>([]);

  useEffect(() => {
    if (note) {
      setPriority(note.priority);
      setMood(note.mood);
      setItems(note.details);
    }
  }, [note]);

  const handleAddItem = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setItems([...items, { id: Date.now().toString(), text: '', completed: false }]);
  };

  const handleTextChange = (itemId: string, text: string) => {
    setItems(items.map(item => item.id === itemId ? { ...item, text } : item));
  };

  const handleToggleComplete = (itemId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setItems(items.map(item => item.id === itemId ? { ...item, completed: !item.completed } : item));
  };

  const handleRemoveItem = (itemId: string) => {
    if (items.length === 1) return;
    setItems(items.filter(item => item.id !== itemId));
  };

  const handleSave = () => {
    const validItems = items.filter(item => item.text.trim() !== '');
    if (validItems.length === 0) {
      Alert.alert('Falta Información', 'Por favor ingresa al menos un síntoma o pregunta.');
      return;
    }

    if (!note) {
      Alert.alert('Error', 'La nota original no pudo ser cargada.');
      return;
    }

    updateNote(note.id, {
      mood,
      priority,
      details: validItems,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Cambios Guardados', 'La nota se ha actualizado correctamente.', [
      { text: 'Aceptar', onPress: () => router.back() }
    ]);
  };

  const getHeaderName = () => {
    if (user) return `${user.name} ${user.surname}`;
    return 'Mariana Sofia Garcia';
  };

  const MOODS = [
    { key: 'great',  emoji: '😊', label: 'Bien',    color: '#006953' },
    { key: 'ok',     emoji: '😐', label: 'Normal',  color: '#765b00' },
    { key: 'tired',  emoji: '😴', label: 'Cansada', color: '#3e4945' },
    { key: 'sad',    emoji: '😢', label: 'Triste',  color: '#9b4500' },
    { key: 'mom',    emoji: '🤱', label: 'Mamá',    color: '#499F86' },
  ];

  if (!note) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
          </TouchableOpacity>
          <Text style={styles.brandTitle}>Editar Nota</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Nota no encontrada</Text>
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
          <View style={styles.headerTitleGroup}>
            <Image 
              source={require('@/assets/images/Tani user icon.png')}
              style={styles.headerLogo}
            />
            <Text style={styles.brandTitle} numberOfLines={1}>{getHeaderName()}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Header Text */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Editar Nota</Text>
          <Text style={styles.pageSubtitle}>Actualiza los síntomas o preguntas para tu consulta</Text>
        </View>

        {/* Linked Appointment Card */}
        {linkedAppointment && (
          <View style={styles.appointmentCard}>
            <View style={styles.appointmentDeco} />
            <View style={styles.appointmentEyebrowRow}>
              <Ionicons name="link" size={16} color={Colors.light.primary} />
              <Text style={styles.appointmentEyebrow}>CITA VINCULADA</Text>
            </View>
            <Text style={styles.appointmentTitle}>{linkedAppointment.titulo}</Text>
            <View style={styles.appointmentDetailRow}>
              <Ionicons name="calendar-outline" size={14} color={Colors.light.textSecondary} opacity={0.7} />
              <Text style={styles.appointmentDetailText}>{linkedAppointment.hora}</Text>
            </View>
            <View style={styles.appointmentDetailRow}>
              <Ionicons name="location-outline" size={14} color={Colors.light.textSecondary} opacity={0.7} />
              <Text style={styles.appointmentDetailText}>{linkedAppointment.lugar}</Text>
            </View>
          </View>
        )}

        {/* Estado de Ánimo */}
        <View style={{ marginBottom: 28 }}>
          <Text style={styles.inputLabel}>¿Cómo te sientes hoy?</Text>
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

        {/* Note Details Form */}
        <View style={styles.formSection}>
          
          {/* Items List */}
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Puntos a tratar / Lista de chequeo</Text>
            
            {items.map((item, idx) => (
              <View key={item.id} style={styles.pointItem}>
                <TouchableOpacity onPress={() => handleToggleComplete(item.id)}>
                  <View style={[styles.checkbox, item.completed && styles.checkboxActive]}>
                    {item.completed && <Ionicons name="checkmark" size={14} color={Colors.light.text} />}
                  </View>
                </TouchableOpacity>
                <TextInput 
                  style={[styles.pointInput, item.completed && styles.textCompleted]}
                  value={item.text}
                  placeholder="Escribe un detalle..."
                  placeholderTextColor={Colors.light.textSecondary}
                  onChangeText={(text) => handleTextChange(item.id, text)}
                />
                {items.length > 1 && (
                  <TouchableOpacity onPress={() => handleRemoveItem(item.id)} style={styles.deletePointBtn}>
                    <Ionicons name="trash-outline" size={20} color="#ba1a1a" />
                  </TouchableOpacity>
                )}
              </View>
            ))}

            <TouchableOpacity style={styles.addPointBtn} onPress={handleAddItem}>
              <Ionicons name="add" size={18} color={Colors.light.primary} />
              <Text style={styles.addPointText}>Añadir otro punto</Text>
            </TouchableOpacity>
          </View>

          {/* Priority Toggle */}
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Prioridad</Text>
            <View style={styles.priorityRow}>
              
              <TouchableOpacity 
                style={[
                  styles.priorityBtn, 
                  priority === 'normal' ? styles.priorityBtnActive : styles.priorityBtnInactive
                ]}
                onPress={() => setPriority('normal')}
              >
                <Ionicons 
                  name="checkmark-circle" 
                  size={18} 
                  color={priority === 'normal' ? '#002018' : Colors.light.textSecondary} 
                />
                <Text style={[
                  styles.priorityBtnText,
                  priority === 'normal' ? styles.priorityBtnTextActive : styles.priorityBtnTextInactive
                ]}>Normal</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.priorityBtn, 
                  priority === 'important' ? styles.priorityBtnActiveImportant : styles.priorityBtnInactive
                ]}
                onPress={() => setPriority('important')}
              >
                <Ionicons 
                  name="alert" 
                  size={18} 
                  color={priority === 'important' ? '#612900' : Colors.light.textSecondary} 
                />
                <Text style={[
                  styles.priorityBtnText,
                  priority === 'important' ? styles.priorityBtnTextActive : styles.priorityBtnTextInactive
                ]}>Importante</Text>
              </TouchableOpacity>

            </View>
          </View>

        </View>

      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomActionArea}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Ionicons name="save" size={20} color="#FFF" />
          <Text style={styles.saveBtnText}>Guardar Cambios</Text>
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
    backgroundColor: 'rgba(251, 249, 248, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 8,
  },
  headerLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 120, // space for bottom action
  },
  titleSection: {
    marginBottom: 32,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    opacity: 0.8,
  },
  appointmentCard: {
    backgroundColor: '#f5f3f3',
    borderRadius: 24,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 32,
  },
  appointmentDeco: {
    position: 'absolute',
    top: -24,
    right: -24,
    width: 96,
    height: 96,
    backgroundColor: 'rgba(40, 130, 107, 0.1)',
    borderRadius: 48,
  },
  appointmentEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  appointmentEyebrow: {
    color: Colors.light.primary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
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
  formSection: {
    gap: 24,
  },
  formGroup: {
    gap: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  pointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(62, 73, 69, 0.5)',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    borderColor: Colors.light.text,
    backgroundColor: '#eae8e7',
  },
  pointInput: {
    flex: 1,
    backgroundColor: '#f5f3f3',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.light.text,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  textCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  deletePointBtn: {
    padding: 8,
  },
  addPointBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  addPointText: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  priorityBtnActive: {
    backgroundColor: '#9df3d7',
    borderColor: '#9df3d7',
  },
  priorityBtnActiveImportant: {
    backgroundColor: '#ff7f27',
    borderColor: '#ff7f27',
  },
  priorityBtnInactive: {
    backgroundColor: '#f5f3f3',
    borderColor: 'rgba(190, 201, 195, 0.3)',
  },
  priorityBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  priorityBtnTextActive: {
    color: '#002018',
  },
  priorityBtnTextInactive: {
    color: Colors.light.textSecondary,
  },
  bottomActionArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(251, 249, 248, 0.9)',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.03,
    shadowRadius: 20,
    elevation: 10,
  },
  saveBtn: {
    backgroundColor: Colors.light.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 20,
    gap: 12,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
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
});