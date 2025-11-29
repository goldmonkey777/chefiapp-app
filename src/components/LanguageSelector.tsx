import React from 'react';
import { useTranslation } from 'react-i18next';
import { supportedLanguages } from '../i18n';
import { Globe } from 'lucide-react';

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem('i18nextLng', languageCode);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Globe className="w-4 h-4" />
        <span>Language / Idioma</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {supportedLanguages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`
              flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all
              ${
                i18n.language === lang.code
                  ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <span className="text-2xl">{lang.flag}</span>
            <span className="text-sm">{lang.name}</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {i18n.language === 'pt' && 'Selecione seu idioma preferido'}
        {i18n.language === 'en' && 'Select your preferred language'}
        {i18n.language === 'es' && 'Selecciona tu idioma preferido'}
        {i18n.language === 'fr' && 'Sélectionnez votre langue préférée'}
        {i18n.language === 'de' && 'Wählen Sie Ihre bevorzugte Sprache'}
        {i18n.language === 'it' && 'Seleziona la tua lingua preferita'}
      </p>
    </div>
  );
};
