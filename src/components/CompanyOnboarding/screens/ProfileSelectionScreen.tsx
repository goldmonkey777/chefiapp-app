// Tela 1 - Seleção de Perfil: Quem é você?
// Renomeado de WelcomeScreen para ProfileSelectionScreen para evitar confusão

import React from 'react';
import { Building2, Users, LogIn, ArrowRight, AlertCircle } from 'lucide-react';
import { CompanyOnboardingData } from '../CompanyOnboarding';

interface ProfileSelectionScreenProps {
  data: CompanyOnboardingData;
  onUpdate: (updates: Partial<CompanyOnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
  onEmployeeSelected?: () => void; // Callback quando funcionário é selecionado
}

const ProfileSelectionScreen: React.FC<ProfileSelectionScreenProps> = ({ 
  data, 
  onUpdate, 
  onNext, 
  onBack,
  onEmployeeSelected 
}) => {
  const handleSelectType = (type: 'owner' | 'manager' | 'employee') => {
    try {
      onUpdate({ userType: type });
      
      if (type === 'owner' || type === 'manager') {
        // Avança automaticamente para próxima tela se for dono/gerente
        // Usar requestAnimationFrame para garantir que o estado foi atualizado
        requestAnimationFrame(() => {
          try {
            onNext();
          } catch (err) {
            console.error('Error advancing to next step:', err);
          }
        });
      } else {
        // Funcionário: voltar para tela de join (QR Code/Código)
        // O onEmployeeSelected permite que o componente pai (CompanyOnboarding) 
        // comunique com o Onboarding.tsx para mostrar a tela de join
        if (onEmployeeSelected) {
          onEmployeeSelected();
        } else {
          // Fallback: apenas voltar
          onBack();
        }
      }
    } catch (err) {
      console.error('Error selecting user type:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-white">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl">
          <img 
            src="/logo.png" 
            alt="ChefIApp" 
            className="w-full h-full object-contain p-4"
            onError={(e) => {
              // Fallback se logo não existir
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          {/* Fallback se logo não carregar */}
          <div className="w-full h-full flex items-center justify-center text-blue-600 font-bold text-2xl">
            CA
          </div>
        </div>
      </div>

      {/* Título */}
      <h1 className="text-3xl font-bold text-center mb-4 px-4">
        A Ordem Dentro do Caos da Hotelaria Global
      </h1>
      <p className="text-blue-100 text-center mb-12 px-4">
        Escolha seu perfil para começar
      </p>

      {/* Botões de Seleção */}
      <div className="w-full max-w-md space-y-4">
        <button
          onClick={() => handleSelectType('owner')}
          className="w-full bg-white text-blue-600 font-bold py-4 px-6 rounded-2xl shadow-xl hover:bg-blue-50 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <Building2 size={24} className="text-blue-600" />
            <span className="text-lg">Sou Dono / Gerente</span>
          </div>
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => handleSelectType('employee')}
          className="w-full bg-white/10 backdrop-blur-md text-white font-semibold py-4 px-6 rounded-2xl border-2 border-white/20 hover:bg-white/20 transition-all flex items-center justify-between group relative"
        >
          <div className="flex items-center gap-4">
            <Users size={24} />
            <span className="text-lg">Sou Funcionário</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-blue-500/30 px-2 py-1 rounded-full border border-blue-400/50">
              Join via QR/Código
            </span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
        
        {/* Info sobre funcionário */}
        <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-3 text-sm text-blue-100 flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          <p>
            Funcionários devem entrar na empresa usando QR Code ou código de convite fornecido pelo gerente.
          </p>
        </div>

        <button
          onClick={onBack}
          className="w-full text-white/80 font-medium py-3 px-6 rounded-xl hover:text-white transition-all flex items-center justify-center gap-2"
        >
          <LogIn size={18} />
          <span>Já tenho conta → Login</span>
        </button>
      </div>

      {/* Indicador de Progresso */}
      <div className="mt-12 flex gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
          <div
            key={step}
            className={`h-2 rounded-full transition-all ${
              step === 1 ? 'w-8 bg-white' : 'w-2 bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfileSelectionScreen;

