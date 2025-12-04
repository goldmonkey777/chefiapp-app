// ChefIApp™ - Bottom Navigation Component
// Navegação inferior para mobile

import React from 'react';
import { Home, ListChecks, Trophy, Award, User, Calendar, Settings } from 'lucide-react';

export type NavigationView = 'dashboard' | 'tasks' | 'schedule' | 'leaderboard' | 'achievements' | 'profile' | 'settings';

interface BottomNavigationProps {
  currentView: NavigationView;
  onNavigate: (view: NavigationView) => void;
  unreadNotifications?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = React.memo(({
  currentView,
  onNavigate,
  unreadNotifications = 0,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavigationView,
      label: 'Início',
      icon: Home,
    },
    {
      id: 'tasks' as NavigationView,
      label: 'Tarefas',
      icon: ListChecks,
    },
    {
      id: 'schedule' as NavigationView,
      label: 'Escala',
      icon: Calendar,
    },
    {
      id: 'leaderboard' as NavigationView,
      label: 'Ranking',
      icon: Trophy,
    },
    {
      id: 'achievements' as NavigationView,
      label: 'Conquistas',
      icon: Award,
    },
    {
      id: 'profile' as NavigationView,
      label: 'Perfil',
      icon: User,
      badge: unreadNotifications,
    },
    {
      id: 'settings' as NavigationView,
      label: 'Config',
      icon: Settings,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 safe-area-bottom">
      <div className="max-w-screen-xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  relative flex flex-col items-center gap-1 py-2 sm:py-3 px-2 sm:px-4 min-w-[50px] sm:min-w-[60px]
                  transition-all duration-200 active:scale-95
                  ${isActive
                    ? 'text-blue-600'
                    : 'text-gray-500 active:text-gray-700'
                  }
                `}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-full" />
                )}

                {/* Icon */}
                <div className="relative">
                  <Icon
                    className={`
                      w-6 h-6 transition-all
                      ${isActive ? 'scale-110' : 'scale-100'}
                    `}
                  />

                  {/* Badge */}
                  {item.badge && item.badge > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge > 9 ? '9+' : item.badge}
                    </div>
                  )}
                </div>

                {/* Label */}
                <span
                  className={`
                    text-[10px] sm:text-xs font-medium transition-all
                    ${isActive ? 'font-semibold' : 'font-normal'}
                  `}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
});

BottomNavigation.displayName = 'BottomNavigation';

export default BottomNavigation;
