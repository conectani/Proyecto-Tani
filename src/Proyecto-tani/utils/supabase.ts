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

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://tu-proyecto.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'tu-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
