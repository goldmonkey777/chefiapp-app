import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getUserRegion, regionalCompliance } from '../i18n';
import { Shield, FileText, Globe, AlertCircle } from 'lucide-react';

interface RegionalComplianceProps {
  countryCode?: string;
}

export const RegionalCompliance: React.FC<RegionalComplianceProps> = ({
  countryCode
}) => {
  const { t } = useTranslation();
  const [region, setRegion] = useState<keyof typeof regionalCompliance>('OTHER');
  const [compliance, setCompliance] = useState(regionalCompliance.OTHER);

  useEffect(() => {
    if (countryCode) {
      const detectedRegion = getUserRegion(countryCode);
      setRegion(detectedRegion);
      setCompliance(regionalCompliance[detectedRegion]);
    } else {
      // Try to detect from browser
      const browserLang = navigator.language;
      const langCountry = browserLang.split('-')[1]?.toUpperCase() || 'US';
      const detectedRegion = getUserRegion(langCountry);
      setRegion(detectedRegion);
      setCompliance(regionalCompliance[detectedRegion]);
    }
  }, [countryCode]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      <div className="flex items-start gap-3">
        <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">
            {t('legal.privacy')}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {region === 'EU' && 'Seus dados são protegidos pelo RGPD (Regulamento Geral sobre a Proteção de Dados)'}
            {region === 'US' && 'Your data is protected under CCPA (California Consumer Privacy Act)'}
            {region === 'BR' && 'Seus dados são protegidos pela LGPD (Lei Geral de Proteção de Dados)'}
            {region === 'UK' && 'Your data is protected under UK-GDPR'}
            {region === 'CA' && 'Your data is protected under PIPEDA'}
            {region === 'AU' && 'Your data is protected under the Privacy Act'}
            {!['EU', 'US', 'BR', 'UK', 'CA', 'AU'].includes(region) && 'Your data is protected under international standards'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a
          href={compliance.privacyPolicyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
        >
          <FileText className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
          <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
            {t('legal.privacy')}
          </span>
        </a>

        <a
          href={compliance.termsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
        >
          <FileText className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
          <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
            {t('legal.terms')}
          </span>
        </a>
      </div>

      <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
        <Globe className="w-4 h-4 text-gray-500 mt-0.5" />
        <div className="flex-1">
          <p className="text-xs text-gray-600">
            <strong>Região:</strong> {region}
            {' | '}
            <strong>Regulamentação:</strong> {compliance.regulation}
          </p>
          {compliance.cookieConsent && (
            <p className="text-xs text-gray-500 mt-1">
              {t('common.cookieConsent', 'This app uses cookies to improve your experience')}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
        <div className="flex-1">
          <p className="text-xs text-blue-800">
            {region === 'EU' && (
              <>
                <strong>Seus direitos RGPD:</strong> Acesso, retificação, eliminação, portabilidade, oposição e limitação do processamento dos seus dados.
              </>
            )}
            {region === 'US' && (
              <>
                <strong>Your CCPA rights:</strong> Know, delete, opt-out, and non-discrimination.
              </>
            )}
            {region === 'BR' && (
              <>
                <strong>Seus direitos LGPD:</strong> Confirmação, acesso, correção, anonimização, portabilidade, eliminação, revogação do consentimento.
              </>
            )}
            {region === 'UK' && (
              <>
                <strong>Your UK-GDPR rights:</strong> Access, rectification, erasure, portability, objection, and restriction of processing.
              </>
            )}
            {!['EU', 'US', 'BR', 'UK'].includes(region) && (
              <>
                <strong>Your data rights:</strong> Contact us to exercise your privacy rights.
              </>
            )}
          </p>
          <a
            href="mailto:privacy@chefiapp.com"
            className="text-xs text-blue-700 hover:text-blue-800 underline mt-1 inline-block"
          >
            privacy@chefiapp.com
          </a>
        </div>
      </div>
    </div>
  );
};
