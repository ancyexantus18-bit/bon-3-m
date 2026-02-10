
import React, { useState, useEffect } from 'react';
import { DayState, Mission } from '../types';
import MissionItem from './MissionItem';

interface DashboardProps {
  todayState?: DayState;
  onUpdate: (missions: Mission[]) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ todayState, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(!todayState?.missions.length);
  const [localMissions, setLocalMissions] = useState<Mission[]>(
    todayState?.missions || [
      { id: '1', text: '', completed: false },
      { id: '2', text: '', completed: false },
      { id: '3', text: '', completed: false },
    ]
  );

  useEffect(() => {
    if (todayState) {
      setLocalMissions(todayState.missions);
      setIsEditing(!todayState.missions.some(m => m.text));
    }
  }, [todayState]);

  const handleToggle = (id: string) => {
    const updated = localMissions.map(m => 
      m.id === id ? { ...m, completed: !m.completed } : m
    );
    setLocalMissions(updated);
    onUpdate(updated);
  };

  const handleTextChange = (id: string, text: string) => {
    const updated = localMissions.map(m => 
      m.id === id ? { ...m, text } : m
    );
    setLocalMissions(updated);
  };

  const handleSave = () => {
    if (localMissions.every(m => m.text.trim())) {
      setIsEditing(false);
      onUpdate(localMissions);
    } else {
      alert("Tu dois définir les 3 missions pour aujourd'hui.");
    }
  };

  const isComplete = localMissions.every(m => m.completed);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-2">
        <h2 className="text-xl font-bold">Aujourd'hui</h2>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-xs text-[#FF4C00] font-bold uppercase tracking-wider"
          >
            Modifier
          </button>
        )}
      </div>

      <div className="space-y-6">
        {localMissions.map((m, idx) => (
          <MissionItem
            key={m.id}
            mission={m}
            index={idx}
            onToggle={handleToggle}
            onTextChange={handleTextChange}
            isEditing={isEditing}
          />
        ))}
      </div>

      {isEditing ? (
        <button
          onClick={handleSave}
          className="w-full bg-[#FF4C00] py-4 rounded-2xl text-lg font-black uppercase tracking-widest shadow-lg shadow-[#FF4C00]/20 active:scale-95 transition-transform"
        >
          Lancer la journée
        </button>
      ) : (
        <div className="pt-4">
          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#FF4C00] h-full transition-all duration-500"
              style={{ width: `${(localMissions.filter(m => m.completed).length / 3) * 100}%` }}
            ></div>
          </div>
          <p className="text-center mt-3 text-sm text-gray-500 font-medium">
            {isComplete ? "Félicitations ! Discipline de fer." : `${localMissions.filter(m => m.completed).length} / 3 missions terminées`}
          </p>
        </div>
      )}

      {!isEditing && isComplete && (
        <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 p-4 rounded-2xl flex items-center space-x-4 animate-bounce mt-4">
          <div className="text-2xl text-[#FFD700]"><i className="fa-solid fa-trophy"></i></div>
          <p className="text-[#FFD700] text-sm font-bold">Journée parfaite ! Ton mental se renforce.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
