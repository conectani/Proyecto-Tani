import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const CATEGORIAS = [
  'Mejora de Servicios',
  'Feedback General',
  'Soporte Técnico App',
  'Otros',
];

export default function SugerenciaScreen() {
  const router = useRouter();
  const [categoria, setCategoria] = useState('');
  const [texto, setTexto] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const handleSubmit = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarSmall}>
            <Image
              source={require('@/assets/images/Tani user icon.png')}
              style={styles.avatarImg}
            />
          </View>
          <View>
            <Text style={styles.headerTitle}>Tani</Text>
            <Text style={styles.headerSub}>Familia González</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

          {/* Handle bar decorative */}
          <View style={styles.handleBar} />

          {/* Title */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Envía tu Sugerencia</Text>
            <Text style={styles.mainSubtitle}>
              Tu opinión es el motor de nuestra comunidad. Ayúdanos a construir un espacio mejor para ti.
            </Text>
          </View>

          {/* Category Selector */}
          <View style={styles.field}>
            <Text style={styles.label}>Asunto / Categoría</Text>
            <TouchableOpacity
              style={styles.selectBox}
              onPress={() => setShowPicker(!showPicker)}
              activeOpacity={0.8}
            >
              <Text style={[styles.selectText, !categoria && styles.placeholder]}>
                {categoria || 'Selecciona una categoría'}
              </Text>
              <Ionicons name={showPicker ? 'chevron-up' : 'chevron-down'} size={20} color={Colors.light.textSecondary} />
            </TouchableOpacity>
            {showPicker && (
              <View style={styles.dropdown}>
                {CATEGORIAS.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.dropdownItem, categoria === cat && styles.dropdownItemActive]}
                    onPress={() => { setCategoria(cat); setShowPicker(false); }}
                  >
                    <Text style={[styles.dropdownText, categoria === cat && styles.dropdownTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Text Area */}
          <View style={styles.field}>
            <Text style={styles.label}>Tu Sugerencia</Text>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={5}
              placeholder="Cuéntanos cómo podemos mejorar..."
              placeholderTextColor={Colors.light.textSecondary}
              value={texto}
              onChangeText={setTexto}
              textAlignVertical="top"
            />
          </View>

          {/* Info card */}
          <View style={styles.infoCard}>
            <View style={styles.infoIconBox}>
              <Ionicons name="bulb" size={20} color={Colors.light.primary} />
            </View>
            <Text style={styles.infoText}>
              Todas las sugerencias son revisadas de forma anónima para garantizar tu privacidad y comodidad.
            </Text>
          </View>

          {/* Submit */}
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
            <Text style={styles.submitText}>Enviar Sugerencia</Text>
            <Ionicons name="send" size={20} color="#FFF" />
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fbf9f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fbf9f8',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(0,105,83,0.1)',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1b1c1c',
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    opacity: 0.6,
    marginTop: -2,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 48,
  },
  handleBar: {
    width: 48,
    height: 6,
    backgroundColor: '#e4e2e1',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 32,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1b1c1c',
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: 12,
  },
  mainSubtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1b1c1c',
    marginBottom: 8,
    marginLeft: 4,
  },
  selectBox: {
    backgroundColor: '#eae8e7',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    fontSize: 15,
    color: '#1b1c1c',
    fontWeight: '500',
  },
  placeholder: {
    color: Colors.light.textSecondary,
  },
  dropdown: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  dropdownItemActive: {
    backgroundColor: 'rgba(0,105,83,0.06)',
  },
  dropdownText: {
    fontSize: 14,
    color: '#1b1c1c',
    fontWeight: '500',
  },
  dropdownTextActive: {
    color: Colors.light.primary,
    fontWeight: '700',
  },
  textArea: {
    backgroundColor: '#eae8e7',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 15,
    color: '#1b1c1c',
    minHeight: 120,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0,105,83,0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    gap: 12,
  },
  infoIconBox: {
    backgroundColor: 'rgba(40,130,107,0.15)',
    borderRadius: 12,
    padding: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#005140',
    lineHeight: 20,
  },
  submitBtn: {
    backgroundColor: Colors.light.primary,
    borderRadius: 24,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  submitText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
