import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/auth';
import { useBabyStore } from '@/stores/babies';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

export default function VerifyDNIScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ nombre?: string; email?: string; password?: string }>();
  const { register } = useAuthStore();
  const { clearAndAddBaby } = useBabyStore();

  const [dni, setDni] = useState('');
  const [phone, setPhone] = useState('');
  const [babyName, setBabyName] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  const handleContinue = async () => {
    if (!dni.trim() || dni.length !== 8) {
      Alert.alert('Campo Requerido', 'Por favor ingresa un DNI válido de 8 dígitos.');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Campo Requerido', 'Por favor ingresa tu número de teléfono.');
      return;
    }
    if (!babyName.trim()) {
      Alert.alert('Campo Requerido', 'Por favor ingresa el nombre de tu bebé.');
      return;
    }

    // Dividir nombre completo en nombre y apellido
    const fullName = params.nombre || 'Mariana Sofia Garcia';
    const nameParts = fullName.trim().split(' ');
    const name = nameParts[0] || 'Mariana';
    const surname = nameParts.slice(1).join(' ') || 'Garcia';

    try {
      // 1. Iniciar registro e inicio de sesión con los datos ingresados
      await register({
        dni: dni.trim(),
        phone: phone.trim(),
        name,
        surname,
        email: params.email || `${dni.trim()}@tani.app`,
        password: params.password,
      });

      // 2. Limpiar bebés por defecto y registrar el bebé real ingresado
      const formattedBirthDate = birthDate.toISOString().split('T')[0]; // YYYY-MM-DD
      await clearAndAddBaby({
        name: babyName.trim(),
        birthDate: formattedBirthDate,
        weightText: '3.5 kg',
        isFavorite: true,
      });

      Alert.alert(
        '¡Registro Completado!',
        `Bienvenida a Tani, ${name}. Hemos configurado el seguimiento de desarrollo para tu bebé ${babyName}.`,
        [
          {
            text: 'Entrar',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error de Registro', error.message || 'No se pudo completar el registro. Inténtalo de nuevo.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Datos de Crianza</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Completa tu Perfil</Text>
        <Text style={styles.subtitle}>Ingresa tu identificación y los datos de tu bebé para iniciar el seguimiento personalizado.</Text>
        
        {/* Formulario */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>DNI de la Madre *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="card-outline" size={20} color={Colors.light.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu DNI de 8 dígitos"
                placeholderTextColor={Colors.light.textSecondary}
                keyboardType="numeric"
                maxLength={8}
                value={dni}
                onChangeText={setDni}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Teléfono / Celular *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="call-outline" size={20} color={Colors.light.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ej. +51 987 654 321"
                placeholderTextColor={Colors.light.textSecondary}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nombre de tu Bebé *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="happy-outline" size={20} color={Colors.light.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ej. Mateo"
                placeholderTextColor={Colors.light.textSecondary}
                value={babyName}
                onChangeText={setBabyName}
              />
            </View>
          </View>

          {/* Selector de Fecha de Nacimiento del Bebé */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Fecha de Nacimiento del Bebé *</Text>
            <TouchableOpacity style={styles.dateSelector} onPress={() => setShowDatePicker(true)}>
              <Ionicons name="calendar-outline" size={20} color={Colors.light.primary} />
              <Text style={styles.dateSelectorText}>
                {birthDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={birthDate}
            mode="date"
            display="default"
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleContinue}>
          <Text style={styles.submitButtonText}>Completar Registro</Text>
          <Ionicons name="checkmark-circle" size={20} color="#FFF" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#Fbf9f8',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 56,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f3f3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  spacer: {
    width: 40,
  },
  content: {
    padding: 24,
    paddingBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: 24,
  },
  formContainer: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    gap: 16,
    marginBottom: 24,
  },
  inputGroup: {},
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 6,
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
    color: Colors.light.text,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f3f3',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    gap: 10,
  },
  dateSelectorText: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    width: '100%',
    gap: 8,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});