import i18n from 'i18next';

export type Language = 'ko' | 'en' | 'zh';

export interface I18nResources {
  [key: string]: {
    translation: Record<string, any>;
  };
}

// 기본 i18n 설정
export const i18nConfig = {
  fallbackLng: 'ko',
  supportedLngs: ['ko', 'en', 'zh'] as Language[],
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage'],
  },
};

// 번역 키 타입 (타입 안전성을 위한 기본 구조)
export type TranslationKeys = {
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    create: string;
    search: string;
    reset: string;
    confirm: string;
    close: string;
    back: string;
    next: string;
    loading: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };
  inspection: {
    title: string;
    iqc: {
      title: string;
      lotNo: string;
      inspectionDate: string;
      judgment: {
        pass: string;
        fail: string;
        hold: string;
      };
    };
  };
  ncr: {
    title: string;
    ncrNo: string;
    status: string;
  };
  // ... 확장 가능
};

export { i18n };
export default i18n;
