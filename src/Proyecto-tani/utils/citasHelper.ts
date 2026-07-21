/**
 * Interfaz técnica que detalla el resultado de la confirmación de la cita
 */
export interface ResultadoCita {
  exito: boolean;
  intentoActual: number;
  error: string | null;
}

/**
 * Función que implementa Exponential Backoff para mitigar colisiones de concurrencia en Supabase Postgres
 * @param callback Función de llamada a Supabase que interactúa con la base de datos
 * @param reintentosMax Cantidad límite de ejecuciones antes de lanzar error de concurrencia (Default: 3)
 */
export async function agendarCitaConReintento(
  callback: () => Promise<{ error: any }>,
  reintentosMax: number = 3
): Promise<ResultadoCita> {
  let intento = 0;

  while (intento < reintentosMax) {
    intento++;
    try {
      // Intentamos ejecutar la consulta a la base de datos Supabase
      const response = await callback();
      
      if (!response.error) {
        return { exito: true, intentoActual: intento, error: null };
      }

      // Si el error detectado es de concurrencia (ej. Deadlock o base de datos bloqueada)
      if (response.error.code === '40001' || response.error.message?.includes('lock')) {
        if (intento >= reintentosMax) {
          return {
            exito: false,
            intentoActual: intento,
            error: 'Limite de reintentos concurrentes alcanzado en Supabase (40001).'
          };
        }
        
        // Calcular tiempo de espera exponencial con factor aleatorio (Jitter)
        const jitter = typeof globalThis.crypto?.getRandomValues === 'function'
          ? (globalThis.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295) * 50
          : (Date.now() % 50);
        const delay = Math.pow(2, intento) * 100 + jitter;
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue; // Proceder con el siguiente intento
      }

      // Si es otro tipo de error de base de datos, abortamos de inmediato
      return { exito: false, intentoActual: intento, error: response.error.message };
      
    } catch (err: any) {
      if (intento >= reintentosMax) {
        return { exito: false, intentoActual: intento, error: err.message || 'Error inesperado' };
      }
      const delay = Math.pow(2, intento) * 100;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return { exito: false, intentoActual: reintentosMax, error: 'Proceso de reintentos finalizado sin exito.' };
}
