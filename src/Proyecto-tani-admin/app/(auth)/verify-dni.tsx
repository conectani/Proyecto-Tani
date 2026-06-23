import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function VerifyDNIScreen() {
  const router = useRouter();

  const handleContinue = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verificación</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Verificación de DNI</Text>
        <Text style={styles.subtitle}>Por favor verifica tu identidad para continuar.</Text>
        
        <View style={styles.placeholderContainer}>
          <Ionicons name="id-card-outline" size={64} color={Colors.light.textSecondary} />
          <Text style={styles.placeholderText}>(Simulación de escaneo / carga de DNI)</Text>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleContinue}>
          <Text style={styles.submitButtonText}>Continuar con Verificación</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  spacer: {
    width: 40,
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  placeholderContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#E4E2E1',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  placeholderText: {
    marginTop: 16,
    color: Colors.light.textSecondary,
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    width: '100%',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});