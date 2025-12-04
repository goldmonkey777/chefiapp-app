// ChefIApp™ - Owner Dashboard
// Dashboard do dono com visão completa da empresa (Optimized)

import React, { useState, lazy, Suspense, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCompany } from '../hooks/useCompany';
import { useNotifications } from '../hooks/useNotifications';
import { useAppStore } from '../stores/useAppStore';
import { Building, Users, TrendingUp, Award, QrCode as QrCodeIcon, Plus, Calendar, Settings } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { Task, Shift } from '../lib/types';

// Componentes UI (importação direta para componentes leves)
import { QRCodeGenerator } from '../components/QRCodeGenerator';
import { NotificationBell } from '../components/NotificationBell';
import { BottomNavigation, NavigationView } from '../components/BottomNavigation';
import { TaskList } from '../components/TaskManagement/TaskList';
import { TaskForm } from '../components/TaskManagement/TaskForm';
import { ShiftCalendar } from '../components/ShiftManagement/ShiftCalendar';
import { ShiftForm } from '../components/ShiftManagement/ShiftForm';

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

const OwnerDashboard: React.FC = React.memo(() => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<NavigationView>('dashboard');

  // Memoizar função de navegação para evitar re-renders
  const handleNavigate = useCallback((view: NavigationView) => {
    setCurrentView(view);
  }, []);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);

  if (!user) return null;

  const { company, employees, activeEmployees, getEmployeeStats } = useCompany(user.id);
  const { unreadCount } = useNotifications(user.id);
  const { getTasksByCompany, getLeaderboard } = useAppStore();

  const {
    tasks: allTasks,
    createTask,
    updateTask,
    deleteTask,
    isLoading: tasksLoading
  } = useTasks(user.id);

  const { getShiftsByCompany, removeShift } = useAppStore();
  const allShifts = company ? getShiftsByCompany(company.id) : [];

  const stats = getEmployeeStats();

  const completedTasks = allTasks.filter((t) => t.status === 'done');
  const totalXP = employees.reduce((sum, e) => sum + e.xp, 0);
  const avgLevel = employees.length > 0
    ? (employees.reduce((sum, e) => sum + e.level, 0) / employees.length).toFixed(1)
    : '0';

  const handleSaveTask = async (data: any) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await createTask(data);
    }
    setShowTaskModal(false);
    setEditingTask(undefined);
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
  };

  const handleSaveShift = () => {
    setShowShiftModal(false);
    setEditingShift(undefined);
    setSelectedDate(undefined);
  };

  const handleDeleteShift = (shiftId: string) => {
    removeShift(shiftId);
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
                  Dashboard do Proprietário
                </h1>
                {company && (
                  <p className="text-gray-600">{company.name}</p>
                )}
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

            {/* Company Card */}
            {company && (
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Building className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{company.name}</h2>
                      <p className="text-blue-100 capitalize">
                        {company.type.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowQRCode(true)}
                    className="p-3 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-colors"
                  >
                    <QrCodeIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <div className="text-3xl font-bold">{stats.total}</div>
                    <div className="text-sm text-blue-100">Funcionários</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <div className="text-3xl font-bold text-green-300">
                      {stats.active}
                    </div>
                    <div className="text-sm text-blue-100">Ativos Agora</div>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 shadow">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {completedTasks.length}
                    </div>
                    <div className="text-xs text-gray-600">Tarefas Concluídas</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Award className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {totalXP.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">XP Total</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {avgLevel}
                    </div>
                    <div className="text-xs text-gray-600">Nível Médio</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {allTasks.filter((t) => t.status === 'pending').length}
                    </div>
                    <div className="text-xs text-gray-600">Pendentes</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Leaderboard */}
            <div>
              <h2 className="text-xl font-bold mb-4">Top Performers</h2>
              <Suspense fallback={<LoadingPlaceholder message="Carregando ranking..." />}>
                <Leaderboard
                  companyId={company!.id}
                  limit={10}
                  showCurrentUser={false}
                />
              </Suspense>
            </div>

            {/* Employee List */}
            <div>
              <h2 className="text-xl font-bold mb-4">
                Todos os Funcionários ({employees.length})
              </h2>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Nome
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Setor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Nível
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          XP
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {employees.map((employee) => (
                        <tr key={employee.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              {employee.profilePhoto ? (
                                <img
                                  src={employee.profilePhoto}
                                  alt={employee.name}
                                  className="w-8 h-8 rounded-full"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                                  {employee.name.charAt(0)}
                                </div>
                              )}
                              <span className="font-medium text-gray-900">
                                {employee.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap capitalize text-sm text-gray-600">
                            {employee.sector}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {employee.level}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                            {employee.xp.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`
                                px-2 py-1 rounded-full text-xs font-medium
                                ${employee.shiftStatus === 'active'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                                }
                              `}
                            >
                              {employee.shiftStatus === 'active' ? 'Ativo' : 'Offline'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

      case 'tasks':
        return (
          <div className="space-y-6 pb-24">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Gerenciar Tarefas</h1>
              <button
                onClick={() => {
                  setEditingTask(undefined);
                  setShowTaskModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition shadow-lg shadow-blue-200"
              >
                <Plus size={20} />
                Nova Tarefa
              </button>
            </div>

            <TaskList
              tasks={allTasks}
              employees={employees}
              onEdit={(task) => {
                setEditingTask(task);
                setShowTaskModal(true);
              }}
              onDelete={handleDeleteTask}
              isLoading={tasksLoading}
            />
          </div>
        );

      case 'leaderboard':
        return (
          <div className="space-y-6 pb-24">
            <Suspense fallback={<LoadingPlaceholder message="Carregando ranking..." />}>
              <Leaderboard
                companyId={company!.id}
                limit={20}
                showCurrentUser={false}
              />
            </Suspense>
          </div>
        );

      case 'schedule':
        return (
          <div className="space-y-6 pb-24">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Escala de Turnos</h1>
            </div>

            <ShiftCalendar
              shifts={allShifts}
              employees={employees}
              onAddShift={(date) => {
                setSelectedDate(date);
                setEditingShift(undefined);
                setShowShiftModal(true);
              }}
              onEditShift={(shift) => {
                setEditingShift(shift);
                setShowShiftModal(true);
              }}
              onDeleteShift={handleDeleteShift}
            />
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6 pb-24 pt-safe">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Meu Perfil</h1>
            </div>
            {/* Owner profile content */}
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
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-fade-in">
          {renderView()}
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRCode && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowQRCode(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <QRCodeGenerator userId={user.id} size={300} />
          </div>
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <TaskForm
              task={editingTask}
              onSave={handleSaveTask}
              onCancel={() => {
                setShowTaskModal(false);
                setEditingTask(undefined);
              }}
              isLoading={tasksLoading}
            />
          </div>
        </div>
      )}

      {/* Shift Modal */}
      {showShiftModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <ShiftForm
              shift={editingShift}
              selectedDate={selectedDate}
              onSave={handleSaveShift}
              onCancel={() => {
                setShowShiftModal(false);
                setEditingShift(undefined);
                setSelectedDate(undefined);
              }}
            />
          </div>
        </div>
      )}

      <BottomNavigation
        currentView={currentView}
        onNavigate={handleNavigate}
        unreadNotifications={unreadCount}
      />
    </div>
  );
});

OwnerDashboard.displayName = 'OwnerDashboard';

export default OwnerDashboard;
