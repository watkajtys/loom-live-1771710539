import React from 'react';

interface RotaryKnobProps {
  value: number; // 0-100
  color: string;
  shadowColor: string;
}

export const RotaryKnob: React.FC<RotaryKnobProps> = ({ value, color, shadowColor }) => {
  // Map value (0-100) to rotation (-135 to 135 degrees)
  const rotation = (value / 100) * 270 - 135;

  return (
    <div 
      className="w-6 h-6 rounded-full bg-gradient-to-br from-[#3a4b4b] to-[#1a2525] knob-shadow border border-[#2a3838] relative flex items-center justify-center"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div 
        className={`w-0.5 h-2 absolute top-0.5 ${shadowColor}`}
        style={{ backgroundColor: color }}
      ></div>
    </div>
  );
};
