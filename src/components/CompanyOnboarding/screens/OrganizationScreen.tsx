// Tela 6 - Tamanho e Organização

import React from 'react';
import { ArrowRight, ArrowLeft, Users, Clock, AlertCircle } from 'lucide-react';
import { CompanyOnboardingData } from '../CompanyOnboarding';

interface OrganizationScreenProps {
  data: CompanyOnboardingData;
  onUpdate: (updates: Partial<CompanyOnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const EMPLOYEE_COUNTS = ['1-5', '6-10', '11-20', '20-50', '50+'];
const SHIFTS = ['Manhã', 'Tarde', 'Noite', 'Madrugada'];
const HOURS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return `${hour}:00`;
});

const OrganizationScreen: React.FC<OrganizationScreenProps> = ({ data, onUpdate, onBack, onNext }) => {
  const toggleShift = (shift: string) => {
    const currentShifts = data.shifts || [];
    if (currentShifts.includes(shift)) {
      onUpdate({ shifts: currentShifts.filter(s => s !== shift) });
    } else {
      onUpdate({ shifts: [...currentShifts, shift] });
    }
  };

  // Validação de campos obrigatórios
  const validationErrors = {
    employeeCount: !data.employeeCount,
    shifts: !data.shifts || data.shifts.length === 0,
    openingTime: !data.openingTime,
    closingTime: !data.closingTime,
  };

  const canContinue = !validationErrors.employeeCount && !validationErrors.shifts && 
                      !validationErrors.openingTime && !validationErrors.closingTime;
  const hasErrors = Object.values(validationErrors).some(err => err);

  return (
    <div className="min-h-screen flex flex-col p-6 text-white">
      <div className="flex-1 max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Users size={32} />
            Tamanho e Organização
          </h1>
          <p className="text-blue-100">
            Configure a escala e horários da sua empresa
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

        {/* Employee Count */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">Quantos funcionários têm? *</label>
          <div className="grid grid-cols-5 gap-2">
            {EMPLOYEE_COUNTS.map((count) => (
              <button
                key={count}
                onClick={() => onUpdate({ employeeCount: count })}
                className={`py-3 rounded-xl font-semibold transition ${
                  data.employeeCount === count
                    ? 'bg-white text-blue-600'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Shifts */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3 flex items-center gap-2">
            <Clock size={16} />
            Turnos de Trabalho * (selecione todos que aplicam)
            {validationErrors.shifts && (
              <span className="text-xs text-red-300">(obrigatório)</span>
            )}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {SHIFTS.map((shift) => {
              const isSelected = data.shifts.includes(shift);
              return (
                <button
                  key={shift}
                  onClick={() => toggleShift(shift)}
                  className={`py-3 rounded-xl font-semibold transition border-2 ${
                    isSelected
                      ? 'bg-white text-blue-600 border-white'
                      : 'bg-white/10 border-white/20 hover:bg-white/20'
                  }`}
                >
                  {shift}
                </button>
              );
            })}
          </div>
        </div>

        {/* Operating Hours */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Abre às *</label>
            <select
              value={data.openingTime}
              onChange={(e) => onUpdate({ openingTime: e.target.value })}
              className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 ${
                validationErrors.openingTime
                  ? 'border-red-500/50 focus:ring-red-500/50'
                  : 'border-white/20 focus:ring-white/50'
              }`}
            >
              <option value="" className="text-gray-900">Selecione</option>
              {HOURS.map((hour) => (
                <option key={hour} value={hour} className="text-gray-900">
                  {hour}
                </option>
              ))}
            </select>
            {validationErrors.openingTime && (
              <p className="text-xs text-red-300 mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                Horário de abertura é obrigatório
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Fecha às *</label>
            <select
              value={data.closingTime}
              onChange={(e) => onUpdate({ closingTime: e.target.value })}
              className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 ${
                validationErrors.closingTime
                  ? 'border-red-500/50 focus:ring-red-500/50'
                  : 'border-white/20 focus:ring-white/50'
              }`}
            >
              <option value="" className="text-gray-900">Selecione</option>
              {HOURS.map((hour) => (
                <option key={hour} value={hour} className="text-gray-900">
                  {hour}
                </option>
              ))}
            </select>
            {validationErrors.closingTime && (
              <p className="text-xs text-red-300 mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                Horário de fechamento é obrigatório
              </p>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4">
          <p className="text-sm text-blue-100">
            💡 Essas informações ajustam:
          </p>
          <ul className="text-sm text-blue-200 mt-2 space-y-1 ml-4">
            <li>• Presets de tarefas</li>
            <li>• Agenda automática</li>
            <li>• Regras de check-in</li>
            <li>• Alertas MCP</li>
          </ul>
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

export default OrganizationScreen;

