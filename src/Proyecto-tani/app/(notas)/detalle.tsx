import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Alert } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '@/stores/auth';
import { useAppointmentStore } from '@/stores/appointments';

export default function DetalleNotaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { user } = useAuthStore();
  const { notes, deleteNote, appointments } = useAppointmentStore();

  const note = notes.find((n) => n.id === id) || notes[0];
  const linkedAppointment = note ? appointments.find((a) => a.id === note.appointmentId) : null;

  const handleDelete = () => {
    if (!note) return;
    Alert.alert(
      'Eliminar Nota',
      '¿Estás segura de que deseas eliminar esta nota médica?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => {
            deleteNote(note.id);
            router.back();
          }
        }
      ]
    );
  };

  const getHeaderName = () => {
    if (user) return `${user.name} ${user.surname}`;
    return 'Mariana Sofia Garcia';
  };

  const getMoodEmoji = (moodKey: string | null) => {
    switch (moodKey) {
      case 'great': return '😊 Bien';
      case 'ok': return '😐 Normal';
      case 'tired': return '😴 Cansada';
      case 'sad': return '😢 Triste';
      case 'mom': return '🤱 Mamá';
      default: return '😐 Normal';
    }
  };

  if (!note) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
          </TouchableOpacity>
          <Text style={styles.brandTitle}>Detalle de Nota</Text>
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
        <View style={styles.headerTitleGroup}>
          <View style={styles.profileBadge}>
            <Image 
              source={require('@/assets/images/Tani user icon.png')}
              style={styles.profileImage}
            />
          </View>
          <View>
            <Text style={styles.brandTitle}>Familia TANI</Text>
            <Text style={styles.brandSubtitle} numberOfLines={1}>{getHeaderName()}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationBtn} onPress={() => router.push('/notificaciones')}>
          <Ionicons name="notifications" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Back and Title */}
        <View style={styles.titleSection}>
          <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={16} color={Colors.light.primary} />
            <Text style={styles.backLinkText}>Volver</Text>
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Detalle de Nota</Text>
        </View>

        {/* Date and Time Badge */}
        <View style={styles.dateTimeRow}>
          <View style={styles.badge}>
            <Ionicons name="calendar-outline" size={16} color={Colors.light.primary} />
            <Text style={styles.badgeText}>{note.date}</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="alert-circle-outline" size={16} color={note.priority === 'important' ? '#9b4500' : Colors.light.primary} />
            <Text style={[styles.badgeText, note.priority === 'important' && { color: '#9b4500', fontWeight: '700' }]}>
              Prioridad: {note.priority === 'important' ? 'Importante' : 'Normal'}
            </Text>
          </View>
        </View>

        {/* Mood Badge */}
        {note.mood && (
          <View style={{ marginBottom: 20, alignSelf: 'flex-start' }}>
            <View style={[styles.badge, { backgroundColor: 'rgba(73, 159, 134, 0.1)' }]}>
              <Text style={styles.badgeText}>Estado de ánimo: {getMoodEmoji(note.mood)}</Text>
            </View>
          </View>
        )}

        {/* Note Content Card */}
        <View style={styles.noteCard}>
          <View style={styles.noteCardDeco} />
          <View style={styles.noteHeader}>
            <View style={styles.iconBox}>
              <Ionicons name="document-text-outline" size={24} color={Colors.light.primary} />
            </View>
            <View style={styles.noteTitleArea}>
              <Text style={styles.noteTitle}>Síntomas y Preguntas</Text>
              <Text style={styles.noteCategory}>Diario de la mamá</Text>
            </View>
          </View>

          {/* Checklist details rendering */}
          <View style={{ gap: 12, marginTop: 8 }}>
            {note.details.map((item) => (
              <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons 
                  name={item.completed ? 'checkmark-circle' : 'ellipse-outline'} 
                  size={20} 
                  color={item.completed ? '#499F86' : '#6e7a74'} 
                />
                <Text style={[{ fontSize: 16, color: '#1b1c1c' }, item.completed && { textDecorationLine: 'line-through', opacity: 0.6 }]}>
                  {item.text}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Linkage Section */}
        {linkedAppointment && (
          <TouchableOpacity 
            style={styles.linkageCard}
            onPress={() => router.push({ pathname: '/(citas)/detalle', params: { id: linkedAppointment.id } })}
          >
            <View style={styles.linkageLeft}>
              <View style={styles.linkageIconBox}>
                <Ionicons name="calendar" size={20} color="#765b00" />
              </View>
              <View>
                <Text style={styles.linkageLabel}>Vinculado a la cita:</Text>
                <Text style={styles.linkageValue}>{linkedAppointment.titulo}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.light.textSecondary} opacity={0.5} />
          </TouchableOpacity>
        )}

        {/* Actions */}
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color={Colors.light.text} />
            <Text style={styles.deleteBtnText}>Eliminar</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.editBtn} 
            onPress={() => router.push({ pathname: '/(notas)/editar', params: { id: note.id } })}
          >
            <Ionicons name="pencil" size={20} color="#FFF" />
            <Text style={styles.editBtnText}>Editar Nota</Text>
          </TouchableOpacity>
        </View>

        {/* Decorative Element */}
        <View style={styles.decorativeImageContainer}>
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKZk2d3f2gqNhzfENjnFxsJ-ZyorsxpzEVkMemMIcGGUgBZvTf8drnsUN_9ptA6Z9fSwRNrVIFf67jrgo0yIUwIDF0f5HGGCdXEYEl1cJBR7FpO6molV1FkE_W40D7jzKUZecoXEY9GMZVkyaQ_mPhh8TP8Tj6ieU_x_2Nvw8cL1upBN2eBViIiVwOYNIlQ5kC3KfJqrDrt9o4t6yKgYSxXCyXT_UM-KF3pObgu1xU-JTp9sFow4Qf6TD2O5-OSkBVkRcLoJ5gzcU' }}
            style={styles.decorativeImage}
          />
          <View style={styles.imageOverlay} />
          <View style={styles.imageTextContainer}>
            <Text style={styles.imageHeadline}>Tu bienestar es su bienestar.</Text>
            <Text style={styles.imageSubeline}>Sigue registrando cada momento.</Text>
          </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#Fbf9f8',
    ...Platform.select({
      ios: { zIndex: 10 },
      android: { elevation: 10 }
    })
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(190, 201, 195, 0.2)',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.primary,
    lineHeight: 20,
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    maxWidth: 150,
  },
  notificationBtn: {
    padding: 8,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 24,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backLinkText: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.light.text,
    letterSpacing: -0.5,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#f5f3f3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.light.text,
  },
  noteCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  noteCardDeco: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 64,
    height: 64,
    backgroundColor: 'rgba(157, 243, 215, 0.2)',
    borderBottomLeftRadius: 64,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 105, 83, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteTitleArea: {
    flex: 1,
    justifyContent: 'center',
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 2,
  },
  noteCategory: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  linkageCard: {
    backgroundColor: '#f5f3f3',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  linkageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  linkageIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  linkageLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.light.textSecondary,
  },
  linkageValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: '#eae8e7',
    paddingVertical: 16,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteBtnText: {
    color: Colors.light.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  editBtn: {
    flex: 1,
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  editBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  decorativeImageContainer: {
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
  },
  decorativeImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 105, 83, 0.4)',
  },
  imageTextContainer: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    right: 24,
  },
  imageHeadline: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  imageSubeline: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  }
});