/**
 * TANI Design System — Archivo central de colores
 * Exporta Colors.light para compatibilidad con todos los screens existentes
 * y también constantes directas para los screens nuevos.
 */

// ─── Paleta de colores TANI ───────────────────────────────────────────────────
const teal       = '#499F86';  // primario (home y screens de la app)
const tealDeep   = '#006953';  // primario oscuro (auth, perfil, aprende)
const tealDark   = '#2D5A54';  // muy oscuro
const gold       = '#C5A059';  // dorado (login)
const orange     = '#9b4500';  // secundario
const amber      = '#765b00';  // terciario
const surface    = '#fbf9f8';  // fondo de pantalla general
const bg         = '#F0F9F7';  // fondo pantalla de login
const white      = '#ffffff';
const text       = '#1b1c1c';
const textSub    = '#3e4945';
const outline    = '#6e7a74';
const outlineVar = '#bec9c3';
const error      = '#ba1a1a';

// ─── Export principal — estructura Colors.light ───────────────────────────────
// Todos los screens existentes usan Colors.light.xxx
export const Colors = {
  light: {
    // Colores de marca
    primary:         teal,
    primaryDark:     tealDeep,
    primaryDeeper:   tealDark,
    secondary:       orange,
    tertiary:        amber,
    gold:            gold,

    // Fondos
    background:      surface,
    loginBackground: bg,
    surface:         surface,
    surfaceContainer:    '#f0eded',
    surfaceContainerLow: '#f5f3f3',
    surfaceContainerHigh:'#eae8e7',
    surfaceHigh:     '#eae8e7',
    white:           white,

    // Textos
    text:            text,
    textSecondary:   textSub,
    outline:         outline,
    outlineVariant:  outlineVar,

    // Bordes y accents
    border:          outlineVar,
    loginBorder:     '#B2EBF2',

    // Estados
    error:           error,
    icon:            '#6e7a74',
  },
  dark: {
    // Colores de marca (copia de light para compatibilidad de tipos)
    primary:         teal,
    primaryDark:     tealDeep,
    primaryDeeper:   tealDark,
    secondary:       orange,
    tertiary:        amber,
    gold:            gold,

    // Fondos
    background:      surface,
    loginBackground: bg,
    surface:         surface,
    surfaceContainer:    '#f0eded',
    surfaceContainerLow: '#f5f3f3',
    surfaceContainerHigh:'#eae8e7',
    surfaceHigh:     '#eae8e7',
    white:           white,

    // Textos
    text:            text,
    textSecondary:   textSub,
    outline:         outline,
    outlineVariant:  outlineVar,

    // Bordes y accents
    border:          outlineVar,
    loginBorder:     '#B2EBF2',

    // Estados
    error:           error,
    icon:            '#6e7a74',
  },
};

// ─── TANI Auth (pantalla de login clásica) ────────────────────────────────────
export const TANI = {
  teal:          '#4A948C',
  dark:          '#2D5A54',
  gold:          '#C5A059',
  bg:            '#F0F9F7',
  border:        '#B2EBF2',
  btnGradTop:    '#5BA39B',
  btnGradBottom: '#3A736C',
};
