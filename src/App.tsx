// ChefIApp™ - Main App Component (MIGRATED)
// Agora usando hooks customizados e componentes novos

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { OnboardingContainer } from './components/Onboarding/OnboardingContainer';
import { UserRole } from './lib/types';
import { useAuth } from './hooks/useAuth';
import AIChat from './components/AIChat';
import { supabase } from './lib/supabase';

// Importar novos dashboards
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import OwnerDashboard from './pages/OwnerDashboard';

const App: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Handle OAuth callback
  useEffect(() => {
    // Check for OAuth callback in URL hash or query params
    const handleOAuthCallback = async () => {
      try {
        // Check both hash and query params (Capacitor may use either)
        const hash = window.location.hash.substring(1);
        const search = window.location.search.substring(1);
        const fullParams = hash || search;
        
        console.log('🔗 [App] OAuth callback detectado:', {
          hash,
          search,
          fullUrl: window.location.href,
          pathname: window.location.pathname
        });
        
        const hashParams = new URLSearchParams(fullParams);
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const errorParam = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');
        
        console.log('🔗 [App] OAuth params:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          error: errorParam,
          errorDescription
        });

        // Handle OAuth errors
        if (errorParam) {
          console.error('🔗 [App] OAuth error:', errorParam, errorDescription);

          // Decode error description
          const decodedError = errorDescription ? decodeURIComponent(errorDescription) : errorParam;

          // Show user-friendly error message for common errors
          if (errorParam === 'access_denied' && errorDescription?.includes('signup_disabled')) {
            alert('⚠️ Cadastros estão desabilitados no Supabase.\n\nPor favor, habilite signups em:\nAuthentication → Settings → User Signups');
          } else if (errorParam === 'server_error' && decodedError.includes('Unable to exchange external code')) {
            // Apple OAuth configuration error
            alert('❌ Erro na configuração do Apple Sign In\n\n' +
                  'O Supabase não conseguiu validar o código da Apple.\n\n' +
                  'Possíveis causas:\n' +
                  '1. Services ID incorreto no Supabase\n' +
                  '2. Private Key (.p8) incorreta\n' +
                  '3. Team ID ou Key ID incorretos\n' +
                  '4. Return URLs não configuradas no Apple Developer\n\n' +
                  'Por favor, verifique as configurações do Apple OAuth no Supabase Dashboard.\n\n' +
                  'Por enquanto, use "Continuar com Google" ou email/password.');
          } else if (decodedError) {
            alert(`❌ Erro de autenticação\n\n${decodedError}\n\nTente novamente ou use outro método de login.`);
          } else {
            alert(`❌ Erro de autenticação: ${errorParam}\n\nTente novamente ou use outro método de login.`);
          }

          // Clear URL hash and reload to reset state
          window.history.replaceState(null, '', window.location.pathname);
          window.location.reload();  // ✅ Reload para voltar à tela de login
          return;
        }

        if (accessToken && refreshToken) {
          console.log('🔗 [App] Processing OAuth callback...');
          console.log('🔗 [App] Access token recebido:', accessToken.substring(0, 20) + '...');
          
          // Set session from URL hash
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('🔗 [App] Error setting session:', error);
            alert(`Erro ao estabelecer sessão: ${error.message}`);
            // Clear URL hash
            window.history.replaceState(null, '', window.location.pathname);
            return;
          }

          if (data?.user) {
            console.log('🔗 [App] OAuth session established successfully!');
            console.log('🔗 [App] User:', data.user.email);
            console.log('🔗 [App] User ID:', data.user.id);
            
            // Clear URL hash to prevent re-processing
            window.history.replaceState(null, '', window.location.pathname);
            
            // Don't reload - let onAuthStateChange handle it
            // The reload was causing issues
            console.log('🔗 [App] Aguardando onAuthStateChange processar...');
          } else {
            console.error('🔗 [App] Sessão estabelecida mas sem user data');
            alert('Erro: Sessão criada mas sem dados do usuário');
            window.history.replaceState(null, '', window.location.pathname);
          }
        } else {
          console.log('🔗 [App] OAuth callback sem tokens completos');
          console.log('🔗 [App] Access token:', !!accessToken);
          console.log('🔗 [App] Refresh token:', !!refreshToken);
        }
      } catch (err) {
        console.error('[App] Error handling OAuth callback:', err);
      }
    };

    handleOAuthCallback();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 safe-area-insets">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white font-medium">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // Not authenticated or no user - show onboarding
  if (!isAuthenticated || !user || showOnboarding) {
    return (
      <OnboardingContainer
        onComplete={(data) => {
          setShowOnboarding(false);
          // User will be automatically set by useAuth hook
        }}
      />
    );
  }

  // Render appropriate dashboard based on user role
  const renderDashboard = () => {
    switch (user.role) {
      case UserRole.OWNER:
        return <OwnerDashboard />;
      case UserRole.MANAGER:
        return <ManagerDashboard />;
      case UserRole.EMPLOYEE:
      default:
        return <EmployeeDashboard />;
    }
  };

  return (
    <>
      {renderDashboard()}
      <AIChat />
    </>
  );
};

export default App;
