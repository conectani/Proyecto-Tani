import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../utils/supabase';

export interface BabyProfile {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD
  weightText: string;
  imageUri?: string;
}

export interface MotherProfile {
  id: string;
  name: string;
  surname: string;
  dni: string;
  phone: string;
  email: string;
  registrationDate: string;
  babies: BabyProfile[];
}

export interface Appointment {
  id: string;
  motherId: string;
  babyId: string;
  tipo: 'LACTANCIA' | 'PIEL A PIEL' | 'CRED' | 'DESARROLLO' | 'MÉDICO' | string;
  color: string;
  titulo: string;
  hora: string;
  lugar: string;
  nota: string | null;
  tipoIcon: string;
  doctor?: string;
  pagoEstado: 'Pendiente' | 'Verificando' | 'Confirmado';
  pagoMonto: string; // S/. XX.XX
  reciboUrl?: string;
  clinicalNotes?: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  targetAgeGroup: 'Todos' | '0-3 meses' | '4-6 meses' | '7-12 meses' | '12 meses+';
  date: string;
}

export const calculateAgeInMonths = (birthDateString: string): number => {
  const birthDate = new Date(birthDateString);
  const today = new Date('2026-05-22'); // Fecha del sistema fijada para la demo
  let months = (today.getFullYear() - birthDate.getFullYear()) * 12;
  months -= birthDate.getMonth();
  months += today.getMonth();
  if (today.getDate() < birthDate.getDate()) {
    months--;
  }
  return Math.max(0, months);
};

export const getAgeText = (birthDateString: string): string => {
  const months = calculateAgeInMonths(birthDateString);
  if (months === 0) return 'Recién nacido';
  if (months < 12) {
    return `${months} ${months === 1 ? 'mes' : 'meses'}`;
  }
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) {
    return `${years} ${years === 1 ? 'año' : 'años'}`;
  }
  return `${years} ${years === 1 ? 'año' : 'años'} ${remainingMonths} ${remainingMonths === 1 ? 'mes' : 'meses'}`;
};

interface AdminMothersState {
  mothers: MotherProfile[];
  appointments: Appointment[];
  announcements: Announcement[];
  loadAdminData: () => Promise<void>;
  addMother: (mother: Omit<MotherProfile, 'id' | 'registrationDate' | 'babies'> & { babies?: Omit<BabyProfile, 'id'>[] }) => Promise<string>;
  addBabyToMother: (motherId: string, baby: Omit<BabyProfile, 'id'>) => Promise<void>;
  addAppointment: (app: Omit<Appointment, 'id'>) => Promise<string>;
  updateAppointment: (id: string, updated: Partial<Appointment>) => Promise<void>;
  confirmPayment: (id: string) => Promise<void>;
  addAnnouncement: (ann: Omit<Announcement, 'id' | 'date'>) => Promise<void>;
}

