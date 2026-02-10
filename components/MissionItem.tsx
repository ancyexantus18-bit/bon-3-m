
import React from 'react';
import { Mission } from '../types';

interface MissionItemProps {
  mission: Mission;
  index: number;
  onToggle: (id: string) => void;
  onTextChange: (id: string, text: string) => void;
  isEditing: boolean;
}

const MissionItem: React.FC<MissionItemProps> = ({ mission, index, onToggle, onTextChange, isEditing }) => {
  return (
    <div className={`relative flex items-center p-5 rounded-2xl transition-all duration-300 border-2 ${
      mission.completed 
        ? 'bg-[#2A2A2A] border-[#FF4C00] opacity-80' 
        : 'bg-[#2A2A2A] border-transparent'
    }`}>
      <span className="absolute -top-3 -left-2 bg-[#1E1E1E] text-gray-500 text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border border-gray-800">
        {index + 1}
      </span>

      <div className="flex-1 mr-4">
        {isEditing ? (
          <input
            type="text"
            value={mission.text}
            onChange={(e) => onTextChange(mission.id, e.target.value)}
            placeholder="Écris ta mission ici..."
            className="w-full bg-transparent border-b border-gray-700 focus:border-[#FF4C00] outline-none text-lg font-medium py-1"
            autoFocus={index === 0}
          />
        ) : (
          <p className={`text-lg font-medium ${mission.completed ? 'line-through text-gray-500' : 'text-white'}`}>
            {mission.text || "Mission non définie"}
          </p>
        )}
      </div>

      {!isEditing && (
        <button
          onClick={() => onToggle(mission.id)}
          disabled={!mission.text}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            mission.completed 
              ? 'bg-[#FF4C00] text-white' 
              : 'bg-[#3A3A3A] text-gray-400 hover:bg-[#444]'
          } ${!mission.text ? 'opacity-30 cursor-not-allowed' : ''}`}
        >
          <i className={`fa-solid ${mission.completed ? 'fa-check' : 'fa-circle'}`}></i>
        </button>
      )}
    </div>
  );
};

export default MissionItem;
