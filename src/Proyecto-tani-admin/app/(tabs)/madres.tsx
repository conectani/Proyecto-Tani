import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal, Alert, Platform, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAdminStore, calculateAgeInMonths, getAgeText, MotherProfile, Appointment } from '@/stores/adminMothers';
import DateTimePicker from '@react-native-community/datetimepicker';
import { sanitizeInput } from '../../utils/sanitizer';

const PRIMARY = '#006953';
const TEXT = '#1b1c1c';
const TEXT_SECONDARY = '#3e4945';

const AGE_GROUPS = [
  { id: 'all', label: 'Todos' },
  { id: '0-3', label: '0-3m (Lactancia)' },
  { id: '4-6', label: '4-6m (Sólidos)' },
  { id: '7-12', label: '7-12m (Gateo)' },
  { id: '12+', label: '12m+ (Lenguaje)' }
];

const CITAS_TYPES = [
  { id: 'LACTANCIA', label: 'Asesoría Lactancia', color: '#006953', icon: 'happy-outline' },
  { id: 'PIEL A PIEL', label: 'Sesión Piel a Piel', color: '#C5A059', icon: 'people-outline' },
  { id: 'CRED', label: 'Control CRED', color: '#499F86', icon: 'calendar-outline' },
  { id: 'DESARROLLO', label: 'Ev. Desarrollo', color: '#9b4500', icon: 'analytics-outline' },
  { id: 'MÉDICO', label: 'Médico Especialista', color: '#c62828', icon: 'medkit-outline' }
];

