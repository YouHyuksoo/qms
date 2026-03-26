// Theme types and constants

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeColors {
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  success: {
    50: string;
    100: string;
    500: string;
    600: string;
    700: string;
  };
  warning: {
    50: string;
    100: string;
    500: string;
    600: string;
    700: string;
  };
  danger: {
    50: string;
    100: string;
    500: string;
    600: string;
    700: string;
  };
  info: {
    50: string;
    100: string;
    500: string;
    600: string;
    700: string;
  };
  background: string;
  surface: string;
  border: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
}

// CSS 변수 매핑
export const themeCSSVariables = {
  light: {
    '--primary-50': '#EEF2FF',
    '--primary-100': '#E0E7FF',
    '--primary-200': '#C7D2FE',
    '--primary-300': '#A5B4FC',
    '--primary-400': '#818CF8',
    '--primary-500': '#6366F1',
    '--primary-600': '#4F46E5',
    '--primary-700': '#4338CA',
    '--primary-800': '#3730A3',
    '--primary-900': '#312E81',
    
    '--success-50': '#F0FDF4',
    '--success-100': '#DCFCE7',
    '--success-500': '#22C55E',
    '--success-600': '#16A34A',
    '--success-700': '#15803D',
    
    '--warning-50': '#FFFBEB',
    '--warning-100': '#FEF3C7',
    '--warning-500': '#F59E0B',
    '--warning-600': '#D97706',
    '--warning-700': '#B45309',
    
    '--danger-50': '#FEF2F2',
    '--danger-100': '#FEE2E2',
    '--danger-500': '#EF4444',
    '--danger-600': '#DC2626',
    '--danger-700': '#B91C1C',
    
    '--info-50': '#EFF6FF',
    '--info-100': '#DBEAFE',
    '--info-500': '#3B82F6',
    '--info-600': '#2563EB',
    '--info-700': '#1D4ED8',
    
    '--background': '#F9FAFB',
    '--surface': '#FFFFFF',
    '--border': '#E5E7EB',
    '--text-primary': '#111827',
    '--text-secondary': '#6B7280',
    '--text-disabled': '#9CA3AF',
  },
  dark: {
    '--primary-50': '#1E1B4B',
    '--primary-100': '#312E81',
    '--primary-200': '#3730A3',
    '--primary-300': '#4338CA',
    '--primary-400': '#4F46E5',
    '--primary-500': '#6366F1',
    '--primary-600': '#818CF8',
    '--primary-700': '#A5B4FC',
    '--primary-800': '#C7D2FE',
    '--primary-900': '#E0E7FF',
    
    '--success-50': '#052E16',
    '--success-100': '#14532D',
    '--success-500': '#22C55E',
    '--success-600': '#4ADE80',
    '--success-700': '#86EFAC',
    
    '--warning-50': '#451A03',
    '--warning-100': '#713F12',
    '--warning-500': '#F59E0B',
    '--warning-600': '#FBBF24',
    '--warning-700': '#FCD34D',
    
    '--danger-50': '#450A0A',
    '--danger-100': '#7F1D1D',
    '--danger-500': '#EF4444',
    '--danger-600': '#F87171',
    '--danger-700': '#FCA5A5',
    
    '--info-50': '#172554',
    '--info-100': '#1E3A8A',
    '--info-500': '#3B82F6',
    '--info-600': '#60A5FA',
    '--info-700': '#93C5FD',
    
    '--background': '#111827',
    '--surface': '#1F2937',
    '--border': '#374151',
    '--text-primary': '#F9FAFB',
    '--text-secondary': '#9CA3AF',
    '--text-disabled': '#6B7280',
  }
};

// 테마 적용 함수 (브라우저 환경에서만 실행)
export function applyTheme(theme: Theme): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  
  const root = document.documentElement;
  const isDark = theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  const variables = isDark ? themeCSSVariables.dark : themeCSSVariables.light;
  
  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  
  root.classList.toggle('dark', isDark);
}

// 로컬 스토리지 키
export const THEME_STORAGE_KEY = 'qms-theme';
export const LANGUAGE_STORAGE_KEY = 'qms-language';
