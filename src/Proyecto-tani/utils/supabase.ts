import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Determinar si SecureStore está disponible de forma segura (solo móvil nativo)
const isSecureStoreAvailable = Platform.OS !== 'web' && typeof SecureStore.getItemAsync === 'function';

const ExpoSecureStoreAdapter = {
  getItem: async (key: string) => {
    try {
      if (isSecureStoreAvailable) {
        return await SecureStore.getItemAsync(key);
      }
    } catch (e) {
      console.warn('SecureStore not available, falling back to localStorage:', e);
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return null;
  },
  setItem: async (key: string, value: string) => {
    try {
      if (isSecureStoreAvailable) {
        await SecureStore.setItemAsync(key, value);
        return;
      }
    } catch (e) {
      console.warn('SecureStore not available, falling back to localStorage:', e);
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  },
  removeItem: async (key: string) => {
    try {
      if (isSecureStoreAvailable) {
        await SecureStore.deleteItemAsync(key);
        return;
      }
    } catch (e) {
      console.warn('SecureStore not available, falling back to localStorage:', e);
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || supabaseUrl.includes('tu-proyecto') || supabaseUrl === '[https://tu-proyecto.supabase.co](https://tu-proyecto.supabase.co)') {
  throw new Error(
    'Falta EXPO_PUBLIC_SUPABASE_URL. Por favor, asegúrate de que el archivo .env de este aplicativo esté bien configurado con la URL de tu proyecto de Supabase.'
  );
}

if (!supabaseAnonKey || supabaseAnonKey === 'tu-anon-key') {
  throw new Error(
    'Falta EXPO_PUBLIC_SUPABASE_ANON_KEY. Por favor, asegúrate de que el archivo .env de este aplicativo esté bien configurado con la Anon Key de tu proyecto de Supabase.'
  );
}

// Inicializamos el cliente garantizando persistencia óptima y renovación de token automática
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,   // ACTIVADO: Renueva el token automáticamente antes de expirar
    persistSession: true,      // ACTIVADO: Conserva la sesión en el storage seguro elegido
    detectSessionInUrl: false, // ACTIVADO: Evita redirecciones conflictivas en la app móvil
  },
});