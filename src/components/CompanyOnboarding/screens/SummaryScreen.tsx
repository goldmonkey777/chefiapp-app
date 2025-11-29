// Tela 8 - Resumo & Criar Empresa

import React from 'react';
import { ArrowLeft, CheckCircle2, Building2, MapPin, Users, Briefcase, Clock, Settings, AlertCircle } from 'lucide-react';
import { CompanyOnboardingData } from '../CompanyOnboarding';

interface SummaryScreenProps {
  data: CompanyOnboardingData;
  onBack: () => void;
  onCreate: () => Promise<void>;
  loading: boolean;
  isAuthenticated?: boolean;
  onRequestLogin?: () => void; // Callback para pedir login
}

const COUNTRIES: Record<string, string> = {
  BR: 'Brasil',
  US: 'Estados Unidos',
  ES: 'Espanha',
  PT: 'Portugal',
  CA: 'Canadá',
  GB: 'Reino Unido',
  FR: 'França',
  IT: 'Itália',
  DE: 'Alemanha',
};

const PRESETS: Record<string, string> = {
  restaurant: 'Restaurante Padrão',
  bar: 'Bar / Cocktail Bar',
  cafe: 'Café / Padaria',
  hotel: 'Hotel (F&B)',
  catering: 'Catering / Eventos',
  custom: 'Personalizado',
};

