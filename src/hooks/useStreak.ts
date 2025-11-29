// ChefIApp™ - useStreak Hook
// Consecutive days tracking system

import { useAppStore } from '../stores/useAppStore';

export interface UseStreakReturn {
  streak: number;
  isOnFire: boolean; // 3+ days
  isBlazing: boolean; // 7+ days
  isLegendary: boolean; // 30+ days
  getStreakEmoji: () => string;
  getStreakMessage: () => string;
}

export function useStreak(userId: string): UseStreakReturn {
  const { getUserById, getStreakState } = useAppStore();

  const user = getUserById(userId);
  const streak = user?.streak || 0;
  const streakState = getStreakState(streak);

  // Get appropriate emoji based on streak
  const getStreakEmoji = (): string => {
    if (streakState.isLegendary) return '🏆';
    if (streakState.isBlazing) return '🔥🔥🔥';
    if (streakState.isOnFire) return '🔥🔥';
    if (streak > 0) return '🔥';
    return '⚪';
  };

  // Get motivational message based on streak
  const getStreakMessage = (): string => {
    if (streakState.isLegendary) {
      return `${streak} dias - LENDÁRIO! 🏆`;
    }
    if (streakState.isBlazing) {
      return `${streak} dias - Em Chamas! 🔥`;
    }
    if (streakState.isOnFire) {
      return `${streak} dias - Pegando Fogo! 🔥`;
    }
    if (streak > 0) {
      return `${streak} dias consecutivos`;
    }
    return 'Inicie sua sequência!';
  };

  return {
    streak,
    isOnFire: streakState.isOnFire,
    isBlazing: streakState.isBlazing,
    isLegendary: streakState.isLegendary,
    getStreakEmoji,
    getStreakMessage,
  };
}
