// ChefIApp™ - Check-In Card Component
// Card de check-in/check-out com bloqueio do dashboard

import React, { useState, useEffect } from 'react';
import { Clock, LogIn, LogOut, MapPin, Loader2 } from 'lucide-react';
import { useCheckin } from '../hooks/useCheckin';
import { formatDuration } from '../lib/utils';

interface CheckInCardProps {
  userId: string;
  showLocation?: boolean;
  onCheckInSuccess?: () => void;
  onCheckOutSuccess?: () => void;
}

export const CheckInCard: React.FC<CheckInCardProps> = ({
  userId,
  showLocation = true,
  onCheckInSuccess,
  onCheckOutSuccess,
}) => {
  const { isActive, isLoading, error, checkIn, checkOut, getCurrentShiftDuration } = useCheckin(userId);

  const [currentDuration, setCurrentDuration] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Update duration every second if active
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCurrentDuration(getCurrentShiftDuration());
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, getCurrentShiftDuration]);

  const handleCheckIn = async () => {
    setIsProcessing(true);
    try {
      await checkIn(showLocation);
      onCheckInSuccess?.();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckOut = async () => {
    setIsProcessing(true);
    try {
      await checkOut();
      onCheckOutSuccess?.();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">
              {isActive ? 'Turno Ativo' : 'Turno Offline'}
            </h3>
            <p className="text-blue-100 text-sm">
              {isActive ? 'Você está trabalhando' : 'Inicie seu turno'}
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        <div
          className={`
            w-3 h-3 rounded-full animate-pulse
            ${isActive ? 'bg-green-400' : 'bg-gray-300'}
          `}
        />
      </div>

      {/* Timer */}
      {isActive && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
          <div className="text-center">
            <div className="text-xs text-blue-100 mb-2">DURAÇÃO DO TURNO</div>
            <div className="text-4xl font-bold font-mono tracking-wider">
              {formatDuration(currentDuration)}
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-300 rounded-xl p-3 mb-4">
          <p className="text-sm text-red-100">{error}</p>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={isActive ? handleCheckOut : handleCheckIn}
        disabled={isLoading || isProcessing}
        className={`
          w-full py-4 rounded-xl font-semibold text-lg
          flex items-center justify-center gap-3
          transition-all disabled:opacity-50 disabled:cursor-not-allowed
          ${isActive
            ? 'bg-white text-blue-600 hover:bg-blue-50'
            : 'bg-green-500 text-white hover:bg-green-600'
          }
        `}
      >
        {isLoading || isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processando...</span>
          </>
        ) : isActive ? (
          <>
            <LogOut className="w-5 h-5" />
            <span>FINALIZAR TURNO</span>
          </>
        ) : (
          <>
            <LogIn className="w-5 h-5" />
            <span>INICIAR TURNO</span>
          </>
        )}
      </button>

      {/* Location Info */}
      {showLocation && !isActive && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-blue-100">
          <MapPin className="w-4 h-4" />
          <span>Com localização para segurança</span>
        </div>
      )}

      {/* Info Text */}
      {!isActive && (
        <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-xl">
          <p className="text-sm text-blue-100 text-center">
            ⚠️ Você precisa iniciar o turno para acessar suas tarefas
          </p>
        </div>
      )}
    </div>
  );
};

export default CheckInCard;
