// ChefIApp™ - Onboarding Container (Refactored)
// Manages onboarding flow state

import React, { useState } from 'react';
import { OnboardingAuth } from './OnboardingAuth';
import { OnboardingJoin } from './OnboardingJoin';
import CompanyOnboarding from '../CompanyOnboarding/CompanyOnboarding';

// Simplified state machine
type OnboardingStep = 'auth' | 'choose-path' | 'join-company' | 'create-company' | 'complete';

interface OnboardingContainerProps {
  onComplete: (data: any) => void;
}

export const OnboardingContainer: React.FC<OnboardingContainerProps> = ({ onComplete }) => {
  const [step, setStep] = useState<OnboardingStep>('auth');
  const [userData, setUserData] = useState<any>(null);

  const handleAuthComplete = (user: any) => {
    console.log('🎯 [OnboardingContainer] Auth complete, user:', {
      id: user.id,
      email: user.email,
      company_id: user.company_id
    });

    setUserData(user);

    // ✅ CORREÇÃO 3: Verificar company_id (snake_case) ao invés de companyId
    if (user.company_id) {
      console.log('✅ [OnboardingContainer] User já tem empresa, indo para dashboard');
      onComplete(user);
      return;
    }

    // Otherwise, choose path
    console.log('🔄 [OnboardingContainer] User sem empresa, escolher caminho');
    setStep('choose-path');
  };

  const handleChoosePath = (path: 'join' | 'create') => {
    setStep(path === 'join' ? 'join-company' : 'create-company');
  };

  const handleJoinComplete = (profile: any) => {
    onComplete(profile);
  };

  const handleCreateComplete = (companyId: string) => {
    onComplete({ ...userData, companyId });
  };

  // Render current step
  switch (step) {
    case 'auth':
      return <OnboardingAuth onComplete={handleAuthComplete} />;

    case 'choose-path':
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            {/* ✅ MELHORIA: Mostrar nome do usuário */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto flex items-center justify-center mb-4">
                <span className="text-3xl">👋</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Bem-vindo{userData?.name ? `, ${userData.name.split(' ')[0]}` : ''}!
              </h1>
              <p className="text-gray-600">
                Como você gostaria de começar?
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleChoosePath('create')}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex flex-col items-center justify-center gap-2"
              >
                <span className="text-4xl">🏢</span>
                <span className="text-lg">Criar Minha Empresa</span>
                <span className="text-sm text-blue-100">Sou dono ou gerente</span>
              </button>

              <button
                onClick={() => handleChoosePath('join')}
                className="w-full bg-white hover:bg-gray-50 text-blue-600 font-semibold py-6 rounded-xl border-2 border-blue-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex flex-col items-center justify-center gap-2"
              >
                <span className="text-4xl">👥</span>
                <span className="text-lg">Entrar em uma Empresa</span>
                <span className="text-sm text-blue-600/70">Sou funcionário</span>
              </button>
            </div>
          </div>
        </div>
      );

    case 'join-company':
      return (
        <OnboardingJoin
          user={userData}
          onComplete={handleJoinComplete}
          onBack={() => setStep('choose-path')}
        />
      );

    case 'create-company':
      return (
        <CompanyOnboarding
          initialData={userData}
          onComplete={handleCreateComplete}
          onCancel={() => setStep('choose-path')}
        />
      );

    default:
      return null;
  }
};

export default OnboardingContainer;
