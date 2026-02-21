import React, { useMemo } from 'react';
import { useMixerStore } from '../../store/useMixerStore';
import { clsx } from 'clsx';

export const Teleprompter: React.FC = () => {
  const channels = useMixerStore((state) => state.channels);
  const isPlaying = useMixerStore((state) => state.isPlaying);
  
  // Determine dominant channel and generate prompt
  const prompt = useMemo(() => {
    // Find highest level channel
    const sorted = [...channels].sort((a, b) => b.currentLevel - a.currentLevel);
    const top = sorted[0];
    const second = sorted[1];
    
    if (top.currentLevel < 30) return { main: "Quiet Beat", sub: "Build tension..." };
    
    // Mix logic
    if (top.id === 'action') {
        if (second.id === 'threat' && second.currentLevel > 50) return { main: "High Stakes Combat", sub: "Raise the stakes, immediate danger." };
        if (second.id === 'romance' && second.currentLevel > 50) return { main: "Passionate Conflict", sub: "Fighting for love, or with it." };
        return { main: "Escalate Action", sub: "Increase pacing, rapid cuts." };
    }
    if (top.id === 'romance') {
        if (second.id === 'threat' && second.currentLevel > 50) return { main: "Forbidden Love", sub: "Intimacy amidst danger." };
        return { main: "Deepen Connection", sub: "Slow pacing, focus on emotion." };
    }
    if (top.id === 'threat') {
        return { main: "Impending Doom", sub: "Shadows lengthen, silence falls." };
    }
    if (top.id === 'expo') {
        return { main: "Lore Revelation", sub: "Explain the mechanism, reveal the history." };
    }
    
    return { main: "Narrative Beat", sub: "Transitioning..." };
  }, [channels]);

  return (
    <section className="flex-none p-4 pb-2">
      <div className="bg-black border-2 border-surface-light rounded-lg p-3 shadow-inset-slot relative overflow-hidden lcd-screen">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Prompt</span>
          <span className={clsx("text-[10px] font-mono animate-pulse", isPlaying ? "text-primary" : "text-slate-600")}>
            {isPlaying ? "● LIVE" : "○ PAUSED"}
          </span>
        </div>
        <div 
            className="font-mono text-lg leading-tight text-primary/90 uppercase tracking-wide transition-all duration-300" 
            style={{ textShadow: '0 0 4px rgba(31, 249, 249, 0.5)' }}
        >
          &gt; {prompt.main}<br/>
          <span className="opacity-50 text-sm">&gt; {prompt.sub}</span>
        </div>
        {/* Scanline effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent h-full w-full pointer-events-none opacity-20 animate-pulse"></div>
      </div>
    </section>
  );
};
