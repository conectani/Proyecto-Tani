/**
 * Sanitiza cualquier texto de entrada para prevenir inyección de caracteres
 * que afecten a las consultas SQL/Postgres de Supabase.
 */
export function sanitizeInput(text: string): string {
  if (!text) return '';
  // Elimina caracteres especiales comunes en inyecciones SQL
  return text.replace(/['";\-]/g, '').trim();
}
