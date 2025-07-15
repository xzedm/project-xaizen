// src/contexts/AudioContext.tsx
"use client";

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';

interface AudioTrack {
  id: string;
  title: string;
  url: string;
  duration?: number;
}

interface AudioContextType {
  // Audio state
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTrackIndex: number;
  currentTime: number;
  duration: number;
  tracks: AudioTrack[];
  
  // Audio controls
  togglePlay: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  selectTrack: (index: number) => void;
  seekTo: (time: number) => void;
  
  // Audio element ref - Updated to allow null
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

// Your audio tracks - replace with your cloud storage URLs
const AUDIO_TRACKS: AudioTrack[] = [
  {
    id: '1',
    title: 'Rain Sounds',
    url: 'https://www.soundjay.com/misc/sounds/rain-01.wav', // Replace with your cloud URL
  },
  {
    id: '2',
    title: 'Forest Birds',
    url: 'https://www.soundjay.com/misc/sounds/birds-01.wav', // Replace with your cloud URL
  },
  {
    id: '3',
    title: 'Ocean Waves',
    url: 'https://www.soundjay.com/misc/sounds/waves-01.wav', // Replace with your cloud URL
  },
  {
    id: '4',
    title: 'Wind in Trees',
    url: 'https://www.soundjay.com/misc/sounds/wind-01.wav', // Replace with your cloud URL
  },
  {
    id: '5',
    title: 'Crackling Fire',
    url: 'https://www.soundjay.com/misc/sounds/fire-01.wav', // Replace with your cloud URL
  },
  {
    id: '6',
    title: 'Thunderstorm',
    url: 'https://www.soundjay.com/misc/sounds/thunder-01.wav', // Replace with your cloud URL
  },
  {
    id: '7',
    title: 'Cafe Ambiance',
    url: 'https://www.soundjay.com/misc/sounds/cafe-01.wav', // Replace with your cloud URL
  },
  {
    id: '8',
    title: 'White Noise',
    url: 'https://www.soundjay.com/misc/sounds/whitenoise-01.wav', // Replace with your cloud URL
  },
];

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider = ({ children }: AudioProviderProps) => {
  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
      audioRef.current.preload = 'metadata';
      
      const audio = audioRef.current;

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };

      const handleLoadedMetadata = () => {
        setDuration(audio.duration || 0);
      };

      const handleEnded = () => {
        nextTrack();
      };

      const handleCanPlay = () => {
        // Audio is ready to play
      };

      const handleError = (e: unknown) => {
        console.error('Audio error:', e);
        // Try next track on error
        setTimeout(() => {
          nextTrack();
        }, 1000);
      };

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('error', handleError);

      // Load initial track
      if (AUDIO_TRACKS[currentTrackIndex]) {
        audio.src = AUDIO_TRACKS[currentTrackIndex].url;
        audio.load();
      }

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
        audio.pause();
      };
    }
  }, []);

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current && AUDIO_TRACKS[currentTrackIndex]) {
      const wasPlaying = isPlaying;
      const currentTrack = AUDIO_TRACKS[currentTrackIndex];
      
      audioRef.current.src = currentTrack.url;
      audioRef.current.load();
      
      if (wasPlaying) {
        // Small delay to ensure audio is loaded
        setTimeout(() => {
          audioRef.current?.play().catch(console.error);
        }, 100);
      }
    }
  }, [currentTrackIndex, isPlaying]);

  // Audio controls
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % AUDIO_TRACKS.length);
    setCurrentTime(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + AUDIO_TRACKS.length) % AUDIO_TRACKS.length);
    setCurrentTime(0);
  };

  const selectTrack = (index: number) => {
    if (index >= 0 && index < AUDIO_TRACKS.length) {
      setCurrentTrackIndex(index);
      setCurrentTime(0);
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current && time >= 0 && time <= duration) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const contextValue: AudioContextType = {
    // State
    isPlaying,
    isMuted,
    volume,
    currentTrackIndex,
    currentTime,
    duration,
    tracks: AUDIO_TRACKS,
    
    // Controls
    togglePlay,
    toggleMute,
    setVolume,
    nextTrack,
    prevTrack,
    selectTrack,
    seekTo,
    
    // Ref
    audioRef,
  };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
};