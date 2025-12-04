// ChefIApp™ - Company Onboarding Flow (8 Telas)
// Fluxo completo de criação de empresa

import React, { useState } from 'react';
import { Building2, MapPin, Users, Briefcase, Clock, Settings, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { installPreset } from '../../services/preset-installer.service';

// Importar telas individuais
import ProfileSelectionScreen from './screens/ProfileSelectionScreen';
import CompanyDataScreen from './screens/CompanyDataScreen';
import LocationScreen from './screens/LocationScreen';
import SectorsScreen from './screens/SectorsScreen';
import PositionsScreen from './screens/PositionsScreen';
import OrganizationScreen from './screens/OrganizationScreen';
import PresetScreen from './screens/PresetScreen';
import SummaryScreen from './screens/SummaryScreen';

export interface CompanyOnboardingData {
  // Tela 1
  userType: 'owner' | 'manager' | 'employee' | null;

  // Tela 2
  companyName: string;
  cnpjEin: string;
  email: string;
  phone: string;
  logoUrl: string;
  country: string;
  language: string;
  currency: string;

  // Tela 3
  address: string;
  number: string;
  city: string;
  postalCode: string;
  complement: string;
  latitude: number | null;
  longitude: number | null;

  // Tela 4
  sectors: string[];

  // Tela 5
  positions: string[];

  // Tela 6
  employeeCount: string;
  shifts: string[];
  openingTime: string;
  closingTime: string;

  // Tela 7
  preset: string;
}

const INITIAL_DATA: CompanyOnboardingData = {
  userType: null,
  companyName: '',
  cnpjEin: '',
  email: '',
  phone: '',
  logoUrl: '',
  country: '',
  language: 'pt',
  currency: 'BRL',
  address: '',
  number: '',
  city: '',
  postalCode: '',
  complement: '',
  latitude: null,
  longitude: null,
  sectors: [],
  positions: [],
  employeeCount: '',
  shifts: [],
  openingTime: '',
  closingTime: '',
  preset: '',
};

interface CompanyOnboardingProps {
  onComplete: (companyId: string) => void;
  onCancel?: () => void;
  onEmployeeSelected?: () => void; // Callback quando funcionário é selecionado
  initialData?: Partial<CompanyOnboardingData>;
}

const CompanyOnboarding: React.FC<CompanyOnboardingProps> = ({ 
  onComplete, 
  onCancel, 
  onEmployeeSelected,
  initialData 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<CompanyOnboardingData>({
    ...INITIAL_DATA,
    ...initialData, // Pré-preencher com dados do OAuth
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debug = import.meta.env.DEV;

  // useAuth deve ser chamado sempre no topo (regra dos hooks do React)
  // Se o hook falhar, vai quebrar mesmo - mas isso é melhor que tela branca silenciosa
  const { user, isLoading: authLoading } = useAuth();

  // Log para debug
  if (debug) {
    console.log('[CompanyOnboarding] Rendered:', {
      currentStep,
      hasUser: !!user,
      authLoading,
      dataKeys: Object.keys(data),
      initialDataProvided: !!initialData,
    });
  }

  // Permitir navegar pelas telas mesmo sem autenticação
  // Mas vamos verificar autenticação apenas na hora de criar a empresa

  const updateData = (updates: Partial<CompanyOnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  // Validação global antes de avançar para Summary (Tela 8)
  const validateBeforeSummary = (): string[] => {
    const errors: string[] = [];
    
    if (!data.companyName || data.companyName.trim().length === 0) {
      errors.push('Nome da empresa');
    }
    if (!data.email || !data.email.includes('@')) {
      errors.push('E-mail válido');
    }
    if (!data.country) {
      errors.push('País');
    }
    if (!data.address || !data.number || !data.city || !data.postalCode) {
      errors.push('Endereço completo');
    }
    if (!data.sectors || data.sectors.length === 0) {
      errors.push('Pelo menos um setor');
    }
    if (!data.positions || data.positions.length === 0) {
      errors.push('Pelo menos um cargo');
    }
    if (!data.employeeCount) {
      errors.push('Quantidade de funcionários');
    }
    if (!data.shifts || data.shifts.length === 0) {
      errors.push('Pelo menos um turno');
    }
    if (!data.openingTime || !data.closingTime) {
      errors.push('Horário de funcionamento');
    }
    if (!data.preset) {
      errors.push('Preset operacional');
    }
    
    return errors;
  };

  const handleNext = () => {
    // Se está indo para Summary (Tela 8), validar todos os dados
    if (currentStep === 7) {
      const validationErrors = validateBeforeSummary();
      if (validationErrors.length > 0) {
        setError(`Por favor, complete os seguintes campos antes de continuar: ${validationErrors.join(', ')}`);
        return;
      }
      setError(null); // Limpar erro se validação passou
    }
    
    if (currentStep < 8) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else if (onCancel) {
      onCancel();
    }
  };

  const handleCreateCompany = async () => {
    // Verificar autenticação antes de criar empresa
    const { data: { session } } = await supabase.auth.getSession();
    const currentUser = session?.user;

    if (!currentUser) {
      setError('Você precisa estar autenticado para criar uma empresa. Por favor, faça login primeiro.');
      // Não redirecionar automaticamente - deixar usuário decidir
      // Mostrar botão para fazer login
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Criar empresa no Supabase
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: data.companyName,
          cnpj_ein: data.cnpjEin || null,
          email: data.email,
          phone: data.phone,
          logo_url: data.logoUrl || null,
          country: data.country,
          language: data.language,
          currency: data.currency,
          address: data.address,
          address_number: data.number,
          city: data.city,
          postal_code: data.postalCode,
          complement: data.complement || null,
          latitude: data.latitude,
          longitude: data.longitude,
          owner_id: currentUser.id,
          employee_count_range: data.employeeCount,
          opening_time: data.openingTime,
          closing_time: data.closingTime,
          preset: data.preset,
        })
        .select()
        .single();

      if (companyError) {
        console.error('Company creation error:', companyError);
        throw new Error(companyError.message || 'Erro ao criar empresa');
      }

      // Criar setores
      if (data.sectors.length > 0) {
        const sectorsData = data.sectors.map(sector => ({
          company_id: company.id,
          name: sector,
        }));

        const { error: sectorsError } = await supabase.from('sectors').insert(sectorsData);
        if (sectorsError && debug) {
          console.warn('Error creating sectors:', sectorsError);
          // Não falha o onboarding se setores não puderem ser criados
        }
      }

      // Criar posições
      if (data.positions.length > 0) {
        const positionsData = data.positions.map(position => ({
          company_id: company.id,
          name: position,
        }));

        const { error: positionsError } = await supabase.from('positions').insert(positionsData);
        if (positionsError && debug) {
          console.warn('Error creating positions:', positionsError);
          // Não falha o onboarding se posições não puderem ser criadas
        }
      }

      // Criar turnos
      if (data.shifts.length > 0) {
        const shiftsData = data.shifts.map(shift => ({
          company_id: company.id,
          name: shift,
        }));

        const { error: shiftsError } = await supabase.from('shifts').insert(shiftsData);
        if (shiftsError && debug) {
          console.warn('Error creating shifts:', shiftsError);
          // Não falha o onboarding se turnos não puderem ser criados
        }
      }

      // Atualizar perfil do usuário
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          company_id: company.id,
          role: 'OWNER',
        })
        .eq('id', currentUser.id);

      if (profileError && debug) {
        console.warn('Error updating profile:', profileError);
        // Não falha o onboarding se perfil não puder ser atualizado
      }

      // Forçar refresh do perfil do usuário para atualizar o store
      // O useAuth vai detectar a mudança automaticamente via onAuthStateChange
      // Mas vamos forçar um refresh para garantir
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Dispara um evento de mudança de auth para atualizar o store
        await supabase.auth.getUser();
      }

      // Generate QR code URL for the company
      // Format: com-chefiapp-app://join/{companyId}
      // The QR code is generated dynamically from the company ID
      // and can be accessed via the QRCodeGenerator component
      const qrCodeUrl = `com-chefiapp-app://join/${company.id}`;

      if (debug) {
        console.log(`✅ QR Code generated for company ${company.id}: ${qrCodeUrl}`);
        console.log('   The QR code can be accessed in the Owner Dashboard via the QRCodeGenerator component');
      }

      // Instalar preset de tarefas (se não for custom)
      if (data.preset && data.preset !== 'custom') {
        if (debug) console.log(`Installing preset: ${data.preset} for company: ${company.id}`);
        const presetResult = await installPreset(company.id, data.preset);

        if (presetResult.success) {
          if (debug) console.log(`Successfully installed ${presetResult.tasksCreated} tasks from preset`);
        } else {
          if (debug) console.warn('Failed to install preset tasks:', presetResult.error);
          // Não falha o onboarding se preset não puder ser instalado
        }
      }

      onComplete(company.id);
    } catch (error: any) {
      console.error('Error creating company:', error);
      setError(error.message || 'Erro ao criar empresa. Por favor, tente novamente.');
      // Não fazer throw para não quebrar o componente
    } finally {
      setLoading(false);
    }
  };

  const renderScreen = () => {
    try {
      switch (currentStep) {
        case 1:
          return (
            <ProfileSelectionScreen
              data={data}
              onUpdate={updateData}
              onNext={handleNext}
              onBack={handleBack}
              onEmployeeSelected={onEmployeeSelected}
            />
          );
        case 2:
          return (
            <CompanyDataScreen
              data={data}
              onUpdate={updateData}
              onNext={handleNext}
              onBack={handleBack}
            />
          );
        case 3:
          return (
            <LocationScreen
              data={data}
              onUpdate={updateData}
              onNext={handleNext}
              onBack={handleBack}
            />
          );
        case 4:
          return (
            <SectorsScreen
              data={data}
              onUpdate={updateData}
              onNext={handleNext}
              onBack={handleBack}
            />
          );
        case 5:
          return (
            <PositionsScreen
              data={data}
              onUpdate={updateData}
              onNext={handleNext}
              onBack={handleBack}
            />
          );
        case 6:
          return (
            <OrganizationScreen
              data={data}
              onUpdate={updateData}
              onNext={handleNext}
              onBack={handleBack}
            />
          );
        case 7:
          return (
            <PresetScreen
              data={data}
              onUpdate={updateData}
              onNext={handleNext}
              onBack={handleBack}
            />
          );
        case 8:
          return (
            <SummaryScreen
              data={data}
              onBack={handleBack}
              onCreate={handleCreateCompany}
              loading={loading}
              isAuthenticated={!!user}
              onRequestLogin={() => {
                // Voltar para tela de login quando usuário clicar em "Fazer Login"
                if (onCancel) {
                  onCancel();
                }
              }}
            />
          );
        default:
          return (
            <div className="min-h-screen flex items-center justify-center p-6 text-white">
              <div className="text-center">
                <p className="text-xl font-bold mb-2">Tela não encontrada (Step: {currentStep})</p>
                <button
                  onClick={handleBack}
                  className="mt-4 bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition"
                >
                  Voltar
                </button>
              </div>
            </div>
          );
      }
    } catch (err: any) {
      console.error('Error rendering screen:', err);
      return (
        <div className="min-h-screen flex items-center justify-center p-6 text-white">
          <div className="text-center bg-red-500/20 rounded-xl p-8">
            <p className="text-xl font-bold mb-2">Erro ao renderizar tela</p>
            <p className="text-sm mb-4">{err?.message || 'Erro desconhecido'}</p>
            <button
              onClick={handleBack}
              className="mt-4 bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition"
            >
              Voltar
            </button>
          </div>
        </div>
      );
    }
  };

  // Mostrar loading enquanto verifica autenticação (apenas na primeira renderização)
  if (authLoading && currentStep === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 safe-area-insets flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  // Renderizar conteúdo com try/catch adicional
  let screenContent;
  try {
    screenContent = renderScreen();
  } catch (err: any) {
    console.error('Error in renderScreen:', err);
    screenContent = (
      <div className="min-h-screen flex items-center justify-center p-6 text-white">
        <div className="text-center bg-red-500/20 rounded-xl p-8">
          <p className="text-xl font-bold mb-2">Erro ao carregar tela</p>
          <p className="text-sm mb-4">{err?.message || 'Erro desconhecido'}</p>
          <button
            onClick={onCancel}
            className="mt-4 bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 safe-area-insets flex flex-col">
      {/* Progress Bar */}
      <div className="w-full bg-blue-900/30 h-1">
        <div
          className="bg-white h-full transition-all duration-300"
          style={{ width: `${(currentStep / 8) * 100}%` }}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-100 p-4 m-4 rounded-xl">
          <p className="font-semibold">Erro:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Screen Content */}
      <div className="flex-1 overflow-y-auto">
        {screenContent}
      </div>
    </div>
  );
};

export default CompanyOnboarding;
