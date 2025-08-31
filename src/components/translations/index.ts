import { zhTranslations } from './zh';
import { enTranslations } from './en';

export const translations = {
  zh: zhTranslations,
  en: enTranslations
} as const;

export type TranslationKey = keyof typeof zhTranslations;
export type Language = keyof typeof translations;