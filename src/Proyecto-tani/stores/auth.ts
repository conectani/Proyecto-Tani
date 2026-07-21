import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../utils/supabase';

export interface UserProfile {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  dni: string;
  avatarUrl?: string;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (dni: string, password?: string) => Promise<void>;
  register: (params: {
    dni: string;
    phone: string;
    name: string;
    surname: string;
    email: string;
    password?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
}

const DEFAULT_DEMO_PASSWORD = process.env.EXPO_PUBLIC_DEFAULT_DEMO_PASSWORD || 'Estefany123';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (dni, password = DEFAULT_DEMO_PASSWORD) => {
        // Mapeo especial para los usuarios sembrados, de lo contrario se usa dni@tani.app
        let email = `${dni}@tani.app`;
        if (dni === '12345678') email = 'estefany@tani.app';
        if (dni === '00000000') email = 'admin@tani.app';

        // 1. Iniciar sesión en Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
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
        if (profileData.rol !== 'madre') {
          await supabase.auth.signOut();
          throw new Error('Acceso no autorizado. Esta cuenta no pertenece al perfil de Madres.');
        }

        const user: UserProfile = {
          id: profileData.id,
          name: profileData.nombre,
          surname: profileData.apellido,
          email: profileData.email,
          phone: profileData.telefono || '',
          dni: profileData.dni,
          avatarUrl: undefined,
        };

        set({
          user,
          token: session.access_token,
          isAuthenticated: true,
        });
      },
      register: async ({ dni, phone, name, surname, email, password = DEFAULT_DEMO_PASSWORD }) => {
        // 1. Registrar usuario en Supabase Auth con metadatos
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              nombre: name,
              apellido: surname,
              dni: dni,
              telefono: phone,
              rol: 'madre',
            },
          },
        });

        if (authError) {
          throw new Error(authError.message);
        }

        let session = authData.session;
        
        // Si no se inició sesión automáticamente (por ejemplo, requiere confirmación de email),
        // intentamos hacer un login inmediato.
        if (!session) {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInError) {
            throw new Error(signInError.message);
          }
          session = signInData.session;
        }

        if (!session) {
          throw new Error('No se pudo establecer la sesión activa tras el registro.');
        }

        const user: UserProfile = {
          id: session.user.id,
          name,
          surname,
          email,
          phone,
          dni,
          avatarUrl: undefined,
        };

        set({
          user,
          token: session.access_token,
          isAuthenticated: true,
        });
      },
      logout: async () => {
        try {
          await supabase.auth.signOut();
        } catch (e) {
          console.warn('Error during Supabase signout:', e);
        } finally {
          set({ user: null, token: null, isAuthenticated: false });
        }
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
      name: 'tani-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
