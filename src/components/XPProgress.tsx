// ChefIApp™ - XP Progress Component
// Barra de progresso de XP e nível

import React from 'react';
import { Zap, TrendingUp, Star } from 'lucide-react';
import { useXP } from '../hooks/useXP';

interface XPProgressProps {
  userId: string;
  variant?: 'default' | 'compact' | 'detailed';
  showLevel?: boolean;
  showNextLevel?: boolean;
}

export const XPProgress: React.FC<XPProgressProps> = ({
  userId,
  variant = 'default',
  showLevel = true,
  showNextLevel = true,
}) => {
  const { xp, level, progress, getXPForNextLevel } = useXP(userId);

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3">
        {/* Level Badge */}
        {showLevel && (
          <div className="flex items-center gap-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full">
            <Star className="w-4 h-4" />
            <span className="font-bold text-sm">Nv. {level}</span>
          </div>
        )}

        {/* Progress Bar */}
        <div className="flex-1 relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* XP Text */}
        <span className="text-sm font-semibold text-gray-600">
          {xp.toLocaleString()} XP
        </span>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">Experiência</h3>
              <p className="text-sm text-gray-600">Continue ganhando XP!</p>
            </div>
          </div>
          <TrendingUp className="w-6 h-6 text-green-500" />
        </div>

        {/* Level Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Nível {level}</span>
          </div>
          {showNextLevel && (
            <div className="text-right">
              <div className="text-xs text-gray-500">Próximo Nível</div>
              <div className="text-sm font-semibold text-gray-700">
                {getXPForNextLevel()} XP restantes
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="relative h-4 bg-white rounded-full overflow-hidden shadow-inner">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 rounded-full flex items-center justify-end pr-2"
            style={{ width: `${progress}%` }}
          >
            {progress > 20 && (
              <span className="text-xs font-bold text-white">{progress}%</span>
            )}
          </div>
        </div>

        {/* XP Details */}
        <div className="flex items-center justify-between mt-3 text-sm">
          <span className="text-gray-600">XP Total:</span>
          <span className="font-bold text-blue-600">{xp.toLocaleString()}</span>
        </div>

        {/* Milestone Badges */}
        <div className="mt-4 flex gap-2">
          {[100, 500, 1000, 5000].map((milestone) => (
            <div
              key={milestone}
              className={`
                flex-1 text-center py-2 rounded-lg text-xs font-medium transition-all
                ${xp >= milestone
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-400'
                }
              `}
            >
              {milestone >= 1000 ? `${milestone / 1000}K` : milestone}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      {/* Level and XP */}
      <div className="flex items-center justify-between mb-3">
        {showLevel && (
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
              <Star className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Nível</div>
              <div className="text-lg font-bold text-gray-900">{level}</div>
            </div>
          </div>
        )}

        <div className="text-right">
          <div className="text-xs text-gray-500">XP Total</div>
          <div className="text-lg font-bold text-blue-600">
            {xp.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Next Level Info */}
      {showNextLevel && (
        <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
          <span>{progress}% para o próximo nível</span>
          <span>{getXPForNextLevel()} XP restantes</span>
        </div>
      )}
    </div>
  );
};

export default XPProgress;
