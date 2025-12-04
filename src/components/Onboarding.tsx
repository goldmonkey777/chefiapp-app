import React, { useState, useEffect } from 'react';
import { ChevronRight, Camera, Crown, Clock, List, Star, Rocket, Check, Building, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { onboardViaQRCode, onboardViaInviteLink } from '../services/employee-onboarding.service';
import { OnboardingRequest } from '../lib/employee-relationship-types';
import { useAuth } from '../hooks/useAuth';
// Importar usando default export para evitar problemas
import CompanyOnboardingComponent from './CompanyOnboarding/CompanyOnboarding';
import { ErrorBoundary } from './ErrorBoundary';
import { QRCodeScanner } from './QRCodeScanner';
import { extractOAuthDataForCompany } from '../utils/oauth-data-extractor';

interface OnboardingProps {
  onComplete: (data: any) => void;
}

const STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to ChefIApp™',
    subtitle: 'Hospitality Workforce Intelligence',
    desc: 'Transform your daily work into achievements, track your progress, and excel in hospitality service',
    icon: <Crown size={48} className="text-white" />,
    color: 'bg-blue-600',
    btn: 'Get Started'
  },
  {
    id: 'track',
    title: 'Track Your Shifts',
    subtitle: 'Check in and out seamlessly',
    desc: 'Build your streak with consecutive days and unlock special achievements.',
    icon: <Clock size={48} className="text-white" />,
    color: 'bg-indigo-600',
    btn: 'Continue'
  },
  {
    id: 'tasks',
    title: 'Complete Tasks',
    subtitle: 'Receive assignments & track progress',
    desc: 'Track progress with real-time timers, and submit photo proof of completion.',
    icon: <List size={48} className="text-white" />,
    color: 'bg-blue-700',
    btn: 'Continue'
  },
  {
    id: 'xp',
    title: 'Earn XP & Level Up',
    subtitle: 'Gain experience points',
    desc: 'Climb the ranks with your team for every completed task.',
    icon: <Star size={48} className="text-white" />,
    color: 'bg-purple-600',
    btn: 'Continue'
  },
  {
    id: 'ready',
    title: 'Ready to Excel?',
    subtitle: 'Join your team',
    desc: '',
    icon: <Rocket size={48} className="text-white" />,
    color: 'bg-indigo-700',
    btn: 'Start My Journey',
    isFinal: true
  },
  {
    id: 'join-company',
    title: 'Join Your Company',
    subtitle: 'Scan QR or Enter Code',
    desc: 'Connect with your employer to start tracking your shifts.',
    icon: <Building size={48} className="text-white" />,
    color: 'bg-slate-800',
    btn: 'Join',
    isExtra: true
  }
];

