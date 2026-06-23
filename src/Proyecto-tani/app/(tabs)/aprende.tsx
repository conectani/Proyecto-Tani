import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/auth';
import { useBabyStore, calculateAgeInMonths, getAgeText } from '@/stores/babies';
import * as Haptics from 'expo-haptics';

const PRIMARY = '#006953';
const TEXT = '#1b1c1c';
const TEXT_SECONDARY = '#3e4945';

const MILESTONES_BY_AGE = [
  {
    range: [0, 3],
    title: 'Meses 1-3: Adaptación y Apego',
    checks: [
      { id: 'c1', text: 'Sigue objetos en movimiento con la mirada' },
      { id: 'c2', text: 'Sonríe cuando le hablas (sonrisa social)' },
      { id: 'c3', text: 'Sostiene la cabeza brevemente boca abajo' }
    ],
    bentoCognitivo: 'Enfoque visual activo',
    bentoSocial: 'Llanto diferenciado',
    nextTitle: 'Siguiente: Meses 4-5',
    nextSubtitle: 'Descubriendo sus manos y primeros agarres'
  },
  {
    range: [4, 5],
    title: 'Meses 4-5: Exploración y Sonrisas',
    checks: [
      { id: 'c1', text: 'Se apoya en los codos boca abajo' },
      { id: 'c2', text: 'Agarra y sacude juguetes sonajeros' },
      { id: 'c3', text: 'Balbucea sonidos imitando voces' }
    ],
    bentoCognitivo: 'Exploración oral de objetos',
    bentoSocial: 'Sonríe de forma espontánea',
    nextTitle: 'Siguiente: Meses 6-7',
    nextSubtitle: 'Inicio de sólidos y sentarse solos'
  },
  {
    range: [6, 7],
    title: 'Meses 6-7: El Gran Cambio',
    checks: [
      { id: 'c1', text: 'Se mantiene sentado sin apoyo' },
      { id: 'c2', text: 'Inicia alimentación sólida (papillas)' },
      { id: 'c3', text: 'Pasa objetos de una mano a otra' }
    ],
    bentoCognitivo: 'Exploración táctil activa',
    bentoSocial: 'Primeros balbuceos',
    nextTitle: 'Siguiente: Meses 8-9',
    nextSubtitle: 'Primeros gateos y texturas grumosas'
  },
  {
    range: [8, 9],
    title: 'Meses 8-9: Gateo y Coordinación',
    checks: [
      { id: 'c1', text: 'Se arrastra o gatea activamente' },
      { id: 'c2', text: 'Usa agarre en pinza (índice y pulgar)' },
      { id: 'c3', text: 'Muestra ansiedad ante extraños' }
    ],
    bentoCognitivo: 'Busca objetos escondidos',
    bentoSocial: 'Entiende el "No" y señas',
    nextTitle: 'Siguiente: Meses 10-12',
    nextSubtitle: 'Pararse solos y primeras palabras'
  },
  {
    range: [10, 12],
    title: 'Meses 10-12: Primeros Pasos',
    checks: [
      { id: 'c1', text: 'Se pone de pie apoyándose en muebles' },
      { id: 'c2', text: 'Dice palabras sencillas (mamá/papá)' },
      { id: 'c3', text: 'Hace gestos de despedida con la mano' }
    ],
    bentoCognitivo: 'Imita gestos de adultos',
    bentoSocial: 'Muestra preferencia por juguetes',
    nextTitle: 'Siguiente: 1 Año+',
    nextSubtitle: 'Caminar independiente y frases complejas'
  },
  {
    range: [13, 999],
    title: '1 Año+: Independencia y Juego',
    checks: [
      { id: 'c1', text: 'Camina de forma independiente' },
      { id: 'c2', text: 'Construye torres con bloques' },
      { id: 'c3', text: 'Dice al menos 5-10 palabras con sentido' }
    ],
    bentoCognitivo: 'Entiende órdenes de un paso',
    bentoSocial: 'Señala para mostrar interés',
    nextTitle: 'Crianza Tani',
    nextSubtitle: 'Seguimiento de controles de desarrollo anuales'
  }
];

