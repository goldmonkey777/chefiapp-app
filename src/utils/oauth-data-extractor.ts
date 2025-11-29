/**
 * OAuth Data Extractor
 *
 * Extrai dados do OAuth (Google/Apple) e mapeia para o formato CompanyOnboardingData
 * para pré-preencher campos automaticamente.
 */

import type { User } from '@supabase/supabase-js';
import type { CompanyOnboardingData } from '../components/CompanyOnboarding/CompanyOnboarding';

/**
 * Mapeamento de código de país (ISO 3166-1 alpha-2) para moeda (ISO 4217)
 */
const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  // Europa (EUR)
  PT: 'EUR', ES: 'EUR', FR: 'EUR', DE: 'EUR', IT: 'EUR', NL: 'EUR', BE: 'EUR',
  AT: 'EUR', GR: 'EUR', IE: 'EUR', FI: 'EUR', EE: 'EUR', LV: 'EUR', LT: 'EUR',
  SK: 'EUR', SI: 'EUR', CY: 'EUR', MT: 'EUR', LU: 'EUR',

  // Américas
  US: 'USD', CA: 'CAD', BR: 'BRL', MX: 'MXN', AR: 'ARS', CL: 'CLP', CO: 'COP',
  PE: 'PEN', UY: 'UYU', VE: 'VES', EC: 'USD', BO: 'BOB', PY: 'PYG',

  // Reino Unido
  GB: 'GBP',

  // Ásia-Pacífico
  AU: 'AUD', NZ: 'NZD', JP: 'JPY', KR: 'KRW', SG: 'SGD', HK: 'HKD', TW: 'TWD',
  CN: 'CNY', IN: 'INR', TH: 'THB', MY: 'MYR', ID: 'IDR', PH: 'PHP', VN: 'VND',

  // Oriente Médio & África
  AE: 'AED', SA: 'SAR', EG: 'EGP', MA: 'MAD', ZA: 'ZAR', IL: 'ILS', TR: 'TRY',

  // Outros Europa (não EUR)
  CH: 'CHF', SE: 'SEK', NO: 'NOK', DK: 'DKK', PL: 'PLN', CZ: 'CZK', HU: 'HUF',
  RO: 'RON', BG: 'BGN', HR: 'HRK', RS: 'RSD', UA: 'UAH', RU: 'RUB',
};

/**
 * Mapeamento de código de idioma (ISO 639-1) para código suportado pelo i18n
 */
const LANGUAGE_MAP: Record<string, string> = {
  pt: 'pt', // Português
  en: 'en', // English
  es: 'es', // Español
  fr: 'fr', // Français
  de: 'de', // Deutsch
  it: 'it', // Italiano
};

/**
 * Detecta o país do usuário baseado no locale do navegador
 * Exemplo: 'pt-BR' → 'BR', 'en-US' → 'US', 'fr-FR' → 'FR'
 */
export const detectCountryFromLocale = (): string => {
  try {
    const locale = navigator.language || 'en-US';
    const parts = locale.split('-');

    if (parts.length === 2) {
      return parts[1].toUpperCase(); // 'pt-BR' → 'BR'
    }

    // Fallback: mapear idioma para país mais comum
    const languageToCountry: Record<string, string> = {
      pt: 'BR',
      en: 'US',
      es: 'ES',
      fr: 'FR',
      de: 'DE',
      it: 'IT',
    };

    const language = parts[0].toLowerCase();
    return languageToCountry[language] || 'US';
  } catch {
    return 'US'; // Fallback
  }
};

/**
 * Detecta o idioma do usuário baseado no locale do navegador ou i18n atual
 * Retorna apenas idiomas suportados pelo app (pt, en, es, fr, de, it)
 */
