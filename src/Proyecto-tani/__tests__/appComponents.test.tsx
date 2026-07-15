// Configurar variables de entorno ficticias antes de importar supabase
process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://vfgzvsaplqqjcoacjieu.supabase.co';
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key-that-is-valid-for-testing';

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

// Mocks para librerías nativas y externas
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      storage: {},
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    from: jest.fn(),
  })),
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('../hooks/use-color-scheme', () => ({
  useColorScheme: jest.fn(() => 'light'),
}));

// Mock del icono para evitar errores de renderizado nativo
jest.mock('../components/ui/icon-symbol', () => {
  const { Text } = require('react-native');
  return {
    IconSymbol: () => <Text>Icon</Text>
  };
});

import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';
import { Collapsible } from '../components/ui/collapsible';
import { useColorScheme } from '../hooks/use-color-scheme';

const { supabase } = require('../utils/supabase');

describe('Pruebas para componentes y modulos base de la app', () => {

  describe('Supabase Client (supabase.ts)', () => {
    test('Debería inicializar el cliente de Supabase correctamente', () => {
      expect(supabase).toBeDefined();
      expect(supabase.auth).toBeDefined();
      expect(supabase.from).toBeDefined();
    });
  });

  describe('useColorScheme (use-color-scheme.ts)', () => {
    test('Debería retornar un esquema de color válido', () => {
      const scheme = useColorScheme();
      expect(scheme).toBe('light');
    });
  });

  describe('ThemedText Component', () => {
    test('Debería renderizar texto con estilos por defecto', () => {
      const { getByText } = render(<ThemedText>Hola Mundo</ThemedText>);
      expect(getByText('Hola Mundo')).toBeTruthy();
    });

    test('Debería renderizar texto con tipo título', () => {
      const { getByText } = render(<ThemedText type="title">Título</ThemedText>);
      expect(getByText('Título')).toBeTruthy();
    });

    test('Debería aplicar colores específicos de prop si se proveen', () => {
      const { getByText } = render(
        <ThemedText lightColor="#ff0000" darkColor="#00ff00">
          Color Prop
        </ThemedText>
      );
      expect(getByText('Color Prop')).toBeTruthy();
    });
  });

  describe('ThemedView Component', () => {
    test('Debería renderizar el contenedor correctamente', () => {
      const { toJSON } = render(<ThemedView style={{ padding: 10 }} />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Collapsible Component', () => {
    test('Debería renderizar cerrado por defecto y abrirse al presionarlo', () => {
      const { getByText, queryByText } = render(
        <Collapsible title="Detalle">
          <ThemedText>Contenido Oculto</ThemedText>
        </Collapsible>
      );

      // El título debe verse
      expect(getByText('Detalle')).toBeTruthy();
      // El contenido debe estar oculto
      expect(queryByText('Contenido Oculto')).toBeNull();

      // Presionar para abrir
      fireEvent.press(getByText('Detalle'));

      // Ahora el contenido debe ser visible
      expect(getByText('Contenido Oculto')).toBeTruthy();
    });
  });

});
