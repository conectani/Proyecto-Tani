/**
 * Calcula la edad en meses a partir de la fecha de nacimiento.
 * Por defecto compara con la fecha del sistema demo '2026-05-22' si no se especifica otra.
 */
export const calculateAgeInMonths = (birthDateString: string, baseDateInput?: Date | string): number => {
  if (!birthDateString) return 0;
  const birthDate = new Date(birthDateString);
  if (isNaN(birthDate.getTime())) return 0;
  
  const today = baseDateInput ? new Date(baseDateInput) : new Date('2026-05-22');
  if (isNaN(today.getTime())) return 0;
  
  if (birthDate > today) return 0; // Si nació en el futuro relativo, edad es 0
  
  let months = (today.getFullYear() - birthDate.getFullYear()) * 12;
  months -= birthDate.getMonth();
  months += today.getMonth();
  if (today.getDate() < birthDate.getDate()) {
    months--;
  }
  return Math.max(0, months);
};

/**
 * Devuelve la representación en formato de texto legible para la edad del bebé.
 */
export const getAgeText = (birthDateString: string, baseDateInput?: Date | string): string => {
  const months = calculateAgeInMonths(birthDateString, baseDateInput);
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

/**
 * Calcula las semanas y días transcurridos de gestación (embarazo) a partir de la fecha de última regla (LMP).
 * Una gestación normal a término dura aproximadamente 40 semanas (280 días).
 */
export const calculatePregnancyWeeks = (
  lmpString: string,
  baseDateInput?: Date | string
): { weeks: number; days: number; isValid: boolean } => {
  if (!lmpString) return { weeks: 0, days: 0, isValid: false };
  const lmpDate = new Date(lmpString);
  if (isNaN(lmpDate.getTime())) return { weeks: 0, days: 0, isValid: false };

  const today = baseDateInput ? new Date(baseDateInput) : new Date('2026-05-22');
  if (isNaN(today.getTime())) return { weeks: 0, days: 0, isValid: false };

  if (lmpDate > today) {
    return { weeks: 0, days: 0, isValid: false }; // Fecha en el futuro es inválida para la gestación actual
  }

  const diffTime = today.getTime() - lmpDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Límite razonable para un embarazo humano (ej. 45 semanas / 315 días)
  if (diffDays > 315) {
    return { weeks: 0, days: 0, isValid: false }; 
  }

  const weeks = Math.floor(diffDays / 7);
  const days = diffDays % 7;

  return { weeks, days, isValid: true };
};

export interface VaccineItem {
  vaccine: string;
  recommendedAgeMonths: number;
  dueDate: string;
  isOverdue: boolean;
}

/**
 * Genera el calendario de vacunas obligatorias recomendadas según el MINSA (Perú) 
 * y determina si están vencidas en base a la fecha de consulta.
 */
export const getVaccineSchedule = (
  birthDateString: string,
  baseDateInput?: Date | string
): VaccineItem[] => {
  if (!birthDateString) return [];
  const birthDate = new Date(birthDateString);
  if (isNaN(birthDate.getTime())) return [];

  const today = baseDateInput ? new Date(baseDateInput) : new Date('2026-05-22');
  if (isNaN(today.getTime())) return [];

  const vaccinesList = [
    { name: 'BCG (Tuberculosis)', ageMonths: 0 },
    { name: 'HvB (Hepatitis B - Recién Nacido)', ageMonths: 0 },
    { name: 'Pentavalente (1ra dosis)', ageMonths: 2 },
    { name: 'Polio Inactiva - IPV (1ra dosis)', ageMonths: 2 },
    { name: 'Rotavirus (1ra dosis)', ageMonths: 2 },
    { name: 'Neumococo (1ra dosis)', ageMonths: 2 },
    { name: 'Pentavalente (2da dosis)', ageMonths: 4 },
    { name: 'Polio Inactiva - IPV (2da dosis)', ageMonths: 4 },
    { name: 'Rotavirus (2da dosis)', ageMonths: 4 },
    { name: 'Neumococo (2da dosis)', ageMonths: 4 },
    { name: 'Pentavalente (3ra dosis)', ageMonths: 6 },
    { name: 'Polio Oral - APO (3ra dosis)', ageMonths: 6 },
    { name: 'Influenza Pediátrica (1ra dosis)', ageMonths: 7 },
    { name: 'Influenza Pediátrica (2da dosis)', ageMonths: 8 },
    { name: 'SPR - Sarampión, Papera, Rubéola (1ra dosis)', ageMonths: 12 },
    { name: 'Neumococo (3ra dosis)', ageMonths: 12 },
    { name: 'Fiebre Amarilla (AMA)', ageMonths: 15 },
    { name: 'DPT - Difteria, Pertussis, Tétanos (1er refuerzo)', ageMonths: 18 },
    { name: 'Polio Oral - APO (1er refuerzo)', ageMonths: 18 },
    { name: 'SPR - Sarampión, Papera, Rubéola (2da dosis)', ageMonths: 18 }
  ];

  return vaccinesList.map(v => {
    const dueDate = new Date(birthDate);
    dueDate.setMonth(dueDate.getMonth() + v.ageMonths);
    
    const formattedDueDate = dueDate.toISOString().split('T')[0];
    const isOverdue = today > dueDate;

    return {
      vaccine: v.name,
      recommendedAgeMonths: v.ageMonths,
      dueDate: formattedDueDate,
      isOverdue
    };
  });
};
