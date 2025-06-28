"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Music, Volume2, VolumeX, Play, Pause, SkipForward, SkipBack, Maximize2, Minimize2, GripVertical } from 'lucide-react';
import { Button } from './ui/button';

interface AudioTrack {
  id: string;
  title: string;
  url: string;
  duration?: number;
}


const AUDIO_TRACKS: AudioTrack[] = [
  {
    id: '1',
    title: 'Rain Sounds',
    url: 'https://res.cloudinary.com/dr4chxiph/video/upload/v1750396317/rain_wxnisk.mp3',
  },
  {
    id: '2',
    title: 'Forest Birds',
    url: 'https://res.cloudinary.com/dr4chxiph/video/upload/v1750396319/bird_sadrzk.mp3',
  },
  {
    id: '3',
    title: 'Ocean Waves',
    url: 'https://res.cloudinary.com/dr4chxiph/video/upload/v1750396322/waves_e9p5qj.mp3',
  },
  {
    id: '4',
    title: 'Wind in Trees',
    url: 'https://res.cloudinary.com/dr4chxiph/video/upload/v1750396316/wind_aeubc6.mp3',
  },
  {
    id: '5',
    title: 'Crackling Fire',
    url: 'https://res.cloudinary.com/dr4chxiph/video/upload/v1750396316/fire_d9i5uk.mp3',
  },
];

interface Position {
  x: number;
  y: number;
}

const AudioPlayer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 20, y: 20 });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playerRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef<Position>({ x: 0, y: 0 });
  const initialPositionRef = useRef<Position>({ x: 0, y: 0 });

  const currentTrack = AUDIO_TRACKS[currentTrackIndex];

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    audioRef.current.volume = volume;
    
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      nextTrack();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const wasPlaying = isPlaying;
      audioRef.current.src = currentTrack.url;
      audioRef.current.load();
      
      if (wasPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentTrackIndex]);

  // Optimized mouse move handler using useCallback
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    const newX = initialPositionRef.current.x + deltaX;
    const newY = initialPositionRef.current.y + deltaY;

    // Keep within viewport bounds
    const maxX = window.innerWidth - (isExpanded ? 320 : 60);
    const maxY = window.innerHeight - (isExpanded ? 400 : 60);

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    });
  }, [isDragging, isExpanded]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Set up drag event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      // Prevent text selection while dragging
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Handle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  // Handle mute/unmute
  const toggleMute = () => {
    if (!audioRef.current) return;
    
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Next track
  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % AUDIO_TRACKS.length);
  };

  // Previous track
  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + AUDIO_TRACKS.length) % AUDIO_TRACKS.length);
  };

  // Select specific track
  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
  };

  // Format time
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Improved mouse down handler
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start dragging if clicking on draggable areas
    const target = e.target as HTMLElement;
    const isDraggableArea = 
      target === e.currentTarget || 
      target.classList.contains('drag-handle') ||
      target.closest('.draggable-header');

    if (!isDraggableArea) return;

    e.preventDefault();
    setIsDragging(true);
    
    // Store initial positions
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    initialPositionRef.current = { ...position };
  };

  return (
    <div
      ref={playerRef}
      className={`fixed z-[60] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 transition-all duration-300 ${
        isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
      }`}
      style={{
        left: position.x,
        top: position.y,
        width: isExpanded ? '320px' : '60px',
        height: isExpanded ? 'auto' : '60px',
        transform: isDragging ? 'scale(1.02)' : 'scale(1)', // Subtle feedback
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Minimized State */}
      {!isExpanded && (
        <div className="w-full h-full flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(true);
            }}
            className="w-12 h-12 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Music className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Expanded State */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Header with drag handle and minimize button */}
          <div className="flex items-center justify-between draggable-header">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-gray-400 drag-handle cursor-grab" />
              <Music className="h-5 w-5" />
              <span className="font-medium text-sm">Ambient Sounds</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }}
              className="h-8 w-8"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Current Track Info */}
          <div className="text-center">
            <h3 className="font-medium text-sm truncate">{currentTrack.title}</h3>
            <div className="text-xs text-gray-500 mt-1">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Progress Bar */}
          <div
            className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full cursor-pointer"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-100"
              style={{
                width: duration ? `${(currentTime / duration) * 100}%` : '0%',
              }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-2">
            <Button variant="ghost" size="icon" onClick={prevTrack} className="h-8 w-8">
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={togglePlay} className="h-10 w-10">
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={nextTrack} className="h-8 w-8">
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleMute} className="h-8 w-8">
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Track List */}
          <div className="max-h-48 overflow-y-auto space-y-1">
            <h4 className="text-xs font-medium text-gray-500 mb-2">PLAYLIST</h4>
            {AUDIO_TRACKS.map((track, index) => (
              <div
                key={track.id}
                className={`p-2 rounded cursor-pointer text-sm transition-colors ${
                  index === currentTrackIndex
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  selectTrack(index);
                }}
              >
                <div className="flex items-center gap-2">
                  {index === currentTrackIndex && isPlaying && (
                    <div className="w-3 h-3 flex items-center justify-center">
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
                    </div>
                  )}
                  <span className="truncate">{track.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visual indicator when playing (minimized state) */}
      {!isExpanded && isPlaying && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
      )}
    </div>
  );
};

export default AudioPlayer;