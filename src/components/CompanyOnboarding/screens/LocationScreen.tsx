// Tela 3 - Localização com GPS

import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, MapPin, Navigation, AlertCircle } from 'lucide-react';
import { CompanyOnboardingData } from '../CompanyOnboarding';

interface LocationScreenProps {
  data: CompanyOnboardingData;
  onUpdate: (updates: Partial<CompanyOnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const LocationScreen: React.FC<LocationScreenProps> = ({ data, onUpdate, onNext, onBack }) => {
  const [gettingLocation, setGettingLocation] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não suportada pelo navegador');
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onUpdate({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Erro ao obter localização. Por favor, preencha manualmente.');
        setGettingLocation(false);
      }
    );
  };

  // Validação de campos obrigatórios
  const validationErrors = {
    address: !data.address || data.address.trim().length === 0,
    number: !data.number || data.number.trim().length === 0,
    city: !data.city || data.city.trim().length === 0,
    postalCode: !data.postalCode || data.postalCode.trim().length === 0,
  };

  const canContinue = !validationErrors.address && !validationErrors.number && 
                      !validationErrors.city && !validationErrors.postalCode;
  const hasErrors = Object.values(validationErrors).some(err => err);

  return (
    <div className="min-h-screen flex flex-col p-6 text-white">
      <div className="flex-1 max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <MapPin size={32} />
            Localização da Empresa
          </h1>
          <p className="text-blue-100">
            Registre o ponto oficial para check-in e compliance
          </p>
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

        {/* GPS Button */}
        <button
          onClick={getCurrentLocation}
          disabled={gettingLocation}
          className="w-full bg-white/10 hover:bg-white/20 border-2 border-white/20 rounded-xl px-6 py-4 mb-6 transition flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <Navigation size={20} className={gettingLocation ? 'animate-spin' : ''} />
          <span className="font-semibold">
            {gettingLocation ? 'Obtendo localização...' : 'Usar minha localização atual'}
          </span>
        </button>

        {data.latitude && data.longitude && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-green-200">
              ✓ Localização obtida: {data.latitude.toFixed(6)}, {data.longitude.toFixed(6)}
            </p>
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Endereço *</label>
            <input
              type="text"
              value={data.address}
              onChange={(e) => onUpdate({ address: e.target.value })}
              placeholder="Rua, Avenida, etc."
              className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 ${
                validationErrors.address
                  ? 'border-red-500/50 focus:ring-red-500/50'
                  : 'border-white/20 focus:ring-white/50'
              }`}
            />
            {validationErrors.address && (
              <p className="text-xs text-red-300 mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                Endereço é obrigatório
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium mb-2">Número *</label>
              <input
                type="text"
                value={data.number}
                onChange={(e) => onUpdate({ number: e.target.value })}
                placeholder="123"
                className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 ${
                  validationErrors.number
                    ? 'border-red-500/50 focus:ring-red-500/50'
                    : 'border-white/20 focus:ring-white/50'
                }`}
              />
              {validationErrors.number && (
                <p className="text-xs text-red-300 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  Número é obrigatório
                </p>
              )}
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Complemento</label>
              <input
                type="text"
                value={data.complement}
                onChange={(e) => onUpdate({ complement: e.target.value })}
                placeholder="Apto, Sala, etc."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cidade *</label>
            <input
              type="text"
              value={data.city}
              onChange={(e) => onUpdate({ city: e.target.value })}
              placeholder="São Paulo"
              className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 ${
                validationErrors.city
                  ? 'border-red-500/50 focus:ring-red-500/50'
                  : 'border-white/20 focus:ring-white/50'
              }`}
            />
            {validationErrors.city && (
              <p className="text-xs text-red-300 mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                Cidade é obrigatória
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Código Postal *</label>
            <input
              type="text"
              value={data.postalCode}
              onChange={(e) => onUpdate({ postalCode: e.target.value })}
              placeholder="00000-000"
              className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 ${
                validationErrors.postalCode
                  ? 'border-red-500/50 focus:ring-red-500/50'
                  : 'border-white/20 focus:ring-white/50'
              }`}
            />
            {validationErrors.postalCode && (
              <p className="text-xs text-red-300 mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                Código postal é obrigatório
              </p>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4 mt-6">
            <p className="text-sm text-blue-100">
              📍 Estes dados serão usados para:
            </p>
            <ul className="text-sm text-blue-200 mt-2 space-y-1 ml-4">
              <li>• Check-in via geofence</li>
              <li>• Auditoria legal</li>
              <li>• HACCP compliance com geolocalização</li>
            </ul>
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

export default LocationScreen;

