import React from 'react';
import { useMixerStore } from '../../store/useMixerStore';
import { RotaryKnob } from './shared/RotaryKnob';
import { VUMeter } from './shared/VUMeter';
import { SlidingFader } from './shared/SlidingFader';

interface MixerChannelProps {
  channelId: string;
}

export const MixerChannel: React.FC<MixerChannelProps> = ({ channelId }) => {
  const channel = useMixerStore((state) => state.channels.find((c) => c.id === channelId));
  const setChannelLevel = useMixerStore((state) => state.setChannelLevel);

  if (!channel) return null;

  const handleLevelChange = (level: number) => {
    setChannelLevel(channelId, level);
  };

  return (
    <div className="flex flex-col h-full bg-[#161e1e] rounded border border-surface-light shadow-lg p-1 relative select-none">
      {/* Screws */}
      <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-[#2a3838] shadow-inner pointer-events-none"></div>
      <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#2a3838] shadow-inner pointer-events-none"></div>
      <div className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-[#2a3838] shadow-inner pointer-events-none"></div>
      <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-[#2a3838] shadow-inner pointer-events-none"></div>

      {/* Header */}
      <div className="text-center mt-2 mb-2">
        <span className="block text-[10px] font-bold text-slate-400 tracking-widest uppercase truncate px-2">{channel.name}</span>
        <div className="w-full h-8 flex justify-center items-center my-1 pointer-events-none">
          {/* Rotary Knob (Visual only for now, mirroring level) */}
          <RotaryKnob 
            value={channel.currentLevel} 
            color={channel.color} 
            shadowColor={channel.shadowColor} 
          />
        </div>
      </div>

      {/* Main Control Area */}
      <div className="flex-1 flex justify-center gap-1 relative px-1 min-h-0">
        {/* VU Meter */}
        <VUMeter 
            value={channel.currentLevel} 
            color={channel.color} 
            shadowColor={channel.shadowColor} 
        />
        
        {/* Fader */}
        <SlidingFader 
            value={channel.currentLevel} 
            onChange={handleLevelChange} 
            color={channel.color} 
            shadowColor={channel.shadowColor} 
        />
      </div>

      {/* Value Display */}
      <div className="text-center mt-2 mb-1">
        <span 
            className="text-[9px] font-mono"
            style={{ color: channel.color }}
        >
            {Math.round(channel.currentLevel)}%
        </span>
      </div>
    </div>
  );
};
