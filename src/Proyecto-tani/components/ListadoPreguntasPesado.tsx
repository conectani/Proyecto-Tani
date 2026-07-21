import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

// El listado de preguntas se aloja aquí para no sobrecargar el bundle principal de inicio
const FAQS = [
  {
    pregunta: '¿Cómo agendo mi primera consulta prenatal?',
    respuesta: "Puedes hacerlo desde la pestaña 'Citas' seleccionando a tu especialista preferido o la fecha más cercana.",
  },
  {
    pregunta: '¿Puedo cancelar una cita el mismo día?',
    respuesta: 'Recomendamos cancelar con al menos 24 horas de anticipación para permitir que otra madre tome el espacio.',
  },
  {
    pregunta: '¿Cómo cambio mi contraseña?',
    respuesta: "Accede a tu perfil, selecciona 'Seguridad' y sigue los pasos para restablecer tu clave.",
  },
  {
    pregunta: '¿Puedo usar la app sin internet?',
    respuesta: 'Ciertas funciones como el calendario de citas están disponibles offline, pero los chats requieren conexión.',
  },
];

export default function ListadoPreguntasPesado() {
  return (
    <View style={styles.faqList}>
      {FAQS.map((faq, idx) => (
        <View key={faq.pregunta} style={styles.faqItem}>
          <Text style={styles.faqQuestion}>{faq.pregunta}</Text>
          <Text style={styles.faqAnswer}>{faq.respuesta}</Text>
          {idx < FAQS.length - 1 && <View style={styles.divider} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  faqList: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  faqItem: {
    marginBottom: 4,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1b1c1c',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(190,201,195,0.3)',
    marginBottom: 16,
  },
});