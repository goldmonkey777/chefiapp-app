// ChefIApp™ - Main App Component (MIGRATED)
// Agora usando hooks customizados e componentes novos

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { OnboardingContainer } from './components/Onboarding/OnboardingContainer';
import { UserRole } from './lib/types';
import { useAuth } from './hooks/useAuth';
import AIChat from './components/AIChat';
import { supabase } from './lib/supabase';
import { DebugLogger } from './components/DebugLogger';
import RoleSelector from './components/RoleSelector';

// Importar novos dashboards
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import OwnerDashboard from './pages/OwnerDashboard';

// Interface para dados do usuário OAuth pendente de seleção de role
interface OAuthPendingUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

const App: React.FC = () => {
  console.log('🚀🚀🚀 [App] COMPONENT RENDERING - JavaScript is running!');

  const { t } = useTranslation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [oauthPendingUser, setOAuthPendingUser] = useState<OAuthPendingUser | null>(null);

  // ✅ Função para processar deep links do Capacitor
  const handleDeepLink = async (url: string) => {
    try {
      console.log('🔗🔗🔗 [App] ===== PROCESSANDO DEEP LINK =====');
      console.log('🔗 [App] URL recebida:', url);
      alert('🔗 Deep link recebido!\n\nProcessando autenticação...');

      // Parse the URL to extract parameters
      // OAuth pode retornar tokens no hash (#) ou query (?)
      // Exemplo: com-chefiapp-app://auth/callback#access_token=...
      let urlObj: URL;
      try {
        urlObj = new URL(url);
      } catch (e) {
        // Se falhar, tentar adicionar protocolo
        urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      }

      // Tentar pegar do hash primeiro (OAuth padrão)
      const hashParams = urlObj.hash.substring(1); // Remove o #
      const searchParams = urlObj.search.substring(1); // Remove o ?

      // Usar hash se tiver conteúdo, senão usar search
      const paramsString = hashParams || searchParams;
      const params = new URLSearchParams(paramsString);
      
      console.log('🔗 [App] Parâmetros extraídos:', {
        hashLength: hashParams.length,
        searchLength: searchParams.length,
        paramsStringLength: paramsString.length,
        hasAccessToken: params.has('access_token'),
        hasRefreshToken: params.has('refresh_token')
      });

      console.log('🔗 [App] URL parse:', {
        hash: urlObj.hash,
        search: urlObj.search,
        paramsString: paramsString.substring(0, 100) + '...'
      });

      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const errorParam = params.get('error');
      const errorDescription = params.get('error_description');

      console.log('🔗 [App] Deep link params:', {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        error: errorParam,
        errorDescription
      });

      // Handle errors
      if (errorParam) {
        console.error('🔗 [App] OAuth error no deep link:', errorParam, errorDescription);
        const decodedError = errorDescription ? decodeURIComponent(errorDescription) : errorParam;

        if (errorParam === 'server_error' && decodedError.includes('Unable to exchange external code')) {
          alert('❌ Erro na configuração do Apple Sign In\n\n' +
                'O Supabase não conseguiu validar o código da Apple.\n\n' +
                'Possíveis causas:\n' +
                '1. Services ID incorreto no Supabase\n' +
                '2. Private Key (.p8) incorreta\n' +
                '3. Team ID ou Key ID incorretos\n' +
                '4. Return URLs não configuradas no Apple Developer\n\n' +
                'Por favor, verifique as configurações do Apple OAuth.\n\n' +
                'Por enquanto, use "Continuar com Google" ou email/password.');
        } else if (decodedError) {
          alert(`❌ Erro de autenticação\n\n${decodedError}\n\nTente novamente ou use outro método de login.`);
        }
        return;
      }

      // Process tokens
      if (accessToken && refreshToken) {
        console.log('🔗 [App] Tokens recebidos via deep link, estabelecendo sessão...');
        console.log('🔗 [App] Access token:', accessToken.substring(0, 20) + '...');

        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error('🔗 [App] Erro ao estabelecer sessão:', error);
          alert(`Erro ao estabelecer sessão: ${error.message}`);
          return;
        }

        if (data?.user) {
          console.log('✅ [App] Sessão OAuth estabelecida com sucesso!');
          console.log('✅ [App] User email:', data.user.email);
          console.log('✅ [App] User ID:', data.user.id);
          
          const userName = data.user.user_metadata?.name || 
                          data.user.user_metadata?.full_name || 
                          data.user.email?.split('@')[0] || 
                          'Usuário';
          const userAvatar = data.user.user_metadata?.avatar_url || 
                            data.user.user_metadata?.picture;
          
          console.log('✅ [App] User metadata:', {
            name: userName,
            avatar: userAvatar,
            provider: data.user.app_metadata?.provider
          });

          // Verificar se o perfil já existe e tem role definido
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id, role, name')
            .eq('id', data.user.id)
            .maybeSingle();

          if (!existingProfile) {
            // Criar perfil básico primeiro
            console.log('🔧 [App] Criando perfil básico para novo usuário OAuth...');
            const profileData = {
              id: data.user.id,
              name: userName,
              email: data.user.email || '',
              role: UserRole.EMPLOYEE, // Padrão temporário
              xp: 0,
              level: 1,
              streak: 0,
              shift_status: 'offline',
              profile_photo: userAvatar || '',
              auth_method: data.user.app_metadata?.provider || 'google',
            };

            await supabase.from('profiles').upsert(profileData, { onConflict: 'id' });
          }

          // Mostrar seletor de role para novos usuários
          console.log('🎯 [App] Mostrando seletor de função para:', userName);
          setOAuthPendingUser({
            id: data.user.id,
            name: userName,
            email: data.user.email || '',
            avatar: userAvatar,
          });
          setShowRoleSelector(true);
          
        } else {
          console.error('❌ [App] Sessão criada mas sem user data');
          alert('Erro: Sessão criada mas sem dados do usuário');
        }
      } else {
        console.warn('⚠️ [App] Deep link sem tokens completos');
      }
    } catch (err: any) {
      console.error('❌ [App] Erro ao processar deep link:', err);
      alert(`Erro ao processar autenticação: ${err.message}`);
    }
  };

  // Handle OAuth callback via Capacitor deep links
  useEffect(() => {
    console.log('🔗 [App] useEffect: Configurando deep link listener');

    // ✅ CORREÇÃO: Adicionar listener para deep links do Capacitor
    let appUrlListener: any = null;

    const setupCapacitorListener = async () => {
      console.log('🔗 [App] setupCapacitorListener: Iniciando...');
      console.log('🔗 [App] Capacitor disponível?', typeof (window as any).Capacitor !== 'undefined');

      // Check if Capacitor is available
      if (typeof (window as any).Capacitor !== 'undefined') {
        try {
          // Import App plugin dynamically only in mobile context
          const { App: CapApp } = await import('@capacitor/app');

          console.log('🔗 [App] Capacitor detectado, configurando listener de deep links');

          // Check if there's a launch URL (app opened via deep link)
          const launchUrl = await CapApp.getLaunchUrl();
          if (launchUrl?.url) {
            console.log('🔗 [App] App foi aberto via deep link (launch URL):', launchUrl.url);
            handleDeepLink(launchUrl.url);
          } else {
            console.log('🔗 [App] App aberto normalmente (sem launch URL)');
          }

          // Listen for app URL open events (deep links while app is running)
          appUrlListener = await CapApp.addListener('appUrlOpen', (data: any) => {
            console.log('🔗🔗🔗 [App] ===== DEEP LINK RECEBIDO =====');
            console.log('🔗 [App] Deep link capturado pelo Capacitor (appUrlOpen event):', data.url);
            console.log('🔗 [App] Data completo:', JSON.stringify(data));

            // Process the deep link URL
            handleDeepLink(data.url);
          });

          console.log('✅ [App] Listener de deep links configurado');
        } catch (err) {
          console.error('❌ [App] Erro ao configurar listener Capacitor:', err);
          console.warn('⚠️ [App] Erro ao configurar listener Capacitor:', err);
        }
      } else {
        console.log('🌐 [App] Rodando no navegador web, deep links não necessários');
      }
    };

    setupCapacitorListener();

    // Cleanup listener on unmount
    return () => {
      if (appUrlListener) {
        appUrlListener.remove();
      }
    };
  }, []);

  // Separate effect for handling OAuth callback from URL
  useEffect(() => {
    // Check for OAuth callback in URL hash or query params
    const handleOAuthCallback = async () => {
      try {
        // ALERT DE DEBUG VISÍVEL
        const hash = window.location.hash;
        const search = window.location.search;

        if (hash.includes('access_token') || search.includes('access_token')) {
          alert('🔗 OAuth callback detectado na URL!\n\nProcessando tokens...');
        }

        // Check both hash and query params (Capacitor may use either)
        const hashStr = hash.substring(1);
        const searchStr = search.substring(1);
        const fullParams = hashStr || searchStr;

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

          // ALERT VISÍVEL
          alert('✅ Tokens encontrados!\n\nEstabelecendo sessão no Supabase...');

          // Set session from URL hash
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('🔗 [App] Error setting session:', error);
            alert(`❌ Erro ao estabelecer sessão:\n\n${error.message}\n\nVerifique suas configurações do Supabase.`);
            // Clear URL hash
            window.history.replaceState(null, '', window.location.pathname);
            return;
          }

          if (data?.user) {
            console.log('🔗 [App] OAuth session established successfully!');
            console.log('🔗 [App] User:', data.user.email);
            console.log('🔗 [App] User ID:', data.user.id);

            const userName = data.user.user_metadata?.name || 
                            data.user.user_metadata?.full_name || 
                            data.user.email?.split('@')[0] || 
                            'Usuário';
            const userAvatar = data.user.user_metadata?.avatar_url || 
                              data.user.user_metadata?.picture;

            // Clear URL hash to prevent re-processing
            window.history.replaceState(null, '', window.location.pathname);

            // Verificar se o perfil já existe
            const { data: existingProfile } = await supabase
              .from('profiles')
              .select('id, role, name')
              .eq('id', data.user.id)
              .maybeSingle();

            if (!existingProfile) {
              // Criar perfil básico primeiro
              console.log('🔧 [App] Criando perfil básico...');
              const profileData = {
                id: data.user.id,
                name: userName,
                email: data.user.email || '',
                role: UserRole.EMPLOYEE,
                xp: 0,
                level: 1,
                streak: 0,
                shift_status: 'offline',
                profile_photo: userAvatar || '',
                auth_method: data.user.app_metadata?.provider || 'google',
              };

              await supabase.from('profiles').upsert(profileData, { onConflict: 'id' });
            }

            // Mostrar seletor de role para novos usuários
            console.log('🎯 [App] Mostrando seletor de função...');
            setOAuthPendingUser({
              id: data.user.id,
              name: userName,
              email: data.user.email || '',
              avatar: userAvatar,
            });
            setShowRoleSelector(true);
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

  // Callback quando o usuário seleciona um role
  const handleRoleSelected = useCallback(async (role: UserRole) => {
    console.log('✅ [App] Role selecionado:', role);
    setShowRoleSelector(false);
    setOAuthPendingUser(null);
    
    // Forçar reload para carregar o perfil atualizado
    window.location.reload();
  }, []);

  // Debug log to understand state
  useEffect(() => {
    console.log('🎯 [App] State:', {
      isLoading,
      isAuthenticated,
      hasUser: !!user,
      userId: user?.id,
      userRole: user?.role,
      showOnboarding,
      showRoleSelector,
      hasOAuthPendingUser: !!oauthPendingUser
    });
  }, [isLoading, isAuthenticated, user, showOnboarding, showRoleSelector, oauthPendingUser]);

  // Mostrar seletor de role para novos usuários OAuth
  if (showRoleSelector && oauthPendingUser) {
    console.log('🎯 [App] Renderizando RoleSelector para:', oauthPendingUser.name);
    return (
      <RoleSelector
        userId={oauthPendingUser.id}
        userName={oauthPendingUser.name}
        userEmail={oauthPendingUser.email}
        userAvatar={oauthPendingUser.avatar}
        onRoleSelected={handleRoleSelected}
      />
    );
  }

  // Loading state
  if (isLoading) {
    console.log('⏳ [App] Still loading auth state...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 safe-area-insets">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white font-medium">{t('common.loading')}</p>
          <p className="text-white/70 text-sm mt-2">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  // Not authenticated or no user - show onboarding
  if (!isAuthenticated || !user || showOnboarding) {
    console.log('👤 [App] Showing onboarding - isAuth:', isAuthenticated, 'hasUser:', !!user, 'showOnboarding:', showOnboarding);
    return (
      <>
        <OnboardingContainer
          onComplete={(data) => {
            console.log('✅ [App] Onboarding complete, hiding onboarding screen');
            setShowOnboarding(false);
            // User will be automatically set by useAuth hook
          }}
        />
        <DebugLogger />
      </>
    );
  }

  console.log('📊 [App] Rendering dashboard for user:', user.email, 'role:', user.role);

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
      <DebugLogger />
    </>
  );
};

export default App;
