import React from 'react';
import { useMixerStore } from '../../store/useMixerStore';
import { clsx } from 'clsx';

export const TransportControls: React.FC = () => {
  const isPlaying = useMixerStore((state) => state.isPlaying);
  const isRecording = useMixerStore((state) => state.isRecording);
  const currentTime = useMixerStore((state) => state.currentTime);
  const togglePlay = useMixerStore((state) => state.togglePlay);
  const toggleRecord = useMixerStore((state) => state.toggleRecord);
  const stop = useMixerStore((state) => state.stop);

  // Format timecode: HH:MM:SS.ms
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10); // 2 digits

    const pad = (n: number) => n.toString().padStart(2, '0');
    
    return {
      main: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
      sub: `.${pad(milliseconds)}`
    };
  };

  const timecode = formatTime(currentTime);

  return (
    <section className="flex-none bg-[#111616] border-t border-surface-light px-4 py-4 flex flex-col gap-4">
      {/* Timecode & Status */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Timecode</span>
          <span className="text-2xl font-mono text-primary leading-none tracking-tight">
            {timecode.main}<span className="text-sm text-slate-600">{timecode.sub}</span>
          </span>
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400 border border-slate-700">MASTER OUT</span>
          <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400 border border-slate-700">-3.2dB</span>
        </div>
      </div>

      {/* Transport Buttons */}
      <div className="flex gap-4 items-center justify-center py-2 bg-[#0c1010] rounded-xl shadow-inset-slot border border-surface-light p-2 select-none">
        {/* Stop Button */}
        <button 
          onClick={stop}
          className="flex-1 aspect-square max-h-16 rounded bg-[#2a3030] shadow-[0_4px_0_rgb(20,20,20),0_5px_10px_rgba(0,0,0,0.5)] active:shadow-none active:translate-y-1 border-t border-slate-600 flex items-center justify-center group transition-transform"
        >
          <span className="material-symbols-outlined text-slate-400 group-active:text-slate-200" style={{ fontSize: '32px' }}>stop</span>
        </button>
        
        {/* Play Button (Big) */}
        <button 
          onClick={togglePlay}
          className={clsx(
            "flex-[1.5] aspect-square max-h-20 rounded bg-gradient-to-b from-[#2a3838] to-[#1b2727] shadow-[0_4px_0_rgb(15,30,30),0_5px_10px_rgba(0,0,0,0.5)] active:shadow-none active:translate-y-1 border-t border-surface-light flex flex-col items-center justify-center group relative overflow-hidden transition-transform",
            isPlaying && "shadow-none translate-y-1 border-primary/50"
          )}
        >
          <div className={clsx("absolute inset-0 bg-primary/10 transition-opacity", isPlaying ? "opacity-100" : "opacity-0 group-active:opacity-100")}></div>
          <span 
            className={clsx(
                "material-symbols-outlined transition-colors", 
                isPlaying ? "text-primary drop-shadow-[0_0_5px_rgba(31,249,249,0.8)]" : "text-primary group-active:text-white"
            )} 
            style={{ fontSize: '40px' }}
          >
            {isPlaying ? 'pause' : 'play_arrow'}
          </span>
          <span className="text-[10px] font-bold text-primary/50 mt-1 tracking-widest uppercase">{isPlaying ? 'Pause' : 'Play'}</span>
        </button>
        
        {/* Record Button */}
        <button 
          onClick={toggleRecord}
          className={clsx(
            "flex-1 aspect-square max-h-16 rounded bg-[#302a2a] shadow-[0_4px_0_rgb(30,15,15),0_5px_10px_rgba(0,0,0,0.5)] active:shadow-none active:translate-y-1 border-t border-red-900/50 flex items-center justify-center group transition-transform",
            isRecording && "shadow-none translate-y-1 bg-[#3a1a1a]"
          )}
        >
          <div 
            className={clsx(
                "w-4 h-4 rounded-full transition-all duration-200",
                isRecording ? "bg-red-500 shadow-neon-red scale-110 animate-pulse" : "bg-red-700 shadow-inner group-active:bg-red-500 group-active:shadow-neon-red"
            )}
          ></div>
        </button>
      </div>
    </section>
  );
};
