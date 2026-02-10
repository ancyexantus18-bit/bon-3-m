
import React from 'react';
import { AppMode } from '../types';

interface HeaderProps {
  streak: number;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

const Header: React.FC<HeaderProps> = ({ streak, mode, setMode }) => {
  return (
    <header className="py-6 flex justify-between items-center border-b border-gray-800">
      <div>
        <h1 className="text-2xl font-black tracking-tighter">3 MISSIONS</h1>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Discipline & Focus</p>
      </div>
      
      <div className="flex items-center space-x-2 bg-[#2A2A2A] px-3 py-1.5 rounded-full border border-gray-700">
        <span className="text-sm font-bold">{streak}</span>
        <i className="fa-solid fa-fire text-[#FF4C00]"></i>
      </div>
    </header>
  );
};

export default Header;
