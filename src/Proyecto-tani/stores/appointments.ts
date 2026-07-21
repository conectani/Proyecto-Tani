import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../utils/supabase';

export interface NoteDetail {
  id: string;
  text: string;
  completed: boolean;
}

export interface AppointmentNote {
  id: string;
  appointmentId: string;
  mood: string | null;
  priority: 'normal' | 'important';
  details: NoteDetail[];
  date: string;
}

export interface Appointment {
  id: string;
  tipo: string; // TANI CONSULTORÍA, CITA EXTERNA, PEDIATRÍA, CRED, etc.
  color: string;
  titulo: string;
  hora: string;
  lugar: string;
  nota: string | null;
  tipoIcon: string;
  bebeId: string;
  doctor?: string;
  pagoEstado?: 'Pendiente' | 'Verificando' | 'Confirmado';
  pagoMonto?: string;
  reciboUrl?: string;
}

interface AppointmentState {
  appointments: Appointment[];
  notes: AppointmentNote[];
  loadAppointments: () => Promise<void>;
  addAppointment: (app: Omit<Appointment, 'id'>) => Promise<string>;
  updateAppointment: (id: string, updated: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  addNote: (note: Omit<AppointmentNote, 'id'>) => Promise<string>;
  updateNote: (id: string, updated: Partial<AppointmentNote>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  getNotesForAppointment: (appId: string) => AppointmentNote[];
}

export const useAppointmentStore = create<AppointmentState>()(
  persist(
    (set, get) => ({
      appointments: [],
      notes: [],
      loadAppointments: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // 1. Obtener todas las citas para este usuario
        const { data: citasData, error: citasError } = await supabase
          .from('citas')
          .select('*')
          .eq('usuario_id', session.user.id)
          .order('fecha_creacion', { ascending: false });

        if (citasError) {
          console.error('Error al cargar citas:', citasError.message);
          return;
        }

        const mappedApps: Appointment[] = (citasData || []).map((c: any) => ({
          id: c.id,
          tipo: c.tipo,
          color: c.color,
          titulo: c.titulo,
          hora: c.hora,
          lugar: c.lugar,
          nota: c.nota,
          tipoIcon: c.tipo_icon,
          bebeId: c.bebe_id,
          doctor: c.doctor || undefined,
          pagoEstado: c.pago_estado,
          pagoMonto: c.pago_monto,
          reciboUrl: c.recibo_url || undefined,
        }));

        // 2. Obtener todas las notas para las citas
        const citaIds = (citasData || []).map((c: any) => c.id);
        
        let mappedNotes: AppointmentNote[] = [];
        if (citaIds.length > 0) {
          const { data: notasData, error: notasError } = await supabase
            .from('notas_cita')
            .select('*')
            .in('cita_id', citaIds);

          if (notasError) {
            console.error('Error al cargar notas de citas:', notasError.message);
          } else {
            mappedNotes = (notasData || []).map((n: any) => ({
              id: n.id,
              appointmentId: n.cita_id,
              mood: n.mood,
              priority: n.priority as any,
              details: n.details as any[],
              date: new Date(n.fecha_creacion).toISOString().split('T')[0],
            }));
          }
        }

        set({ appointments: mappedApps, notes: mappedNotes });
      },
      addAppointment: async (app) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('Usuario no autenticado.');

        const { data, error } = await supabase
          .from('citas')
          .insert({
            usuario_id: session.user.id,
            bebe_id: app.bebeId,
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
          })
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        const newApp: Appointment = {
          id: data.id,
          tipo: data.tipo,
          color: data.color,
          titulo: data.titulo,
          hora: data.hora,
          lugar: data.lugar,
          nota: data.nota,
          tipoIcon: data.tipo_icon,
          bebeId: data.bebe_id,
          doctor: data.doctor || undefined,
          pagoEstado: data.pago_estado,
          pagoMonto: data.pago_monto,
          reciboUrl: data.recibo_url || undefined,
        };

        set((state) => ({
          appointments: [...state.appointments, newApp],
        }));

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
          })
          .eq('id', id);

        if (error) {
          throw new Error(error.message);
        }

        set((state) => ({
          appointments: state.appointments.map((a) =>
            a.id === id ? { ...a, ...updated } : a
          ),
        }));
      },
      deleteAppointment: async (id) => {
        const { error } = await supabase
          .from('citas')
          .delete()
          .eq('id', id);

        if (error) {
          throw new Error(error.message);
        }

        set((state) => ({
          appointments: state.appointments.filter((a) => a.id !== id),
          notes: state.notes.filter((n) => n.appointmentId !== id),
        }));
      },
      addNote: async (note) => {
        const { data, error } = await supabase
          .from('notas_cita')
          .insert({
            cita_id: note.appointmentId,
            mood: note.mood || null,
            priority: note.priority || 'normal',
            details: note.details,
          })
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        const newNote: AppointmentNote = {
          id: data.id,
          appointmentId: data.cita_id,
          mood: data.mood,
          priority: data.priority as any,
          details: data.details as any[],
          date: new Date(data.fecha_creacion).toISOString().split('T')[0],
        };

        // Actualizar la nota rápida en la cita local y remota
        const firstDetailText = note.details.find(d => !d.completed)?.text || note.details[0]?.text || null;
        
        await supabase
          .from('citas')
          .update({ nota: firstDetailText })
          .eq('id', note.appointmentId);

        set((state) => {
          const updatedApps = state.appointments.map((a) =>
            a.id === note.appointmentId ? { ...a, nota: firstDetailText } : a
          );
          return {
            appointments: updatedApps,
            notes: [...state.notes, newNote],
          };
        });

        return data.id;
      },
      updateNote: async (id, updated) => {
        const { data: currentNotes, error: getError } = await supabase
          .from('notas_cita')
          .select('*')
          .eq('id', id)
          .single();

        if (getError || !currentNotes) {
          throw new Error(getError ? getError.message : 'No se encontró la nota original.');
        }

        const updatedDetails = updated.details !== undefined ? updated.details : currentNotes.details;
        const updatedMood = updated.mood !== undefined ? updated.mood : currentNotes.mood;
        const updatedPriority = updated.priority !== undefined ? updated.priority : currentNotes.priority;

        const { error } = await supabase
          .from('notas_cita')
          .update({
            mood: updatedMood,
            priority: updatedPriority,
            details: updatedDetails,
          })
          .eq('id', id);

        if (error) {
          throw new Error(error.message);
        }

        set((state) => {
          const updatedNotes = state.notes.map((n) =>
            n.id === id ? { ...n, ...updated } : n
          );
          const targetNote = updatedNotes.find(n => n.id === id);
          let updatedApps = state.appointments;
          if (targetNote) {
            const firstDetailText = targetNote.details.find(d => !d.completed)?.text || targetNote.details[0]?.text || null;
            
            // Sincronizar nota rápida en la cita
            supabase
              .from('citas')
              .update({ nota: firstDetailText })
              .eq('id', targetNote.appointmentId);

            updatedApps = state.appointments.map((a) =>
              a.id === targetNote.appointmentId ? { ...a, nota: firstDetailText } : a
            );
          }
          return {
            notes: updatedNotes,
            appointments: updatedApps,
          };
        });
      },
      deleteNote: async (id) => {
        const { data: targetNoteData, error: fetchError } = await supabase
          .from('notas_cita')
          .select('cita_id')
          .eq('id', id)
          .single();

        if (fetchError || !targetNoteData) {
          throw new Error('No se encontró la nota para eliminar.');
        }

        const { error } = await supabase
          .from('notas_cita')
          .delete()
          .eq('id', id);

        if (error) {
          throw new Error(error.message);
        }

        // Limpiar nota en la cita correspondientes en Supabase
        await supabase
          .from('citas')
          .update({ nota: null })
          .eq('id', targetNoteData.cita_id);

        set((state) => {
          const updatedNotes = state.notes.filter((n) => n.id !== id);
          const updatedApps = state.appointments.map((a) =>
            a.id === targetNoteData.cita_id ? { ...a, nota: null } : a
          );
          return {
            notes: updatedNotes,
            appointments: updatedApps,
          };
        });
      },
      getNotesForAppointment: (appId) => {
        return get().notes.filter((n) => n.appointmentId === appId);
      },
    }),
    {
      name: 'tani-appointments-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
