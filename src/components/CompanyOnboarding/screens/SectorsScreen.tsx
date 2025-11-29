// Tela 4 - Estrutura da Empresa (Setores)

import React from 'react';
import { ArrowRight, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { CompanyOnboardingData } from '../CompanyOnboarding';

interface SectorsScreenProps {
  data: CompanyOnboardingData;
  onUpdate: (updates: Partial<CompanyOnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const AVAILABLE_SECTORS = [
  { id: 'Cozinha Quente', name: 'Cozinha Quente', icon: '🔥' },
  { id: 'Cozinha Fria', name: 'Cozinha Fria', icon: '❄️' },
  { id: 'Bar', name: 'Bar', icon: '🍸' },
  { id: 'Sala / Restaurante', name: 'Sala / Restaurante', icon: '🍽️' },
  { id: 'Limpeza', name: 'Limpeza', icon: '🧹' },
  { id: 'Manutenção', name: 'Manutenção', icon: '🔧' },
  { id: 'Administração', name: 'Administração', icon: '📊' },
  { id: 'Armazém', name: 'Armazém', icon: '📦' },
  { id: 'Café da Manhã', name: 'Café da Manhã', icon: '☕' },
  { id: 'Room Service', name: 'Room Service', icon: '🚪' },
];

const SectorsScreen: React.FC<SectorsScreenProps> = ({ data, onUpdate, onBack, onNext }) => {
  const toggleSector = (sectorId: string) => {
    const currentSectors = data.sectors || [];
    if (currentSectors.includes(sectorId)) {
      onUpdate({ sectors: currentSectors.filter(s => s !== sectorId) });
    } else {
      onUpdate({ sectors: [...currentSectors, sectorId] });
    }
  };

  const canContinue = data.sectors.length > 0;

  return (
    <div className="min-h-screen flex flex-col p-6 text-white">
      <div className="flex-1 max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Estrutura da Empresa</h1>
          <p className="text-blue-100">
            Selecione os setores onde as tarefas acontecerão
          </p>
        </div>

        {/* Aviso se nenhum setor selecionado */}
        {!canContinue && (
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 mb-6 flex items-start gap-2">
            <AlertCircle size={18} className="text-yellow-300 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-200">
              Selecione pelo menos um setor para continuar
            </p>
          </div>
        )}

        {/* Sectors Grid */}
        <div className="grid grid-cols-2 gap-3">
          {AVAILABLE_SECTORS.map((sector) => {
            const isSelected = data.sectors.includes(sector.id);
            return (
              <button
                key={sector.id}
                onClick={() => toggleSector(sector.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? 'bg-white text-blue-600 border-white'
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{sector.icon}</span>
                    <span className="font-semibold">{sector.name}</span>
                  </div>
                  {isSelected && (
                    <div className="bg-blue-600 text-white rounded-full p-1">
                      <Check size={16} />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {data.sectors.length > 0 && (
          <div className="mt-6 bg-white/10 rounded-xl p-4">
            <p className="text-sm text-blue-200">
              {data.sectors.length} setor{data.sectors.length > 1 ? 'es' : ''} selecionado{data.sectors.length > 1 ? 's' : ''}
            </p>
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
          Continuar
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default SectorsScreen;

