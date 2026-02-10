
export interface Mission {
  id: string;
  text: string;
  completed: boolean;
}

export interface DayState {
  date: string; // ISO String (YYYY-MM-DD)
  missions: Mission[];
  isFullyCompleted: boolean;
}

export interface UserStats {
  streak: number;
  maxStreak: number;
  totalMissionsCompleted: number;
  history: DayState[];
}

export enum AppMode {
  DASHBOARD = 'DASHBOARD',
  STATS = 'STATS',
  SETTINGS = 'SETTINGS'
}

// Added global declaration to resolve TS2339: Property 'confetti' does not exist on type 'Window'.
declare global {
  interface Window {
    confetti?: (options?: {
      particleCount?: number;
      spread?: number;
      origin?: { x?: number; y?: number };
      colors?: string[];
      [key: string]: any;
    }) => void;
  }
}
