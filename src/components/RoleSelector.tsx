// ChefIApp™ - Role Selector Component
// Tela para usuários OAuth escolherem sua função após primeiro login

import React, { useState } from 'react';
import { UserRole } from '../lib/types';
import { supabase } from '../lib/supabase';
import { 
  User, 
  Users, 
  Building2, 
  ChefHat,
  ArrowRight,
  Loader2,
  CheckCircle
} from 'lucide-react';

interface RoleSelectorProps {
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  onRoleSelected: (role: UserRole) => void;
}

interface RoleOption {
  role: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const roleOptions: RoleOption[] = [
  {
    role: UserRole.EMPLOYEE,
    title: 'Funcionário',
    description: 'Receba tarefas, acumule XP e suba de nível enquanto trabalha',
    icon: <User className="w-8 h-8" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
  },
  {
    role: UserRole.MANAGER,
    title: 'Gerente',
    description: 'Gerencie equipes, crie tarefas e acompanhe a produtividade',
    icon: <Users className="w-8 h-8" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
  },
  {
    role: UserRole.OWNER,
    title: 'Proprietário',
    description: 'Controle total do restaurante, relatórios e métricas',
    icon: <Building2 className="w-8 h-8" />,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 hover:bg-amber-100 border-amber-200',
  },
];

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  userId,
  userName,
  userEmail,
  userAvatar,
  onRoleSelected,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!selectedRole) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log('🔧 [RoleSelector] Atualizando role para:', selectedRole);

      // Atualizar o perfil com o role selecionado
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          role: selectedRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        console.error('❌ [RoleSelector] Erro ao atualizar role:', updateError);
        throw updateError;
      }

      console.log('✅ [RoleSelector] Role atualizado com sucesso!');
      
      // Notificar o componente pai
      onRoleSelected(selectedRole);
    } catch (err: any) {
      console.error('❌ [RoleSelector] Erro:', err);
      setError(err.message || 'Erro ao salvar função');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 safe-area-insets">
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        {/* Logo e Boas-vindas */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
            <ChefHat className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Bem-vindo ao ChefIApp!
          </h1>
          <p className="text-white/80 text-lg">
            Olá, {userName}! 👋
          </p>
        </div>

        {/* Card Principal */}
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-6">
          {/* Avatar e Info do Usuário */}
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
            {userAvatar ? (
              <img 
                src={userAvatar} 
                alt={userName}
                className="w-14 h-14 rounded-full border-2 border-blue-100"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-7 h-7 text-blue-600" />
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-900">{userName}</p>
              <p className="text-sm text-gray-500">{userEmail}</p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-500 ml-auto" />
          </div>

          {/* Título */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">
              Qual é a sua função?
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Selecione seu papel no restaurante
            </p>
          </div>

          {/* Opções de Role */}
          <div className="space-y-3">
            {roleOptions.map((option) => (
              <button
                key={option.role}
                onClick={() => setSelectedRole(option.role)}
                className={`
                  w-full p-4 rounded-xl border-2 transition-all duration-200
                  flex items-center gap-4 text-left
                  ${selectedRole === option.role 
                    ? `${option.bgColor} border-current ring-2 ring-offset-2 ${option.color.replace('text-', 'ring-')}`
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }
                `}
              >
                <div className={`
                  w-14 h-14 rounded-xl flex items-center justify-center
                  ${selectedRole === option.role ? option.bgColor : 'bg-white'}
                  ${option.color}
                `}>
                  {option.icon}
                </div>
                <div className="flex-1">
                  <p className={`font-semibold ${selectedRole === option.role ? option.color : 'text-gray-900'}`}>
                    {option.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {option.description}
                  </p>
                </div>
                {selectedRole === option.role && (
                  <CheckCircle className={`w-6 h-6 ${option.color}`} />
                )}
              </button>
            ))}
          </div>

          {/* Erro */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Botão Confirmar */}
          <button
            onClick={handleConfirm}
            disabled={!selectedRole || isLoading}
            className={`
              w-full py-4 rounded-xl font-semibold text-lg
              flex items-center justify-center gap-2
              transition-all duration-200
              ${selectedRole && !isLoading
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                Continuar
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Nota */}
          <p className="text-center text-xs text-gray-400">
            Você pode alterar isso depois nas configurações
          </p>
        </div>

        {/* Footer */}
        <p className="text-white/50 text-sm mt-6">
          Made with ❤️ by goldmonkey.studio
        </p>
      </div>
    </div>
  );
};

export default RoleSelector;

