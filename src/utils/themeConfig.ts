import { ThemeColorId } from '../types';

export interface ThemeConfig {
  id: ThemeColorId;
  name: string;
  tagline: string;
  primaryHex: string;
  accentHex: string;
  badgeHex: string;
  primaryBtn: string;
  secondaryBtn: string;
  primaryText: string;
  primaryBgLight: string;
  primaryBorder: string;
  badgeBg: string;
  gradientHeader: string;
  ringFocus: string;
  accentDot: string;
}

export const THEME_CONFIGS: Record<ThemeColorId, ThemeConfig> = {
  sky: {
    id: 'sky',
    name: 'Azul Universitario & Dorado',
    tagline: 'Paleta insignia académica, serena y estructurada',
    primaryHex: '#0284c7',
    accentHex: '#f59e0b',
    badgeHex: '#0369a1',
    primaryBtn: 'bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white shadow-sky-200',
    secondaryBtn: 'bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold',
    primaryText: 'text-sky-600',
    primaryBgLight: 'bg-sky-50 text-sky-700 border-sky-200',
    primaryBorder: 'border-sky-200',
    badgeBg: 'bg-sky-100 text-sky-700',
    gradientHeader: 'from-sky-500 to-sky-700',
    ringFocus: 'focus:ring-sky-400',
    accentDot: 'bg-sky-500',
  },
  emerald: {
    id: 'emerald',
    name: 'Esmeralda Éxito & Menta',
    tagline: 'Enfoque en crecimiento, aprobación y superación',
    primaryHex: '#059669',
    accentHex: '#84cc16',
    badgeHex: '#047857',
    primaryBtn: 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-emerald-200',
    secondaryBtn: 'bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold',
    primaryText: 'text-emerald-600',
    primaryBgLight: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    primaryBorder: 'border-emerald-200',
    badgeBg: 'bg-emerald-100 text-emerald-800',
    gradientHeader: 'from-emerald-600 to-teal-800',
    ringFocus: 'focus:ring-emerald-400',
    accentDot: 'bg-emerald-500',
  },
  violet: {
    id: 'violet',
    name: 'Violeta Creativo & Neón',
    tagline: 'Para mentes innovadoras, programación y diseño',
    primaryHex: '#7c3aed',
    accentHex: '#ec4899',
    badgeHex: '#6d28d9',
    primaryBtn: 'bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white shadow-violet-200',
    secondaryBtn: 'bg-pink-400 hover:bg-pink-500 text-slate-950 font-bold',
    primaryText: 'text-violet-600',
    primaryBgLight: 'bg-violet-50 text-violet-800 border-violet-200',
    primaryBorder: 'border-violet-200',
    badgeBg: 'bg-violet-100 text-violet-800',
    gradientHeader: 'from-violet-600 to-purple-800',
    ringFocus: 'focus:ring-violet-400',
    accentDot: 'bg-violet-500',
  },
  indigo: {
    id: 'indigo',
    name: 'Índigo Ejecutivo & Zafiro',
    tagline: 'Estilo formal de alto rendimiento y concentración',
    primaryHex: '#4f46e5',
    accentHex: '#38bdf8',
    badgeHex: '#4338ca',
    primaryBtn: 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-indigo-200',
    secondaryBtn: 'bg-sky-400 hover:bg-sky-500 text-slate-950 font-bold',
    primaryText: 'text-indigo-600',
    primaryBgLight: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    primaryBorder: 'border-indigo-200',
    badgeBg: 'bg-indigo-100 text-indigo-800',
    gradientHeader: 'from-indigo-600 to-blue-800',
    ringFocus: 'focus:ring-indigo-400',
    accentDot: 'bg-indigo-500',
  },
  amber: {
    id: 'amber',
    name: 'Ámbar Energía & Fuego',
    tagline: 'Dinamismo, alerta activa y motivación continua',
    primaryHex: '#d97706',
    accentHex: '#ef4444',
    badgeHex: '#b45309',
    primaryBtn: 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold shadow-amber-200',
    secondaryBtn: 'bg-slate-900 hover:bg-slate-800 text-white font-bold',
    primaryText: 'text-amber-600',
    primaryBgLight: 'bg-amber-50 text-amber-800 border-amber-200',
    primaryBorder: 'border-amber-200',
    badgeBg: 'bg-amber-100 text-amber-800',
    gradientHeader: 'from-amber-500 to-orange-700',
    ringFocus: 'focus:ring-amber-400',
    accentDot: 'bg-amber-500',
  },
  rose: {
    id: 'rose',
    name: 'Rosa Audaz & Frambuesa',
    tagline: 'Estilo contemporáneo, inspirador y vibrante',
    primaryHex: '#e11d48',
    accentHex: '#f43f5e',
    badgeHex: '#be123c',
    primaryBtn: 'bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white shadow-rose-200',
    secondaryBtn: 'bg-amber-300 hover:bg-amber-400 text-slate-950 font-bold',
    primaryText: 'text-rose-600',
    primaryBgLight: 'bg-rose-50 text-rose-800 border-rose-200',
    primaryBorder: 'border-rose-200',
    badgeBg: 'bg-rose-100 text-rose-800',
    gradientHeader: 'from-rose-500 to-pink-700',
    ringFocus: 'focus:ring-rose-400',
    accentDot: 'bg-rose-500',
  },
  teal: {
    id: 'teal',
    name: 'Océano Turquesa & Glaciar',
    tagline: 'Claridad mental, precisión y calma analítica',
    primaryHex: '#0d9488',
    accentHex: '#06b6d4',
    badgeHex: '#0f766e',
    primaryBtn: 'bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white shadow-teal-200',
    secondaryBtn: 'bg-cyan-400 hover:bg-cyan-500 text-slate-950 font-bold',
    primaryText: 'text-teal-600',
    primaryBgLight: 'bg-teal-50 text-teal-800 border-teal-200',
    primaryBorder: 'border-teal-200',
    badgeBg: 'bg-teal-100 text-teal-800',
    gradientHeader: 'from-teal-600 to-cyan-800',
    ringFocus: 'focus:ring-teal-400',
    accentDot: 'bg-teal-500',
  },
};

export function applyThemeToDocument(themeId: ThemeColorId) {
  const config = THEME_CONFIGS[themeId] || THEME_CONFIGS.sky;
  const root = document.documentElement;

  root.setAttribute('data-theme', config.id);
  root.style.setProperty('--theme-primary', config.primaryHex);
  root.style.setProperty('--theme-accent', config.accentHex);
  root.style.setProperty('--theme-badge', config.badgeHex);

  try {
    localStorage.setItem('tutorias_theme', themeId);
  } catch (e) {
    console.warn('No se pudo guardar el tema en localStorage', e);
  }
}

export function getSavedTheme(): ThemeColorId {
  try {
    const saved = localStorage.getItem('tutorias_theme') as ThemeColorId;
    if (saved && THEME_CONFIGS[saved]) {
      return saved;
    }
  } catch (e) {
    console.warn('Error leyendo tema de localStorage', e);
  }
  return 'sky';
}
