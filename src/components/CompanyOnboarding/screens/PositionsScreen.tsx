// Tela 5 - Cargos (Positions)

import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Plus, X, AlertCircle } from 'lucide-react';
import { CompanyOnboardingData } from '../CompanyOnboarding';

interface PositionsScreenProps {
  data: CompanyOnboardingData;
  onUpdate: (updates: Partial<CompanyOnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const SUGGESTED_POSITIONS = [
  'Cozinheiro',
  'Chef de Partie',
  'Sous Chef',
  'Bartender',
  'Barback',
  'Garçom',
  'Gerente de Sala',
  'Gerente Geral',
  'Faxineiro',
  'Mantenedor',
  'Host/Hostess',
  'Runner',
  'Dishwasher',
];

const PositionsScreen: React.FC<PositionsScreenProps> = ({ data, onUpdate, onBack, onNext }) => {
  const [newPosition, setNewPosition] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);

  const positions = data.positions || [];

  const addPosition = (position: string) => {
    if (position.trim() && !positions.includes(position.trim())) {
      onUpdate({ positions: [...positions, position.trim()] });
      setNewPosition('');
      setShowAddInput(false);
    }
  };

  const removePosition = (position: string) => {
    onUpdate({ positions: positions.filter(p => p !== position) });
  };

  const addSuggestedPosition = (position: string) => {
    if (!positions.includes(position)) {
      onUpdate({ positions: [...positions, position] });
    }
  };

  const canContinue = positions.length > 0;

  return (
    <div className="min-h-screen flex flex-col p-6 text-white">
      <div className="flex-1 max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Cargos da Empresa</h1>
          <p className="text-blue-100">
            Crie a hierarquia funcional da sua empresa
          </p>
        </div>

        {/* Aviso se nenhum cargo selecionado */}
        {!canContinue && (
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 mb-6 flex items-start gap-2">
            <AlertCircle size={18} className="text-yellow-300 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-200">
              Adicione pelo menos um cargo para continuar
            </p>
          </div>
        )}

        {/* Suggested Positions */}
        <div className="mb-6">
          <p className="text-sm font-medium mb-3 text-blue-200">Sugestões:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_POSITIONS.map((position) => {
              const isAdded = positions.includes(position);
              return (
                <button
                  key={position}
                  onClick={() => !isAdded && addSuggestedPosition(position)}
                  disabled={isAdded}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isAdded
                      ? 'bg-white/5 text-white/50 cursor-not-allowed'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {position}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Positions */}
        <div className="mb-6">
          <p className="text-sm font-medium mb-3 text-blue-200">
            Cargos Selecionados ({positions.length}):
          </p>
          <div className="space-y-2">
            {positions.map((position) => (
              <div
                key={position}
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 flex items-center justify-between"
              >
                <span className="font-medium">{position}</span>
                <button
                  onClick={() => removePosition(position)}
                  className="text-red-300 hover:text-red-200 transition"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add Custom Position */}
        {showAddInput ? (
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newPosition}
              onChange={(e) => setNewPosition(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPosition(newPosition)}
              placeholder="Nome do cargo"
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              autoFocus
            />
            <button
              onClick={() => addPosition(newPosition)}
              className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition"
            >
              Adicionar
            </button>
            <button
              onClick={() => {
                setShowAddInput(false);
                setNewPosition('');
              }}
              className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-semibold transition"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAddInput(true)}
            className="w-full bg-white/10 hover:bg-white/20 border-2 border-dashed border-white/30 rounded-xl px-6 py-4 transition flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            <span className="font-semibold">Adicionar Cargo Personalizado</span>
          </button>
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

export default PositionsScreen;

