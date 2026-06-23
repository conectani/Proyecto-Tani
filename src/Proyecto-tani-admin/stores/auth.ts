import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../utils/supabase';

export interface AdminProfile {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  phone?: string;
}

interface AuthState {
  user: AdminProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (dni: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updated: Partial<AdminProfile>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (dni, password) => {
        // Mapeo especial para los usuarios sembrados, de lo contrario se usa dni@tani.app
        let email = `${dni}@tani.app`;
        if (dni === '12345678') email = 'estefany@tani.app';
        if (dni === '00000000') email = 'admin@tani.app';

        const securePassword = password || 'Rodrigom@llqui';

        // 1. Iniciar sesión en Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password: securePassword,
        });

        if (authError) {
          throw new Error(authError.message);
        }

        const session = authData.session;
        if (!session) {
          throw new Error('No se pudo establecer la sesión activa.');
        }

        // 2. Obtener el perfil público de la tabla public.usuarios
        const { data: profileData, error: profileError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError || !profileData) {
          await supabase.auth.signOut();
          throw new Error('No se encontró el perfil de usuario registrado.');
        }

        // 3. Validar el rol
        if (profileData.rol !== 'admin') {
          await supabase.auth.signOut();
          throw new Error('Acceso denegado. Esta consola solo permite el ingreso a administradores.');
        }

        const user: AdminProfile = {
          id: profileData.id,
          name: profileData.nombre,
          surname: profileData.apellido,
          email: profileData.email,
          role: 'Administrador Clínico / Coordinador',
          phone: profileData.telefono || '',
        };

        set({
          user,
          token: session.access_token,
          isAuthenticated: true,
        });
      },
      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, token: null, isAuthenticated: false });
      },
      updateProfile: async (updated) => {
        const currentUser = get().user;
        if (!currentUser) return;

        // Actualizar en Supabase
        const { error } = await supabase
          .from('usuarios')
          .update({
            nombre: updated.name !== undefined ? updated.name : currentUser.name,
            apellido: updated.surname !== undefined ? updated.surname : currentUser.surname,
            telefono: updated.phone !== undefined ? updated.phone : currentUser.phone,
          })
          .eq('id', currentUser.id);

        if (error) {
          throw new Error(error.message);
        }

        set((state) => {
          if (!state.user) return state;
          return {
            user: { ...state.user, ...updated },
          };
        });
      },
    }),
    {
      name: 'tani-admin-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
