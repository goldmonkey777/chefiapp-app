// Tela 2 - Dados da Empresa

import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Upload, Globe, DollarSign, AlertCircle } from 'lucide-react';
import { CompanyOnboardingData } from '../CompanyOnboarding';
import { supabase } from '../../../lib/supabase';
import imageCompression from 'browser-image-compression';

interface CompanyDataScreenProps {
  data: CompanyOnboardingData;
  onUpdate: (updates: Partial<CompanyOnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const COUNTRIES = [
  { code: 'BR', name: 'Brasil', language: 'pt', currency: 'BRL' },
  { code: 'US', name: 'Estados Unidos', language: 'en', currency: 'USD' },
  { code: 'ES', name: 'Espanha', language: 'es', currency: 'EUR' },
  { code: 'PT', name: 'Portugal', language: 'pt', currency: 'EUR' },
  { code: 'CA', name: 'Canadá', language: 'en', currency: 'CAD' },
  { code: 'GB', name: 'Reino Unido', language: 'en', currency: 'GBP' },
  { code: 'FR', name: 'França', language: 'fr', currency: 'EUR' },
  { code: 'IT', name: 'Itália', language: 'it', currency: 'EUR' },
  { code: 'DE', name: 'Alemanha', language: 'de', currency: 'EUR' },
];

const LEGAL_ENGINES: Record<string, string[]> = {
  BR: ['HACCP BR', 'ANVISA'],
  US: ['ServSafe', 'FDA'],
  ES: ['PRL ES', 'AECOSAN'],
  PT: ['HACCP EU', 'ASAE'],
  CA: ['AllerGen', 'CFIA'],
  GB: ['UK Food Safety', 'FSA'],
  FR: ['HACCP EU', 'DGCCRF'],
  IT: ['HACCP EU', 'ICQRF'],
  DE: ['HACCP EU', 'BVL'],
};

const CompanyDataScreen: React.FC<CompanyDataScreenProps> = ({ data, onUpdate, onNext, onBack }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadProgress(0);

    // Validação de tipo de arquivo
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Tipo de arquivo inválido. Use PNG, JPG ou WEBP.');
      return;
    }

    // Validação de tamanho (max 5MB antes da compressão)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setUploadError('Arquivo muito grande. Tamanho máximo: 5MB.');
      return;
    }

    setUploading(true);
    setUploadProgress(20);

    try {
      let processedFile = file;

      // Comprimir imagem se for maior que 2MB
      if (file.size > 2 * 1024 * 1024) {
        if (import.meta.env.DEV) console.log('Compressing image...');
        setUploadProgress(40);

        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 512,
          useWebWorker: true,
        };

        processedFile = await imageCompression(file, options);
        if (import.meta.env.DEV) {
          console.log(`Compressed from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(processedFile.size / 1024 / 1024).toFixed(2)}MB`);
        }
      }

      setUploadProgress(60);

