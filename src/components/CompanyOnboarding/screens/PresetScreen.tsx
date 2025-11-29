// Tela 7 - Seleção de Preset Operacional

import React from 'react';
import { ArrowRight, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { CompanyOnboardingData } from '../CompanyOnboarding';

interface PresetScreenProps {
  data: CompanyOnboardingData;
  onUpdate: (updates: Partial<CompanyOnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const PRESETS = [
  {
    id: 'restaurant',
    name: 'Restaurante Padrão',
    icon: '🍽️',
    description: 'Tarefas, checklists e rotinas para restaurante completo',
  },
  {
    id: 'bar',
    name: 'Bar / Cocktail Bar',
    icon: '🍸',
    description: 'Foco em bar, drinks e atendimento noturno',
  },
  {
    id: 'cafe',
    name: 'Café / Padaria',
    icon: '☕',
    description: 'Operação diurna, café da manhã e lanches',
  },
  {
    id: 'hotel',
    name: 'Hotel (F&B)',
    icon: '🏨',
    description: 'Food & Beverage completo para hotéis',
  },
  {
    id: 'catering',
    name: 'Catering / Eventos',
    icon: '🎉',
    description: 'Eventos, catering e serviços externos',
  },
  {
    id: 'custom',
    name: 'Personalizado',
    icon: '⚙️',
    description: 'Configure tudo manualmente depois',
  },
];

const PresetScreen: React.FC<PresetScreenProps> = ({ data, onUpdate, onBack, onNext }) => {
  const canContinue = !!data.preset;

  return (
    <div className="min-h-screen flex flex-col p-6 text-white">
      <div className="flex-1 max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Preset Operacional</h1>
          <p className="text-blue-100">
            Escolha um preset para economizar centenas de horas de configuração
          </p>
        </div>

        {/* Aviso se nenhum preset selecionado */}
        {!canContinue && (
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 mb-6 flex items-start gap-2">
            <AlertCircle size={18} className="text-yellow-300 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-200">
              Selecione um preset operacional para continuar
            </p>
          </div>
        )}

        {/* Presets Grid */}
        <div className="space-y-3">
          {PRESETS.map((preset) => {
            const isSelected = data.preset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onUpdate({ preset: preset.id })}
                className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? 'bg-white text-blue-600 border-white'
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <span className="text-3xl">{preset.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{preset.name}</h3>
                      <p className={`text-sm ${isSelected ? 'text-blue-600/80' : 'text-blue-200'}`}>
                        {preset.description}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="bg-blue-600 text-white rounded-full p-1.5">
                      <Check size={20} />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Info Box */}
        {data.preset && data.preset !== 'custom' && (
          <div className="mt-6 bg-green-500/20 border border-green-500/50 rounded-xl p-4">
            <p className="text-sm text-green-200">
              ✓ Este preset instalará automaticamente:
            </p>
            <ul className="text-sm text-green-300 mt-2 space-y-1 ml-4">
              <li>• Tarefas pré-configuradas</li>
              <li>• Checklists operacionais</li>
              <li>• Horários e turnos</li>
              <li>• HACCP defaults</li>
              <li>• Rotinas de abertura/fechamento</li>
            </ul>
          </div>
        )}
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
          Instalar Preset
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default PresetScreen;

