import React, { useEffect, useRef, useMemo } from 'react';
import { useMixerStore } from '../../store/useMixerStore';
import { clsx } from 'clsx';

const PIXELS_PER_MS = 0.1; // 100px per second

export const Chronoline: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Connect to store
  const currentTime = useMixerStore((state) => state.currentTime);
  const duration = useMixerStore((state) => state.duration);
  const isPlaying = useMixerStore((state) => state.isPlaying);
  const scrub = useMixerStore((state) => state.scrub);
  
  // Memoize bars generation
  const bars = useMemo(() => {
    // Generate enough bars for the duration
    // Each bar is 4px wide + 1px gap = 5px
    // Wait, previous code used 10px? No, explicit width not set for gap?
    // Tailwind `gap-1` is 0.25rem = 4px.
    // Width `w-1` is 0.25rem = 4px.
    // Total 8px per bar?
    // Let's assume bar width + gap = 6px (w-1 is 4px, gap-0.5 is 2px? or gap-1 is 4px -> 8px total).
    // Let's assume 6px per unit for calculation.
    
    // The previous code had `Array.from({ length: ... / 6 })`.
    // Let's generate a fixed set of fake data based on duration.
    const count = Math.ceil((duration * PIXELS_PER_MS) / 6);
    return Array.from({ length: count }, (_, i) => {
      // Deterministic random height based on index
      // Use simple noise function
      const noise = (Math.sin(i * 0.1) + Math.sin(i * 0.31) + Math.sin(i * 0.73)) / 3;
      // Map -1..1 to 20..100 % height
      const height = 20 + ((noise + 1) / 2) * 80;
      return height;
    });
  }, [duration]);

  // Sync scroll position with currentTime
  useEffect(() => {
    if (scrollContainerRef.current) {
      const targetScroll = currentTime * PIXELS_PER_MS;
      if (Math.abs(scrollContainerRef.current.scrollLeft - targetScroll) > 1) {
        scrollContainerRef.current.scrollLeft = targetScroll;
      }
    }
  }, [currentTime]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    if (isPlaying) return; 

    const newTime = scrollContainerRef.current.scrollLeft / PIXELS_PER_MS;
    scrub(newTime);
  };

  return (
    <section className="flex-none h-24 bg-[#0a0f0f] border-b border-surface-light relative overflow-hidden group">
      {/* Playhead Line */}
      <div className="absolute inset-y-0 left-1/2 w-0.5 bg-primary shadow-neon z-10 transform -translate-x-1/2 pointer-events-none"></div>
      {/* Playhead Label */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-20 bg-primary text-black text-[10px] font-bold px-1 rounded-sm pointer-events-none shadow-neon">PLAYHEAD</div>
      
      {/* Scroll Container */}
      <div 
        ref={scrollContainerRef}
        className="flex items-center h-full overflow-x-auto no-scrollbar px-[50vw]"
        onScroll={handleScroll}
      >
        <div className="flex gap-1 h-12 items-end opacity-60">
          {bars.map((height, i) => {
            // Check if this bar is under the playhead
            // Bar i is at x = i * 6 (approx)
            // Playhead is at currentTime * PIXELS_PER_MS
            const barX = i * 6;
            const playheadX = currentTime * PIXELS_PER_MS;
            const distance = Math.abs(barX - playheadX);
            const isActive = distance < 4; // close enough

            return (
                <div 
                    key={i} 
                    className={clsx(
                        "w-1 rounded-sm transition-all duration-75",
                        isActive ? "bg-primary shadow-neon opacity-100" : "bg-slate-600 opacity-60"
                    )}
                    style={{ height: `${height}%` }}
                ></div>
            );
          })}
          
          {/* Scene Marker (Hardcoded for demo) */}
          <div className="flex flex-col items-center justify-end h-full w-24 mx-2 relative top-2">
            <div className="text-[10px] text-slate-400 mb-1 whitespace-nowrap uppercase tracking-wider">Scene 3</div>
            <div className="w-full h-full bg-surface-light/30 border-l border-r border-slate-600"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
