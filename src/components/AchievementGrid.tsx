// ChefIApp™ - Achievement Grid Component
// Grid de conquistas desbloqueadas e bloqueadas

import React, { useState } from 'react';
import { Award, Lock, Sparkles, X } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';
import { Achievement } from '../lib/types';
import { formatRelativeTime } from '../lib/utils';

interface AchievementGridProps {
  userId: string;
}

export const AchievementGrid: React.FC<AchievementGridProps> = ({ userId }) => {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const { achievements, getUserAchievements } = useAppStore();

  const userAchievements = getUserAchievements(userId);

  const isUnlocked = (achievementId: string) => {
    return userAchievements.some(ua => ua.achievementId === achievementId);
  };

  const getUnlockedAt = (achievementId: string) => {
    const ua = userAchievements.find(ua => ua.achievementId === achievementId);
    return ua?.unlockedAt;
  };

  const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
    const unlocked = isUnlocked(achievement.id);
    const unlockedAt = getUnlockedAt(achievement.id);

    return (
      <button
        onClick={() => setSelectedAchievement(achievement)}
        className={`
          relative p-6 rounded-2xl border-2 transition-all text-left
          ${unlocked
            ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 hover:shadow-lg hover:-translate-y-1'
            : 'bg-gray-50 border-gray-200 opacity-60 hover:opacity-80'
          }
        `}
      >
        {/* Unlocked Badge */}
        {unlocked && (
          <div className="absolute top-2 right-2">
            <div className="bg-green-500 rounded-full p-1">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>
        )}

        {/* Icon */}
        <div className="mb-4">
          {unlocked ? (
            <div className="text-5xl">{achievement.icon}</div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
              <Lock className="w-8 h-8 text-gray-500" />
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className={`font-bold text-lg mb-2 ${unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
          {unlocked ? achievement.name : '???'}
        </h3>

        {/* XP */}
        <div className="flex items-center gap-2">
          <Award className={`w-4 h-4 ${unlocked ? 'text-blue-600' : 'text-gray-400'}`} />
          <span className={`text-sm font-semibold ${unlocked ? 'text-blue-600' : 'text-gray-400'}`}>
            +{achievement.xp} XP
          </span>
        </div>

        {/* Unlocked Date */}
        {unlocked && unlockedAt && (
          <div className="mt-3 text-xs text-gray-500">
            {formatRelativeTime(unlockedAt)}
          </div>
        )}
      </button>
    );
  };

  // Modal for achievement details
  const AchievementModal = () => {
    if (!selectedAchievement) return null;

    const unlocked = isUnlocked(selectedAchievement.id);
    const unlockedAt = getUnlockedAt(selectedAchievement.id);

    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={() => setSelectedAchievement(null)}
      >
        <div
          className="bg-white rounded-3xl max-w-md w-full p-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedAchievement(null)}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Icon */}
          <div className="text-center mb-6">
            {unlocked ? (
              <div className="text-8xl mb-4">{selectedAchievement.icon}</div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-12 h-12 text-gray-500" />
              </div>
            )}

            {unlocked && (
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Desbloqueada!
              </div>
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-3">
            {unlocked ? selectedAchievement.name : 'Conquista Bloqueada'}
          </h2>

          {/* Description */}
          <p className="text-center text-gray-600 mb-6">
            {unlocked ? selectedAchievement.description : 'Continue progredindo para desbloquear esta conquista!'}
          </p>

          {/* XP Reward */}
          <div className="bg-blue-50 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-center gap-3">
              <Award className="w-6 h-6 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">
                +{selectedAchievement.xp} XP
              </span>
            </div>
          </div>

          {/* Unlock Info */}
          {unlocked && unlockedAt && (
            <div className="text-center text-sm text-gray-500">
              Desbloqueada {formatRelativeTime(unlockedAt)}
            </div>
          )}

          {!unlocked && (
            <div className="text-center">
              <button
                onClick={() => setSelectedAchievement(null)}
                className="bg-gray-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
              >
                Continuar Progredindo
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Stats
  const unlockedCount = userAchievements.length;
  const totalCount = achievements.length;
  const progress = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Conquistas</h2>
            <p className="text-sm text-gray-500">
              {unlockedCount} de {totalCount} desbloqueadas
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-right mt-2">
          <span className="text-sm font-semibold text-purple-600">{progress}% completo</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {achievements.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma conquista disponível</p>
          </div>
        ) : (
          achievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))
        )}
      </div>

      {/* Modal */}
      <AchievementModal />
    </div>
  );
};

export default AchievementGrid;
