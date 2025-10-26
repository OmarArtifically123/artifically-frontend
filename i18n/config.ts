/**
 * i18n Configuration for next-intl
 * Supports English (en) and Arabic (ar) with RTL support
 */

export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/**
 * Locale metadata for display and configuration
 */
export const localeConfig = {
  en: {
    label: 'English',
    direction: 'ltr' as const,
    htmlLang: 'en',
    currency: 'USD',
    currencySymbol: '$',
    dateFormat: 'MM/DD/YYYY',
    flag: '🇺🇸',
  },
  ar: {
    label: 'العربية',
    direction: 'rtl' as const,
    htmlLang: 'ar',
    currency: 'SAR',
    currencySymbol: 'ر.س',
    dateFormat: 'DD/MM/YYYY',
    flag: '🇸🇦',
  },
} as const;

/**
 * Currency options for Middle East market
 */
export const currencies = {
  USD: { symbol: '$', label: 'US Dollar', locale: 'en-US' },
  SAR: { symbol: 'ر.س', label: 'Saudi Riyal', locale: 'ar-SA' },
  AED: { symbol: 'د.إ', label: 'UAE Dirham', locale: 'ar-AE' },
  BHD: { symbol: 'د.ب', label: 'Bahraini Dinar', locale: 'ar-BH' },
  QAR: { symbol: 'ر.ق', label: 'Qatari Riyal', locale: 'ar-QA' },
} as const;

export type Currency = keyof typeof currencies;

/**
 * Get locale configuration
 */
export function getLocaleConfig(locale: Locale) {
  return localeConfig[locale] || localeConfig[defaultLocale];
}

/**
 * Check if locale is RTL
 */
export function isRTL(locale: Locale): boolean {
  return getLocaleConfig(locale).direction === 'rtl';
}

/**
 * Get text direction for locale
 */
export function getDirection(locale: Locale): 'ltr' | 'rtl' {
  return getLocaleConfig(locale).direction;
}

/**
 * Validate locale
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
