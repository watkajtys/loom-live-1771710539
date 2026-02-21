import React, { useEffect, useRef } from 'react';
import { useMixerStore } from '../../store/useMixerStore';
import { Header } from './Header';
import { Chronoline } from './Chronoline';
import { Teleprompter } from './Teleprompter';
import { MixerChannel } from './MixerChannel';
import { TransportControls } from './TransportControls';
import { Footer } from './Footer';

export const Console: React.FC = () => {
  const tick = useMixerStore((state) => state.tick);
  const isPlaying = useMixerStore((state) => state.isPlaying);
  const channels = useMixerStore((state) => state.channels);
  
  const lastTimeRef = useRef<number>(0);
  const requestRef = useRef<number>(0);

  const animate = (time: number) => {
    if (lastTimeRef.current !== 0) {
      const deltaTime = time - lastTimeRef.current;
      tick(deltaTime);
    }
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestRef.current);
      lastTimeRef.current = 0;
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying]); // tick is stable

  return (
    <div className="bg-background-dark text-slate-100 flex flex-col h-screen overflow-hidden font-display">
      <Header />
      
      <main className="flex-1 overflow-y-auto flex flex-col relative bg-background-dark bg-brushed-metal">
        <Chronoline />
        <Teleprompter />
        
        {/* Mixer Section */}
        <section className="flex-1 px-4 py-2 min-h-0 overflow-y-auto">
          <div className="grid grid-cols-4 gap-3 h-full pb-4">
            {channels.map((channel) => (
              <MixerChannel key={channel.id} channelId={channel.id} />
            ))}
          </div>
        </section>
        
        <TransportControls />
        <Footer />
      </main>
    </div>
  );
};