const GUIDES_BY_AGE = [
  {
    range: [0, 5],
    guides: [
      {
        title: 'Técnicas de Agarre Correcto',
        tag: 'LACTANCIA',
        desc: 'Evita grietas y mejora el flujo de leche en las tomas.',
        duration: 'Guía de 5 pasos',
        icon: 'book-outline',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzOSbzmn_xadKosD5dYU5zDT-ykmPIk_S638r5tkE_v_34rXeESoNwxVTa2CM2l4ofSLnyF5RWmn6t3pYotLy3BSaq960ljSfc22ij1PomCIyxfcmFRkrpYO2hgLKqo4cPBNKMHlJZCYdlE3-zV8-vZjn2ScocIuVC6MlCqCe_7aWiyhazJrE5-9bUutEjU3tHYVb_U8qoNpQ3rIpJkeJQthXThyqNcU0teibkejj4vg_aLIrwCgEd8gVBwyqQMU1EgJcBb4GAJGw'
      },
      {
        title: 'Beneficios del Piel a Piel',
        tag: 'APEGO',
        desc: 'Regula la temperatura y fortalece el vínculo afectivo inicial.',
        duration: '10 min lectura',
        icon: 'time-outline',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4J2btLI94crP8TrUktNuXNS7Gi_ktU99dW9O6vKCQNM89-470s-bpF9lYV282DZwK9HObHxkfEo2_a5upxr8YAsDDZj6-v2Icu9p_jXYbrA0FwfMwNF2u6LrgcywdZIiqvpz0PC_83_t1-aqyNob-Dd1JVEYQ2dhjO9Pxzbw85yGH0oBiSqTbN_2xP-jmexUNWaGQkZe1lkECL0Px3LSSkPNjH1Qj9wAlw_nl4FIhnop5dwNmr4CyVxzheer8IhBMEbW1XwJYJFE'
      }
    ]
  },
  {
    range: [6, 999],
    guides: [
      {
        title: 'Papilla de Hierro y Camote',
        tag: 'RECETA MINSA',
        desc: 'Ideal para prevenir la anemia infantil y aportar energía.',
        duration: '15 min preparación',
        icon: 'time-outline',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4J2btLI94crP8TrUktNuXNS7Gi_ktU99dW9O6vKCQNM89-470s-bpF9lYV282DZwK9HObHxkfEo2_a5upxr8YAsDDZj6-v2Icu9p_jXYbrA0FwfMwNF2u6LrgcywdZIiqvpz0PC_83_t1-aqyNob-Dd1JVEYQ2dhjO9Pxzbw85yGH0oBiSqTbN_2xP-jmexUNWaGQkZe1lkECL0Px3LSSkPNjH1Qj9wAlw_nl4FIhnop5dwNmr4CyVxzheer8IhBMEbW1XwJYJFE'
      },
      {
        title: 'Guía de Texturas Grumosas',
        tag: 'NUTRICIÓN',
        desc: 'Cómo pasar de papillas licuadas a alimentos machacados.',
        duration: 'Guía de 4 pasos',
        icon: 'book-outline',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzOSbzmn_xadKosD5dYU5zDT-ykmPIk_S638r5tkE_v_34rXeESoNwxVTa2CM2l4ofSLnyF5RWmn6t3pYotLy3BSaq960ljSfc22ij1PomCIyxfcmFRkrpYO2hgLKqo4cPBNKMHlJZCYdlE3-zV8-vZjn2ScocIuVC6MlCqCe_7aWiyhazJrE5-9bUutEjU3tHYVb_U8qoNpQ3rIpJkeJQthXThyqNcU0teibkejj4vg_aLIrwCgEd8gVBwyqQMU1EgJcBb4GAJGw'
      }
    ]
  }
];

