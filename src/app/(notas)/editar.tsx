import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Image, Platform } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function EditarNotaScreen() {
  const router = useRouter();
  const [priority, setPriority] = useState('normal'); // 'normal' or 'important'

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
            <Text style={styles.brandTitle}>Tani</Text>
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
        <View style={styles.appointmentCard}>
          <View style={styles.appointmentDeco} />
          <View style={styles.appointmentEyebrowRow}>
            <Ionicons name="link" size={16} color={Colors.light.primary} />
            <Text style={styles.appointmentEyebrow}>CITA VINCULADA</Text>
          </View>
          <Text style={styles.appointmentTitle}>Control Prenatal</Text>
          <View style={styles.appointmentDetailRow}>
            <Ionicons name="calendar-outline" size={14} color={Colors.light.textSecondary} opacity={0.7} />
            <Text style={styles.appointmentDetailText}>14 May, 10:30 AM</Text>
          </View>
          <View style={styles.appointmentDetailRow}>
            <Ionicons name="medkit-outline" size={14} color={Colors.light.textSecondary} opacity={0.7} />
            <Text style={styles.appointmentDetailText}>Dr. Ramírez</Text>
          </View>
        </View>

        {/* Note Details Form */}
        <View style={styles.formSection}>
          
          {/* Items List */}
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Puntos a tratar</Text>
            
            <View style={styles.pointItem}>
              <View style={styles.checkbox}>
                <Ionicons name="checkmark" size={12} color="#FFF" />
              </View>
              <TextInput 
                style={styles.pointInput}
                value="Escribe un síntoma o pregunta importante"
                placeholder="Añadir punto..."
                placeholderTextColor={Colors.light.textSecondary}
              />
              <TouchableOpacity style={styles.deletePointBtn}>
                <Ionicons name="close" size={20} color={Colors.light.textSecondary} opacity={0.5} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.addPointBtn}>
              <Ionicons name="add" size={18} color={Colors.light.primary} />
              <Text style={styles.addPointText}>Añadir otro punto</Text>
            </TouchableOpacity>
          </View>

          {/* Details Textarea */}
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Detalles</Text>
            <TextInput 
              style={styles.textArea}
              value="He sentido leves molestias en la espalda baja durante las noches."
              placeholder="Actualiza tus observaciones aquí..."
              placeholderTextColor={Colors.light.textSecondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
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
                  color={priority === 'normal' ? '#FFF' : Colors.light.textSecondary} 
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
                  name="warning" 
                  size={18} 
                  color={priority === 'important' ? '#FFF' : Colors.light.textSecondary} 
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
        <TouchableOpacity style={styles.saveBtn} onPress={() => router.back()}>
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
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.light.outlineVariant,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointInput: {
    flex: 1,
    backgroundColor: '#f5f3f3',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.light.text,
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
  textArea: {
    backgroundColor: '#eae8e7',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 14,
    color: Colors.light.text,
    minHeight: 100,
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
    backgroundColor: Colors.light.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  priorityBtnActiveImportant: {
    backgroundColor: '#ff7f27', // secondary-container
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    color: '#FFF',
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
  }
});