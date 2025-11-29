// ChefIApp™ - useXP Hook
// XP and Level Management System

import { useAppStore } from '../stores/useAppStore';
import { calculateLevel, calculateNextLevelXP } from '../lib/utils';

export interface UseXPReturn {
  xp: number;
  level: number;
  nextLevelXP: number;
  progress: number; // 0-100
  addXP: (amount: number, reason: string) => void;
  getXPForNextLevel: () => number;
  getLevelProgress: () => number;
}

export function useXP(userId: string): UseXPReturn {
  const { getUserById, addXP: storeAddXP } = useAppStore();

  const user = getUserById(userId);
  const xp = user?.xp ?? 0;
  const level = user?.level ?? 1;
  const nextLevelXP = calculateNextLevelXP(level);

  // Calculate progress percentage to next level
  const getLevelProgress = (): number => {
    const currentLevelXP = level * 100;
    const xpInCurrentLevel = Math.max(0, xp - currentLevelXP);
    const xpNeededForNextLevel = 100;

    if (xpNeededForNextLevel === 0) return 0;

    return Math.min(
      Math.floor((xpInCurrentLevel / xpNeededForNextLevel) * 100),
      100
    );
  };

  // Get XP needed for next level
  const getXPForNextLevel = (): number => {
    const currentLevelXP = level * 100;
    const xpNeeded = nextLevelXP - (xp - currentLevelXP);
    return Math.max(0, xpNeeded);
  };

  // Add XP to user
  const addXP = (amount: number, reason: string) => {
    storeAddXP(userId, amount, reason);
  };

  return {
    xp,
    level,
    nextLevelXP,
    progress: getLevelProgress(),
    addXP,
    getXPForNextLevel,
    getLevelProgress,
  };
}