const SummaryScreen: React.FC<SummaryScreenProps> = ({ data, onBack, onCreate, loading, isAuthenticated = false, onRequestLogin }) => {
  // Validação completa dos dados antes de criar empresa
  const validateData = (): string[] => {
    const errors: string[] = [];
    
    if (!data.companyName || data.companyName.trim().length === 0) errors.push('Nome da empresa');
    if (!data.email || !data.email.includes('@')) errors.push('E-mail válido');
    if (!data.country) errors.push('País');
    if (!data.address || !data.number || !data.city || !data.postalCode) errors.push('Endereço completo');
    if (!data.sectors || data.sectors.length === 0) errors.push('Pelo menos um setor');
    if (!data.positions || data.positions.length === 0) errors.push('Pelo menos um cargo');
    if (!data.employeeCount) errors.push('Quantidade de funcionários');
    if (!data.shifts || data.shifts.length === 0) errors.push('Pelo menos um turno');
    if (!data.openingTime || !data.closingTime) errors.push('Horário de funcionamento');
    if (!data.preset) errors.push('Preset operacional');
    
    return errors;
  };

  const validationErrors = validateData();
  const canCreate = validationErrors.length === 0 && isAuthenticated;

  return (
    <div className="min-h-screen flex flex-col p-6 text-white">
      <div className="flex-1 max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Resumo da Empresa</h1>
          <p className="text-blue-100">Revise os dados antes de criar</p>
          
          {/* Avisos */}
          {!isAuthenticated && (
            <div className="mt-4 bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 text-yellow-100">
              <div className="flex items-start gap-2 mb-3">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold mb-1">Você precisa estar logado para criar a empresa.</p>
                  <p className="text-xs text-yellow-200">Não se preocupe, seus dados estão salvos. Faça login e continue de onde parou.</p>
                </div>
              </div>
              {onRequestLogin && (
                <button
                  onClick={onRequestLogin}
                  className="w-full mt-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition text-sm"
                >
                  Fazer Login / Criar Conta
                </button>
              )}
            </div>
          )}
          
          {validationErrors.length > 0 && (
            <div className="mt-4 bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-100 text-sm">
              <div className="flex items-start gap-2 mb-2">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <p className="font-semibold">Dados incompletos:</p>
              </div>
              <ul className="list-disc list-inside ml-6 space-y-1">
                {validationErrors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
              <p className="mt-2 text-xs">Por favor, volte e complete os campos faltando.</p>
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="space-y-4">
          {/* Company Info */}
          <div className="bg-white/10 rounded-xl p-5 border border-white/20">
            <div className="flex items-start gap-4">
              {data.logoUrl && (
                <img src={data.logoUrl} alt="Logo" className="w-16 h-16 rounded-xl object-cover" />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 size={20} />
                  <h3 className="font-bold text-lg">{data.companyName}</h3>
                </div>
                <p className="text-blue-200 text-sm">{data.email}</p>
                {data.phone && <p className="text-blue-200 text-sm">{data.phone}</p>}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white/10 rounded-xl p-5 border border-white/20">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="mt-1" />
              <div className="flex-1">
                <h3 className="font-bold mb-2">Localização</h3>
                <p className="text-blue-200 text-sm">
                  {data.address}, {data.number}
                  {data.complement && `, ${data.complement}`}
                </p>
                <p className="text-blue-200 text-sm">
                  {data.city} - {data.postalCode}
                </p>
                {data.latitude && data.longitude && (
                  <p className="text-blue-300 text-xs mt-1">
                    GPS: {data.latitude.toFixed(6)}, {data.longitude.toFixed(6)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Country & Settings */}
          <div className="bg-white/10 rounded-xl p-5 border border-white/20">
            <h3 className="font-bold mb-3">Configurações</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-blue-200">País</p>
                <p className="font-semibold">{COUNTRIES[data.country] || data.country}</p>
              </div>
              <div>
                <p className="text-blue-200">Idioma</p>
                <p className="font-semibold">{data.language.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-blue-200">Moeda</p>
                <p className="font-semibold">{data.currency}</p>
              </div>
            </div>
          </div>

          {/* Sectors */}
          <div className="bg-white/10 rounded-xl p-5 border border-white/20">
            <div className="flex items-start gap-3">
              <Settings size={20} className="mt-1" />
              <div className="flex-1">
                <h3 className="font-bold mb-2">Setores ({data.sectors.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {data.sectors.map((sector) => (
                    <span key={sector} className="bg-white/20 px-3 py-1 rounded-lg text-sm">
                      {sector}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Positions */}
          <div className="bg-white/10 rounded-xl p-5 border border-white/20">
            <div className="flex items-start gap-3">
              <Briefcase size={20} className="mt-1" />
              <div className="flex-1">
                <h3 className="font-bold mb-2">Cargos ({data.positions.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {data.positions.map((position) => (
                    <span key={position} className="bg-white/20 px-3 py-1 rounded-lg text-sm">
                      {position}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Organization */}
          <div className="bg-white/10 rounded-xl p-5 border border-white/20">
            <div className="flex items-start gap-3">
              <Users size={20} className="mt-1" />
              <div className="flex-1">
                <h3 className="font-bold mb-2">Organização</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-blue-200">
                    Funcionários: <span className="font-semibold text-white">{data.employeeCount}</span>
                  </p>
                  <p className="text-blue-200">
                    Turnos: <span className="font-semibold text-white">{data.shifts.join(', ')}</span>
                  </p>
                  <p className="text-blue-200">
                    Horário: <span className="font-semibold text-white">
                      {data.openingTime} - {data.closingTime}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Preset */}
          <div className="bg-white/10 rounded-xl p-5 border border-white/20">
            <div className="flex items-start gap-3">
              <Clock size={20} className="mt-1" />
              <div className="flex-1">
                <h3 className="font-bold mb-2">Preset Operacional</h3>
                <p className="text-blue-200 text-sm">{PRESETS[data.preset] || data.preset}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mt-8 max-w-2xl mx-auto w-full">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex-1 bg-white/10 hover:bg-white/20 px-6 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>
        <button
          onClick={onCreate}
          disabled={loading || !canCreate}
          className="flex-1 bg-green-500 text-white font-bold px-6 py-4 rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Criando...
            </>
          ) : !isAuthenticated ? (
            <>
              <AlertCircle size={20} />
              <span>Faça login para criar</span>
            </>
          ) : validationErrors.length > 0 ? (
            <>
              <AlertCircle size={20} />
              <span>Complete os dados faltando</span>
            </>
          ) : (
            <>
              <CheckCircle2 size={20} />
              Criar Empresa
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SummaryScreen;

