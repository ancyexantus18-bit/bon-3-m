
import React, { useEffect, useState } from 'react';
import { UserStats } from '../types';
import { analyzeProgress } from '../services/gemini';

interface StatsProps {
  stats: UserStats;
}

const Stats: React.FC<StatsProps> = ({ stats }) => {
  const [analysis, setAnalysis] = useState<string>('Analyse en cours...');
  const [loading, setLoading] = useState(true);

  const completedDays = stats.history.filter(h => h.isFullyCompleted).length;
  const totalMissions = stats.history.reduce((acc, curr) => acc + curr.missions.filter(m => m.completed).length, 0);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      const res = await analyzeProgress({
        streak: stats.streak,
        maxStreak: stats.maxStreak,
        completedDays,
        totalMissions
      });
      setAnalysis(res);
      setLoading(false);
    };
    fetchAnalysis();
  }, [stats, completedDays, totalMissions]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold">Tes Progrès</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#2A2A2A] p-5 rounded-3xl border border-gray-800">
          <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Série Actuelle</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-[#FF4C00]">{stats.streak}</span>
            <span className="text-sm text-gray-400">jours</span>
          </div>
        </div>
        <div className="bg-[#2A2A2A] p-5 rounded-3xl border border-gray-800">
          <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Record</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white">{stats.maxStreak}</span>
            <span className="text-sm text-gray-400">jours</span>
          </div>
        </div>
        <div className="bg-[#2A2A2A] p-5 rounded-3xl border border-gray-800 col-span-2">
          <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Missions Accomplies</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white">{totalMissions}</span>
            <span className="text-sm text-gray-400">tâches terminées</span>
          </div>
        </div>
      </div>

      <div className="bg-[#2A2A2A] p-6 rounded-3xl border border-gray-800">
        <div className="flex items-center space-x-2 mb-4">
          <i className="fa-solid fa-brain text-[#FF4C00]"></i>
          <h3 className="text-lg font-bold">Diagnostic IA</h3>
        </div>
        {loading ? (
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 w-full animate-pulse rounded"></div>
            <div className="h-4 bg-gray-700 w-3/4 animate-pulse rounded"></div>
          </div>
        ) : (
          <p className="text-gray-300 leading-relaxed text-sm italic">
            "{analysis}"
          </p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4">Historique Récent</h3>
        <div className="space-y-3">
          {stats.history.length === 0 ? (
            <p className="text-gray-500 italic text-sm">Commence aujourd'hui pour voir ton historique.</p>
          ) : (
            stats.history.slice(-7).reverse().map((day, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-[#2A2A2A] rounded-2xl border border-gray-800">
                <div>
                  <p className="text-sm font-bold text-white">
                    {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {day.missions.filter(m => m.completed).length} / 3 missions
                  </p>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${day.isFullyCompleted ? 'bg-[#FF4C00]/20 text-[#FF4C00]' : 'bg-gray-800 text-gray-600'}`}>
                  <i className={`fa-solid ${day.isFullyCompleted ? 'fa-check' : 'fa-xmark'}`}></i>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Stats;
