import React from 'react';
import { twMerge } from 'tailwind-merge';

interface VUMeterProps {
  value: number; // 0-100
  color: string; // The main color (e.g. primary, magenta)
  shadowColor: string;
}

export const VUMeter: React.FC<VUMeterProps> = ({ value, color, shadowColor }) => {
  // 8 segments
  // Top -> Bottom DOM order
  // 0: Red (>87.5%)
  // 1: Red (>75%)
  // 2: Yellow (>62.5%)
  // 3: Color (>50%)
  // 4: Color (>37.5%)
  // 5: Color (>25%)
  // 6: Color (>12.5%)
  // 7: Color (>0%)

  const segments = [
    { threshold: 87.5, color: '#ef4444', shadow: 'shadow-neon-red' }, // Red
    { threshold: 75,   color: '#ef4444', shadow: 'shadow-neon-red' }, // Red
    { threshold: 62.5, color: '#facc15', shadow: 'shadow-neon-amber' }, // Yellow
    { threshold: 50,   color: color,     shadow: shadowColor },
    { threshold: 37.5, color: color,     shadow: shadowColor },
    { threshold: 25,   color: color,     shadow: shadowColor },
    { threshold: 12.5, color: color,     shadow: shadowColor },
    { threshold: 0,    color: color,     shadow: shadowColor },
  ];

  return (
    <div className="w-1.5 h-full bg-black/50 rounded-full overflow-hidden flex flex-col justify-end gap-[1px] py-1">
      {segments.map((seg, i) => {
        const isActive = value > seg.threshold;
        return (
          <div
            key={i}
            className={twMerge(
              "h-1 w-full led-segment transition-all duration-75",
              isActive ? `led-active opacity-100 ${seg.shadow}` : "opacity-20"
            )}
            style={{ 
                backgroundColor: seg.color,
                boxShadow: isActive ? undefined : 'inset 0 0 2px rgba(0,0,0,0.5)' // default shadow for inactive
            }}
          ></div>
        );
      })}
    </div>
  );
};
