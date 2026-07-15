import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';

// ==========================================
// 1. IMPORTACIONES DE LAS LIBRERÍAS DE VALIDACIÓN
// ==========================================
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/stores/auth';

// ==========================================
// 2. DEFINICIÓN DEL ESQUEMA (REGLAS DE VALIDACIÓN)
// Se define fuera del componente para que no se recree en cada renderizado.
// ==========================================
const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 letras'),
  surname: z.string().min(2, 'El apellido debe tener al menos 2 letras'),
  phone: z
    .string()
    .length(9, 'El celular debe tener exactamente 9 dígitos')
    .regex(/^[0-9]+$/, 'Solo se permiten números'),
  dni: z
    .string()
    .length(8, 'El DNI debe tener exactamente 8 dígitos')
    .regex(/^[0-9]+$/, 'Solo se permiten números'),
  email: z.string().email('Debe ingresar un correo electrónico válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

// Tipado estricto automático a partir del esquema de Zod
type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const { register: registerUser } = useAuthStore();

  // ==========================================
  // 3. CONFIGURACIÓN DE REACT HOOK FORM
  // Le pasamos el resolver de Zod para que conecte nuestras reglas.
  // ==========================================
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      surname: '',
      phone: '',
      dni: '',
      email: '',
      password: '',
    },
  });

  // Esta función solo se llamará si Zod verifica que no hay ningún error
  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
      Alert.alert('Éxito', '¡Cuenta creada y registrada con éxito!');
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al registrar la cuenta.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Gestante</Text>

      {/* ==========================================
          CAMPO: NOMBRES
          Usamos <Controller> para "envolver" el TextInput y vincularlo
          ========================================== */}
      <Text style={styles.label}>Nombres</Text>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Ingresa tus nombres"
          />
        )}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

      {/* ==========================================
          CAMPO: APELLIDOS
          ========================================== */}
      <Text style={styles.label}>Apellidos</Text>
      <Controller
        control={control}
        name="surname"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Ingresa tus apellidos"
          />
        )}
      />
      {errors.surname && <Text style={styles.errorText}>{errors.surname.message}</Text>}

      {/* ==========================================
          CAMPO: DNI (Numérico, máximo 8 caracteres)
          ========================================== */}
      <Text style={styles.label}>DNI (8 dígitos)</Text>
      <Controller
        control={control}
        name="dni"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={8}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="12345678"
          />
        )}
      />
      {errors.dni && <Text style={styles.errorText}>{errors.dni.message}</Text>}

      {/* ==========================================
          CAMPO: CELULAR (Numérico, máximo 9 caracteres)
          ========================================== */}
      <Text style={styles.label}>Celular (9 dígitos)</Text>
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={9}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="987654321"
          />
        )}
      />
      {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}

      {/* ==========================================
          CAMPO: EMAIL
          ========================================== */}
      <Text style={styles.label}>Correo Electrónico</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="correo@tani.org"
          />
        )}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      {/* ==========================================
          BOTÓN DE REGISTRO
          Enlazamos la función handleSubmit al evento onPress
          ========================================== */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSubmit(onSubmit)} 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Registrar Cuenta</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

// Estilos de la vista
const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', color: '#006953' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 4, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16 },
  errorText: { color: '#ba1a1a', fontSize: 12, marginTop: 4, fontWeight: '500' },
  button: { backgroundColor: '#006953', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});