// Estados unificados do onboarding para evitar conflitos
type OnboardingState =
  | 'intro'           // STEPS[0-4] - Introdução
  | 'profile'         // Login/Signup
  | 'join'            // QR Code/Código
  | 'company'         // CompanyOnboarding
  | 'complete';       // Finalizado

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  // Estado unificado - apenas um pode estar ativo por vez
  // Começar direto na tela de login/signup (removidas telas genéricas)
  const [onboardingState, setOnboardingState] = useState<OnboardingState>('profile');
  const [currentStep, setCurrentStep] = useState(0);
  const [companyInitialData, setCompanyInitialData] = useState<any>(null); // Dados do OAuth para pré-preencher
  const [joinMethod, setJoinMethod] = useState<'qr' | 'code' | 'create'>('qr');
  const [joinData, setJoinData] = useState({ qrData: '', inviteCode: '' });
  // Carregar email e senha salvos do localStorage
  const loadSavedCredentials = () => {
    try {
      const savedEmail = localStorage.getItem('chefiapp_saved_email') || '';
      const savedPassword = localStorage.getItem('chefiapp_saved_password') || '';
      return { email: savedEmail, password: savedPassword };
    } catch (e) {
      return { email: '', password: '' };
    }
  };

  const savedCredentials = loadSavedCredentials();
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    companyCode: '',
    email: savedCredentials.email,
    password: savedCredentials.password
  });
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wantsToCreateCompany, setWantsToCreateCompany] = useState(false); // Rastrear se usuário quer criar empresa

  // Hook must be called before any useEffect that uses its values
  const { signInWithGoogle, signInWithApple, signInWithMagicLink, isAuthenticated, isLoading: authIsLoading, user } = useAuth();

  // Resetar loading quando autenticação completa
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('🔗 [Onboarding] Usuário autenticado, resetando loading...');
      setLoading(false);
      // Se usuário está autenticado, não precisa mais mostrar onboarding
      // O App.tsx vai redirecionar para o dashboard
    } else if (!authIsLoading && !isAuthenticated) {
      // Se não está carregando e não está autenticado, resetar loading também
      setLoading(false);
    }
  }, [isAuthenticated, user, authIsLoading]);
  const debug = import.meta.env.DEV;

  // Estados derivados para compatibilidade (serão removidos gradualmente)
  const isProfileStep = onboardingState === 'profile';
  const isJoinStep = onboardingState === 'join';
  const isCompanyOnboarding = onboardingState === 'company';

  // Debug: log sempre que estado mudar
  React.useEffect(() => {
    if (debug) console.log('[Onboarding] State changed:', onboardingState);
  }, [onboardingState]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 2) { // Adjust for extra step
      setCurrentStep(curr => curr + 1);
    } else if (currentStep === STEPS.length - 2) {
      setOnboardingState('profile');
    }
  };

  // Handler para quando funcionário é selecionado no CompanyOnboarding
  const handleEmployeeSelected = () => {
    // Fechar CompanyOnboarding e mostrar tela de join (QR Code/Código)
    setOnboardingState('join');
  };

  // Renderização baseada no estado unificado
  if (onboardingState === 'company') {
    return (
      <ErrorBoundary
        fallback={
          <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-6 text-white safe-area-insets">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center max-w-md border border-white/20">
              <h2 className="text-2xl font-bold mb-4">Algo deu errado</h2>
              <p className="mb-6 text-blue-100">Não foi possível carregar o formulário de criação de empresa.</p>
              <button
                onClick={() => setOnboardingState('profile')}
                className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition"
              >
                Voltar
              </button>
            </div>
          </div>
        }
      >
        <CompanyOnboardingComponent
          initialData={companyInitialData}
          onComplete={async (companyId) => {
            try {
              setOnboardingState('complete');
              // Pequeno delay para garantir que o estado atualizou
              await new Promise(resolve => setTimeout(resolve, 100));

              // Buscar dados atualizados do perfil
              const { data: { user } } = await supabase.auth.getUser();
              if (user) {
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', user.id)
                  .single();

                if (profile) {
                  onComplete(profile);
                }
              }
            } catch (err) {
              console.error('Error completing company onboarding:', err);
              setOnboardingState('profile'); // Voltar para profile em caso de erro
            }
          }}
          onCancel={() => setOnboardingState('profile')}
          onEmployeeSelected={handleEmployeeSelected}
        />
      </ErrorBoundary>
    );
  }

  if (isProfileStep) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex flex-col p-6 animate-fade-in text-white safe-area-insets">
        <div className="flex-1 flex flex-col items-center justify-center space-y-8">
          <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-md w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-white rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-xl p-2">
                <img src="/chefiapp-logo.png" alt="ChefIApp" className="w-full h-full object-contain" />
              </div>
              <h2 className="text-2xl font-bold">{authMode === 'signup' ? 'Join Your Company' : 'Welcome Back'}</h2>
              <p className="text-blue-100 text-sm mt-2">
                {authMode === 'signup' ? 'Create an account to get started' : 'Sign in to continue your progress'}
              </p>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-100 p-3 rounded-xl text-sm mb-4">
                {error}
              </div>
            )}

            {/* OAuth Buttons */}
            <div className="space-y-3 mb-6 animate-fade-in">
              <button
                onClick={async () => {
                  setLoading(true);
                  setError(null);
                  try {
                    await signInWithGoogle();
                    // Timeout de segurança: resetar loading após 10 segundos se não autenticou
                    setTimeout(() => {
                      if (!isAuthenticated) {
                        console.log('🔗 [Onboarding] Timeout OAuth Google, resetando loading...');
                        setLoading(false);
                      }
                    }, 10000);
                  } catch (err: any) {
                    console.error('🔗 [Onboarding] Erro Google OAuth:', err);
                    setError(err.message || 'Erro ao fazer login com Google');
                    setLoading(false);
                  }
                }}
                disabled={loading || authIsLoading}
                className="w-full py-3.5 bg-white text-gray-900 font-semibold rounded-xl shadow-lg hover:bg-gray-50 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3 active:scale-95 relative"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-900 border-t-transparent"></div>
                    <span>Abrindo Google...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continuar com Google
                  </>
                )}
              </button>

              <button
                onClick={async () => {
                  setLoading(true);
                  setError(null);
                  try {
                    await signInWithApple();
                    // Timeout de segurança: resetar loading após 10 segundos se não autenticou
                    setTimeout(() => {
                      if (!isAuthenticated) {
                        console.log('🔗 [Onboarding] Timeout OAuth Apple, resetando loading...');
                        setLoading(false);
                      }
                    }, 10000);
                  } catch (err: any) {
                    console.error('🔗 [Onboarding] Erro Apple OAuth:', err);
                    setError(err.message || 'Erro ao fazer login com Apple');
                    setLoading(false);
                  }
                }}
                disabled={loading || authIsLoading}
                className="w-full py-3.5 bg-black text-white font-semibold rounded-xl shadow-lg hover:bg-gray-900 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3 active:scale-95 relative"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Abrindo Apple...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                    Continuar com Apple
                  </>
                )}
              </button>

              <div className="flex items-center gap-4 my-5">
                <div className="flex-1 h-px bg-white/20"></div>
                <span className="text-sm text-blue-200 font-medium">ou</span>
                <div className="flex-1 h-px bg-white/20"></div>
              </div>
            </div>

            {/* Botão para criar empresa (apenas no signup) */}
            {authMode === 'signup' && (
              <div className="mb-6">
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    // Verificar se já está autenticado
                    const { data: { session } } = await supabase.auth.getSession();

                    if (session?.user) {
                      // Já autenticado, pode criar empresa
                      setOnboardingState('company');
                    } else {
                      // Não autenticado - marcar que quer criar empresa e pedir para criar conta primeiro
                      setWantsToCreateCompany(true);
                      setError('Por favor, crie uma conta primeiro para criar sua empresa. Preencha os campos acima e clique em "Create Account".');
                      // Scroll para o topo para mostrar o formulário
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="w-full bg-blue-500/20 hover:bg-blue-500/30 border-2 border-blue-400/50 text-white font-semibold py-3.5 px-6 rounded-xl transition flex items-center justify-center gap-2 active:scale-95"
                >
                  <Building size={20} />
                  Sou Dono/Gerente - Criar Empresa
                </button>
                <p className="text-xs text-blue-200 mt-2 text-center">
                  Crie sua conta primeiro para começar
                </p>
              </div>
            )}

            <div className="space-y-4">
              {authMode === 'signup' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full bg-white/10 border border-blue-400/30 rounded-xl px-4 py-3 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-primary-light"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-1">Department</label>
                    <select
                      className="w-full bg-white/10 border border-blue-400/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-light appearance-none"
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option className="text-gray-900" value="">Select Role</option>
                      <option className="text-gray-900" value="Reception">Reception</option>
                      <option className="text-gray-900" value="Kitchen">Kitchen</option>
                      <option className="text-gray-900" value="Service">Bar/Service</option>
                      <option className="text-gray-900" value="Manager">Manager</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-blue-100 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full bg-white/10 border border-blue-400/30 rounded-xl px-4 py-3 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-primary-light"
                  placeholder="name@company.com"
                  value={formData.email || ''}
                  onChange={e => {
                    const newEmail = e.target.value;
                    setFormData({ ...formData, email: newEmail });
                    // Salvar email no localStorage
                    try {
                      localStorage.setItem('chefiapp_saved_email', newEmail);
                    } catch (err) {
                      console.warn('Não foi possível salvar email:', err);
                    }
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-1">Password</label>
                <input
                  type="password"
                  className="w-full bg-white/10 border border-blue-400/30 rounded-xl px-4 py-3 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-primary-light"
                  placeholder="••••••••"
                  value={formData.password || ''}
                  onChange={e => {
                    const newPassword = e.target.value;
                    setFormData({ ...formData, password: newPassword });
                    // Salvar senha no localStorage
                    try {
                      localStorage.setItem('chefiapp_saved_password', newPassword);
                    } catch (err) {
                      console.warn('Não foi possível salvar senha:', err);
                    }
                  }}
                />
              </div>
            </div>

            <button
              onClick={async () => {
                setLoading(true);
                setError(null);
                try {
                  const trimmedEmail = formData.email.trim();
                  const trimmedName = formData.name.trim();
                  const normalizedDepartment = formData.role || 'General';
                  const normalizedRole = formData.role === 'Manager' ? 'MANAGER' : 'EMPLOYEE';

                  if (authMode === 'signup') {
                    const { data, error } = await supabase.auth.signUp({
                      email: trimmedEmail,
                      password: formData.password,
                      options: {
                        data: {
                          name: trimmedName,
                          role: normalizedRole,
                          department: normalizedDepartment
                        }
                      }
                    });
                    if (error) throw error;

                    // Salvar credenciais após signup bem-sucedido
                    try {
                      localStorage.setItem('chefiapp_saved_email', trimmedEmail);
                      localStorage.setItem('chefiapp_saved_password', formData.password);
                    } catch (err) {
                      console.warn('Não foi possível salvar credenciais:', err);
                    }

                    const userId = data.user?.id;

                    // If email confirmation is on, Supabase may not return a session yet.
                    if (!data.session) {
                      setError('Check your email to confirm your account, then sign in.');
                      return;
                    }

                    if (userId) {
                      // Profile is created by DB trigger; fetch it to continue.
                      const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', userId)
                        .maybeSingle();

                      if (profileError) throw profileError;

                      // Check if user has a company assigned
                      let empProfile = null;
                      try {
                        const { data: empData } = await supabase
                          .from('profiles')
                          .select('*')
                          .eq('id', userId)
                          .maybeSingle();
                        empProfile = empData;
                      } catch (empError: any) {
                        // Table might not exist or user doesn't have employee profile yet
                        console.log('Employee profile check:', empError.message);
                        empProfile = null;
                      }

                      if (empProfile) {
                        onComplete({
                          ...(profile || {}),
                          ...empProfile,
                          email: trimmedEmail
                        });
                      } else {
                        // Usuário criou conta mas não tem empresa
                        // Se estava tentando criar empresa, abrir onboarding da empresa
                        if (wantsToCreateCompany) {
                          setWantsToCreateCompany(false); // Reset flag
                          setOnboardingState('company');
                        } else {
                          // Caso contrário, ir para join step
                          setOnboardingState('join');
                        }
                      }
                    }
                  } else {
                    const { data, error } = await supabase.auth.signInWithPassword({
                      email: formData.email,
                      password: formData.password,
                    });
                    if (error) throw error;

                    // Salvar credenciais após login bem-sucedido
                    try {
                      localStorage.setItem('chefiapp_saved_email', trimmedEmail);
                      localStorage.setItem('chefiapp_saved_password', formData.password);
                    } catch (err) {
                      console.warn('Não foi possível salvar credenciais:', err);
                    }
                    if (data.user) {
                      // Fetch profile
                      const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', data.user.id)
                        .single();

                      if (profileError) {
                        console.error('Profile error:', profileError);
                        throw new Error(`Erro ao carregar perfil: ${profileError.message}`);
                      }

                      if (!profile) {
                        throw new Error('Perfil não encontrado. Por favor, entre em contato com o suporte.');
                      }

                      // Check if user has a company assigned
                      let empProfile = null;
                      try {
                        const { data: empData, error: empError } = await supabase
                          .from('profiles')
                          .select('*')
                          .eq('id', data.user.id)
                          .maybeSingle();

                        if (!empError && empData) {
                          empProfile = empData;
                        }
                      } catch (empError: any) {
                        // Table might not exist or user doesn't have employee profile yet
                        console.log('Employee profile check (optional):', empError?.message || 'Not found');
                        empProfile = null;
                      }

                      if (empProfile) {
                        onComplete({ ...profile, ...empProfile, email: data.user.email });
                      } else {
                        // User doesn't have employee profile, but can still login
                        // Move to Join Step to connect with company
                        setOnboardingState('join');
                      }
                    }
                  }
                } catch (err: any) {
                  console.error('Login error:', err);
                  setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading || !formData.email || !formData.password || (authMode === 'signup' && (!formData.name || !formData.role))}
              className="w-full mt-6 py-4 bg-white text-primary font-bold rounded-xl shadow-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex justify-center"
            >
              {loading ? <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div> : (authMode === 'signup' ? 'Create Account' : 'Sign In')}
            </button>

            <div className="mt-4 text-center">
              <button
                onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
                className="text-sm text-blue-200 hover:text-white underline"
              >
                {authMode === 'signup' ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>
        </div>
      </div >
    );
  }

  if (isJoinStep) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col p-6 animate-fade-in text-white">
        <div className="flex-1 flex flex-col items-center justify-center space-y-8">
          <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-md w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg p-2">
                <img src="/chefiapp-logo.png" alt="ChefIApp" className="w-full h-full object-contain" />
              </div>
              <h2 className="text-2xl font-bold">Join Your Team</h2>
              <p className="text-blue-100 text-sm mt-2">
                Select how you want to connect
              </p>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-100 p-3 rounded-xl text-sm mb-4">
                {error}
              </div>
            )}

            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => setJoinMethod('qr')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${joinMethod === 'qr' ? 'bg-blue-600 text-white' : 'bg-white/5 text-blue-200 hover:bg-white/10'}`}
              >
                Scan QR
              </button>
              <button
                onClick={() => setJoinMethod('code')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${joinMethod === 'code' ? 'bg-blue-600 text-white' : 'bg-white/5 text-blue-200 hover:bg-white/10'}`}
              >
                Invite Code
              </button>
            </div>

            <div className="space-y-4">
              {joinMethod === 'qr' && (
                <div>
                  <button
                    onClick={() => {
                      // Open QR scanner modal
                      const scannerContainer = document.getElementById('qr-scanner-container');
                      if (scannerContainer) {
                        scannerContainer.style.display = 'block';
                      }
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition flex items-center justify-center gap-3"
                  >
                    <Camera size={24} />
                    Abrir Scanner de QR Code
                  </button>
                  <p className="text-xs text-blue-300 mt-3 text-center">
                    Escaneie o QR code fornecido pela sua empresa
                  </p>
                </div>
              )}

              {joinMethod === 'code' && (
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-1">Invite Code</label>
                  <input
                    type="text"
                    className="w-full bg-white/10 border border-blue-400/30 rounded-xl px-4 py-3 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-primary-light"
                    placeholder="Enter code provided by manager"
                    value={joinData.inviteCode}
                    onChange={e => setJoinData({ ...joinData, inviteCode: e.target.value })}
                  />
                </div>
              )}
            </div>

            <button
              onClick={async () => {
                setLoading(true);
                setError(null);
                try {
                  const { data: { user } } = await supabase.auth.getUser();
                  if (!user) throw new Error('User not found');

                  let result;
                  if (joinMethod === 'qr') {
                    // Simulate GPS for now
                    const mockGps = { latitude: 40.7128, longitude: -74.0060 };
                    // Parse QR to get company ID (assuming simplified flow for demo)
                    let companyId = '';
                    try {
                      const parsed = JSON.parse(joinData.qrData);
                      companyId = parsed.company_id;
                    } catch (e) {
                      throw new Error('Invalid QR Data format');
                    }

                    const req: OnboardingRequest = {
                      user_id: user.id,
                      company_id: companyId,
                      method: 'qr_code',
                      qr_data: joinData.qrData,
                      gps_coordinates: mockGps,
                      device_info: {
                        device_id: 'web-sim',
                        device_model: 'Browser',
                        os: 'Web',
                        os_version: '1.0',
                        app_version: '1.0'
                      }
                    };
                    result = await onboardViaQRCode(req);
                  } else {
                    // Invite code flow - simplified, assuming token contains company info or we look it up
                    // For now, let's just use the logic we have
                    // We need company_id for the request, which usually comes from the link or token lookup
                    // This part might need the user to input company ID if the token doesn't encode it fully in this UI
                    throw new Error('Invite code flow requires deep link handling implementation');
                  }

                  if (!result.success) throw new Error(result.error);

                  onComplete(result.employee_profile);

                } catch (err: any) {
                  console.error('Join company error:', err);
                  setError(err.message || 'Erro ao entrar na empresa. Verifique os dados informados.');
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="w-full mt-6 py-4 bg-white text-primary font-bold rounded-xl shadow-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex justify-center"
            >
              {loading ? <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div> : 'Join Company'}
            </button>
          </div>

          {/* QR Scanner Modal */}
          <div id="qr-scanner-container" style={{ display: 'none' }}>
            <QRCodeScanner
              onScanSuccess={async (companyId) => {
                // Hide scanner
                const scannerContainer = document.getElementById('qr-scanner-container');
                if (scannerContainer) {
                  scannerContainer.style.display = 'none';
                }

                // Process company join
                setLoading(true);
                setError(null);
                try {
                  const { data: { user } } = await supabase.auth.getUser();
                  if (!user) throw new Error('User not found');

                  // Update user profile with company
                  const { error: updateError } = await supabase
                    .from('profiles')
                    .update({ company_id: companyId, role: 'EMPLOYEE' })
                    .eq('id', user.id);

                  if (updateError) throw updateError;

                  // Fetch updated profile
                  const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                  onComplete(profile);
                } catch (err: any) {
                  console.error('Error joining company:', err);
                  setError(err.message || 'Erro ao entrar na empresa');
                } finally {
                  setLoading(false);
                }
              }}
              onClose={() => {
                const scannerContainer = document.getElementById('qr-scanner-container');
                if (scannerContainer) {
                  scannerContainer.style.display = 'none';
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Se chegou aqui e ainda está em 'intro', redirecionar para profile
  // (telas genéricas foram removidas - não fazem sentido antes de escolher perfil)
  if (onboardingState === 'intro') {
    // Usar useEffect para evitar warning de atualização durante render
    React.useEffect(() => {
      setOnboardingState('profile');
    }, []);
    // Retornar tela de loading enquanto redireciona
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center safe-area-insets">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  // Não deve chegar aqui, mas por segurança retornar null
  return null;
};

export default Onboarding;
