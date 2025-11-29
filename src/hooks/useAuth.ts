// ChefIApp™ - useAuth Hook
// Handles authentication (Google, Apple, Magic Link, QR Code)

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAppStore } from '../stores/useAppStore';
import { User, UserRole, Sector, AuthMethod } from '../lib/types';

export interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<void>;
  signInWithQR: (qrCode: string) => Promise<void>;
  signOut: () => Promise<void>;
  createProfile: (data: {
    name: string;
    role: UserRole;
    sector?: Sector;
    companyId?: string;
  }) => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    currentUser,
    isAuthenticated,
    setCurrentUser,
    setAuthenticated,
    addUser,
  } = useAppStore();

  // Fetch user profile from Supabase
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      console.log('🔗 [fetchProfile] Buscando perfil para userId:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('🔗 [fetchProfile] Erro ao buscar perfil:', error);
        
        // Se o perfil não existe, tentar criar novamente
        if (error.code === 'PGRST116') {
          console.log('🔗 [fetchProfile] Perfil não encontrado, tentando criar...');
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await ensureProfileExists(user);
            // Tentar buscar novamente
            const { data: retryData, error: retryError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .single();
            
            if (retryError) {
              console.error('🔗 [fetchProfile] Erro ao buscar após criar:', retryError);
              setError('Erro ao carregar perfil');
              setCurrentUser(null);
              setAuthenticated(false);
              setIsLoading(false);
              return;
            }
            
            if (retryData) {
              const user: User = {
                id: retryData.id,
                name: retryData.name,
                email: retryData.email || '',
                role: retryData.role as UserRole,
                companyId: retryData.company_id || '',
                sector: retryData.sector as Sector,
                xp: retryData.xp || 0,
                level: retryData.level || 1,
                streak: retryData.streak || 0,
                shiftStatus: retryData.shift_status || 'offline',
                lastCheckIn: retryData.last_check_in ? new Date(retryData.last_check_in) : null,
                lastCheckOut: retryData.last_check_out ? new Date(retryData.last_check_out) : null,
                profilePhoto: retryData.profile_photo || '',
                createdAt: new Date(retryData.created_at),
                authMethod: retryData.auth_method as AuthMethod,
              };

              console.log('🔗 [fetchProfile] Perfil criado e carregado:', user.name);
              setCurrentUser(user);
              addUser(user);
              setAuthenticated(true);
              setIsLoading(false);
              return;
            }
          }
        }
        
        setError('Erro ao carregar perfil');
        setCurrentUser(null);
        setAuthenticated(false);
        setIsLoading(false);
        return;
      }

      if (data) {
        console.log('🔗 [fetchProfile] Perfil encontrado:', {
          id: data.id,
          name: data.name,
          email: data.email
        });
        
        const user: User = {
          id: data.id,
          name: data.name,
          email: data.email || '',
          role: data.role as UserRole,
          companyId: data.company_id || '',
          sector: data.sector as Sector,
          xp: data.xp || 0,
          level: data.level || 1,
          streak: data.streak || 0,
          shiftStatus: data.shift_status || 'offline',
          lastCheckIn: data.last_check_in ? new Date(data.last_check_in) : null,
          lastCheckOut: data.last_check_out ? new Date(data.last_check_out) : null,
          profilePhoto: data.profile_photo || '',
          createdAt: new Date(data.created_at),
          authMethod: data.auth_method as AuthMethod,
        };

        setCurrentUser(user);
        addUser(user);
        setAuthenticated(true);
        setIsLoading(false);
        console.log('🔗 [fetchProfile] Perfil carregado com sucesso!');
      } else {
        console.log('🔗 [fetchProfile] Nenhum perfil encontrado');
        setCurrentUser(null);
        setAuthenticated(false);
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('🔗 [fetchProfile] Erro:', err);
      setError(err.message || 'Erro ao carregar perfil');
      setCurrentUser(null);
      setAuthenticated(false);
      setIsLoading(false);
    }
  }, [setCurrentUser, addUser, setAuthenticated, ensureProfileExists]);

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;
    
    // Safety timeout - if loading takes more than 3 seconds, show onboarding
    timeoutId = setTimeout(() => {
      if (isMounted) {
        console.warn('Auth initialization timeout - forcing onboarding');
        setCurrentUser(null);
        setAuthenticated(false);
        setIsLoading(false);
      }
    }, 3000);
    
    const initializeAuth = async () => {
      try {
        // Check active session from Supabase first (most reliable)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          if (isMounted) {
            clearTimeout(timeoutId);
            setCurrentUser(null);
            setAuthenticated(false);
            setIsLoading(false);
          }
          return;
        }

        if (session?.user) {
          // We have a session, fetch profile
          await fetchProfile(session.user.id);
          if (isMounted) clearTimeout(timeoutId);
        } else {
          // No session - show onboarding
          if (isMounted) {
            clearTimeout(timeoutId);
            setCurrentUser(null);
            setAuthenticated(false);
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        if (isMounted) {
          clearTimeout(timeoutId);
          setCurrentUser(null);
          setAuthenticated(false);
          setIsLoading(false);
        }
      }
    };

    // Start initialization immediately
    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      
      console.log('🔗 [useAuth] Auth state change:', {
        event,
        hasSession: !!session,
        userId: session?.user?.id,
        email: session?.user?.email
      });
      
      try {
        clearTimeout(timeoutId);
        
        if (session?.user) {
          console.log('🔗 [useAuth] Session encontrada, buscando perfil...');
          console.log('🔗 [useAuth] User metadata:', {
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.user_metadata?.full_name,
            avatar: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
            provider: session.user.app_metadata?.provider
          });
          
          try {
            // Garantir que o perfil existe (pode ter sido criado pelo trigger, mas vamos garantir)
            console.log('🔗 [useAuth] Garantindo que perfil existe...');
            await ensureProfileExists(session.user);
            
            console.log('🔗 [useAuth] Buscando perfil...');
            await fetchProfile(session.user.id);
            
            console.log('🔗 [useAuth] Perfil carregado com sucesso!');
          } catch (profileError) {
            console.error('🔗 [useAuth] Erro ao carregar perfil:', profileError);
            // Mesmo com erro, definir como autenticado para não ficar em loading infinito
            if (isMounted) {
              setIsLoading(false);
            }
          }
        } else {
          console.log('🔗 [useAuth] Sem sessão, limpando estado...');
          setCurrentUser(null);
          setAuthenticated(false);
          // Clear persisted data (but keep achievements)
          const store = useAppStore.getState();
          store.setCurrentUser(null);
          store.setAuthenticated(false);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('🔗 [useAuth] Error in auth state change:', err);
        if (isMounted) {
          setCurrentUser(null);
          setAuthenticated(false);
          setIsLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [setCurrentUser, setAuthenticated, fetchProfile, ensureProfileExists]);

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Detect if running in Capacitor
      const isCapacitor = typeof (window as any).Capacitor !== 'undefined';
      // For iOS, use Supabase URL with redirect_to query parameter
      // This forces Supabase to redirect to the deep link after processing
      // Make sure 'com-chefiapp-app://auth/callback' is in Supabase Redirect URLs
      const redirectUrl = isCapacitor 
        ? 'https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback?redirect_to=com-chefiapp-app://auth/callback'
        : `${window.location.origin}/auth/callback`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('[useAuth] Google OAuth error:', error);
        throw error;
      }

      // In Capacitor, OAuth will open in browser and redirect back
      // The session will be handled by onAuthStateChange
      // Note: isLoading will be set to false by onAuthStateChange when session is established
      
      // Timeout safety: if OAuth doesn't complete in 30 seconds, reset loading
      // But check if we're in a callback first
      const checkCallback = () => {
        const hash = window.location.hash.substring(1);
        const search = window.location.search.substring(1);
        const fullParams = hash || search;
        const params = new URLSearchParams(fullParams);
        const hasTokens = params.get('access_token') && params.get('refresh_token');
        
        if (hasTokens) {
          console.log('🔗 [useAuth] Tokens detectados na URL, aguardando processamento...');
          // Don't timeout if we have tokens - App.tsx will process them
          return;
        }
        
        // Only timeout if no tokens are present
        setTimeout(() => {
          console.warn('🔗 [useAuth] Google OAuth timeout - user may have cancelled');
          setIsLoading(false);
        }, 30000);
      };
      
      checkCallback();
    } catch (err: any) {
      console.error('[useAuth] Google OAuth failed:', err);
      const errorMessage = err.message || 'Erro ao fazer login com Google';
      
      // Provide more specific error messages
      if (errorMessage.includes('provider') && errorMessage.includes('not enabled')) {
        setError('Google OAuth não está habilitado. Verifique as configurações no Supabase.');
      } else if (errorMessage.includes('redirect_uri')) {
        setError('Erro de configuração. Verifique as Redirect URLs no Google Cloud Console.');
      } else if (errorMessage.includes('signup_disabled') || errorMessage.includes('Signups+not+allowed')) {
        setError('Cadastros estão desabilitados no Supabase. Habilite em: Authentication → Settings → User Signups');
      } else {
        setError(errorMessage);
      }
      
      setIsLoading(false);
    }
  };

  // Sign in with Apple
  const signInWithApple = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Detect if running in Capacitor
      const isCapacitor = typeof (window as any).Capacitor !== 'undefined';
      // For iOS, use Supabase URL with redirect_to query parameter
      // This forces Supabase to redirect to the deep link after processing
      // Make sure 'com-chefiapp-app://auth/callback' is in Supabase Redirect URLs
      const redirectUrl = isCapacitor 
        ? 'https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback?redirect_to=com-chefiapp-app://auth/callback'
        : `${window.location.origin}/auth/callback`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        console.error('[useAuth] Apple OAuth error:', error);
        throw error;
      }

      // In Capacitor, OAuth will open in browser and redirect back
      // The session will be handled by onAuthStateChange
      // Note: isLoading will be set to false by onAuthStateChange when session is established
      
      // Timeout safety: if OAuth doesn't complete in 30 seconds, reset loading
      // But check if we're in a callback first
      const checkCallback = () => {
        const hash = window.location.hash.substring(1);
        const search = window.location.search.substring(1);
        const fullParams = hash || search;
        const params = new URLSearchParams(fullParams);
        const hasTokens = params.get('access_token') && params.get('refresh_token');
        
        if (hasTokens) {
          console.log('🔗 [useAuth] Tokens detectados na URL, aguardando processamento...');
          // Don't timeout if we have tokens - App.tsx will process them
          return;
        }
        
        // Only timeout if no tokens are present
        setTimeout(() => {
          console.warn('🔗 [useAuth] Apple OAuth timeout - user may have cancelled');
          setIsLoading(false);
        }, 30000);
      };
      
      checkCallback();
    } catch (err: any) {
      console.error('[useAuth] Apple OAuth failed:', err);
      const errorMessage = err.message || 'Erro ao fazer login com Apple';
      
      // Provide more specific error messages
      if (errorMessage.includes('provider') && errorMessage.includes('not enabled')) {
        setError('Apple OAuth não está habilitado. Verifique as configurações no Supabase.');
      } else if (errorMessage.includes('signup_disabled') || errorMessage.includes('Signups+not+allowed')) {
        setError('Cadastros estão desabilitados no Supabase. Habilite em: Authentication → Settings → User Signups');
      } else if (errorMessage.includes('Service ID') || errorMessage.includes('Key')) {
        setError('Erro de configuração. Verifique as credenciais do Apple no Supabase.');
      } else if (errorMessage.includes('redirect_uri')) {
        setError('Erro de configuração. Verifique as Redirect URLs no Apple Developer Portal.');
      } else {
        setError(errorMessage);
      }
      
      setIsLoading(false);
    }
  };

  // Sign in with Magic Link
  const signInWithMagicLink = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      alert('Link mágico enviado! Verifique seu email.');
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar link mágico');
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with QR Code
  const signInWithQR = async (qrCode: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Extract company ID from QR code
      // Format: com-chefiapp-app://join/{companyId}
      const companyId = qrCode.split('/').pop();

      if (!companyId) {
        throw new Error('QR Code inválido');
      }

      // Verify company exists
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

      if (companyError || !company) {
        throw new Error('Empresa não encontrada');
      }

      // Store company ID for profile creation (web-safe)
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('pendingCompanyId', companyId);
        }
      } catch (storageErr) {
        console.warn('Não foi possível armazenar pendingCompanyId localmente:', storageErr);
      }

      // Redirect to auth (will create profile after auth)
      alert(`Entrando na empresa: ${company.name}`);
    } catch (err: any) {
      setError(err.message || 'Erro ao processar QR Code');
    } finally {
      setIsLoading(false);
    }
  };

  // Create user profile
  const createProfile = async (data: {
    name: string;
    role: UserRole;
    sector?: Sector;
    companyId?: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const profileData = {
        id: user.id,
        name: data.name,
        email: user.email || '',
        role: data.role,
        company_id: data.companyId,
        sector: data.sector,
        xp: 0,
        level: 1,
        streak: 0,
        shift_status: 'offline',
        profile_photo: user.user_metadata.avatar_url || '',
        auth_method: user.app_metadata.provider || 'magic_link',
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData);

      if (error) throw error;

      // Fetch the created profile
      await fetchProfile(user.id);

      // Unlock first achievement
      // This would be handled by the store/backend
    } catch (err: any) {
      setError(err.message || 'Erro ao criar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      // Clear all auth state
      setCurrentUser(null);
      setAuthenticated(false);
      
      // Clear persisted user from users array
      const store = useAppStore.getState();
      if (currentUser) {
        store.removeUser(currentUser.id);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao sair');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user: currentUser,
    isAuthenticated,
    isLoading,
    error,
    signInWithGoogle,
    signInWithApple,
    signInWithMagicLink,
    signInWithQR,
    signOut,
    createProfile,
  };
}
