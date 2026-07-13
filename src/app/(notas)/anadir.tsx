import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AnadirNotaScreen() {
  const router = useRouter();
  const [priority, setPriority] = useState('normal'); // 'normal' or 'important'

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
          <Text style={styles.headerProfileText}>(Apellido)</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Agregar Nota</Text>
          <Text style={styles.pageSubtitle}>Registra síntomas o preguntas para tu próxima consulta.</Text>
        </View>

        {/* Linked Appointment Card */}
        <View style={styles.appointmentCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="calendar" size={20} color={Colors.light.primary} />
          </View>
          <View style={styles.appointmentInfo}>
            <Text style={styles.appointmentEyebrow}>CITA VINCULADA</Text>
            <Text style={styles.appointmentTitle}>Control Prenatal</Text>
            <View style={styles.appointmentDetailRow}>
              <Ionicons name="time-outline" size={14} color={Colors.light.textSecondary} />
              <Text style={styles.appointmentDetailText}>14 May, 10:30 AM</Text>
            </View>
            <View style={styles.appointmentDetailRow}>
              <Ionicons name="person-outline" size={14} color={Colors.light.textSecondary} />
              <Text style={styles.appointmentDetailText}>Dr. Ramírez</Text>
            </View>
          </View>
        </View>

        {/* Checklist Area */}
        <View style={styles.checklistSection}>
          <Text style={styles.sectionLabel}>Detalles</Text>
          <View style={styles.checklistCard}>
            
            {/* Item 1 */}
            <View style={styles.checklistItem}>
              <View style={[styles.checkbox, styles.checkboxActive]} />
              <TextInput 
                style={styles.checklistInput}
                placeholder="Escribe un síntoma o pregunta importante..."
                placeholderTextColor="rgba(62, 73, 69, 0.5)"
              />
            </View>

            {/* Item 2 */}
            <View style={[styles.checklistItem, { opacity: 0.6 }]}>
              <View style={styles.checkbox} />
              <TextInput 
                style={styles.checklistInput}
                placeholder="Añadir otro detalle..."
                placeholderTextColor="rgba(62, 73, 69, 0.5)"
              />
            </View>

            {/* Item 3 */}
            <View style={[styles.checklistItem, { opacity: 0.6 }]}>
              <View style={styles.checkbox} />
              <TextInput 
                style={styles.checklistInput}
                placeholder="Recordar para la consulta..."
                placeholderTextColor="rgba(62, 73, 69, 0.5)"
              />
            </View>

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
        <TouchableOpacity style={styles.fab} onPress={() => router.back()}>
          <Ionicons name="save" size={20} color="#FFF" />
          <Text style={styles.fabText}>Guardar Nota</Text>
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
    backgroundColor: '#Fbf9f8',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    borderRadius: 20,
    marginRight: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    backgroundColor: 'rgba(40, 130, 107, 0.1)', // primary-container / 10
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
  },
  checkboxActive: {
    borderColor: Colors.light.text,
  },
  checklistInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    padding: 0,
  },
  prioritySection: {
    marginBottom: 32,
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
    backgroundColor: '#9df3d7', // primary-fixed
    borderColor: '#9df3d7',
  },
  chipImportantActive: {
    backgroundColor: '#ff7f27', // secondary-container
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
    color: '#612900', // on-secondary-container
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
    backgroundColor: 'rgba(251, 249, 248, 0.9)', // Simulated gradient top
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