export const detectLanguage = (): string => {
  try {
    // Tentar pegar do localStorage (i18n cache)
    const storedLanguage = localStorage.getItem('i18nextLng');
    if (storedLanguage && LANGUAGE_MAP[storedLanguage]) {
      return storedLanguage;
    }

    // Tentar pegar do navegador
    const locale = navigator.language || 'en-US';
    const language = locale.split('-')[0].toLowerCase();

    // Retornar idioma se suportado, senão 'en'
    return LANGUAGE_MAP[language] || 'en';
  } catch {
    return 'en'; // Fallback
  }
};

/**
 * Converte código de país para moeda
 * Exemplo: 'BR' → 'BRL', 'US' → 'USD', 'PT' → 'EUR'
 */
export const getCurrencyFromCountry = (countryCode: string): string => {
  return COUNTRY_CURRENCY_MAP[countryCode.toUpperCase()] || 'USD';
};

/**
 * Verifica se o email é um email privado do Apple (relay)
 * Emails privados da Apple seguem o padrão: *@privaterelay.appleid.com
 */
export const isApplePrivateEmail = (email: string): boolean => {
  return email.toLowerCase().includes('@privaterelay.appleid.com');
};

/**
 * Extrai dados do usuário autenticado via OAuth (Google/Apple)
 * e retorna objeto parcial para pré-preencher CompanyOnboardingData
 */
export const extractOAuthDataForCompany = (user: User | null): Partial<CompanyOnboardingData> => {
  if (!user) {
    if (import.meta.env.DEV) console.log('[OAuth Extractor] No user provided');
    return {};
  }

  if (import.meta.env.DEV) {
    console.log('[OAuth Extractor] Extracting data from user:', {
      userId: user.id,
      email: user.email,
      provider: user.app_metadata?.provider,
      metadata: user.user_metadata,
    });
  }

  const extractedData: Partial<CompanyOnboardingData> = {};

  // 1. EMAIL
  // Pegar email do usuário, mas avisar se for relay privado da Apple
  if (user.email) {
    if (isApplePrivateEmail(user.email)) {
      if (import.meta.env.DEV) console.warn('[OAuth Extractor] Email is Apple Private Relay - user may want to change it');
      // Mesmo assim vamos preencher, mas o usuário pode editar
      extractedData.email = user.email;
    } else {
      extractedData.email = user.email;
    }
  }

  // 2. LOGO URL (usar foto de perfil como placeholder temporário)
  if (user.user_metadata?.picture) {
    extractedData.logoUrl = user.user_metadata.picture; // Google
  } else if (user.user_metadata?.avatar_url) {
    extractedData.logoUrl = user.user_metadata.avatar_url; // Outros providers
  }

  // 3. LANGUAGE (idioma)
  extractedData.language = detectLanguage();

  // 4. COUNTRY (país)
  extractedData.country = detectCountryFromLocale();

  // 5. CURRENCY (moeda baseada no país)
  extractedData.currency = getCurrencyFromCountry(extractedData.country || 'US');

  if (import.meta.env.DEV) console.log('[OAuth Extractor] Extracted data:', extractedData);

  return extractedData;
};

/**
 * Extrai nome completo do usuário do OAuth
 * Útil para pré-preencher perfil do proprietário/gerente
 */
export const extractUserFullName = (user: User | null): string => {
  if (!user) return '';

  // Google fornece 'full_name' e 'name'
  if (user.user_metadata?.full_name) {
    return user.user_metadata.full_name;
  }

  if (user.user_metadata?.name) {
    return user.user_metadata.name;
  }

  // Fallback: extrair do email
  if (user.email) {
    const emailUsername = user.email.split('@')[0];
    // Capitalizar primeira letra
    return emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1);
  }

  return '';
};

/**
 * Extrai foto de perfil do usuário do OAuth
 */
export const extractUserProfilePhoto = (user: User | null): string => {
  if (!user) return '';

  // Google e outros providers
  if (user.user_metadata?.picture) {
    return user.user_metadata.picture;
  }

  if (user.user_metadata?.avatar_url) {
    return user.user_metadata.avatar_url;
  }

  return '';
};
