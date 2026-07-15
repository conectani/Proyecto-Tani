import { 
  calculateAgeInMonths, 
  getAgeText, 
  calculatePregnancyWeeks, 
  getVaccineSchedule 
} from '../utils/dateUtils';

describe('Suite de Pruebas Unitarias Clínicas y de Utilidades de Fecha', () => {

  describe('calculateAgeInMonths', () => {
    const baseDate = '2026-05-22';

    test('Debería retornar 0 meses si nació el mismo día de la fecha base', () => {
      expect(calculateAgeInMonths('2026-05-22', baseDate)).toBe(0);
    });

    test('Debería retornar 0 meses si la fecha de nacimiento es futura respecto a la fecha base', () => {
      expect(calculateAgeInMonths('2026-06-01', baseDate)).toBe(0);
    });

    test('Debería retornar 1 mes si nació hace un mes exacto', () => {
      expect(calculateAgeInMonths('2026-04-22', baseDate)).toBe(1);
    });

    test('Debería retornar 12 meses si nació hace exactamente un año', () => {
      expect(calculateAgeInMonths('2025-05-22', baseDate)).toBe(12);
    });

    test('Debería manejar días de frontera correctamente (ej. nacido el 31 de Enero, evaluado el 28 de Febrero)', () => {
      // 31 Ene 2026 a 28 Feb 2026 es menos de un mes completo en base a días
      expect(calculateAgeInMonths('2026-01-31', '2026-02-28')).toBe(0);
      // Evaluado el 3 de Marzo debería ser 1 mes completo
      expect(calculateAgeInMonths('2026-01-31', '2026-03-03')).toBe(1);
    });

    test('Debería manejar años bisiestos (nacido el 29 de Febrero de 2024)', () => {
      // Evaluado el 28 de Febrero de 2025 (no bisiesto): no ha cumplido el año completo por días
      expect(calculateAgeInMonths('2024-02-29', '2025-02-28')).toBe(11);
      // Evaluado el 1 de Marzo de 2025: cumple los 12 meses
      expect(calculateAgeInMonths('2024-02-29', '2025-03-01')).toBe(12);
    });

    test('Debería retornar 0 si la fecha de nacimiento es inválida o vacía', () => {
      expect(calculateAgeInMonths('')).toBe(0);
      expect(calculateAgeInMonths('fecha-no-valida')).toBe(0);
    });
  });

  describe('getAgeText', () => {
    test('Debería retornar "Recién nacido" para 0 meses', () => {
      expect(getAgeText('2026-05-22', '2026-05-22')).toBe('Recién nacido');
    });

    test('Debería usar singular para 1 mes', () => {
      expect(getAgeText('2026-04-22', '2026-05-22')).toBe('1 mes');
    });

    test('Debería usar plural para varios meses', () => {
      expect(getAgeText('2026-01-22', '2026-05-22')).toBe('4 meses');
    });

    test('Debería mostrar año exacto en singular', () => {
      expect(getAgeText('2025-05-22', '2026-05-22')).toBe('1 año');
    });

    test('Debería mostrar años exactos en plural', () => {
      expect(getAgeText('2024-05-22', '2026-05-22')).toBe('2 años');
    });

    test('Debería mostrar años y meses combinados correctamente', () => {
      expect(getAgeText('2025-03-22', '2026-05-22')).toBe('1 año 2 meses');
      expect(getAgeText('2024-04-22', '2026-05-22')).toBe('2 años 1 mes');
    });
  });

  describe('calculatePregnancyWeeks', () => {
    const baseDate = '2026-05-22';

    test('Debería retornar 0 semanas y días si la última regla es hoy', () => {
      const res = calculatePregnancyWeeks('2026-05-22', baseDate);
      expect(res.weeks).toBe(0);
      expect(res.days).toBe(0);
      expect(res.isValid).toBe(true);
    });

    test('Debería calcular semanas y días transcurridos correctamente', () => {
      // 10 días de diferencia = 1 semana y 3 días
      const res = calculatePregnancyWeeks('2026-05-12', baseDate);
      expect(res.weeks).toBe(1);
      expect(res.days).toBe(3);
      expect(res.isValid).toBe(true);
    });

    test('Debería calcular un embarazo completo a término (40 semanas / 280 días)', () => {
      const lmp = new Date('2026-05-22');
      lmp.setDate(lmp.getDate() - 280);
      const res = calculatePregnancyWeeks(lmp.toISOString().split('T')[0], baseDate);
      expect(res.weeks).toBe(40);
      expect(res.days).toBe(0);
      expect(res.isValid).toBe(true);
    });

    test('Debería retornar inválido si la fecha de última regla es posterior a la evaluación', () => {
      const res = calculatePregnancyWeeks('2026-06-01', baseDate);
      expect(res.isValid).toBe(false);
    });

    test('Debería retornar inválido si supera el límite de gestación razonable (mayor a 45 semanas / 315 días)', () => {
      const res = calculatePregnancyWeeks('2025-05-01', baseDate); // Más de 1 año de gestación
      expect(res.isValid).toBe(false);
    });

    test('Debería manejar de forma segura entradas inválidas o vacías', () => {
      expect(calculatePregnancyWeeks('').isValid).toBe(false);
      expect(calculatePregnancyWeeks('invalid-date').isValid).toBe(false);
    });
  });

  describe('getVaccineSchedule', () => {
    const birthDate = '2026-01-22';
    const baseDate = '2026-05-22'; // Bebé tiene exactamente 4 meses de edad en esta fecha base

    test('Debería retornar un listado vacío ante entradas inválidas', () => {
      expect(getVaccineSchedule('')).toEqual([]);
      expect(getVaccineSchedule('invalid-date')).toEqual([]);
    });

    test('Debería listar la cantidad correcta de vacunas recomendadas', () => {
      const schedule = getVaccineSchedule(birthDate, baseDate);
      expect(schedule.length).toBe(20);
      expect(schedule[0].vaccine).toBe('BCG (Tuberculosis)');
    });

    test('Debería calcular la fecha de vencimiento correcta para cada vacuna', () => {
      const schedule = getVaccineSchedule(birthDate, baseDate);
      // BCG es a los 0 meses (mismo día de nacimiento)
      expect(schedule[0].dueDate).toBe('2026-01-22');
      // Pentavalente 1ra es a los 2 meses (22 de Marzo)
      const pentavalente1 = schedule.find(v => v.vaccine === 'Pentavalente (1ra dosis)');
      expect(pentavalente1).toBeDefined();
      expect(pentavalente1?.dueDate).toBe('2026-03-22');
    });

    test('Debería identificar correctamente las vacunas vencidas (overdue)', () => {
      const schedule = getVaccineSchedule(birthDate, baseDate);
      
      // BCG (0 meses) vencida a los 4 meses
      const bcg = schedule.find(v => v.vaccine === 'BCG (Tuberculosis)');
      expect(bcg?.isOverdue).toBe(true);

      // Pentavalente 1ra (2 meses, due 22 Marzo) vencida el 22 de Mayo
      const penta1 = schedule.find(v => v.vaccine === 'Pentavalente (1ra dosis)');
      expect(penta1?.isOverdue).toBe(true);

      // Pentavalente 2da (4 meses, due 22 Mayo) no debería estar vencida en el mismo día exacto
      const penta2 = schedule.find(v => v.vaccine === 'Pentavalente (2da dosis)');
      expect(penta2?.isOverdue).toBe(false);

      // SPR 1ra dosis (12 meses, due en el futuro) no debería estar vencida
      const spr = schedule.find(v => v.vaccine === 'SPR - Sarampión, Papera, Rubéola (1ra dosis)');
      expect(spr?.isOverdue).toBe(false);
    });
  });

});
