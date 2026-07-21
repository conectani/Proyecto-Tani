import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
  error: Error | null;
}
export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };
  // 1. Detecta que ocurrió un error y cambia el estado
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  // 2. Registra los detalles del error en la consola o en un servidor
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.group('=== [Global Error Tracker] ===');
    console.error('Mensaje de error:', error.message);
    console.error('Ubicación del error:', errorInfo.componentStack);
    console.groupEnd();
    
    // Aquí puedes conectar en el futuro un servicio de logs externo como Sentry:
    // Sentry.captureException(error);
  }
  // 3. Permite al usuario "reiniciar" la app tras el error
  private readonly handleReset = () => {
    this.setState({ hasError: false, error: null });
  };
  public render() {
    if (this.state.hasError) {
      // Diseño de la pantalla de error amigable que verá el usuario
      return (
        <View style={styles.container}>
          <Ionicons name="alert-circle-outline" size={80} color="#ba1a1a" />
          <Text style={styles.title}>¡Oops! Algo salió mal</Text>
          <Text style={styles.description}>
            La aplicación ha experimentado un inconveniente inesperado. Nuestro equipo ha sido notificado y estamos trabajando para solucionarlo.
          </Text>
          <TouchableOpacity style={styles.button} onPress={this.handleReset}>
            <Text style={styles.buttonText}>Reintentar Cargar App</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#151b1e',
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#5b6164',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
    paddingHorizontal: 12,
  },
  button: {
    backgroundColor: '#006953',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
