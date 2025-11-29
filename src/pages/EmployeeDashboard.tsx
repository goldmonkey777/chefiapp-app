// ChefIApp™ - Employee Dashboard
// Dashboard completo do funcionário com todos os componentes

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { useNotifications } from '../hooks/useNotifications';
import { useCheckin } from '../hooks/useCheckin';

// Componentes UI
import { CheckInCard } from '../components/CheckInCard';
import { XPProgress } from '../components/XPProgress';
import { StreakBadge } from '../components/StreakBadge';
import { TaskCard } from '../components/TaskCard';
import { Leaderboard } from '../components/Leaderboard';
import { AchievementGrid } from '../components/AchievementGrid';
import { NotificationBell } from '../components/NotificationBell';
import { BottomNavigation, NavigationView } from '../components/BottomNavigation';

import { getGreeting } from '../lib/utils';

export const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<NavigationView>('dashboard');

  if (!user) return null;

  const {
    pendingTasks,
    inProgressTasks,
    completedTasks,
    startTask,
    completeTask,
    canStartTask,
    isLoading: tasksLoading,
  } = useTasks(user.id);

  const { unreadCount } = useNotifications(user.id);
  const { isActive } = useCheckin(user.id);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-6 pb-24 pt-safe">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {getGreeting()}, {user.name}! 👋
                </h1>
                <p className="text-gray-600">Seja bem-vindo de volta</p>
              </div>
              <NotificationBell userId={user.id} />
            </div>

            {/* Check-in Card */}
            <CheckInCard
              userId={user.id}
              showLocation
              onCheckInSuccess={() => {
                // Refresh tasks or show success message
              }}
            />

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <XPProgress userId={user.id} />
              <div className="flex items-center justify-center">
                <StreakBadge userId={user.id} />
              </div>
            </div>

            {/* Tasks Section */}
            {isActive ? (
              <div>
                {/* In Progress Tasks */}
                {inProgressTasks.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <span className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></span>
                      Em Andamento
                    </h2>
                    <div className="space-y-4">
                      {inProgressTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onComplete={completeTask}
                          isLoading={tasksLoading}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Pending Tasks */}
                <div>
                  <h2 className="text-xl font-bold mb-4">
                    Suas Tarefas ({pendingTasks.length})
                  </h2>
                  {pendingTasks.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                      <div className="text-6xl mb-4">🎉</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Parabéns!
                      </h3>
                      <p className="text-gray-600">
                        Você não tem tarefas pendentes
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingTasks.map((task) => {
                        const validation = canStartTask(task.id);
                        return (
                          <TaskCard
                            key={task.id}
                            task={task}
                            onStart={startTask}
                            canStart={validation.canStart}
                            canStartReason={validation.reason}
                            isLoading={tasksLoading}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Team Ranking Preview */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-bold text-gray-900">Ranking da Equipe</h2>
                    <button
                      onClick={() => setCurrentView('leaderboard')}
                      className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors"
                    >
                      Ver Todos →
                    </button>
                  </div>
                  <Leaderboard
                    companyId={user.companyId}
                    currentUserId={user.id}
                    limit={3}
                    showCurrentUser={false}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-8 text-center">
                <div className="text-5xl mb-4">🔒</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Dashboard Bloqueado
                </h3>
                <p className="text-gray-600">
                  Inicie seu turno acima para acessar suas tarefas
                </p>
              </div>
            )}
          </div>
        );

      case 'tasks':
        return (
          <div className="space-y-6 pb-24 pt-safe">
            <h1 className="text-2xl font-bold text-gray-900">Todas as Tarefas</h1>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium whitespace-nowrap">
                Pendentes ({pendingTasks.length})
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium whitespace-nowrap">
                Em Progresso ({inProgressTasks.length})
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium whitespace-nowrap">
                Concluídas ({completedTasks.length})
              </button>
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
              {[...pendingTasks, ...inProgressTasks, ...completedTasks].map((task) => {
                const validation = canStartTask(task.id);
                return (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStart={startTask}
                    onComplete={completeTask}
                    canStart={validation.canStart}
                    canStartReason={validation.reason}
                    isLoading={tasksLoading}
                  />
                );
              })}
            </div>
          </div>
        );

      case 'leaderboard':
        return (
          <div className="space-y-6 pb-24 pt-safe">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Ranking 🏆
              </h1>
              <p className="text-gray-600">
                Veja como você se compara com seus colegas
              </p>
            </div>

            <Leaderboard
              companyId={user.companyId}
              currentUserId={user.id}
              limit={10}
              showCurrentUser
            />
          </div>
        );

      case 'achievements':
        return (
          <div className="space-y-6 pb-24 pt-safe">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Conquistas 🎯
              </h1>
              <p className="text-gray-600">
                Desbloqueie conquistas completando desafios
              </p>
            </div>

            <AchievementGrid userId={user.id} />
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6 pb-24 pt-safe">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Meu Perfil
              </h1>
            </div>

            {/* Profile Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              {user.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={user.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-blue-500"
                />
              ) : (
                <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-blue-500">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {user.name}
              </h2>
              <p className="text-gray-600 capitalize mb-4">{user.sector}</p>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium">
                {user.role === 'employee' && '👤 Funcionário'}
                {user.role === 'manager' && '👔 Gerente'}
                {user.role === 'owner' && '👑 Dono'}
              </div>
            </div>

            {/* XP Progress - Detailed */}
            <XPProgress userId={user.id} variant="detailed" />

            {/* Streak - Large */}
            <StreakBadge userId={user.id} variant="large" />

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 shadow text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {completedTasks.length}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Tarefas Concluídas
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow text-center">
                <div className="text-3xl font-bold text-green-600">
                  {inProgressTasks.length}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Em Andamento
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 safe-area-insets">
      <div className="max-w-full sm:max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {renderView()}
      </div>

      <BottomNavigation
        currentView={currentView}
        onNavigate={setCurrentView}
        unreadNotifications={unreadCount}
      />
    </div>
  );
};

export default EmployeeDashboard;
