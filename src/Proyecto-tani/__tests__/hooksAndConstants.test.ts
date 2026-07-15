import { Colors, TANI } from '../constants/theme';
import { useThemeColor } from '../hooks/use-theme-color';

// Mock del hook useColorScheme
jest.mock('../hooks/use-color-scheme', () => ({
  useColorScheme: jest.fn(() => 'light'),
}));

import { useColorScheme } from '../hooks/use-color-scheme';

describe('Suite de Pruebas para Constantes y Hooks de Apariencia', () => {

  describe('Constantes de Tema (theme.ts)', () => {
    test('Debería exportar la paleta de colores TANI con light y dark correctos', () => {
      expect(Colors.light.primary).toBe('#499F86');
      expect(Colors.light.primaryDark).toBe('#006953');
      expect(Colors.light.gold).toBe('#C5A059');
      expect(Colors.light.white).toBe('#ffffff');
      expect(Colors.light.error).toBe('#ba1a1a');

      expect(Colors.dark.primary).toBe('#499F86');
      expect(Colors.dark.gold).toBe('#C5A059');
    });

    test('Debería exportar los colores específicos de login TANI', () => {
      expect(TANI.teal).toBe('#4A948C');
      expect(TANI.dark).toBe('#2D5A54');
      expect(TANI.gold).toBe('#C5A059');
      expect(TANI.btnGradTop).toBe('#5BA39B');
      expect(TANI.btnGradBottom).toBe('#3A736C');
    });
  });

  describe('Hook useThemeColor', () => {
    const mockUseColorScheme = useColorScheme as jest.Mock;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('Debería retornar el color específico del prop cuando está definido para light', () => {
      mockUseColorScheme.mockReturnValue('light');
      const color = useThemeColor({ light: '#111111', dark: '#222222' }, 'primary');
      expect(color).toBe('#111111');
    });

    test('Debería retornar el color específico del prop cuando está definido para dark', () => {
      mockUseColorScheme.mockReturnValue('dark');
      const color = useThemeColor({ light: '#111111', dark: '#222222' }, 'primary');
      expect(color).toBe('#222222');
    });

    test('Debería retornar el color de paleta del tema por defecto cuando no se pasan props (light)', () => {
      mockUseColorScheme.mockReturnValue('light');
      const color = useThemeColor({}, 'primary');
      expect(color).toBe(Colors.light.primary);
    });

    test('Debería retornar el color de paleta del tema por defecto cuando no se pasan props (dark)', () => {
      mockUseColorScheme.mockReturnValue('dark');
      const color = useThemeColor({}, 'primary');
      expect(color).toBe(Colors.dark.primary);
    });

    test('Debería caer en light por defecto si useColorScheme retorna null', () => {
      mockUseColorScheme.mockReturnValue(null);
      const color = useThemeColor({}, 'primary');
      expect(color).toBe(Colors.light.primary);
    });
  });

});
