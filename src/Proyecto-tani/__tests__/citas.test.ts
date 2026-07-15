import { agendarCitaConReintento } from '../utils/citasHelper';

describe('BUG-042: Suite de Pruebas de Calidad para el Control de Concurrencia', () => {

  it('Debe confirmar la cita de forma exitosa en el primer intento si no hay colisiones en base de datos', async () => {
    const mockSupabaseQuery = jest.fn().mockResolvedValue({ error: null });

    const resultado = await agendarCitaConReintento(mockSupabaseQuery);

    expect(resultado.exito).toBe(true);
    expect(resultado.intentoActual).toBe(1);
    expect(resultado.error).toBeNull();
    expect(mockSupabaseQuery).toHaveBeenCalledTimes(1);
  });

  it('Debe reintentar la transacción y tener éxito si Supabase reporta un bloqueo temporal en la tabla citas', async () => {
    const errorBloqueo = { code: '40001', message: 'deadlock detected - lock conflict' };
    
    // El mock fallará en el primer intento y será exitoso en el segundo intento
    const mockSupabaseQuery = jest
      .fn()
      .mockResolvedValueOnce({ error: errorBloqueo })
      .mockResolvedValueOnce({ error: null });

    const resultado = await agendarCitaConReintento(mockSupabaseQuery, 3);

    expect(resultado.exito).toBe(true);
    expect(resultado.intentoActual).toBe(2);
    expect(resultado.error).toBeNull();
    expect(mockSupabaseQuery).toHaveBeenCalledTimes(2);
  });

  it('Debe denegar la reserva de cita tras agotar los 3 reintentos si el bloqueo de concurrencia persiste', async () => {
    const errorBloqueo = { code: '40001', message: 'deadlock detected - lock conflict' };
    
    // Todos los intentos van a retornar error de concurrencia Postgres
    const mockSupabaseQuery = jest.fn().mockResolvedValue({ error: errorBloqueo });

    const resultado = await agendarCitaConReintento(mockSupabaseQuery, 3);

    expect(resultado.exito).toBe(false);
    expect(resultado.intentoActual).toBe(3);
    expect(resultado.error).toContain('Limite de reintentos concurrentes alcanzado');
    expect(mockSupabaseQuery).toHaveBeenCalledTimes(3);
  });

  it('Debe reintentar y fallar si el callback arroja un error inesperado (excepción)', async () => {
    const mockSupabaseQuery = jest.fn().mockRejectedValue(new Error('Network Error'));

    const resultado = await agendarCitaConReintento(mockSupabaseQuery, 2);

    expect(resultado.exito).toBe(false);
    expect(resultado.intentoActual).toBe(2);
    expect(resultado.error).toBe('Network Error');
    expect(mockSupabaseQuery).toHaveBeenCalledTimes(2);
  });

  it('Debe denegar inmediatamente si reintentosMax es 0', async () => {
    const mockSupabaseQuery = jest.fn();

    const resultado = await agendarCitaConReintento(mockSupabaseQuery, 0);

    expect(resultado.exito).toBe(false);
    expect(resultado.intentoActual).toBe(0);
    expect(resultado.error).toBe('Proceso de reintentos finalizado sin exito.');
    expect(mockSupabaseQuery).toHaveBeenCalledTimes(0);
  });

  it('Debe reintentar y fallar con mensaje genérico si la excepción no tiene mensaje', async () => {
    const mockSupabaseQuery = jest.fn().mockRejectedValue({ error: 'Some error' });

    const resultado = await agendarCitaConReintento(mockSupabaseQuery, 1);

    expect(resultado.exito).toBe(false);
    expect(resultado.intentoActual).toBe(1);
    expect(resultado.error).toBe('Error inesperado');
    expect(mockSupabaseQuery).toHaveBeenCalledTimes(1);
  });

  it('Debe abortar inmediatamente y no reintentar si el error reportado no es de concurrencia', async () => {
    const errorNormal = { code: '23505', message: 'duplicate key value violates unique constraint' };
    const mockSupabaseQuery = jest.fn().mockResolvedValue({ error: errorNormal });

    const resultado = await agendarCitaConReintento(mockSupabaseQuery, 3);

    expect(resultado.exito).toBe(false);
    expect(resultado.intentoActual).toBe(1);
    expect(resultado.error).toBe('duplicate key value violates unique constraint');
    expect(mockSupabaseQuery).toHaveBeenCalledTimes(1);
  });

  it('Debe reintentar dos veces y tener éxito en el tercer intento si hay dos bloqueos consecutivos', async () => {
    const errorBloqueo = { code: '40001', message: 'lock conflict' };
    const mockSupabaseQuery = jest
      .fn()
      .mockResolvedValueOnce({ error: errorBloqueo })
      .mockResolvedValueOnce({ error: errorBloqueo })
      .mockResolvedValueOnce({ error: null });

    const resultado = await agendarCitaConReintento(mockSupabaseQuery, 4);

    expect(resultado.exito).toBe(true);
    expect(resultado.intentoActual).toBe(3);
    expect(resultado.error).toBeNull();
    expect(mockSupabaseQuery).toHaveBeenCalledTimes(3);
  });

  it('Debe manejar un error de concurrencia detectado mediante mensaje que contenga la palabra lock', async () => {
    const errorConcurrenteSinCodigo = { message: 'database is locked at the moment' };
    const mockSupabaseQuery = jest
      .fn()
      .mockResolvedValueOnce({ error: errorConcurrenteSinCodigo })
      .mockResolvedValueOnce({ error: null });

    const resultado = await agendarCitaConReintento(mockSupabaseQuery, 2);

    expect(resultado.exito).toBe(true);
    expect(resultado.intentoActual).toBe(2);
    expect(resultado.error).toBeNull();
    expect(mockSupabaseQuery).toHaveBeenCalledTimes(2);
  });

  it('Debe manejar una llamada con reintentosMax negativos tratándola como 0 reintentos', async () => {
    const mockSupabaseQuery = jest.fn();
    const resultado = await agendarCitaConReintento(mockSupabaseQuery, -5);

    expect(resultado.exito).toBe(false);
    expect(resultado.intentoActual).toBe(-5);
    expect(resultado.error).toBe('Proceso de reintentos finalizado sin exito.');
    expect(mockSupabaseQuery).toHaveBeenCalledTimes(0);
  });

  it('Debe manejar errores lanzados como strings en lugar de objetos Error', async () => {
    const mockSupabaseQuery = jest.fn().mockRejectedValue('String Error Exception');
    const resultado = await agendarCitaConReintento(mockSupabaseQuery, 1);

    expect(resultado.exito).toBe(false);
    expect(resultado.intentoActual).toBe(1);
    expect(resultado.error).toBe('Error inesperado');
  });

  it('Debe abortar si el error retornado no tiene código ni mensaje pero es un objeto', async () => {
    const errorVacio = {};
    const mockSupabaseQuery = jest.fn().mockResolvedValue({ error: errorVacio });
    const resultado = await agendarCitaConReintento(mockSupabaseQuery, 2);

    expect(resultado.exito).toBe(false);
    expect(resultado.intentoActual).toBe(1);
    expect(resultado.error).toBeUndefined();
  });
});
