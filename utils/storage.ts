
import { UserStats, DayState } from '../types';

const STORAGE_KEY = '3M_USER_STATS';

export const getTodayDateString = () => new Date().toISOString().split('T')[0];

export const loadStats = (): UserStats => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    streak: 0,
    maxStreak: 0,
    totalMissionsCompleted: 0,
    history: []
  };
};

export const saveStats = (stats: UserStats) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
};

export const getDayState = (stats: UserStats, date: string): DayState | undefined => {
  return stats.history.find(d => d.date === date);
};
