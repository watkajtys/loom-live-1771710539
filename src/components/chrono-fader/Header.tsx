import React from 'react';
import { useMixerStore } from '../../store/useMixerStore';
import { clsx } from 'clsx';

export const Header: React.FC = () => {
  const isRecording = useMixerStore((state) => state.isRecording);

  return (
    <header className="flex-none bg-surface-dark border-b border-surface-light px-4 py-3 flex items-center justify-between z-20 shadow-lg relative select-none">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-white transition-colors">menu</span>
        <h1 
            className="font-bold text-lg tracking-widest text-slate-200 uppercase" 
            style={{ textShadow: '0 1px 2px black' }}
        >
            ChronoFader
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <div 
            className={clsx(
                "flex items-center gap-1 bg-black/40 px-3 py-1 rounded border shadow-inset-slot transition-colors duration-300",
                isRecording ? "border-red-500/50 bg-red-900/10" : "border-surface-light"
            )}
        >
          <span className={clsx("w-2 h-2 rounded-full transition-all duration-300", isRecording ? "bg-red-500 animate-pulse shadow-neon-red" : "bg-red-900")}></span>
          <span className={clsx("text-xs font-mono tracking-wider transition-colors", isRecording ? "text-red-400" : "text-red-900")}>REC</span>
        </div>
        <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-white transition-colors">settings</span>
      </div>
    </header>
  );
};
