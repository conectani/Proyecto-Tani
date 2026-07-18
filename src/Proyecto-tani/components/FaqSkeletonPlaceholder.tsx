import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonLoader from './SkeletonLoader';

export default function FaqSkeletonPlaceholder() {
  return (
    <View style={styles.container}>
      {/* Simulación de 3 tarjetas de preguntas cargando */}
      {[1, 2, 3].map((item) => (
        <View key={item} style={styles.card}>
          {/* Título de la pregunta (Línea gruesa y corta) */}
          <SkeletonLoader width="70%" height={18} borderRadius={4} style={{ marginBottom: 12 }} />
          {/* Respuesta (Líneas delgadas de texto) */}
          <SkeletonLoader width="100%" height={12} borderRadius={4} style={{ marginBottom: 8 }} />
          <SkeletonLoader width="90%" height={12} borderRadius={4} style={{ marginBottom: 16 }} />
          
          {/* Divisor */}
          {item < 3 && <View style={styles.divider} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  card: {
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(190,201,195,0.2)',
    marginVertical: 12,
  },
});