export default function AdminMothersScreen() {
  const router = useRouter();
  const { mothers, appointments, updateAppointment, addMother, addAppointment } = useAdminStore();

  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedMother, setSelectedMother] = useState<MotherProfile | null>(null);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [targetAppId, setTargetAppId] = useState<string | null>(null);
  const [clinicalNotesText, setClinicalNotesText] = useState('');

  // Estados para reprogramación individual
  const [showReprogramModal, setShowReprogramModal] = useState(false);
  const [reprogramApp, setReprogramApp] = useState<Appointment | null>(null);
  const [reprogramDoctor, setReprogramDoctor] = useState('');
  const [reprogramLugar, setReprogramLugar] = useState('');
  const [reprogramMonto, setReprogramMonto] = useState('');
  const [reprogramDate, setReprogramDate] = useState(new Date());
  const [showReprogramDatePicker, setShowReprogramDatePicker] = useState(false);
  const [showReprogramTimePicker, setShowReprogramTimePicker] = useState(false);

  // Estados para programación grupal
  const [showGroupSchedModal, setShowGroupSchedModal] = useState(false);
  const [groupAgeRange, setGroupAgeRange] = useState('0-3');
  const [groupType, setGroupType] = useState('CRED');
  const [groupDoctor, setGroupDoctor] = useState('');
  const [groupLugar, setGroupLugar] = useState('Tani Center - Sede Principal');
  const [groupAmount, setGroupAmount] = useState('S/. 0.00');
  const [groupNotes, setGroupNotes] = useState('');
  const [groupDate, setGroupDate] = useState(new Date());
  const [showGroupDatePicker, setShowGroupDatePicker] = useState(false);
  const [showGroupTimePicker, setShowGroupTimePicker] = useState(false);

  // Estados de registro de nueva familia
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [momName, setMomName] = useState('');
  const [momSurname, setMomSurname] = useState('');
  const [momDni, setMomDni] = useState('');
  const [momPhone, setMomPhone] = useState('');
  const [momEmail, setMomEmail] = useState('');
  const [newBabyName, setNewBabyName] = useState('');
  const [newBabyWeight, setNewBabyWeight] = useState('');
  const [newBabyBirthDate, setNewBabyBirthDate] = useState(new Date());
  const [showRegisterDatePicker, setShowRegisterDatePicker] = useState(false);

  const handleSaveMother = () => {
    if (!momName.trim() || !momSurname.trim() || !momDni.trim() || !momPhone.trim() || !momEmail.trim() || !newBabyName.trim()) {
      Alert.alert('Campos Incompletos', 'Por favor completa todos los campos obligatorios (*).');
      return;
    }
    if (momDni.length !== 8) {
      Alert.alert('DNI Inválido', 'El DNI debe tener exactamente 8 dígitos.');
      return;
    }

    const formattedBirthDate = newBabyBirthDate.toISOString().split('T')[0];

    addMother({
      name: momName.trim(),
      surname: momSurname.trim(),
      dni: momDni.trim(),
      phone: momPhone.trim(),
      email: momEmail.trim(),
      babies: [
        {
          name: newBabyName.trim(),
          birthDate: formattedBirthDate,
          weightText: newBabyWeight.trim() || '3.5 kg'
        }
      ]
    });

    Alert.alert('Registro Exitoso', 'La madre y el bebé han sido ingresados al sistema de TANI.');

    // Resetear form
    setMomName('');
    setMomSurname('');
    setMomDni('');
    setMomPhone('');
    setMomEmail('');
    setNewBabyName('');
    setNewBabyWeight('');
    setNewBabyBirthDate(new Date());
    setShowRegisterModal(false);
  };

  // Filtrado de madres
  const filteredMothers = mothers.filter(m => {
    // 1. Filtro de búsqueda (nombre madre, dni, o nombre bebe)
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.surname.toLowerCase().includes(search.toLowerCase()) ||
      m.dni.includes(search) ||
      m.babies.some(b => b.name.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    // 2. Filtro de grupo de edad del bebé
    if (selectedGroup === 'all') return true;

    return m.babies.some(b => {
      const age = calculateAgeInMonths(b.birthDate);
      if (selectedGroup === '0-3') return age <= 3;
      if (selectedGroup === '4-6') return age >= 4 && age <= 6;
      if (selectedGroup === '7-12') return age >= 7 && age <= 12;
      if (selectedGroup === '12+') return age > 12;
      return true;
    });
  });

  const getMotherAppointments = (motherId: string) => {
    return appointments.filter(a => a.motherId === motherId);
  };

  const handleSaveNotes = () => {
    if (!targetAppId) return;
    updateAppointment(targetAppId, { clinicalNotes: clinicalNotesText });
    Alert.alert('Observación Guardada', 'La nota clínica se ha guardado correctamente.');
    setShowNotesDialog(false);
    setClinicalNotesText('');
    setTargetAppId(null);
    // Actualizar la madre seleccionada en el estado local para ver la nota de inmediato
    if (selectedMother) {
      const refreshed = mothers.find(m => m.id === selectedMother.id);
      if (refreshed) setSelectedMother(refreshed);
    }
  };

  const handleSaveReprogram = () => {
    if (!reprogramApp) return;
    if (!reprogramDoctor.trim()) {
      Alert.alert('Campo Obligatorio', 'Por favor ingresa el nombre del especialista.');
      return;
    }

    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const day = reprogramDate.getDate();
    const month = months[reprogramDate.getMonth()];
    let hours = reprogramDate.getHours();
    const minutes = reprogramDate.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formattedTime = `${day} ${month}, ${hours}:${minutes} ${ampm}`;

    updateAppointment(reprogramApp.id, {
      doctor: reprogramDoctor.trim(),
      hora: formattedTime,
      lugar: reprogramLugar.trim() || 'Tani Center - Sede Principal',
      pagoMonto: reprogramMonto.trim() || 'S/. 0.00'
    }).then(() => {
      Alert.alert('Cita Reprogramada', 'La cita se ha reprogramado correctamente.');
      setShowReprogramModal(false);
      setReprogramApp(null);
      if (selectedMother) {
        const refreshed = mothers.find(m => m.id === selectedMother.id);
        if (refreshed) setSelectedMother(refreshed);
      }
    }).catch((err) => {
      Alert.alert('Error', 'No se pudo reprogramar la cita: ' + err.message);
    });
  };

  const handleSaveGroupSched = async () => {
    if (!groupDoctor.trim()) {
      Alert.alert('Campo Obligatorio', 'Por favor ingresa el nombre del especialista.');
      return;
    }
    const handleSearch = (text: string) => {
      const cleanSearch = sanitizeInput(text); // LIMPIAR LA ENTRADA
      setSearchQuery(cleanSearch);
    };

    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const day = groupDate.getDate();
    const month = months[groupDate.getMonth()];
    let hours = groupDate.getHours();
    const minutes = groupDate.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formattedTime = `${day} ${month}, ${hours}:${minutes} ${ampm}`;

    const activeType = CITAS_TYPES.find(t => t.id === groupType) || CITAS_TYPES[2];

    const targets: { motherId: string; babyId: string }[] = [];
    mothers.forEach(m => {
      m.babies.forEach(b => {
        const age = calculateAgeInMonths(b.birthDate);
        const match = groupAgeRange === 'all'
          || (groupAgeRange === '0-3' && age <= 3)
          || (groupAgeRange === '4-6' && age >= 4 && age <= 6)
          || (groupAgeRange === '7-12' && age >= 7 && age <= 12)
          || (groupAgeRange === '12+' && age > 12);

        if (match) {
          targets.push({ motherId: m.id, babyId: b.id });
        }
      });
    });

    if (targets.length === 0) {
      Alert.alert('Sin Pacientes', `No se encontraron bebés registrados en el grupo de edad seleccionado (${groupAgeRange}).`);
      return;
    }

    try {
      await Promise.all(targets.map(t => addAppointment({
        motherId: t.motherId,
        babyId: t.babyId,
        tipo: groupType,
        color: activeType.color,
        titulo: activeType.label,
        hora: formattedTime,
        lugar: groupLugar.trim() || 'Tani Center - Sede Principal',
        nota: groupNotes.trim() ? groupNotes.trim() : null,
        tipoIcon: activeType.icon,
        doctor: groupDoctor.trim(),
        pagoEstado: 'Pendiente',
        pagoMonto: groupAmount.trim() || 'S/. 0.00'
      })));

      Alert.alert('Programación Exitosa', `Se han agendado exitosamente ${targets.length} citas grupales de ${activeType.label} para el rango de edad ${groupAgeRange}.`);
      setShowGroupSchedModal(false);
      setGroupDoctor('');
      setGroupNotes('');
      if (selectedMother) {
        const refreshed = mothers.find(m => m.id === selectedMother.id);
        if (refreshed) setSelectedMother(refreshed);
      }
    } catch (err: any) {
      Alert.alert('Error', 'No se pudieron programar las citas: ' + err.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Directorio de Madres</Text>
            <Text style={styles.headerSubtitle}>Seguimiento clínico y agendado por hitos</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <TouchableOpacity
              style={[styles.addMotherHeaderBtn, { backgroundColor: '#6c757d' }]}
              onPress={() => setShowGroupSchedModal(true)}
            >
              <Ionicons name="people-outline" size={16} color="#FFF" />
              <Text style={styles.addMotherHeaderBtnText}>Prog. Grupal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addMotherHeaderBtn}
              onPress={() => setShowRegisterModal(true)}
            >
              <Ionicons name="person-add-outline" size={16} color="#FFF" />
              <Text style={styles.addMotherHeaderBtnText}>Registrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Buscador */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search-outline" size={20} color={TEXT_SECONDARY} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por madre, bebé o DNI..."
            placeholderTextColor={TEXT_SECONDARY}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={TEXT_SECONDARY} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtros de edad */}
      <View style={{ marginBottom: 12 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
          {AGE_GROUPS.map(group => (
            <TouchableOpacity
              key={group.id}
              style={[styles.filterPill, selectedGroup === group.id && styles.filterPillActive]}
              onPress={() => setSelectedGroup(group.id)}
            >
              <Text style={[styles.filterPillText, selectedGroup === group.id && styles.filterPillTextActive]}>
                {group.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Directorio de Madres */}
      {/* Directorio de Madres Optimizado con FlatList */}
      {filteredMothers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={48} color={TEXT_SECONDARY} style={{ opacity: 0.4, marginBottom: 12 }} />
          <Text style={styles.emptyText}>No se encontraron madres en este grupo.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredMothers}
          keyExtractor={(mother) => mother.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}

          // --- PARÁMETROS DE RENDIMIENTO ---
          initialNumToRender={10}       // Cuántos elementos cargar al inicio (lo que cabe en pantalla)
          maxToRenderPerBatch={10}      // Cuántos elementos procesar por lote al hacer scroll
          windowSize={5}                // Cuánta memoria reservar fuera de la pantalla (5 pantallas de alto)
          removeClippedSubviews={true}  // Desmontar las tarjetas que salieron de pantalla (ahorra RAM)

          // Renderizado de cada tarjeta (Mismo diseño pero modular)
          renderItem={({ item: mother }) => {
            const motherApps = getMotherAppointments(mother.id);
            return (
              <TouchableOpacity
                style={styles.motherCard}
                onPress={() => setSelectedMother(mother)}
              >
                <View style={styles.motherInfoCol}>
                  <Text style={styles.motherName}>{mother.name} {mother.surname}</Text>
                  <Text style={styles.motherDni}>DNI: {mother.dni} • Cel: {mother.phone}</Text>

                  {/* Bebés */}
                  <View style={styles.babiesBadgeRow}>
                    {mother.babies.map(baby => {
                      const age = calculateAgeInMonths(baby.birthDate);
                      let ageBadgeColor = '#e6f3ef';
                      let ageBadgeTextCol = PRIMARY;
                      if (age <= 3) { ageBadgeColor = '#e3f2fd'; ageBadgeTextCol = '#1565c0'; }
                      else if (age <= 6) { ageBadgeColor = '#fff3e0'; ageBadgeTextCol = '#e65100'; }
                      else if (age <= 12) { ageBadgeColor = '#fff8e1'; ageBadgeTextCol = '#f57f17'; }

                      return (
                        <View key={baby.id} style={[styles.babyBadge, { backgroundColor: ageBadgeColor }]}>
                          <Text style={[styles.babyBadgeText, { color: ageBadgeTextCol }]}>
                            {baby.name} ({getAgeText(baby.birthDate)})
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
                <View style={styles.motherActionsCol}>
                  <View style={styles.appCountBadge}>
                    <Text style={styles.appCountText}>{motherApps.length} Citas</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={TEXT_SECONDARY} style={{ marginTop: 8 }} />
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* Modal Ficha Detallada */}
      <Modal
        visible={selectedMother !== null}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setSelectedMother(null)}
      >
        {selectedMother && (
          <SafeAreaView style={styles.modalSafeArea}>
            <View style={styles.modalHeader}>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setSelectedMother(null)}>
                <Ionicons name="arrow-back" size={24} color={PRIMARY} />
              </TouchableOpacity>
              <Text style={styles.modalHeaderTitle}>Ficha de Familia</Text>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>

              {/* Perfil Madre */}
              <View style={styles.modalProfileCard}>
                <Text style={styles.modalMomName}>{selectedMother.name} {selectedMother.surname}</Text>
                <Text style={styles.modalMomSub}>DNI: {selectedMother.dni}</Text>

                <View style={styles.momDivider} />

                <View style={styles.momContactRow}>
                  <Ionicons name="call" size={16} color={PRIMARY} />
                  <Text style={styles.momContactText}>{selectedMother.phone}</Text>
                </View>
                <View style={styles.momContactRow}>
                  <Ionicons name="mail" size={16} color={PRIMARY} />
                  <Text style={styles.momContactText}>{selectedMother.email}</Text>
                </View>
                <View style={styles.momContactRow}>
                  <Ionicons name="calendar" size={16} color={PRIMARY} />
                  <Text style={styles.momContactText}>Registrada: {selectedMother.registrationDate}</Text>
                </View>
              </View>

              {/* Bebés Registrados */}
              <Text style={styles.modalSectionTitle}>Bebés en Seguimiento</Text>
              {selectedMother.babies.map(baby => (
                <View key={baby.id} style={styles.modalBabyCard}>
                  <View style={styles.babyAvatarCircle}>
                    <Ionicons name="happy" size={28} color={PRIMARY} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalBabyName}>{baby.name}</Text>
                    <Text style={styles.modalBabyDetails}>
                      Nacimiento: {baby.birthDate} • Edad: {getAgeText(baby.birthDate)}
                    </Text>
                    <Text style={styles.modalBabyDetails}>Peso Registrado: {baby.weightText || 'Sin registrar'}</Text>
                  </View>
                </View>
              ))}

              {/* Citas y Notas Clínicas */}
              <Text style={styles.modalSectionTitle}>Historial de Citas y Notas Clínicas</Text>
              {getMotherAppointments(selectedMother.id).length === 0 ? (
                <View style={styles.modalEmptyCard}>
                  <Text style={styles.modalEmptyText}>No hay citas registradas.</Text>
                </View>
              ) : (
                getMotherAppointments(selectedMother.id).map(app => (
                  <View key={app.id} style={[styles.modalAppCard, { borderLeftColor: app.color }]}>
                    <View style={styles.appCardHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.modalAppTipo, { color: app.color }]}>{app.tipo}</Text>
                        <Text style={styles.modalAppTitle}>{app.titulo}</Text>
                      </View>
                      <View style={[styles.statusBadge,
                      app.pagoEstado === 'Confirmado' && { backgroundColor: '#e6f3ef' },
                      app.pagoEstado === 'Verificando' && { backgroundColor: '#fff8e1' },
                      app.pagoEstado === 'Pendiente' && { backgroundColor: '#ffebee' }
                      ]}>
                        <Text style={[styles.statusBadgeText,
                        app.pagoEstado === 'Confirmado' && { color: PRIMARY },
                        app.pagoEstado === 'Verificando' && { color: '#765b00' },
                        app.pagoEstado === 'Pendiente' && { color: '#c62828' }
                        ]}>
                          {app.pagoEstado}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.appCardMeta}>📅 {app.hora} • 📍 {app.lugar}</Text>
                    <Text style={styles.appCardMeta}>👨‍⚕️ Especialista: {app.doctor || 'Por asignar'}</Text>
                    {app.nota && <Text style={styles.appCardNota}>&quot;Madre indicó: {app.nota}&quot;</Text>}

                    <View style={styles.clinicalNotesWrapper}>
                      <Text style={styles.clinicalNotesHeader}>Observación Médica / Clínica:</Text>
                      {app.clinicalNotes ? (
                        <Text style={styles.clinicalNotesText}>{app.clinicalNotes}</Text>
                      ) : (
                        <Text style={[styles.clinicalNotesText, { fontStyle: 'italic', color: TEXT_SECONDARY }]}>
                          Sin notas clínicas registradas todavía.
                        </Text>
                      )}

                      <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                        <TouchableOpacity
                          style={styles.addClinicalNotesBtn}
                          onPress={() => {
                            setTargetAppId(app.id);
                            setClinicalNotesText(app.clinicalNotes || '');
                            setShowNotesDialog(true);
                          }}
                        >
                          <Ionicons name="create-outline" size={14} color={PRIMARY} />
                          <Text style={styles.addClinicalNotesBtnText}>
                            {app.clinicalNotes ? 'Editar Observación' : 'Registrar Observación'}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.addClinicalNotesBtn, { borderColor: '#c5a059' }]}
                          onPress={() => {
                            setReprogramApp(app);
                            setReprogramDoctor(app.doctor || '');
                            setReprogramLugar(app.lugar || 'Tani Center - Sede Principal');
                            setReprogramMonto(app.pagoMonto || 'S/. 0.00');
                            setReprogramDate(new Date());
                            setShowReprogramModal(true);
                          }}
                        >
                          <Ionicons name="calendar-outline" size={14} color="#c5a059" />
                          <Text style={[styles.addClinicalNotesBtnText, { color: '#c5a059' }]}>
                            Reprogramar Cita
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))
              )}

              {/* Botón Agendar Cita */}
              <TouchableOpacity
                style={styles.modalBookButton}
                onPress={() => {
                  setSelectedMother(null);
                  router.push('/(citas)/agendar');
                }}
              >
                <Ionicons name="calendar" size={20} color="#FFF" />
                <Text style={styles.modalBookButtonText}>Programar Nueva Cita</Text>
              </TouchableOpacity>

              <View style={{ height: 40 }} />
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>

      {/* Modal Registrar Madre */}
      <Modal
        visible={showRegisterModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowRegisterModal(false)}
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowRegisterModal(false)}>
              <Ionicons name="arrow-back" size={24} color={PRIMARY} />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Registrar Nueva Madre</Text>
          </View>

          <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalSectionTitle}>Datos de la Madre</Text>

            <View style={styles.formCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nombres *</Text>
                <TextInput style={styles.input} value={momName} onChangeText={setMomName} placeholder="Ej. Ana María" />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Apellidos *</Text>
                <TextInput style={styles.input} value={momSurname} onChangeText={setMomSurname} placeholder="Ej. Torres Paz" />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>DNI *</Text>
                <TextInput style={styles.input} value={momDni} onChangeText={setMomDni} keyboardType="numeric" maxLength={8} placeholder="8 dígitos" />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Teléfono / Celular *</Text>
                <TextInput style={styles.input} value={momPhone} onChangeText={setMomPhone} keyboardType="phone-pad" placeholder="Ej. +51 987 654 321" />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Correo Electrónico *</Text>
                <TextInput style={styles.input} value={momEmail} onChangeText={setMomEmail} keyboardType="email-address" placeholder="Ej. ana.torres@gmail.com" />
              </View>
            </View>

            <Text style={styles.modalSectionTitle}>Datos del Bebé</Text>
            <View style={styles.formCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nombre del Bebé *</Text>
                <TextInput style={styles.input} value={newBabyName} onChangeText={setNewBabyName} placeholder="Ej. Lucas" />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Peso (Opcional)</Text>
                <TextInput style={styles.input} value={newBabyWeight} onChangeText={setNewBabyWeight} placeholder="Ej. 3.5 kg" />
              </View>

              {/* Fecha de nacimiento */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Fecha de Nacimiento del Bebé *</Text>
                <TouchableOpacity
                  style={styles.datePickerSelector}
                  onPress={() => setShowRegisterDatePicker(true)}
                >
                  <Ionicons name="calendar-outline" size={20} color={PRIMARY} />
                  <Text style={styles.datePickerSelectorText}>
                    {newBabyBirthDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {showRegisterDatePicker && (
              <DateTimePicker
                value={newBabyBirthDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowRegisterDatePicker(Platform.OS === 'ios');
                  if (selectedDate) setNewBabyBirthDate(selectedDate);
                }}
                maximumDate={new Date()}
              />
            )}

            <TouchableOpacity
              style={styles.modalBookButton}
              onPress={handleSaveMother}
            >
              <Ionicons name="checkmark-circle" size={20} color="#FFF" />
              <Text style={styles.modalBookButtonText}>Guardar e Inscribir Familia</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Modal Dialog para Registrar Notas Clínicas */}
      <Modal
        visible={showNotesDialog}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowNotesDialog(false)}
      >
        <View style={styles.dialogOverlay}>
          <View style={styles.dialogCard}>
            <Text style={styles.dialogTitle}>Registrar Nota Clínica</Text>
            <Text style={styles.dialogSubtitle}>Escribe el reporte de crecimiento o evaluación de desarrollo:</Text>

            <TextInput
              style={styles.dialogTextArea}
              placeholder="Ej: Bebé presenta buen reflejo de succión. Peso adecuado para la edad. Se recomienda continuar lactancia..."
              placeholderTextColor={TEXT_SECONDARY}
              multiline
              numberOfLines={6}
              value={clinicalNotesText}
              onChangeText={setClinicalNotesText}
              textAlignVertical="top"
            />

            <View style={styles.dialogActions}>
              <TouchableOpacity style={styles.dialogCancelBtn} onPress={() => setShowNotesDialog(false)}>
                <Text style={styles.dialogCancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dialogSaveBtn} onPress={handleSaveNotes}>
                <Text style={styles.dialogSaveBtnText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Reprogramación Cita */}
      <Modal
        visible={showReprogramModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => {
          setShowReprogramModal(false);
          setReprogramApp(null);
        }}
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => {
              setShowReprogramModal(false);
              setReprogramApp(null);
            }}>
              <Ionicons name="arrow-back" size={24} color={PRIMARY} />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Reprogramar Cita</Text>
          </View>

          <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
            {reprogramApp && (
              <>
                <Text style={styles.modalSectionTitle}>Detalles de la Cita: {reprogramApp.titulo}</Text>

                <View style={styles.formCard}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Especialista / Doctor *</Text>
                    <TextInput
                      style={styles.input}
                      value={reprogramDoctor}
                      onChangeText={setReprogramDoctor}
                      placeholder="Nombre del especialista"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Establecimiento / Lugar *</Text>
                    <TextInput
                      style={styles.input}
                      value={reprogramLugar}
                      onChangeText={setReprogramLugar}
                      placeholder="Lugar de la cita"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Costo / Monto *</Text>
                    <TextInput
                      style={styles.input}
                      value={reprogramMonto}
                      onChangeText={setReprogramMonto}
                      placeholder="S/. XX.XX"
                    />
                  </View>

                  {/* Fecha de la cita */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Fecha de la Cita *</Text>
                    <TouchableOpacity
                      style={styles.datePickerSelector}
                      onPress={() => setShowReprogramDatePicker(true)}
                    >
                      <Ionicons name="calendar-outline" size={20} color={PRIMARY} />
                      <Text style={styles.datePickerSelectorText}>
                        {reprogramDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Hora de la cita */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Hora de la Cita *</Text>
                    <TouchableOpacity
                      style={styles.datePickerSelector}
                      onPress={() => setShowReprogramTimePicker(true)}
                    >
                      <Ionicons name="time-outline" size={20} color={PRIMARY} />
                      <Text style={styles.datePickerSelectorText}>
                        {reprogramDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {showReprogramDatePicker && (
                  <DateTimePicker
                    value={reprogramDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowReprogramDatePicker(Platform.OS === 'ios');
                      if (selectedDate) {
                        const newDate = new Date(reprogramDate);
                        newDate.setFullYear(selectedDate.getFullYear());
                        newDate.setMonth(selectedDate.getMonth());
                        newDate.setDate(selectedDate.getDate());
                        setReprogramDate(newDate);
                      }
                    }}
                    minimumDate={new Date()}
                  />
                )}

                {showReprogramTimePicker && (
                  <DateTimePicker
                    value={reprogramDate}
                    mode="time"
                    display="default"
                    onChange={(event, selectedTime) => {
                      setShowReprogramTimePicker(Platform.OS === 'ios');
                      if (selectedTime) {
                        const newDate = new Date(reprogramDate);
                        newDate.setHours(selectedTime.getHours());
                        newDate.setMinutes(selectedTime.getMinutes());
                        setReprogramDate(newDate);
                      }
                    }}
                  />
                )}

                <TouchableOpacity
                  style={styles.modalBookButton}
                  onPress={handleSaveReprogram}
                >
                  <Ionicons name="save-outline" size={20} color="#FFF" />
                  <Text style={styles.modalBookButtonText}>Guardar Reprogramación</Text>
                </TouchableOpacity>
              </>
            )}
            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Modal Programación Grupal */}
      <Modal
        visible={showGroupSchedModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowGroupSchedModal(false)}
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowGroupSchedModal(false)}>
              <Ionicons name="arrow-back" size={24} color={PRIMARY} />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Programación Grupal por Edad</Text>
          </View>

          <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalSectionTitle}>Configuración del Control Grupal</Text>

            <View style={styles.formCard}>
              {/* Selector de Rango de Edad */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Grupo de Edad de los Bebés *</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                  {[
                    { id: 'all', label: 'Todos' },
                    { id: '0-3', label: '0-3m (Lactancia)' },
                    { id: '4-6', label: '4-6m (Sólidos)' },
                    { id: '7-12', label: '7-12m (Gateo)' },
                    { id: '12+', label: '12m+ (Lenguaje)' }
                  ].map(g => (
                    <TouchableOpacity
                      key={g.id}
                      style={[
                        styles.filterPill,
                        groupAgeRange === g.id && { backgroundColor: PRIMARY, borderColor: PRIMARY }
                      ]}
                      onPress={() => setGroupAgeRange(g.id)}
                    >
                      <Text style={[
                        styles.filterPillText,
                        groupAgeRange === g.id && { color: '#FFF' }
                      ]}>
                        {g.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Selector de Tipo de Cita */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tipo de Cita / Actividad *</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                  {CITAS_TYPES.map(t => (
                    <TouchableOpacity
                      key={t.id}
                      style={[
                        styles.filterPill,
                        groupType === t.id && { backgroundColor: t.color, borderColor: t.color }
                      ]}
                      onPress={() => setGroupType(t.id)}
                    >
                      <Text style={[
                        styles.filterPillText,
                        groupType === t.id && { color: '#FFF' }
                      ]}>
                        {t.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Especialista / Doctor *</Text>
                <TextInput
                  style={styles.input}
                  value={groupDoctor}
                  onChangeText={setGroupDoctor}
                  placeholder="Nombre del especialista responsable"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Lugar del Evento *</Text>
                <TextInput
                  style={styles.input}
                  value={groupLugar}
                  onChangeText={setGroupLugar}
                  placeholder="Ej: Sala de Lactancia o Zoom"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Costo / Monto por Paciente *</Text>
                <TextInput
                  style={styles.input}
                  value={groupAmount}
                  onChangeText={setGroupAmount}
                  placeholder="S/. 0.00"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Observaciones / Notas (Opcional)</Text>
                <TextInput
                  style={styles.input}
                  value={groupNotes}
                  onChangeText={setGroupNotes}
                  placeholder="Instrucciones adicionales para la madre..."
                />
              </View>

              {/* Fecha de la cita */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Fecha del Control Grupal *</Text>
                <TouchableOpacity
                  style={styles.datePickerSelector}
                  onPress={() => setShowGroupDatePicker(true)}
                >
                  <Ionicons name="calendar-outline" size={20} color={PRIMARY} />
                  <Text style={styles.datePickerSelectorText}>
                    {groupDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Hora de la cita */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Hora del Control Grupal *</Text>
                <TouchableOpacity
                  style={styles.datePickerSelector}
                  onPress={() => setShowGroupTimePicker(true)}
                >
                  <Ionicons name="time-outline" size={20} color={PRIMARY} />
                  <Text style={styles.datePickerSelectorText}>
                    {groupDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {showGroupDatePicker && (
              <DateTimePicker
                value={groupDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowGroupDatePicker(Platform.OS === 'ios');
                  if (selectedDate) {
                    const newDate = new Date(groupDate);
                    newDate.setFullYear(selectedDate.getFullYear());
                    newDate.setMonth(selectedDate.getMonth());
                    newDate.setDate(selectedDate.getDate());
                    setGroupDate(newDate);
                  }
                }}
                minimumDate={new Date()}
              />
            )}

            {showGroupTimePicker && (
              <DateTimePicker
                value={groupDate}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowGroupTimePicker(Platform.OS === 'ios');
                  if (selectedTime) {
                    const newDate = new Date(groupDate);
                    newDate.setHours(selectedTime.getHours());
                    newDate.setMinutes(selectedTime.getMinutes());
                    setGroupDate(newDate);
                  }
                }}
              />
            )}

            <TouchableOpacity
              style={styles.modalBookButton}
              onPress={handleSaveGroupSched}
            >
              <Ionicons name="people-outline" size={20} color="#FFF" />
              <Text style={styles.modalBookButtonText}>Programar para el Grupo</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
    paddingBottom: 12,
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
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eae8e7',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: TEXT,
  },
  filtersScroll: {
    paddingHorizontal: 24,
    paddingBottom: 4,
    gap: 8,
  },
  filterPill: {
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  filterPillActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_SECONDARY,
  },
  filterPillTextActive: {
    color: '#FFF',
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 12,
  },
  emptyContainer: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    marginTop: 20,
  },
  emptyText: {
    color: TEXT_SECONDARY,
    fontSize: 14,
    fontWeight: '500',
  },
  motherCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  motherInfoCol: {
    flex: 1,
    paddingRight: 12,
  },
  motherName: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 4,
  },
  motherDni: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    marginBottom: 8,
  },
  babiesBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  babyBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  babyBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  motherActionsCol: {
    alignItems: 'flex-end',
  },
  appCountBadge: {
    backgroundColor: '#e6f3ef',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  appCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: PRIMARY,
  },

  // Estilos del Modal Ficha Detallada
  modalSafeArea: {
    flex: 1,
    backgroundColor: '#Fbf9f8',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    backgroundColor: '#FFF',
  },
  modalCloseButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f5f3f3',
    marginRight: 16,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PRIMARY,
  },
  modalContent: {
    padding: 24,
  },
  modalProfileCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    marginBottom: 24,
  },
  modalMomName: {
    fontSize: 22,
    fontWeight: '800',
    color: TEXT,
  },
  modalMomSub: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    marginTop: 2,
  },
  momDivider: {
    height: 1,
    backgroundColor: '#f0eded',
    marginVertical: 14,
  },
  momContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  momContactText: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    fontWeight: '500',
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: TEXT,
    marginBottom: 12,
    marginTop: 8,
  },
  modalBabyCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  babyAvatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e6f3ef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBabyName: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT,
  },
  modalBabyDetails: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    marginTop: 2,
  },
  modalEmptyCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    marginBottom: 20,
  },
  modalEmptyText: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    fontStyle: 'italic',
  },
  modalAppCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    marginBottom: 16,
  },
  appCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  modalAppTipo: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  modalAppTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT,
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  appCardMeta: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    marginBottom: 4,
  },
  appCardNota: {
    fontSize: 12,
    color: '#9b4500',
    backgroundColor: '#fff3e0',
    padding: 8,
    borderRadius: 8,
    marginTop: 6,
    fontStyle: 'italic',
  },
  clinicalNotesWrapper: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  clinicalNotesHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 4,
  },
  clinicalNotesText: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    lineHeight: 18,
  },
  addClinicalNotesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  addClinicalNotesBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: PRIMARY,
  },
  modalBookButton: {
    backgroundColor: PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  modalBookButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Dialog Overlay
  dialogOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialogCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TEXT,
    marginBottom: 6,
  },
  dialogSubtitle: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    marginBottom: 16,
    lineHeight: 18,
  },
  dialogTextArea: {
    backgroundColor: '#f5f3f3',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: TEXT,
    minHeight: 120,
    marginBottom: 20,
  },
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  dialogCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  dialogCancelBtnText: {
    color: TEXT_SECONDARY,
    fontWeight: '600',
    fontSize: 14,
  },
  dialogSaveBtn: {
    backgroundColor: PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  dialogSaveBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  addMotherHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 6,
  },
  addMotherHeaderBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f5f3f3',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: TEXT,
  },
  datePickerSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f3f3',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  datePickerSelectorText: {
    fontSize: 14,
    color: TEXT,
  },
});
