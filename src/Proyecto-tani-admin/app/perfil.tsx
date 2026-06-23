import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, ScrollView, Switch, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/auth';

const PROFILE_IMG = require('@/assets/images/Tani user icon.png');

export default function PerfilScreen() {
  const router = useRouter();
  const { user, logout, updateProfile } = useAuthStore();

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [biometric, setBiometric] = useState(true);

  // States for editing profile info
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setSurname(user.surname);
      setEmail(user.email);
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!name.trim() || !surname.trim()) {
      Alert.alert('Error', 'El nombre y apellido no pueden estar vacíos.');
      return;
    }
    await updateProfile({ name, surname, email, phone });
    setIsEditing(false);
    Alert.alert('Perfil Actualizado', 'Tus datos se han guardado correctamente.');
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás segura de que deseas salir de tu cuenta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Salir', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  const getHeaderName = () => {
    if (user) return `${user.name} ${user.surname}`;
    return 'Mariana Sofia Garcia';
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerL}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#006953" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Mi Perfil</Text>
        </View>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Text style={{ color: '#006953', fontWeight: '700', fontSize: 15 }}>
            {isEditing ? 'Cancelar' : 'Editar'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Avatar Card */}
        <View style={s.avatarRow}>
          <View style={s.avatarWrap}>
            <Image source={PROFILE_IMG} style={s.avatar} />
            <TouchableOpacity style={s.camBtn} onPress={() => Alert.alert('Subir Foto', 'Funcionalidad de cámara/galería (Supabase Storage en Fase 3)')}>
              <Ionicons name="camera" size={14} color="#FFF" />
            </TouchableOpacity>
          </View>
          <View style={{ paddingBottom: 8, flex: 1 }}>
            <Text style={s.userName} numberOfLines={1}>{getHeaderName()}</Text>
            <Text style={s.userId}>ID: {user?.id || 'TN-88294'}</Text>
          </View>
        </View>

        {/* Info Personal */}
        <View style={s.card}>
          <View style={s.cardHead}>
            <Ionicons name="person-circle" size={22} color="#006953" />
            <Text style={s.cardTitle}>Información Personal</Text>
          </View>

          {isEditing ? (
            <View style={{ gap: 16 }}>
              <View style={s.inputGroup}>
                <Text style={s.infoLabel}>Nombre</Text>
                <TextInput style={s.input} value={name} onChangeText={setName} placeholder="Nombre" />
              </View>
              <View style={s.inputGroup}>
                <Text style={s.infoLabel}>Apellido</Text>
                <TextInput style={s.input} value={surname} onChangeText={setSurname} placeholder="Apellido" />
              </View>
              <View style={s.inputGroup}>
                <Text style={s.infoLabel}>Correo Electrónico</Text>
                <TextInput style={s.input} value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="Email" />
              </View>
              <View style={s.inputGroup}>
                <Text style={s.infoLabel}>Teléfono</Text>
                <TextInput style={s.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="Teléfono" />
              </View>
              <TouchableOpacity style={s.saveBtn} onPress={handleSaveProfile}>
                <Text style={s.saveBtnText}>Guardar Cambios</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ gap: 16 }}>
              <View style={{ gap: 3 }}>
                <Text style={s.infoLabel}>Nombre Completo</Text>
                <Text style={s.infoValue}>{getHeaderName()}</Text>
              </View>
              <View style={{ gap: 3 }}>
                <Text style={s.infoLabel}>Email</Text>
                <Text style={s.infoValue}>{user?.email || 'mariana.g@tani.app'}</Text>
              </View>
              <View style={{ gap: 3 }}>
                <Text style={s.infoLabel}>Teléfono</Text>
                <Text style={s.infoValue}>{user?.phone || '+54 9 11 2345-6789'}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Preferencias */}
        <View style={s.card}>
          <View style={s.cardHead}>
            <Ionicons name="options" size={22} color="#006953" />
            <Text style={s.cardTitle}>Preferencias</Text>
          </View>
          <View style={s.row}>
            <View style={s.rowL}>
              <Ionicons name="notifications-outline" size={19} color="#3e4945" />
              <Text style={s.rowLabel}>Notificaciones</Text>
            </View>
            <Switch value={notifications} onValueChange={setNotifications} trackColor={{ false:'#eae8e7', true:'#006953' }} thumbColor="#FFF" />
          </View>
          <View style={s.row}>
            <View style={s.rowL}>
              <Ionicons name="moon-outline" size={19} color="#3e4945" />
              <Text style={s.rowLabel}>Modo Oscuro</Text>
            </View>
            <Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ false:'#eae8e7', true:'#006953' }} thumbColor="#FFF" />
          </View>
        </View>

        {/* Seguridad */}
        <View style={s.card}>
          <View style={s.cardHead}>
            <Ionicons name="shield-checkmark" size={22} color="#006953" />
            <Text style={s.cardTitle}>Seguridad</Text>
          </View>
          <TouchableOpacity style={s.row} onPress={() => Alert.alert('Cambiar Contraseña', 'Esta opción enviará un correo de recuperación en Fase 3.')}>
            <View style={s.rowL}>
              <Ionicons name="lock-open-outline" size={19} color="#3e4945" />
              <Text style={s.rowLabel}>Cambiar Contraseña</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#bec9c3" />
          </TouchableOpacity>
          <View style={s.row}>
            <View style={s.rowL}>
              <Ionicons name="finger-print-outline" size={19} color="#3e4945" />
              <Text style={s.rowLabel}>Ingreso Biométrico</Text>
            </View>
            <Switch value={biometric} onValueChange={setBiometric} trackColor={{ false:'#eae8e7', true:'#006953' }} thumbColor="#FFF" />
          </View>
        </View>

        {/* Legal */}
        <View style={[s.card, { backgroundColor:'#f5f3f3' }]}>
          <View style={s.cardHead}>
            <Ionicons name="information-circle" size={22} color="#006953" />
            <Text style={s.cardTitle}>Ayuda y Legal</Text>
          </View>
          <TouchableOpacity style={s.row} onPress={() => router.push('/terminos')}>
            <View style={s.rowL}>
              <Ionicons name="document-text-outline" size={19} color="#3e4945" />
              <Text style={s.rowLabel}>Términos y Condiciones</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={s.row} onPress={() => router.push('/politica')}>
            <View style={s.rowL}>
              <Ionicons name="shield-outline" size={19} color="#3e4945" />
              <Text style={s.rowLabel}>Política de Privacidad</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Cerrar Sesión */}
        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#ba1a1a" />
          <Text style={s.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex:1, backgroundColor:'#fbf9f8' },
  header: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:24, paddingVertical:14, backgroundColor:'#fbf9f8' },
  headerL: { flexDirection:'row', alignItems:'center', gap:16 },
  headerTitle: { fontSize:18, fontWeight:'700', color:'#006953' },
  content: { paddingHorizontal:24, paddingTop:12 },
  avatarRow: { flexDirection:'row', alignItems:'flex-end', gap:20, marginBottom:28 },
  avatarWrap: { width:120, height:120, borderRadius:60, overflow:'hidden', borderWidth:4, borderColor:'#FFF', shadowColor:'#000', shadowOffset:{width:0,height:6}, shadowOpacity:0.12, shadowRadius:12, elevation:6 },
  avatar: { width:'100%', height:'100%' },
  camBtn: { position:'absolute', bottom:4, right:4, width:32, height:32, borderRadius:16, backgroundColor:'#006953', justifyContent:'center', alignItems:'center' },
  userName: { fontSize:28, fontWeight:'800', color:'#1b1c1c', letterSpacing:-0.5, flex: 1 },
  userId: { fontSize:14, fontWeight:'500', color:'#6e7a74', marginTop:4 },
  card: { backgroundColor:'#FFF', borderRadius:14, padding:24, marginBottom:16, borderWidth:1, borderColor:'rgba(190,201,195,0.1)', gap:16 },
  cardHead: { flexDirection:'row', alignItems:'center', gap:8 },
  cardTitle: { fontSize:17, fontWeight:'700', color:'#1b1c1c' },
  infoLabel: { fontSize:10, fontWeight:'700', color:'#6e7a74', textTransform:'uppercase', letterSpacing:1.5 },
  infoValue: { fontSize:15, fontWeight:'500', color:'#1b1c1c' },
  row: { flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  rowL: { flexDirection:'row', alignItems:'center', gap:12 },
  rowLabel: { fontSize:15, fontWeight:'500', color:'#1b1c1c' },
  logoutBtn: { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:12, paddingVertical:16, paddingHorizontal:48, borderRadius:14, borderWidth:2, borderColor:'rgba(186,26,26,0.1)', alignSelf:'center' },
  logoutText: { fontSize:16, fontWeight:'700', color:'#ba1a1a' },
  inputGroup: { gap: 6 },
  input: {
    backgroundColor: '#f5f3f3',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1b1c1c',
  },
  saveBtn: {
    backgroundColor: '#006953',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  saveBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  }
});