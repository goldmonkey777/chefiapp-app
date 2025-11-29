import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import ptTranslation from './locales/pt/translation.json';
import enTranslation from './locales/en/translation.json';
import esTranslation from './locales/es/translation.json';
import frTranslation from './locales/fr/translation.json';
import deTranslation from './locales/de/translation.json';
import itTranslation from './locales/it/translation.json';

// Language resources
const resources = {
  pt: { translation: ptTranslation },
  en: { translation: enTranslation },
  es: { translation: esTranslation },
  fr: { translation: frTranslation },
  de: { translation: deTranslation },
  it: { translation: itTranslation },
};

// Supported languages
export const supportedLanguages = [
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];

// Regional compliance mapping
export const regionalCompliance = {
  EU: {
    // European Union
    countries: ['PT', 'ES', 'FR', 'DE', 'IT', 'NL', 'BE', 'AT', 'GR', 'IE'],
    regulation: 'GDPR',
    privacyPolicyUrl: '/legal/privacy-eu',
    termsUrl: '/legal/terms-eu',
    cookieConsent: true,
    dataRetention: '30 days',
  },
  US: {
    // United States
    countries: ['US'],
    regulation: 'CCPA',
    privacyPolicyUrl: '/legal/privacy-us',
    termsUrl: '/legal/terms-us',
    cookieConsent: true,
    dataRetention: '30 days',
  },
  BR: {
    // Brazil
    countries: ['BR'],
    regulation: 'LGPD',
    privacyPolicyUrl: '/legal/privacy-br',
    termsUrl: '/legal/terms-br',
    cookieConsent: true,
    dataRetention: '30 days',
  },
  UK: {
    // United Kingdom
    countries: ['GB'],
    regulation: 'UK-GDPR',
    privacyPolicyUrl: '/legal/privacy-uk',
    termsUrl: '/legal/terms-uk',
    cookieConsent: true,
    dataRetention: '30 days',
  },
  CA: {
    // Canada
    countries: ['CA'],
    regulation: 'PIPEDA',
    privacyPolicyUrl: '/legal/privacy-ca',
    termsUrl: '/legal/terms-ca',
    cookieConsent: true,
    dataRetention: '30 days',
  },
  AU: {
    // Australia
    countries: ['AU'],
    regulation: 'Privacy Act',
    privacyPolicyUrl: '/legal/privacy-au',
    termsUrl: '/legal/terms-au',
    cookieConsent: true,
    dataRetention: '30 days',
  },
  LATAM: {
    // Latin America (excluding Brazil)
    countries: ['MX', 'AR', 'CL', 'CO', 'PE', 'VE', 'EC', 'UY'],
    regulation: 'Local Laws',
    privacyPolicyUrl: '/legal/privacy-latam',
    termsUrl: '/legal/terms-latam',
    cookieConsent: true,
    dataRetention: '30 days',
  },
  APAC: {
    // Asia-Pacific
    countries: ['JP', 'KR', 'SG', 'HK', 'TW', 'TH', 'MY', 'PH', 'ID', 'VN'],
    regulation: 'Local Laws',
    privacyPolicyUrl: '/legal/privacy-apac',
    termsUrl: '/legal/terms-apac',
    cookieConsent: true,
    dataRetention: '30 days',
  },
  MENA: {
    // Middle East & North Africa
    countries: ['AE', 'SA', 'EG', 'MA', 'DZ', 'TN', 'IL', 'JO', 'LB'],
    regulation: 'Local Laws',
    privacyPolicyUrl: '/legal/privacy-mena',
    termsUrl: '/legal/terms-mena',
    cookieConsent: true,
    dataRetention: '30 days',
  },
  OTHER: {
    // Rest of World
    countries: [],
    regulation: 'International Standards',
    privacyPolicyUrl: '/legal/privacy',
    termsUrl: '/legal/terms',
    cookieConsent: true,
    dataRetention: '30 days',
  },
};

// Get user's region based on country code
export const getUserRegion = (countryCode: string): keyof typeof regionalCompliance => {
  for (const [region, config] of Object.entries(regionalCompliance)) {
    if (config.countries.includes(countryCode.toUpperCase())) {
      return region as keyof typeof regionalCompliance;
    }
  }
  return 'OTHER';
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['pt', 'en', 'es', 'fr', 'de', 'it'],

    // Language detection
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    interpolation: {
      escapeValue: false, // React already escapes
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