export const useAdminStore = create<AdminMothersState>()(
  persist(
    (set, get) => ({
      mothers: [],
      appointments: [],
      announcements: [],
      loadAdminData: async () => {
        // 1. Obtener todas las madres (usuarios con rol madre)
        const { data: usersData, error: usersError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('rol', 'madre')
          .order('fecha_registro', { ascending: false });

        if (usersError) {
          console.error('Error al cargar madres:', usersError.message);
          return;
        }

        // 2. Obtener todos los bebés
        const { data: babiesData, error: babiesError } = await supabase
          .from('bebes')
          .select('*');

        if (babiesError) {
          console.error('Error al cargar bebés:', babiesError.message);
          return;
        }

        const mappedMothers: MotherProfile[] = (usersData || []).map((u: any) => {
          const babiesForMother = (babiesData || [])
            .filter((b: any) => b.usuario_id === u.id)
            .map((b: any) => ({
              id: b.id,
              name: b.nombre,
              birthDate: b.fecha_nacimiento,
              weightText: b.peso_inicial || '',
              imageUri: b.foto_url || undefined,
            }));

          return {
            id: u.id,
            name: u.nombre,
            surname: u.apellido,
            dni: u.dni,
            phone: u.telefono || '',
            email: u.email,
            registrationDate: new Date(u.fecha_registro).toISOString().split('T')[0],
            babies: babiesForMother,
          };
        });

        // 3. Obtener todas las citas
        const { data: citasData, error: citasError } = await supabase
          .from('citas')
          .select('*')
          .order('fecha_creacion', { ascending: false });

        if (citasError) {
          console.error('Error al cargar citas de la plataforma:', citasError.message);
          return;
        }

        const mappedApps: Appointment[] = (citasData || []).map((c: any) => ({
          id: c.id,
          motherId: c.usuario_id,
          babyId: c.bebe_id,
          tipo: c.tipo,
          color: c.color,
          titulo: c.titulo,
          hora: c.hora,
          lugar: c.lugar,
          nota: c.nota || null,
          tipoIcon: c.tipo_icon,
          doctor: c.doctor || undefined,
          pagoEstado: c.pago_estado as any,
          pagoMonto: c.pago_monto,
          reciboUrl: c.recibo_url || undefined,
          clinicalNotes: c.clinical_notes || undefined,
        }));

        // 4. Obtener todos los anuncios
        const { data: anunciosData, error: anunciosError } = await supabase
          .from('anuncios')
          .select('*')
          .order('fecha_creacion', { ascending: false });

        if (anunciosError) {
          console.error('Error al cargar anuncios de la plataforma:', anunciosError.message);
          return;
        }

        const mappedAnnouncements: Announcement[] = (anunciosData || []).map((a: any) => ({
          id: a.id,
          title: a.titulo,
          body: a.cuerpo,
          targetAgeGroup: a.target_grupo_edad as any,
          date: new Date(a.fecha_creacion).toISOString().split('T')[0],
        }));

        set({
          mothers: mappedMothers,
          appointments: mappedApps,
          announcements: mappedAnnouncements,
        });
      },
      addMother: async (mother) => {
        const fakeUuid = 'd1e1a1b1-1111-1111-1111-' + Date.now().toString().slice(-12);

        // Se inserta en public.usuarios directamente. Para habilitar el login real de la madre,
        // esta puede registrarse usando la pantalla de registro en su respectiva aplicación
        const { error } = await supabase
          .from('usuarios')
          .insert({
            id: fakeUuid,
            email: mother.email || `${mother.dni}@tani.app`,
            nombre: mother.name,
            apellido: mother.surname,
            dni: mother.dni,
            telefono: mother.phone,
            rol: 'madre',
          });

        if (error) {
          throw new Error(error.message);
        }

        // Si la madre trae bebés especificados (como ocurre al registrar en la vista de admin), registrarlos
        if (mother.babies && mother.babies.length > 0) {
          for (const baby of mother.babies) {
            await supabase
              .from('bebes')
              .insert({
                usuario_id: fakeUuid,
                nombre: baby.name,
                fecha_nacimiento: baby.birthDate,
                peso_inicial: baby.weightText || '3.5 kg',
                es_activo: true,
                es_favorito: true,
              });
          }
        }

        await get().loadAdminData();
        return fakeUuid;
      },
      addBabyToMother: async (motherId, baby) => {
        const { error } = await supabase
          .from('bebes')
          .insert({
            usuario_id: motherId,
            nombre: baby.name,
            fecha_nacimiento: baby.birthDate,
            peso_inicial: baby.weightText,
            es_activo: false,
            es_favorito: false,
          });

        if (error) {
          throw new Error(error.message);
        }

        await get().loadAdminData();
      },
      addAppointment: async (app) => {
        const { data, error } = await supabase
          .from('citas')
          .insert({
            usuario_id: app.motherId,
            bebe_id: app.babyId,
            tipo: app.tipo,
            color: app.color,
            titulo: app.titulo,
            hora: app.hora,
            lugar: app.lugar,
            nota: app.nota || null,
            tipo_icon: app.tipoIcon,
            doctor: app.doctor || null,
            pago_estado: app.pagoEstado || 'Pendiente',
            pago_monto: app.pagoMonto || 'S/. 0.00',
            recibo_url: app.reciboUrl || null,
            clinical_notes: app.clinicalNotes || null,
          })
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        await get().loadAdminData();
        return data.id;
      },
      updateAppointment: async (id, updated) => {
        const { error } = await supabase
          .from('citas')
          .update({
            tipo: updated.tipo,
            color: updated.color,
            titulo: updated.titulo,
            hora: updated.hora,
            lugar: updated.lugar,
            nota: updated.nota,
            tipo_icon: updated.tipoIcon,
            doctor: updated.doctor,
            pago_estado: updated.pagoEstado,
            pago_monto: updated.pagoMonto,
            recibo_url: updated.reciboUrl,
            clinical_notes: updated.clinicalNotes,
          })
          .eq('id', id);

        if (error) {
          throw new Error(error.message);
        }

        await get().loadAdminData();
      },
      confirmPayment: async (id) => {
        const { error } = await supabase
          .from('citas')
          .update({ pago_estado: 'Confirmado' })
          .eq('id', id);

        if (error) {
          throw new Error(error.message);
        }

        await get().loadAdminData();
      },
      addAnnouncement: async (ann) => {
        const { error } = await supabase
          .from('anuncios')
          .insert({
            titulo: ann.title,
            cuerpo: ann.body,
            target_grupo_edad: ann.targetAgeGroup,
          });

        if (error) {
          throw new Error(error.message);
        }

        await get().loadAdminData();
      },
    }),
    {
      name: 'tani-admin-mothers-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
