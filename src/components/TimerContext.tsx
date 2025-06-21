"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface TimerSettings {
  workTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  longBreakInterval: number;
}

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

interface TimerContextType {
  settings: TimerSettings;
  setSettings: React.Dispatch<React.SetStateAction<TimerSettings>>;
  isRunning: boolean;
  timeLeft: number;
  currentMode: TimerMode;
  completedWorkSessions: number;
  formatTime: (seconds: number) => string;
  stopTimer: () => void;
  resetTimer: () => void;
  getCurrentModeTime: () => number;
  handleModeChange: (mode: TimerMode) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

// Default settings
const DEFAULT_SETTINGS: TimerSettings = {
  workTime: 25 * 60, // 25 minutes
  shortBreakTime: 5 * 60, // 5 minutes
  longBreakTime: 15 * 60, // 15 minutes
  longBreakInterval: 4 // Every 4 work sessions
};

// Storage keys
const STORAGE_KEYS = {
  SETTINGS: 'pomodoro_settings',
  COMPLETED_SESSIONS: 'pomodoro_completed_sessions',
  CURRENT_MODE: 'pomodoro_current_mode'
};

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load settings from localStorage or use defaults
  const [settings, setSettings] = useState<TimerSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
      } catch (error) {
        console.error('Error loading settings from localStorage:', error);
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Load other state from localStorage
  const [currentMode, setCurrentMode] = useState<TimerMode>(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem(STORAGE_KEYS.CURRENT_MODE);
      return (savedMode as TimerMode) || 'work';
    }
    return 'work';
  });

  const [completedWorkSessions, setCompletedWorkSessions] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedSessions = localStorage.getItem(STORAGE_KEYS.COMPLETED_SESSIONS);
      return savedSessions ? parseInt(savedSessions) : 0;
    }
    return 0;
  });

  const [timeLeft, setTimeLeft] = useState(() => {
    // Initialize with current mode time
    const modeTime = currentMode === 'work' ? settings.workTime : 
                    currentMode === 'shortBreak' ? settings.shortBreakTime : 
                    settings.longBreakTime;
    return modeTime;
  });

  const [isRunning, setIsRunning] = useState(false);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      } catch (error) {
        console.error('Error saving settings to localStorage:', error);
      }
    }
  }, [settings]);

  // Save completed sessions to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.COMPLETED_SESSIONS, completedWorkSessions.toString());
      } catch (error) {
        console.error('Error saving completed sessions to localStorage:', error);
      }
    }
  }, [completedWorkSessions]);

  // Save current mode to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.CURRENT_MODE, currentMode);
      } catch (error) {
        console.error('Error saving current mode to localStorage:', error);
      }
    }
  }, [currentMode]);

  // Update timeLeft when settings change for current mode
  useEffect(() => {
    if (!isRunning) {
      const newTime = getCurrentModeTime();
      setTimeLeft(newTime);
    }
  }, [settings, currentMode]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false);
            // Handle timer completion
            if (currentMode === 'work') {
              setCompletedWorkSessions(prev => prev + 1);
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeLeft, currentMode]);

  const getCurrentModeTime = useCallback(() => {
    switch (currentMode) {
      case 'work':
        return settings.workTime;
      case 'shortBreak':
        return settings.shortBreakTime;
      case 'longBreak':
        return settings.longBreakTime;
      default:
        return settings.workTime;
    }
  }, [currentMode, settings]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const stopTimer = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(getCurrentModeTime());
  }, [getCurrentModeTime]);

  const handleModeChange = useCallback((mode: TimerMode) => {
    setCurrentMode(mode);
    setIsRunning(false);
    // timeLeft will be updated by the useEffect above
  }, []);

  // Enhanced setSettings that preserves current timer state
  const enhancedSetSettings = useCallback((newSettings: React.SetStateAction<TimerSettings>) => {
    setSettings(prevSettings => {
      const updatedSettings = typeof newSettings === 'function' ? newSettings(prevSettings) : newSettings;
      
      // If timer is not running, update timeLeft to reflect new settings
      if (!isRunning) {
        const newTime = currentMode === 'work' ? updatedSettings.workTime : 
                       currentMode === 'shortBreak' ? updatedSettings.shortBreakTime : 
                       updatedSettings.longBreakTime;
        setTimeLeft(newTime);
      }
      
      return updatedSettings;
    });
  }, [currentMode, isRunning]);

  const value: TimerContextType = {
    settings,
    setSettings: enhancedSetSettings,
    isRunning,
    timeLeft,
    currentMode,
    completedWorkSessions,
    formatTime,
    stopTimer,
    resetTimer,
    getCurrentModeTime,
    handleModeChange
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};