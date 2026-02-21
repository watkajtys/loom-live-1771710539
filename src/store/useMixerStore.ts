import { create } from 'zustand';

export type AutomationPoint = {
  time: number; // in milliseconds
  value: number; // 0-100
};

export type Channel = {
  id: string;
  name: string;
  color: string;
  shadowColor: string;
  currentLevel: number;
  automation: AutomationPoint[];
};

interface MixerState {
  isPlaying: boolean;
  isRecording: boolean;
  currentTime: number;
  duration: number; // in milliseconds
  channels: Channel[];

  togglePlay: () => void;
  toggleRecord: () => void;
  stop: () => void;
  setChannelLevel: (channelId: string, level: number) => void;
  setDuration: (duration: number) => void;
  tick: (deltaTime: number) => void;
  scrub: (time: number) => void;
}

const INITIAL_CHANNELS: Channel[] = [
  {
    id: 'action',
    name: 'Action',
    color: '#1ff9f9', // primary cyan
    shadowColor: 'shadow-neon',
    currentLevel: 75,
    automation: [{ time: 0, value: 75 }],
  },
  {
    id: 'romance',
    name: 'Romance',
    color: '#ff00ff', // magenta
    shadowColor: 'shadow-neon-magenta',
    currentLevel: 40,
    automation: [{ time: 0, value: 40 }],
  },
  {
    id: 'expo',
    name: 'Expo',
    color: '#ffbf00', // amber
    shadowColor: 'shadow-neon-amber',
    currentLevel: 95,
    automation: [{ time: 0, value: 95 }],
  },
  {
    id: 'threat',
    name: 'Threat',
    color: '#ff3b30', // red
    shadowColor: 'shadow-neon-red',
    currentLevel: 20,
    automation: [{ time: 0, value: 20 }],
  },
];

export const useMixerStore = create<MixerState>((set, get) => ({
  isPlaying: false,
  isRecording: false,
  currentTime: 0,
  duration: 60000, // 60 seconds default
  channels: INITIAL_CHANNELS,

  togglePlay: () => {
    const { isPlaying } = get();
    if (isPlaying) {
      set({ isPlaying: false, isRecording: false });
    } else {
      // If we are at the end, restart
      if (get().currentTime >= get().duration) {
        set({ currentTime: 0 });
      }
      set({ isPlaying: true });
    }
  },

  toggleRecord: () => {
    // Can only record while playing? Or toggle record mode then play?
    // Let's toggle record mode. If playing, it starts recording immediately.
    set((state) => ({ isRecording: !state.isRecording }));
  },

  stop: () => {
    set({ isPlaying: false, isRecording: false, currentTime: 0 });
    // Reset levels to initial state or time 0?
    // For now, let's reset levels to their values at time 0
    const { channels } = get();
    const newChannels = channels.map(ch => {
        // Find value at time 0 or use current if none
        const initial = ch.automation.find(p => p.time === 0)?.value ?? ch.currentLevel;
        return { ...ch, currentLevel: initial };
    });
    set({ channels: newChannels });
  },

  setChannelLevel: (channelId, level) => {
    set((state) => {
      const { isPlaying, isRecording, currentTime } = state;
      const newChannels = state.channels.map((ch) => {
        if (ch.id === channelId) {
          const newCh = { ...ch, currentLevel: level };
          // If recording and playing, add automation point
          if (isRecording && isPlaying) {
             // Basic optimization: if the last point is very close in time, maybe replace it?
             // For now, just append.
             newCh.automation = [...ch.automation, { time: currentTime, value: level }].sort((a, b) => a.time - b.time);
          }
          return newCh;
        }
        return ch;
      });
      return { channels: newChannels };
    });
  },

  setDuration: (duration) => set({ duration }),

  tick: (deltaTime) => {
    const { isPlaying, currentTime, duration, stop, isRecording, channels } = get();
    if (!isPlaying) return;

    let nextTime = currentTime + deltaTime;
    if (nextTime >= duration) {
      nextTime = duration;
      stop(); // Auto stop at end
      return;
    }

    // If NOT recording, update levels based on automation
    let nextChannels = channels;
    if (!isRecording) {
      nextChannels = channels.map((ch) => {
        // Find automation value for nextTime
        // Simple linear interpolation
        if (ch.automation.length === 0) return ch;

        // Find points surrounding nextTime
        // Automation is sorted by time
        const nextIdx = ch.automation.findIndex(p => p.time >= nextTime);
        
        let newLevel = ch.currentLevel;

        if (nextIdx === -1) {
            // Past the last point, use the last point's value
            newLevel = ch.automation[ch.automation.length - 1].value;
        } else if (nextIdx === 0) {
            // Before the first point, use first point
            newLevel = ch.automation[0].value;
        } else {
            const p1 = ch.automation[nextIdx - 1];
            const p2 = ch.automation[nextIdx];
            const range = p2.time - p1.time;
            const progress = (nextTime - p1.time) / range;
            newLevel = p1.value + (p2.value - p1.value) * progress;
        }

        return { ...ch, currentLevel: newLevel };
      });
    }

    set({ currentTime: nextTime, channels: nextChannels });
  },

  scrub: (time) => {
      // When scrubbing, we should update the channel levels to reflect the automation at that time
      const { channels, duration } = get();
      const clampedTime = Math.max(0, Math.min(time, duration));
      
      const nextChannels = channels.map((ch) => {
        if (ch.automation.length === 0) return ch;

        const nextIdx = ch.automation.findIndex(p => p.time >= clampedTime);
        let newLevel = ch.currentLevel;

        if (nextIdx === -1) {
            newLevel = ch.automation[ch.automation.length - 1].value;
        } else if (nextIdx === 0) {
            newLevel = ch.automation[0].value;
        } else {
            const p1 = ch.automation[nextIdx - 1];
            const p2 = ch.automation[nextIdx];
            const range = p2.time - p1.time;
            const progress = (clampedTime - p1.time) / range;
            newLevel = p1.value + (p2.value - p1.value) * progress;
        }
        return { ...ch, currentLevel: newLevel };
      });

      set({ currentTime: clampedTime, channels: nextChannels });
  }
}));
