import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAdminStore } from '@/stores/adminMothers';

const PRIMARY = '#006953';
const TEXT = '#1b1c1c';
const TEXT_SECONDARY = '#3e4945';

const TARGET_GROUPS = ['Todos', '0-3 meses', '4-6 meses', '7-12 meses', '12 meses+'];

export default function AdminAnnouncementsScreen() {
  const { announcements, addAnnouncement } = useAdminStore();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [targetGroup, setTargetGroup] = useState('Todos');

  const handleSend = () => {
    if (!title.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa un título para el anuncio.');
      return;
    }
    if (!body.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa el mensaje del anuncio.');
      return;
    }

    addAnnouncement({
      title: title.trim(),
      body: body.trim(),
      targetAgeGroup: targetGroup as any
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Anuncio Difundido',
      `Se ha enviado la notificación push a todas las madres del grupo "${targetGroup}".`
    );

    // Resetear form
    setTitle('');
    setBody('');
    setTargetGroup('Todos');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Difusión y Campañas</Text>
        <Text style={styles.headerSubtitle}>Envía material educativo segmentado por edad del bebé</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Editor Form */}
        <View style={styles.editorCard}>
          <Text style={styles.cardTitle}>Crear Nueva Notificación Push</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Título del Anuncio *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Taller de Alimentación Complementaria"
              placeholderTextColor={TEXT_SECONDARY}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mensaje del Anuncio *</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Escribe aquí los detalles del evento, consejos o enlaces de interés..."
              placeholderTextColor={TEXT_SECONDARY}
              multiline
              numberOfLines={4}
              value={body}
              onChangeText={setBody}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bebés Destinatarios (Edad)</Text>
            <View style={styles.pillsContainer}>
              {TARGET_GROUPS.map((group) => (
                <TouchableOpacity
                  key={group}
                  style={[styles.pill, targetGroup === group && styles.pillActive]}
                  onPress={() => setTargetGroup(group)}
                >
                  <Text style={[styles.pillText, targetGroup === group && styles.pillTextActive]}>
                    {group}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Ionicons name="paper-plane" size={18} color="#FFF" />
            <Text style={styles.sendButtonText}>Enviar Notificación Push</Text>
          </TouchableOpacity>
        </View>

        {/* Lock Screen Mock Preview */}
        <Text style={styles.sectionTitle}>Previsualización en Celular de la Madre</Text>
        <View style={styles.mockPhoneCard}>
          <View style={styles.mockPhoneHeader}>
            <Text style={styles.mockPhoneTime}>08:15 AM</Text>
            <View style={styles.mockPhoneIcons}>
              <Ionicons name="wifi" size={12} color="#FFF" />
              <Ionicons name="battery-full" size={14} color="#FFF" />
            </View>
          </View>
          
          <View style={styles.mockNotification}>
            <View style={styles.notifHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="happy" size={16} color={PRIMARY} />
                <Text style={styles.notifAppName}>TANI ACOMPAÑA</Text>
              </View>
              <Text style={styles.notifTime}>ahora</Text>
            </View>
            <Text style={styles.notifTitle}>{title || 'Título del anuncio'}</Text>
            <Text style={styles.notifBody} numberOfLines={2}>
              {body || 'El texto del mensaje aparecerá aquí en el celular de la madre de forma inmediata.'}
            </Text>
          </View>
        </View>

        {/* Historial de Envíos */}
        <Text style={styles.sectionTitle}>Historial de Campañas Recientes</Text>
        {announcements.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No hay campañas enviadas previamente.</Text>
          </View>
        ) : (
          [...announcements].reverse().map((ann) => (
            <View key={ann.id} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyTitle}>{ann.title}</Text>
                <View style={styles.targetBadge}>
                  <Text style={styles.targetBadgeText}>{ann.targetAgeGroup}</Text>
                </View>
              </View>
              <Text style={styles.historyBody}>{ann.body}</Text>
              <Text style={styles.historyDate}>Enviado el {ann.date}</Text>
            </View>
          ))
        )}
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
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
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  editorCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f3f3',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: TEXT,
  },
  textArea: {
    backgroundColor: '#f5f3f3',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: TEXT,
    minHeight: 100,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pill: {
    backgroundColor: '#f5f3f3',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  pillActive: {
    backgroundColor: PRIMARY,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
    color: TEXT_SECONDARY,
  },
  pillTextActive: {
    color: '#FFF',
  },
  sendButton: {
    backgroundColor: PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: TEXT,
    marginBottom: 12,
    marginTop: 8,
  },
  mockPhoneCard: {
    backgroundColor: '#263238',
    borderRadius: 24,
    padding: 16,
    borderWidth: 6,
    borderColor: '#37474f',
    marginBottom: 24,
    height: 156,
  },
  mockPhoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mockPhoneTime: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  mockPhoneIcons: {
    flexDirection: 'row',
    gap: 6,
  },
  mockNotification: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifAppName: {
    fontSize: 9,
    fontWeight: '800',
    color: PRIMARY,
    letterSpacing: 0.5,
  },
  notifTime: {
    fontSize: 9,
    color: TEXT_SECONDARY,
  },
  notifTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 2,
  },
  notifBody: {
    fontSize: 11,
    color: TEXT_SECONDARY,
    lineHeight: 14,
  },
  emptyCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  emptyText: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    fontStyle: 'italic',
  },
  historyCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    marginBottom: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT,
    flex: 1,
    paddingRight: 8,
  },
  targetBadge: {
    backgroundColor: '#e6f3ef',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  targetBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: PRIMARY,
  },
  historyBody: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    lineHeight: 18,
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 10,
    color: TEXT_SECONDARY,
    textAlign: 'right',
  },
});