      // Upload para Supabase
      const fileExt = processedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `company-logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('company-assets')
        .upload(filePath, processedFile);

      if (uploadError) throw uploadError;

      setUploadProgress(80);

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('company-assets')
        .getPublicUrl(filePath);

      setUploadProgress(100);
      onUpdate({ logoUrl: publicUrl });

      // Limpar progresso após 1 segundo
      setTimeout(() => setUploadProgress(0), 1000);
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      setUploadError(error.message || 'Erro ao fazer upload. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const handleCountryChange = (countryCode: string) => {
    const country = COUNTRIES.find(c => c.code === countryCode);
    if (country) {
      onUpdate({
        country: countryCode,
        language: country.language,
        currency: country.currency,
      });
    }
  };

  // Validação de campos obrigatórios
  const validationErrors = {
    companyName: !data.companyName || data.companyName.trim().length === 0,
    email: !data.email || !data.email.includes('@') || !data.email.includes('.'),
    country: !data.country || data.country.length === 0,
  };

  const canContinue = !validationErrors.companyName && !validationErrors.email && !validationErrors.country;
  const hasErrors = Object.values(validationErrors).some(err => err);

  return (
    <div className="min-h-screen flex flex-col p-6 text-white">
      <div className="flex-1 max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dados da Empresa</h1>
          <p className="text-blue-100">Informações essenciais para criar sua conta</p>
        </div>

        {/* Erro geral se houver campos faltando */}
        {hasErrors && (
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 mb-6 flex items-start gap-2">
            <AlertCircle size={18} className="text-yellow-300 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-200">
              Por favor, preencha todos os campos obrigatórios marcados com *
            </p>
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              Logo da Empresa
              {data.logoUrl && data.logoUrl.includes('googleusercontent.com') && (
                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">
                  ✓ Foto do Google
                </span>
              )}
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                {data.logoUrl ? (
                  <div className="relative">
                    <img
                      src={data.logoUrl}
                      alt="Logo"
                      className="w-24 h-24 rounded-xl object-cover border-2 border-white/20"
                    />
                    <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-white/10 rounded-xl flex items-center justify-center border-2 border-dashed border-white/30">
                    <Upload size={32} className="text-white/50" />
                  </div>
                )}
                <label className="flex-1 bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl cursor-pointer transition flex items-center justify-center gap-2 border border-white/20">
                  <Upload size={18} />
                  <span>
                    {uploading
                      ? `Enviando... ${uploadProgress}%`
                      : data.logoUrl
                        ? 'Alterar Logo'
                        : 'Upload Logo'}
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleLogoUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>

              {/* Progress Bar */}
              {uploading && uploadProgress > 0 && (
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-green-500 h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}

              {/* Error Message */}
              {uploadError && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 flex items-start gap-2">
                  <AlertCircle size={18} className="text-red-300 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-200">{uploadError}</p>
                </div>
              )}

              {/* Info */}
              <p className="text-xs text-blue-200">
                Formatos aceitos: PNG, JPG, WEBP • Tamanho máximo: 5MB
              </p>
              {data.logoUrl && data.logoUrl.includes('googleusercontent.com') && (
                <p className="text-xs text-blue-300 flex items-center gap-1">
                  <AlertCircle size={12} />
                  Usando sua foto de perfil como logo temporário. Você pode fazer upload da logo real da empresa acima.
                </p>
              )}
            </div>
          </div>

          {/* Nome da Empresa */}
          <div>
            <label className="block text-sm font-medium mb-2">Nome da Empresa *</label>
            <input
              type="text"
              value={data.companyName}
              onChange={(e) => onUpdate({ companyName: e.target.value })}
              placeholder="Ex: Restaurante do Chef"
              className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 ${
                validationErrors.companyName
                  ? 'border-red-500/50 focus:ring-red-500/50'
                  : 'border-white/20 focus:ring-white/50'
              }`}
            />
            {validationErrors.companyName && (
              <p className="text-xs text-red-300 mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                Nome da empresa é obrigatório
              </p>
            )}
          </div>

          {/* CNPJ/EIN */}
          <div>
            <label className="block text-sm font-medium mb-2">CNPJ/EIN (Opcional)</label>
            <input
              type="text"
              value={data.cnpjEin}
              onChange={(e) => onUpdate({ cnpjEin: e.target.value })}
              placeholder="00.000.000/0000-00"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              E-mail do Responsável *
              {data.email && data.email.includes('@') && !validationErrors.email && (
                <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full border border-green-500/30">
                  ✓ Pré-preenchido
                </span>
              )}
            </label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => onUpdate({ email: e.target.value })}
              placeholder="contato@empresa.com"
              className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 ${
                validationErrors.email
                  ? 'border-red-500/50 focus:ring-red-500/50'
                  : 'border-white/20 focus:ring-white/50'
              }`}
            />
            {validationErrors.email && (
              <p className="text-xs text-red-300 mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                E-mail válido é obrigatório
              </p>
            )}
            {data.email && data.email.includes('@privaterelay.appleid.com') && !validationErrors.email && (
              <p className="text-xs text-yellow-300 mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                Este é um email privado da Apple. Você pode alterá-lo se preferir usar o email da empresa.
              </p>
            )}
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-medium mb-2">Telefone</label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => onUpdate({ phone: e.target.value })}
              placeholder="+55 11 99999-9999"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>

          {/* País */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Globe size={16} />
              País *
              {data.country && !validationErrors.country && (
                <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full border border-green-500/30">
                  ✓ Detectado
                </span>
              )}
            </label>
            <select
              value={data.country}
              onChange={(e) => handleCountryChange(e.target.value)}
              className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 ${
                validationErrors.country
                  ? 'border-red-500/50 focus:ring-red-500/50'
                  : 'border-white/20 focus:ring-white/50'
              }`}
            >
              <option value="" className="text-gray-900">Selecione um país</option>
              {COUNTRIES.map(country => (
                <option key={country.code} value={country.code} className="text-gray-900">
                  {country.name}
                </option>
              ))}
            </select>
            {validationErrors.country && (
              <p className="text-xs text-red-300 mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                Selecione um país
              </p>
            )}
            {data.country && LEGAL_ENGINES[data.country] && !validationErrors.country && (
              <div className="mt-2 text-sm text-blue-200">
                Legal Engines ativados: {LEGAL_ENGINES[data.country].join(', ')}
              </div>
            )}
          </div>

          {/* Idioma e Moeda (auto-preenchidos baseado no país) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Idioma</label>
              <input
                type="text"
                value={data.language.toUpperCase()}
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/70"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <DollarSign size={16} />
                Moeda
              </label>
              <input
                type="text"
                value={data.currency}
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/70"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mt-8 max-w-2xl mx-auto w-full">
        <button
          onClick={onBack}
          className="flex-1 bg-white/10 hover:bg-white/20 px-6 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="flex-1 bg-white text-blue-600 font-bold px-6 py-4 rounded-xl hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
        >
          Continuar
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default CompanyDataScreen;