export default function AprendeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { babies, activeBabyId } = useBabyStore();

  const activeBaby = babies.find((b) => b.id === activeBabyId) || babies[0];
  const ageInMonths = activeBaby ? calculateAgeInMonths(activeBaby.birthDate) : 6;

  // Encontrar hitos correspondientes al rango de edad
  const currentMilestone = MILESTONES_BY_AGE.find(
    (m) => ageInMonths >= m.range[0] && ageInMonths <= m.range[1]
  ) || MILESTONES_BY_AGE[2]; // por defecto el de 6-7 meses

  // Encontrar guías correspondientes
  const activeGuideGroup = GUIDES_BY_AGE.find(
    (g) => ageInMonths >= g.range[0] && ageInMonths <= g.range[1]
  ) || GUIDES_BY_AGE[1];

  // Estado local para los checkboxes de los hitos del bebé activo
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Resetear al cambiar de bebé
    setCheckedIds({});
  }, [activeBabyId]);

  const toggleCheck = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCheckedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getHeaderName = () => {
    if (user) return `${user.name} ${user.surname}`;
    return 'Mariana Sofia Garcia';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerProfile}>
          <View style={styles.avatarContainer}>
            <Image 
              source={require('@/assets/images/Tani user icon.png')} 
              style={styles.avatar} 
            />
          </View>
          <Text style={styles.headerName} numberOfLines={1}>{getHeaderName()}</Text>
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/notificaciones')}>
          <Ionicons name="notifications-outline" size={24} color={PRIMARY} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Hitos del Desarrollo Dinámicos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Hitos del Desarrollo</Text>
              <Text style={styles.subtitleSub}>Seguimiento personalizado para {activeBaby?.name} ({getAgeText(activeBaby?.birthDate)})</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(aprende)/guia')}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.bentoGrid}>
            {/* Main Highlight */}
            <View style={styles.mainHighlight}>
              <View style={styles.highlightIcon}>
                <Ionicons name="happy" size={24} color={PRIMARY} />
              </View>
              <Text style={styles.highlightTitle}>{currentMilestone.title}</Text>
              
              {currentMilestone.checks.map((check) => {
                const isChecked = !!checkedIds[check.id];
                return (
                  <TouchableOpacity 
                    key={check.id} 
                    style={styles.checkItem}
                    onPress={() => toggleCheck(check.id)}
                  >
                    <Ionicons 
                      name={isChecked ? "checkmark-circle" : "radio-button-off"} 
                      size={20} 
                      color={isChecked ? Colors.light.primary : TEXT_SECONDARY} 
                    />
                    <Text style={[styles.checkText, isChecked && { textDecorationLine: 'line-through', opacity: 0.7 }]}>
                      {check.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity 
                style={styles.completeButton}
                onPress={() => {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  Alert.alert('¡Excelente progreso!', `Has registrado avances en el desarrollo de ${activeBaby?.name}.`);
                }}
              >
                <Text style={styles.completeButtonText}>Guardar Avance</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bentoRightCol}>
              {/* Sec 1 */}
              <View style={[styles.bentoSmallCard, { backgroundColor: '#fff8e1', borderColor: 'rgba(211,165,0,0.1)' }]}>
                <Ionicons name="bulb" size={28} color="#765b00" />
                <Text style={[styles.bentoSmallTag, { color: '#765b00' }]}>COGNITIVO</Text>
                <Text style={styles.bentoSmallText}>{currentMilestone.bentoCognitivo}</Text>
              </View>
              {/* Sec 2 */}
              <View style={[styles.bentoSmallCard, { backgroundColor: '#fff3e0', borderColor: 'rgba(155,69,0,0.1)', marginTop: 12 }]}>
                <Ionicons name="people" size={28} color="#9b4500" />
                <Text style={[styles.bentoSmallTag, { color: '#9b4500' }]}>SOCIAL</Text>
                <Text style={styles.bentoSmallText}>{currentMilestone.bentoSocial}</Text>
              </View>
            </View>
          </View>

          {/* Next Month Banner */}
          <View style={styles.nextMonthBanner}>
            <View style={styles.nextMonthTextCol}>
              <Text style={styles.nextMonthTitle}>{currentMilestone.nextTitle}</Text>
              <Text style={styles.nextMonthSubtitle}>{currentMilestone.nextSubtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={PRIMARY} />
          </View>
        </View>

        {/* Guías Rápidas Nutrición y Cuidado */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Guías y Material Educativo</Text>
            <TouchableOpacity onPress={() => router.push('/(aprende)/guia')}>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {activeGuideGroup.guides.map((guide, index) => (
              <TouchableOpacity key={index} style={styles.guideCard} onPress={() => router.push('/(aprende)/guia')}>
                <ImageBackground 
                  source={{ uri: guide.image }} 
                  style={styles.guideImage}
                >
                  <View style={styles.guideBadge}>
                    <Text style={[styles.guideBadgeText, { color: guide.tag === 'LACTANCIA' ? PRIMARY : '#9b4500' }]}>
                      {guide.tag}
                    </Text>
                  </View>
                </ImageBackground>
                <View style={styles.guideContent}>
                  <Text style={styles.guideTitle}>{guide.title}</Text>
                  <Text style={styles.guideDesc}>{guide.desc}</Text>
                  <View style={styles.guideFooter}>
                    <Ionicons name={guide.icon === 'book-outline' ? 'book-outline' : 'time-outline'} size={14} color={PRIMARY} />
                    <Text style={styles.guideFooterText}>{guide.duration}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#eae8e7',
    marginRight: 12,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  headerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.primary,
    flex: 1,
  },
  iconButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  subtitleSub: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    marginTop: 2,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  bentoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  mainHighlight: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginRight: 12,
  },
  highlightIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#e6f3ef',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  highlightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 12,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkText: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 8,
    color: Colors.light.text,
    flex: 1,
  },
  completeButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  completeButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bentoRightCol: {
    width: '35%',
    justifyContent: 'space-between',
  },
  bentoSmallCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  bentoSmallTag: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 4,
  },
  bentoSmallText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
  nextMonthBanner: {
    backgroundColor: '#f5f3f3',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  nextMonthTextCol: {
    flex: 1,
  },
  nextMonthTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  nextMonthSubtitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  horizontalScroll: {
    paddingBottom: 8,
  },
  guideCard: {
    width: 260,
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  guideImage: {
    height: 120,
    width: '100%',
  },
  guideBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  guideBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  guideContent: {
    padding: 16,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
    lineHeight: 20,
  },
  guideDesc: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: 12,
  },
  guideFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0eded',
  },
  guideFooterText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: '500',
    marginLeft: 6,
  },
});