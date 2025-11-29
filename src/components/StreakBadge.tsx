// ChefIApp™ - Streak Badge Component
// Badge de streak (dias consecutivos)

import React from 'react';
import { Flame } from 'lucide-react';
import { useStreak } from '../hooks/useStreak';

interface StreakBadgeProps {
  userId: string;
  variant?: 'default' | 'large' | 'minimal';
  showMessage?: boolean;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({
  userId,
  variant = 'default',
  showMessage = true,
}) => {
  const { streak, isOnFire, isBlazing, isLegendary, getStreakEmoji, getStreakMessage } = useStreak(userId);

  const getGradient = () => {
    if (isLegendary) return 'from-purple-500 to-purple-600';
    if (isBlazing) return 'from-orange-500 to-red-600';
    if (isOnFire) return 'from-orange-400 to-orange-500';
    return 'from-gray-400 to-gray-500';
  };

  const getBorderColor = () => {
    if (isLegendary) return 'border-purple-300';
    if (isBlazing) return 'border-orange-300';
    if (isOnFire) return 'border-orange-200';
    return 'border-gray-300';
  };

  if (variant === 'minimal') {
    return (
      <div className="flex items-center gap-2">
        <span className="text-2xl">{getStreakEmoji()}</span>
        <span className="font-bold text-gray-900">{streak}</span>
      </div>
    );
  }

  if (variant === 'large') {
    return (
      <div className={`bg-gradient-to-br ${getGradient()} rounded-2xl p-6 text-white border-2 ${getBorderColor()}`}>
        {/* Emoji */}
        <div className="text-center mb-4">
          <div className="text-6xl mb-2">{getStreakEmoji()}</div>
          {isLegendary && (
            <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
              <Flame className="w-4 h-4" />
              <span>LENDÁRIO!</span>
            </div>
          )}
          {isBlazing && !isLegendary && (
            <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
              <Flame className="w-4 h-4" />
              <span>EM CHAMAS!</span>
            </div>
          )}
          {isOnFire && !isBlazing && (
            <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
              <Flame className="w-4 h-4" />
              <span>PEGANDO FOGO!</span>
            </div>
          )}
        </div>

        {/* Streak Number */}
        <div className="text-center">
          <div className="text-5xl font-bold mb-2">{streak}</div>
          <div className="text-white/90 text-lg">
            {streak === 1 ? 'dia consecutivo' : 'dias consecutivos'}
          </div>
        </div>

        {/* Message */}
        {showMessage && streak > 0 && (
          <div className="mt-4 text-center text-sm text-white/80">
            Continue assim! Não quebre sua sequência!
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={`
        inline-flex items-center gap-3 px-4 py-2 rounded-xl border-2
        bg-gradient-to-br ${getGradient()} ${getBorderColor()}
        text-white shadow-lg
      `}
    >
      {/* Emoji */}
      <span className="text-2xl">{getStreakEmoji()}</span>

      {/* Streak Info */}
      <div>
        <div className="font-bold text-lg">{streak}</div>
        {showMessage && (
          <div className="text-xs text-white/90">
            {streak === 1 ? 'dia' : 'dias'}
          </div>
        )}
      </div>

      {/* Status Badge */}
      {(isOnFire || isBlazing || isLegendary) && (
        <div className="ml-2 flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
          <Flame className="w-3 h-3" />
          <span className="text-xs font-medium">
            {isLegendary ? 'LENDÁRIO' : isBlazing ? 'CHAMAS' : 'FOGO'}
          </span>
        </div>
      )}
    </div>
  );
};

export default StreakBadge;
