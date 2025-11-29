// ChefIApp™ - Onboarding Join Company Screen
// Handles QR code scanning or invite code

import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { QRCodeScanner } from '../QRCodeScanner';
import { supabase } from '../../lib/supabase';

interface OnboardingJoinProps {
  user: any;
  onComplete: (profile: any) => void;
  onBack: () => void;
}

export const OnboardingJoin: React.FC<OnboardingJoinProps> = ({ user, onComplete, onBack }) => {
  const [method, setMethod] = useState<'qr' | 'code'>('qr');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  // ✅ CORREÇÃO 4: Implementar código de convite
  const handleJoinViaCode = async () => {
    if (!inviteCode.trim()) {
      setError('Digite um código de convite');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔍 [OnboardingJoin] Buscando empresa com código:', inviteCode.toUpperCase());

      // Buscar empresa pelo invite_code
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('id, name')
        .eq('invite_code', inviteCode.toUpperCase())
        .single();

      if (companyError || !company) {
        console.error('❌ [OnboardingJoin] Empresa não encontrada:', companyError);
        throw new Error('Código de convite inválido. Verifique e tente novamente.');
      }

      console.log('✅ [OnboardingJoin] Empresa encontrada:', company.name);

      // Atualizar profile com company
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          company_id: company.id,
          role: 'STAFF'  // Funcionário padrão ao entrar via código
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('❌ [OnboardingJoin] Erro ao atualizar profile:', updateError);
        throw updateError;
      }

      console.log('✅ [OnboardingJoin] Profile atualizado');

      // Buscar profile atualizado
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        console.error('❌ [OnboardingJoin] Erro ao buscar profile:', fetchError);
        throw fetchError;
      }

      console.log('✅ [OnboardingJoin] Entrou na empresa:', company.name);
      onComplete(profile);
    } catch (err: any) {
      console.error('❌ [OnboardingJoin] Erro:', err);
      setError(err.message || 'Erro ao entrar na empresa');
    } finally {
      setLoading(false);
    }
  };

  const handleQRScan = async (companyId: string) => {
    setShowScanner(false);
    setLoading(true);
    setError(null);

    try {
      // Update user profile with company
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ company_id: companyId, role: 'EMPLOYEE' })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Fetch updated profile
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError) throw fetchError;

      onComplete(profile);
    } catch (err: any) {
      setError(err.message || 'Erro ao entrar na empresa');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full border border-white/20">
        <button
          onClick={onBack}
          className="text-blue-200 hover:text-white mb-6 flex items-center gap-2"
        >
          ← Voltar
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Entrar em uma Empresa
          </h2>
          <p className="text-blue-100">
            Escaneie o QR code ou digite o código de convite
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-400 text-red-100 p-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Method Selector */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMethod('qr')}
            className={`flex-1 py-3 rounded-xl font-semibold transition ${
              method === 'qr'
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-blue-200 hover:bg-white/20'
            }`}
          >
            QR Code
          </button>
          <button
            onClick={() => setMethod('code')}
            className={`flex-1 py-3 rounded-xl font-semibold transition ${
              method === 'code'
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-blue-200 hover:bg-white/20'
            }`}
          >
            Código
          </button>
        </div>

        {/* Method Content */}
        {method === 'qr' ? (
          <div>
            <button
              onClick={() => setShowScanner(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition flex items-center justify-center gap-3 mb-4"
            >
              <Camera size={24} />
              Escanear QR Code
            </button>
            <p className="text-sm text-blue-200 text-center">
              Peça para o gerente ou dono mostrar o QR code da empresa
            </p>
          </div>
        ) : (
          <div>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="Digite o código de convite"
              className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-blue-300/70 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <button
              onClick={handleJoinViaCode}
              disabled={loading || !inviteCode.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar na Empresa'}
            </button>
          </div>
        )}
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <QRCodeScanner
            onScanSuccess={handleQRScan}
            onClose={() => setShowScanner(false)}
          />
        </div>
      )}
    </div>
  );
};

export default OnboardingJoin;
