import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../db'; // Conexión a la base de datos Supabase

const QUEUE_STORAGE_KEY = '@connectani_offline_queue';

interface SyncTask {
  id: string;
  table: string;
  action: 'INSERT' | 'UPDATE';
  data: any;
}

function generateSyncTaskId(): string {
  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    const array = new Uint32Array(2);
    globalThis.crypto.getRandomValues(array);
    return Array.from(array, num => num.toString(36)).join('');
  }
  return `${Date.now().toString(36)}-${Math.floor(Date.now() * 0.001).toString(36)}`;
}

// 1. Guardar la tarea en la memoria del celular si no hay internet
export async function saveTaskOffline(table: string, action: 'INSERT' | 'UPDATE', data: any) {
  try {
    const existingQueueStr = await AsyncStorage.getItem(QUEUE_STORAGE_KEY);
    const queue: SyncTask[] = existingQueueStr ? JSON.parse(existingQueueStr) : [];
    const newTask: SyncTask = {
      id: generateSyncTaskId(),
      table,
      action,
      data
    };
    queue.push(newTask);
    await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
    console.log(`[Offline] Datos guardados localmente para: ${table}`);
  } catch (error) {
    console.error('Error al guardar datos offline:', error);
  }
}

// 2. Subir las tareas acumuladas a la nube cuando regrese el internet
export async function syncOfflineQueue() {
  try {
    const queueStr = await AsyncStorage.getItem(QUEUE_STORAGE_KEY);
    if (!queueStr) return;
    const queue: SyncTask[] = JSON.parse(queueStr);
    if (queue.length === 0) return;
    console.log(`[Sync] Sincronizando ${queue.length} registros pendientes...`);
    for (const task of queue) {
      if (task.action === 'INSERT') {
        const { error } = await supabase.from(task.table).insert(task.data);
        if (error) throw error;
      }
    }
    // Limpia la lista una vez subido con éxito
    await AsyncStorage.removeItem(QUEUE_STORAGE_KEY);
    console.log('[Sync] ¡Todos los datos offline se subieron a la nube!');
  } catch (error) {
    console.error('[Sync] Error al sincronizar:', error);
  }
}
