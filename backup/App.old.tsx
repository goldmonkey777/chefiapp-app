import React, { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import ManagerDashboard from './components/ManagerDashboard';
import Layout from './components/Layout';
import AIChat from './components/AIChat';
import { User, UserRole } from './types';



import { supabase } from './services/supabase';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        // If no profile, we might need to show onboarding/profile creation
        // But Onboarding component now handles profile creation on signup
      } else if (data) {
        setUser(data);
        setIsOnboarding(false);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = (data: any) => {
    // Data now comes from Supabase profile creation in Onboarding
    setUser(data);
    setIsOnboarding(false);
    if (data.role === 'MANAGER') setCurrentView('manager');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session || isOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (!user) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return user.role === UserRole.MANAGER ? <ManagerDashboard user={user} /> : <Dashboard user={user} onNavigate={setCurrentView} />;
      case 'manager':
        return <ManagerDashboard user={user} />;
      case 'tasks':
      case 'leaderboard':
      case 'profile':
        return <Dashboard user={user} onNavigate={setCurrentView} />;
      default:
        return <Dashboard user={user} onNavigate={setCurrentView} />;
    }
  };

  return (
    <Layout
      currentView={currentView}
      onNavigate={setCurrentView}
      userRole={user.role === UserRole.MANAGER ? 'Manager' : 'Employee'}
    >
      {renderView()}
      <AIChat />
    </Layout>
  );
};

export default App;
