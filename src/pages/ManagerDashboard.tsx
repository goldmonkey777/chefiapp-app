// ChefIApp™ - Manager Dashboard
// Dashboard do gerente com visão da equipe (Optimized)

import React, { useState, lazy, Suspense, useCallback, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { useNotifications } from '../hooks/useNotifications';
import { useAppStore } from '../stores/useAppStore';
import { Users, Plus, TrendingUp, CheckCircle, Clock, Settings } from 'lucide-react';

// Componentes UI (importação direta para componentes leves)
import { XPProgress } from '../components/XPProgress';
import { StreakBadge } from '../components/StreakBadge';
import { NotificationBell } from '../components/NotificationBell';
import { BottomNavigation, NavigationView } from '../components/BottomNavigation';
import { TaskPriority, Sector } from '../lib/types';

// Lazy loading para componentes pesados
const Leaderboard = lazy(() => import('../components/Leaderboard'));
const SettingsPage = lazy(() => import('./SettingsPage'));

// Loading placeholder para lazy components
const LoadingPlaceholder: React.FC<{ message?: string }> = ({ message = 'Carregando...' }) => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-2"></div>
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  </div>
);

const ManagerDashboard: React.FC = React.memo(() => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<NavigationView>('dashboard');

  // Memoizar função de navegação para evitar re-renders
  const handleNavigate = useCallback((view: NavigationView) => {
    setCurrentView(view);
  }, []);
  const [showCreateTask, setShowCreateTask] = useState(false);

  if (!user) return null;

  const { createTask, isLoading } = useTasks(user.id);
  const { unreadCount } = useNotifications(user.id);
  const { getUsersByCompany, getTasksByCompany } = useAppStore();

  const teamMembers = getUsersByCompany(user.companyId).filter(
    (u) => u.sector === user.sector && u.id !== user.id
  );
  const allTasks = getTasksByCompany(user.companyId);

  // Task Creation Modal
  const CreateTaskModal = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);

    const handleCreate = async () => {
      if (!title || !assignedTo) return;

      await createTask({
        title,
        description,
        assignedTo,
        priority,
        xpReward: priority === 'high' ? 50 : priority === 'medium' ? 30 : 20,
      });

      setShowCreateTask(false);
      setTitle('');
      setDescription('');
      setAssignedTo('');
      setPriority(TaskPriority.MEDIUM);
    };

    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={() => setShowCreateTask(false)}
      >
        <div
          className="bg-white rounded-3xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold mb-6">Criar Nova Tarefa</h2>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título da Tarefa
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="Ex: Limpar área de serviço"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                placeholder="Descreva os detalhes da tarefa..."
              />
            </div>

            {/* Assign To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Atribuir Para
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
              >
                <option value="">Selecione um funcionário</option>
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} - Nível {member.level}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridade
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`
                      py-3 rounded-xl font-semibold transition-all
                      ${priority === p
                        ? p === 'high'
                          ? 'bg-red-600 text-white'
                          : p === 'medium'
                            ? 'bg-yellow-500 text-white'
                            : 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                      }
                    `}
                  >
                    {p === 'high' ? 'Alta' : p === 'medium' ? 'Média' : 'Baixa'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowCreateTask(false)}
              className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleCreate}
              disabled={!title || !assignedTo || isLoading}
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Criando...' : 'Criar Tarefa'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-6 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Dashboard do Gerente
                </h1>
                <p className="text-gray-600">{user.sector} - {user.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <NotificationBell userId={user.id} />
                <button
                  onClick={() => setCurrentView('settings')}
                  className="relative p-2 bg-white hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0 border border-gray-200 shadow focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label="Configurações"
                  title="Configurações"
                >
                  <Settings className="w-6 h-6 text-gray-800" strokeWidth={2.75} />
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 shadow">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {teamMembers.length}
                    </div>
                    <div className="text-xs text-gray-600">Equipe</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {allTasks.filter((t) => t.status === 'done').length}
                    </div>
                    <div className="text-xs text-gray-600">Concluídas</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {allTasks.filter((t) => t.status === 'pending').length}
                    </div>
                    <div className="text-xs text-gray-600">Pendentes</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {Math.round(
                        teamMembers.reduce((sum, m) => sum + m.xp, 0) /
                        (teamMembers.length || 1)
                      )}
                    </div>
                    <div className="text-xs text-gray-600">XP Médio</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Create Task Button */}
            <button
              onClick={() => setShowCreateTask(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-3 hover:from-blue-700 hover:to-blue-800 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Criar Nova Tarefa
            </button>

            {/* My Progress */}
            <div>
              <h2 className="text-xl font-bold mb-4">Meu Progresso</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <XPProgress userId={user.id} />
                <div className="flex items-center justify-center">
                  <StreakBadge userId={user.id} />
                </div>
              </div>
            </div>

            {/* Team Leaderboard */}
            <div>
              <h2 className="text-xl font-bold mb-4">Ranking da Equipe</h2>
              <Suspense fallback={<LoadingPlaceholder message="Carregando ranking..." />}>
                <Leaderboard
                  companyId={user.companyId}
                  currentUserId={user.id}
                  limit={5}
                  showCurrentUser={false}
                />
              </Suspense>
            </div>
          </div>
        );

      case 'tasks':
        return (
          <div className="space-y-6 pb-24">
            <h1 className="text-2xl font-bold">Gerenciar Tarefas</h1>
            {/* Task management interface */}
          </div>
        );

      case 'leaderboard':
        return (
          <div className="space-y-6 pb-24">
            <Suspense fallback={<LoadingPlaceholder message="Carregando ranking..." />}>
              <Leaderboard
                companyId={user.companyId}
                currentUserId={user.id}
                limit={10}
                showCurrentUser
              />
            </Suspense>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6 pb-24 pt-safe">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Meu Perfil</h1>
            </div>
            <XPProgress userId={user.id} variant="detailed" />
          </div>
        );

      case 'settings':
        return (
          <div className="pb-24 pt-safe">
            <Suspense fallback={<LoadingPlaceholder message="Carregando configurações..." />}>
              <SettingsPage />
            </Suspense>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 safe-area-insets">
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-fade-in">
          {renderView()}
        </div>
      </div>

      {showCreateTask && <CreateTaskModal />}

      <BottomNavigation
        currentView={currentView}
        onNavigate={handleNavigate}
        unreadNotifications={unreadCount}
      />
    </div>
  );
});

ManagerDashboard.displayName = 'ManagerDashboard';

export default ManagerDashboard;
