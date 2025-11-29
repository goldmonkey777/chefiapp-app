// ChefIApp™ - MCP_LANGUAGE Server
// Automatic Translations and Terminology Standardization

import {
  SupportedLanguage,
  TranslationResult,
  LanguageDetection,
  InternationalizedUI,
  GlossaryTerm,
} from './types';

// ============================================================================
// TRANSLATION DICTIONARIES
// ============================================================================

const languageNames: Record<SupportedLanguage, string> = {
  pt: 'Português',
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
};

// Sample hospitality glossary
const hospitalityGlossary: Record<string, Record<SupportedLanguage, string>> = {
  'check-in': {
    pt: 'entrada',
    en: 'check-in',
    es: 'entrada',
    fr: 'arrivée',
    de: 'anmeldung',
    it: 'arrivo',
  },
  'shift': {
    pt: 'turno',
    en: 'shift',
    es: 'turno',
    fr: 'équipe',
    de: 'schicht',
    it: 'turno',
  },
  'task': {
    pt: 'tarefa',
    en: 'task',
    es: 'tarea',
    fr: 'tâche',
    de: 'aufgabe',
    it: 'compito',
  },
  'manager': {
    pt: 'gerente',
    en: 'manager',
    es: 'gerente',
    fr: 'responsable',
    de: 'manager',
    it: 'responsabile',
  },
};

// ============================================================================
// TRANSLATE TEXT
// ============================================================================

export function translateText(
  text: string,
  fromLang: SupportedLanguage,
  toLang: SupportedLanguage
): TranslationResult {
  // In production, this would call GPT API or translation service
  // For now, simulate translation with simple rules

  if (fromLang === toLang) {
    return {
      original: text,
      translated: text,
      fromLang,
      toLang,
      confidence: 1.0,
    };
  }

  // Check if text matches glossary
  const lowerText = text.toLowerCase();
  for (const [key, translations] of Object.entries(hospitalityGlossary)) {
    if (lowerText.includes(key)) {
      const translated = text.toLowerCase().replace(
        translations[fromLang],
        translations[toLang]
      );
      return {
        original: text,
        translated,
        fromLang,
        toLang,
        confidence: 0.95,
      };
    }
  }

  // Simulated translation
  const translated = `[${toLang.toUpperCase()}] ${text}`;

  return {
    original: text,
    translated,
    fromLang,
    toLang,
    confidence: 0.85,
  };
}

// ============================================================================
// DETECT LANGUAGE
// ============================================================================

export function detectLanguage(text: string): LanguageDetection {
  // In production, use language detection API
  // For now, use simple heuristics

  const lowerText = text.toLowerCase();

  // Portuguese indicators
  const ptIndicators = ['ã', 'õ', 'ç', 'você', 'está', 'não', 'são'];
  const ptScore = ptIndicators.filter((ind) => lowerText.includes(ind)).length;

  // Spanish indicators
  const esIndicators = ['ñ', '¿', '¡', 'está', 'usted', 'señor'];
  const esScore = esIndicators.filter((ind) => lowerText.includes(ind)).length;

  // French indicators
  const frIndicators = ['é', 'è', 'ê', 'à', 'vous', 'est', 'sont'];
  const frScore = frIndicators.filter((ind) => lowerText.includes(ind)).length;

  // Determine detected language
  let detectedLanguage: SupportedLanguage = 'en'; // default
  let maxScore = 0;

  if (ptScore > maxScore) {
    detectedLanguage = 'pt';
    maxScore = ptScore;
  }
  if (esScore > maxScore) {
    detectedLanguage = 'es';
    maxScore = esScore;
  }
  if (frScore > maxScore) {
    detectedLanguage = 'fr';
    maxScore = frScore;
  }

  const confidence = Math.min(0.95, 0.6 + maxScore * 0.1);

  // Generate alternatives
  const alternatives: Array<{ language: SupportedLanguage; confidence: number }> = [];

  if (detectedLanguage !== 'en') {
    alternatives.push({ language: 'en', confidence: 0.3 });
  }
  if (detectedLanguage !== 'pt' && ptScore > 0) {
    alternatives.push({ language: 'pt', confidence: ptScore * 0.15 });
  }
  if (detectedLanguage !== 'es' && esScore > 0) {
    alternatives.push({ language: 'es', confidence: esScore * 0.15 });
  }

  return {
    text,
    detectedLanguage,
    confidence,
    alternatives: alternatives.slice(0, 3),
  };
}

// ============================================================================
// INTERNATIONALIZE UI
// ============================================================================

export function internationalizeUI(
  uiObject: Record<string, string>
): InternationalizedUI {
  const result: InternationalizedUI = {
    pt: {},
    en: {},
    es: {},
  };

  // For each UI string, translate to all languages
  for (const [key, value] of Object.entries(uiObject)) {
    // Assume input is in English
    result.en[key] = value;

    // Translate to Portuguese
    result.pt[key] = translateText(value, 'en', 'pt').translated;

    // Translate to Spanish
    result.es[key] = translateText(value, 'en', 'es').translated;
  }

  return result;
}

// ============================================================================
// AUTO GLOSSARY
// ============================================================================

export function autoGlossary(terms: string[]): GlossaryTerm[] {
  const glossary: GlossaryTerm[] = [];

  for (const term of terms) {
    const lowerTerm = term.toLowerCase();

    // Check if term exists in hospitality glossary
    const translations: Record<SupportedLanguage, string> =
      hospitalityGlossary[lowerTerm] || {
        pt: term,
        en: term,
        es: term,
        fr: term,
        de: term,
        it: term,
      };

    // Determine category
    let category = 'general';
    if (['check-in', 'check-out', 'shift'].includes(lowerTerm)) {
      category = 'operations';
    } else if (['task', 'cleaning', 'preparation'].includes(lowerTerm)) {
      category = 'tasks';
    } else if (['manager', 'employee', 'owner'].includes(lowerTerm)) {
      category = 'roles';
    }

    glossary.push({
      term,
      translations,
      context: `Hospitality industry - ${category}`,
      category,
    });
  }

  return glossary;
}

// ============================================================================
// EXPORTS
// ============================================================================

export const MCPLanguage = {
  translateText,
  detectLanguage,
  internationalizeUI,
  autoGlossary,
};

export default MCPLanguage;
