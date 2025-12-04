import React from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../components/LanguageSelector';
import { RegionalCompliance } from '../components/RegionalCompliance';
import { Settings, User, Bell, Shield, Info, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

export const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 pt-safe">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 safe-area-top">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Voltar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <Settings className="w-6 h-6" />
          <h1 className="text-2xl font-bold">{t('settings.title') || 'Configurações'}</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Profile Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {t('profile.title')}
            </h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500">{t('profile.name') || 'Nome'}</label>
              <p className="text-sm font-medium text-gray-900">{user?.name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500">{t('profile.email') || 'Email'}</label>
              <p className="text-sm font-medium text-gray-900">{user?.email || 'N/A'}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500">{t('profile.position') || 'Cargo'}</label>
              <p className="text-sm font-medium text-gray-900">
                {user?.role === 'employee' && 'Funcionário'}
                {user?.role === 'manager' && 'Gerente'}
                {user?.role === 'owner' && 'Dono'}
                {!user?.role && 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Language Selection */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('settings.language')}
          </h2>
          <LanguageSelector />
        </div>

        {/* Notifications (placeholder) */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  {t('settings.notifications')}
                </h3>
                <p className="text-xs text-gray-500">
                  {t('common.comingSoon', 'Coming soon')}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer opacity-50">
              <input type="checkbox" disabled className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Privacy & Legal */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {t('settings.privacy')}
            </h2>
          </div>
          <RegionalCompliance />
        </div>

        {/* About */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-3">
            <Info className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {t('settings.about')}
            </h2>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>{t('app.name')}</span>
              <span className="font-semibold">ChefIApp™</span>
            </div>
            <div className="flex justify-between">
              <span>{t('settings.version')}</span>
              <span className="font-mono text-xs">1.0.0</span>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                {t('app.tagline')}
              </p>
            </div>
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg border-2 border-red-200 hover:bg-red-100 hover:border-red-300 transition-all font-semibold"
        >
          <LogOut className="w-5 h-5" />
          {t('auth.signOut')}
        </button>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 py-4">
          <p>© 2024 ChefIApp™. All rights reserved.</p>
          <p className="mt-1">Made with ❤️ for the hospitality industry</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
