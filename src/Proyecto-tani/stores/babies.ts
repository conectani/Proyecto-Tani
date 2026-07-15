import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../utils/supabase';

export interface BabyProfile {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD
  weightText: string;
  isActive: boolean;
  isFavorite: boolean;
  imageUri?: string;
}

import { calculateAgeInMonths as calcAge, getAgeText as getAgeT } from '../utils/dateUtils';

export const calculateAgeInMonths = (birthDateString: string): number => {
  return calcAge(birthDateString);
};

export const getAgeText = (birthDateString: string): string => {
  return getAgeT(birthDateString);
};

interface BabyState {
  babies: BabyProfile[];
  activeBabyId: string | null;
  loadBabies: () => Promise<void>;
  addBaby: (baby: Omit<BabyProfile, 'id'>) => Promise<void>;
  setActiveBaby: (id: string) => Promise<void>;
  updateBaby: (id: string, updated: Partial<BabyProfile>) => Promise<void>;
  clearAndAddBaby: (baby: Omit<BabyProfile, 'id' | 'isActive'>) => Promise<void>;
}

export const useBabyStore = create<BabyState>()(
  persist(
    (set, get) => ({
      babies: [],
      activeBabyId: null,
      loadBabies: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
          .from('bebes')
          .select('*')
          .eq('usuario_id', session.user.id)
          .order('fecha_creacion', { ascending: true });

        if (error) {
          console.error('Error al cargar bebés:', error.message);
          return;
        }

        const mapped: BabyProfile[] = (data || []).map((b: any) => ({
          id: b.id,
          name: b.nombre,
          birthDate: b.fecha_nacimiento,
          weightText: b.peso_inicial || '',
          isActive: b.es_activo,
          isFavorite: b.es_favorito,
          imageUri: b.foto_url || undefined,
        }));

        const active = mapped.find(b => b.isActive)?.id || mapped[0]?.id || null;
        set({ babies: mapped, activeBabyId: active });
      },
      addBaby: async (baby) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
          .from('bebes')
          .insert({
            usuario_id: session.user.id,
            nombre: baby.name,
            fecha_nacimiento: baby.birthDate,
            peso_inicial: baby.weightText,
            es_activo: baby.isActive,
            es_favorito: baby.isFavorite,
            foto_url: baby.imageUri || null,
          })
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        const newBaby: BabyProfile = {
          id: data.id,
          name: data.nombre,
          birthDate: data.fecha_nacimiento,
          weightText: data.peso_inicial || '',
          isActive: data.es_activo,
          isFavorite: data.es_favorito,
          imageUri: data.foto_url || undefined,
        };

        set((state) => ({
          babies: [...state.babies, newBaby]
        }));
      },
      setActiveBaby: async (id) => {
        set((state) => ({
          activeBabyId: id,
          babies: state.babies.map((b) => ({
            ...b,
            isActive: b.id === id,
          })),
        }));

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Desactivar todos y activar el seleccionado
        await supabase
          .from('bebes')
          .update({ es_activo: false })
          .eq('usuario_id', session.user.id);

        await supabase
          .from('bebes')
          .update({ es_activo: true })
          .eq('id', id);
      },
      updateBaby: async (id, updated) => {
        const { error } = await supabase
          .from('bebes')
          .update({
            nombre: updated.name,
            fecha_nacimiento: updated.birthDate,
            peso_inicial: updated.weightText,
            es_activo: updated.isActive,
            es_favorito: updated.isFavorite,
            foto_url: updated.imageUri,
          })
          .eq('id', id);

        if (error) {
          throw new Error(error.message);
        }

        set((state) => ({
          babies: state.babies.map((b) =>
            b.id === id ? { ...b, ...updated } : b
          ),
        }));
      },
      clearAndAddBaby: async (baby) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Desactivar anteriores
        await supabase
          .from('bebes')
          .update({ es_activo: false })
          .eq('usuario_id', session.user.id);

        const { data, error } = await supabase
          .from('bebes')
          .insert({
            usuario_id: session.user.id,
            nombre: baby.name,
            fecha_nacimiento: baby.birthDate,
            peso_inicial: baby.weightText,
            es_activo: true,
            es_favorito: baby.isFavorite,
            foto_url: baby.imageUri || null,
          })
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        const newBaby: BabyProfile = {
          id: data.id,
          name: data.nombre,
          birthDate: data.fecha_nacimiento,
          weightText: data.peso_inicial || '',
          isActive: true,
          isFavorite: data.es_favorito,
          imageUri: data.foto_url || undefined,
        };

        set({ babies: [newBaby], activeBabyId: data.id });
      },
    }),
    {
      name: 'tani-babies-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
