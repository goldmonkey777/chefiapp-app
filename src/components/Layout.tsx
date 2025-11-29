import React from 'react';
import { Home, ClipboardList, Trophy, User, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
  userRole: string;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, userRole }) => {
  const isManager = userRole === 'Manager';

  const NavItem = ({ view, icon: Icon, label }: { view: string, icon: any, label: string }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => onNavigate(view)}
        className={`flex flex-col items-center justify-center space-y-1 w-full ${isActive ? 'text-primary' : 'text-gray-400'}`}
      >
        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
        <span className="text-[10px] font-medium">{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-md bg-surface min-h-screen shadow-2xl relative">
        <main className="min-h-screen bg-background">
          {children}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-40 pb-safe">
          <NavItem view="dashboard" icon={Home} label="Home" />
          <NavItem view="tasks" icon={ClipboardList} label="Tasks" />
          {isManager && <NavItem view="manager" icon={Settings} label="Admin" />}
          <NavItem view="leaderboard" icon={Trophy} label="Rank" />
          <NavItem view="profile" icon={User} label="Profile" />
        </nav>
      </div>
    </div>
  );
};

export default Layout;
