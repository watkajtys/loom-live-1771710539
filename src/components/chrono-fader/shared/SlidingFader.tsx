import React, { useRef, useState } from 'react';
import { clsx } from 'clsx';

interface SlidingFaderProps {
  value: number; // 0-100
  onChange: (value: number) => void;
  color: string;
  shadowColor: string;
}

export const SlidingFader: React.FC<SlidingFaderProps> = ({ value, onChange, color, shadowColor }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const calculateValueFromTop = (top: number, trackHeight: number, handleHeight: number) => {
    const range = trackHeight - handleHeight;
    const clampedTop = Math.max(0, Math.min(top, range));
    const percent = 1 - (clampedTop / range);
    return Math.max(0, Math.min(100, percent * 100));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!handleRef.current) return;
    
    e.stopPropagation(); // Prevent track click
    const rect = handleRef.current.getBoundingClientRect();
    setDragOffset(e.clientY - rect.top);
    
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !trackRef.current || !handleRef.current) return;
    
    const trackRect = trackRef.current.getBoundingClientRect();
    const handleHeight = handleRef.current.offsetHeight;
    
    // The new top position relative to track
    const newTop = e.clientY - trackRect.top - dragOffset;
    
    const newValue = calculateValueFromTop(newTop, trackRect.height, handleHeight);
    onChange(newValue);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleTrackClick = (e: React.MouseEvent) => {
    if (!trackRef.current || !handleRef.current) return;
    
    const trackRect = trackRef.current.getBoundingClientRect();
    const handleHeight = handleRef.current.offsetHeight;
    
    // Center the handle on the click point
    const newTop = e.clientY - trackRect.top - (handleHeight / 2);
    
    const newValue = calculateValueFromTop(newTop, trackRect.height, handleHeight);
    onChange(newValue);
  };

  return (
    <div 
      className="w-6 relative fader-track rounded-full h-full cursor-pointer" 
      ref={trackRef} 
      onClick={handleTrackClick}
    >
      <div 
        ref={handleRef}
        className="absolute left-[-4px] right-[-4px] h-10 fader-handle rounded flex items-center justify-center cursor-ns-resize touch-none group"
        style={{ 
          // 100% -> 0px top
          // 0% -> (100% - 40px) top
          top: `calc((100% - 40px) * ${1 - value / 100})` 
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="w-full h-[1px] bg-black/50 absolute top-1/2"></div>
        <div 
            className={clsx("w-4 h-0.5 transition-shadow", shadowColor)}
            style={{ 
              backgroundColor: color, 
              // Fallback if shadowColor class is not enough or specific custom color needed
              // boxShadow: `0 0 5px ${color}, 0 0 10px ${color}` 
            }}
        ></div>
      </div>
    </div>
  );
};
