
import React, { useState, useEffect, useCallback } from 'react';
import { AppMode, UserStats, DayState, Mission } from './types';
import { loadStats, saveStats, getTodayDateString, getDayState } from './utils/storage';
import Dashboard from './components/Dashboard';
import Stats from './components/Stats';
import Header from './components/Header';
import { getMotivationalBoost } from './services/gemini';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.DASHBOARD);
  const [stats, setStats] = useState<UserStats>(loadStats());
  const [motivation, setMotivation] = useState<string>('La discipline est la clé.');
  const [isLoadingMotivation, setIsLoadingMotivation] = useState(false);

  const today = getTodayDateString();

  // Handle day changes and streak resets
  useEffect(() => {
    const checkDateAndStreak = () => {
      const lastDay = stats.history.length > 0 ? stats.history[stats.history.length - 1] : null;
      
      if (lastDay && lastDay.date !== today) {
        // Check if yesterday was completed
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        const wasYesterdayCompleted = stats.history.find(h => h.date === yesterdayStr)?.isFullyCompleted;
        
        if (!wasYesterdayCompleted && lastDay.date !== yesterdayStr) {
           // We missed at least one full day including yesterday
           setStats(prev => ({ ...prev, streak: 0 }));
        }
      }
    };
    
    checkDateAndStreak();
  }, [today, stats.history]);

  const updateStats = useCallback((newStats: UserStats) => {
    setStats(newStats);
    saveStats(newStats);
  }, []);

  const handleMissionsUpdate = (missions: Mission[]) => {
    const isFullyCompleted = missions.every(m => m.completed) && missions.length === 3;
    
    const newHistory = [...stats.history];
    const index = newHistory.findIndex(h => h.date === today);
    
    const dayData: DayState = {
      date: today,
      missions,
      isFullyCompleted
    };

    if (index >= 0) {
      newHistory[index] = dayData;
    } else {
      newHistory.push(dayData);
    }

    // Update streak logic
    let newStreak = stats.streak;
    const wasAlreadyCompletedToday = stats.history.find(h => h.date === today)?.isFullyCompleted;
    
    if (isFullyCompleted && !wasAlreadyCompletedToday) {
      newStreak += 1;
      if (window.confetti) {
        window.confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF4C00', '#FFD700', '#FFFFFF']
        });
      }
    } else if (!isFullyCompleted && wasAlreadyCompletedToday) {
      newStreak = Math.max(0, newStreak - 1);
    }

    const newTotalMissions = missions.filter(m => m.completed).length; // This is a bit simplified for MVP

    updateStats({
      ...stats,
      streak: newStreak,
      maxStreak: Math.max(newStreak, stats.maxStreak),
      history: newHistory
    });
  };

  const fetchMotivation = async () => {
    setIsLoadingMotivation(true);
    const todayData = getDayState(stats, today);
    const missionsText = todayData?.missions.map(m => m.text) || [];
    const boost = await getMotivationalBoost(stats.streak, missionsText);
    setMotivation(boost);
    setIsLoadingMotivation(false);
  };

  useEffect(() => {
    fetchMotivation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats.streak]);

  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col px-4 pb-20">
      <Header 
        streak={stats.streak} 
        mode={mode} 
        setMode={setMode} 
      />
      
      <main className="flex-1 mt-6">
        <div className="mb-8">
          <p className="text-gray-400 text-sm uppercase tracking-widest mb-1 italic">Focus du jour</p>
          <div className="bg-[#2A2A2A] p-4 rounded-xl border-l-4 border-[#FF4C00] relative overflow-hidden">
             {isLoadingMotivation ? (
               <div className="h-4 w-32 bg-gray-700 animate-pulse rounded"></div>
             ) : (
               <p className="text-lg font-medium italic leading-tight">"{motivation}"</p>
             )}
          </div>
        </div>

        {mode === AppMode.DASHBOARD && (
          <Dashboard 
            todayState={getDayState(stats, today)} 
            onUpdate={handleMissionsUpdate} 
          />
        )}

        {mode === AppMode.STATS && (
          <Stats stats={stats} />
        )}
      </main>

      {/* Persistent Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1E1E1E] border-t border-gray-800 py-3 px-6 flex justify-around max-w-md mx-auto">
        <button 
          onClick={() => setMode(AppMode.DASHBOARD)}
          className={`flex flex-col items-center space-y-1 ${mode === AppMode.DASHBOARD ? 'text-[#FF4C00]' : 'text-gray-500'}`}
        >
          <i className="fa-solid fa-bolt text-xl"></i>
          <span className="text-[10px] font-bold uppercase">Missions</span>
        </button>
        <button 
          onClick={() => setMode(AppMode.STATS)}
          className={`flex flex-col items-center space-y-1 ${mode === AppMode.STATS ? 'text-[#FF4C00]' : 'text-gray-500'}`}
        >
          <i className="fa-solid fa-chart-simple text-xl"></i>
          <span className="text-[10px] font-bold uppercase">Stats</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
