import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function GuiaAlimentacionScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <View style={styles.headerProfile}>
          <Image 
            source={require('@/assets/images/Tani user icon.png')}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>(Apellido)</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Title Section */}
        <View style={styles.titleSection}>
          <View style={styles.badge}>
            <MaterialIcons name="child-care" size={16} color="#005140" />
            <Text style={styles.badgeText}>Mateo • 8 meses</Text>
          </View>
          <Text style={styles.pageTitle}>Guía de Alimentación Complementaria</Text>
          <Text style={styles.pageDescription}>
            Un plan nutricional diseñado para el desarrollo cognitivo y físico en esta etapa crucial.
          </Text>
        </View>

        {/* Hero Image Card */}
        <View style={styles.heroCard}>
          <Image 
            source={require('@/assets/images/baby_mateo.png')}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroFooter}>
            <Text style={styles.heroTitle}>Texturas Ideales</Text>
            <Ionicons name="restaurant" size={24} color="#FFF" />
          </View>
        </View>

        {/* Grid Section */}
        <View style={styles.grid}>
          
          {/* Vegetables Card */}
          <View style={styles.vegetableCard}>
            <View style={styles.vegDeco} />
            <View style={styles.cardHeader}>
              <View style={styles.iconBoxPrimary}>
                <Ionicons name="nutrition" size={20} color="#FFF" />
              </View>
              <Text style={styles.cardTitle}>Vegetales</Text>
            </View>
            <Text style={styles.cardSubtitle}>Recomendados para esta semana:</Text>
            <View style={styles.tagContainer}>
              <View style={styles.tag}><Text style={styles.tagText}>Zanahoria</Text></View>
              <View style={styles.tag}><Text style={styles.tagText}>Zapallo</Text></View>
              <View style={styles.tag}><Text style={styles.tagText}>Espinaca</Text></View>
            </View>
          </View>

          {/* Fruits Card */}
          <View style={styles.fruitsCard}>
            <View style={styles.cardHeader}>
              <View style={styles.iconBoxSecondary}>
                <Ionicons name="leaf" size={20} color="#FFF" />
              </View>
              <Text style={styles.cardTitle}>Frutas de temporada</Text>
            </View>
            <View style={styles.listContainer}>
              <View style={styles.listItem}>
                <Text style={styles.listItemText}>Papaya</Text>
                <Ionicons name="checkmark-circle" size={18} color="#9b4500" />
              </View>
              <View style={styles.listItem}>
                <Text style={styles.listItemText}>Plátano</Text>
                <Ionicons name="checkmark-circle" size={18} color="#9b4500" />
              </View>
              <View style={styles.listItem}>
                <Text style={styles.listItemText}>Manzana</Text>
                <Ionicons name="checkmark-circle" size={18} color="#9b4500" />
              </View>
            </View>
          </View>

          {/* Protein Card */}
          <View style={styles.proteinCard}>
            <View style={styles.proteinContent}>
              <View style={styles.proteinHeader}>
                <Ionicons name="water" size={16} color="#9df3d7" />
                <Text style={styles.proteinEyebrow}>ESENCIAL</Text>
              </View>
              <Text style={styles.proteinTitle}>Proteínas y Hierro</Text>
              <Text style={styles.proteinDesc}>
                Fundamentales para prevenir la anemia y apoyar el crecimiento acelerado de Mateo.
              </Text>
            </View>
            <View style={styles.proteinList}>
              <View style={styles.proteinItem}>
                <Ionicons name="fish" size={20} color="#ffdf93" />
                <Text style={styles.proteinItemText}>Hígado de pollo</Text>
              </View>
              <View style={styles.proteinItem}>
                <Ionicons name="water" size={20} color="#ffdf93" />
                <Text style={styles.proteinItemText}>Sangrecita</Text>
              </View>
            </View>
          </View>

          {/* Tips Card */}
          <View style={styles.tipsCard}>
            <View style={styles.iconBoxTertiary}>
              <MaterialIcons name="soup-kitchen" size={24} color="#765b00" />
            </View>
            <View style={styles.tipsContent}>
              <Text style={styles.tipsTitle}>Consejos de textura</Text>
              <Text style={styles.tipsText}>
                A los 8 meses, Mateo debe transitar hacia texturas más complejas. Ofrécele <Text style={styles.tipsTextBold}>papillas espesas y grumosas</Text>. Es importante evitar los alimentos completamente licuados para estimular su masticación y desarrollo mandibular.
              </Text>
            </View>
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
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#Fbf9f8',
    ...Platform.select({
      ios: { zIndex: 10 },
      android: { elevation: 10 }
    })
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 32,
  },
  titleSection: {
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9df3d7', // primary-fixed
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  badgeText: {
    color: '#005140', // on-primary-fixed-variant
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pageTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.light.text,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  pageDescription: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    lineHeight: 24,
    marginTop: 8,
  },
  heroCard: {
    height: 192,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 32,
    elevation: 4,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  heroFooter: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  grid: {
    gap: 16,
  },
  vegetableCard: {
    backgroundColor: '#f5f3f3',
    borderRadius: 24,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  vegDeco: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 128,
    height: 128,
    backgroundColor: 'rgba(157, 243, 215, 0.3)',
    borderRadius: 64,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    zIndex: 1,
  },
  iconBoxPrimary: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBoxSecondary: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#9b4500', // secondary
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 12,
    zIndex: 1,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    zIndex: 1,
  },
  tag: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  tagText: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  fruitsCard: {
    backgroundColor: 'rgba(255, 219, 201, 0.5)', // secondary-fixed / 50
    borderRadius: 24,
    padding: 24,
  },
  listContainer: {
    gap: 12,
    marginTop: 8,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  listItemText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.text,
  },
  proteinCard: {
    backgroundColor: Colors.light.primary,
    borderRadius: 24,
    padding: 24,
    gap: 24,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 6,
  },
  proteinContent: {
    flex: 1,
    gap: 12,
  },
  proteinHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  proteinEyebrow: {
    color: '#9df3d7', // primary-fixed
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  proteinTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  proteinDesc: {
    color: '#81d7bb', // primary-fixed-dim
    fontSize: 14,
    lineHeight: 20,
  },
  proteinList: {
    gap: 8,
  },
  proteinItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 12,
  },
  proteinItemText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '500',
  },
  tipsCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 2,
    marginTop: 8,
  },
  iconBoxTertiary: {
    backgroundColor: 'rgba(211, 165, 0, 0.2)', // tertiary-container / 20
    padding: 12,
    borderRadius: 16,
  },
  tipsContent: {
    flex: 1,
    gap: 4,
  },
  tipsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  tipsText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },
  tipsTextBold: {
    color: Colors.light.primary,
    fontWeight: 'bold',
  }
});