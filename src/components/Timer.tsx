"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from './ui/button';
import { RotateCcw, Settings } from 'lucide-react';
import NavigationMenu from './NavigationMenu';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

interface TimerSettings {
  workTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  longBreakInterval: number;
}

const Timer = () => {
  const [settings, setSettings] = useState<TimerSettings>({
    workTime: 1500, // 25 minutes
    shortBreakTime: 300, // 5 minutes
    longBreakTime: 900, // 15 minutes
    longBreakInterval: 4 // Long break after every 4 work sessions
  });

  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(settings.workTime);
  const [currentMode, setCurrentMode] = useState<TimerMode>('work');
  const [completedWorkSessions, setCompletedWorkSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/alarm.mp3');
    audioRef.current.preload = 'auto';
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Play alarm when timer reaches 0
      playAlarm();
      setIsRunning(false);
      
      // Auto-progression logic
      if (currentMode === 'work') {
        const newCompletedSessions = completedWorkSessions + 1;
        setCompletedWorkSessions(newCompletedSessions);
        
        // Determine next mode based on completed sessions
        if (newCompletedSessions % settings.longBreakInterval === 0) {
          // Time for long break
          setCurrentMode('longBreak');
          setTimeLeft(settings.longBreakTime);
        } else {
          // Time for short break
          setCurrentMode('shortBreak');
          setTimeLeft(settings.shortBreakTime);
        }
        
        // Auto-start the break
        setTimeout(() => {
          setIsRunning(true);
        }, 1000); // 1 second delay to let user see the mode change
      } else {
        // Break finished, return to work
        setCurrentMode('work');
        setTimeLeft(settings.workTime);
        // Don't auto-start work, let user decide when to start
      }
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft, currentMode, completedWorkSessions, settings]);

  const playAlarm = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.log('Could not play alarm sound:', error);
      });
    }
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const stopTimer = () => {
    setIsRunning(prev => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    const defaultTime = getCurrentModeTime();
    setTimeLeft(defaultTime);
  };

  const getCurrentModeTime = () => {
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
  };

  const handleModeChange = (mode: TimerMode) => {
    setCurrentMode(mode);
    setIsRunning(false);
    
    let newTime;
    switch (mode) {
      case 'shortBreak':
        newTime = settings.shortBreakTime;
        break;
      case 'longBreak':
        newTime = settings.longBreakTime;
        break;
      default:
        newTime = settings.workTime;
    }
    
    setTimeLeft(newTime);
    
  };

  const handleSaveSettings = () => {
    const newTime = getCurrentModeTime();
    setTimeLeft(newTime);
    setIsRunning(false);
    

    setShowSettings(false);
  };

  const getButtonClassName = (mode: TimerMode) => {
    const baseClasses = 'px-4 py-2 mx-4 cursor-pointer transition-all duration-200';
    
    if (currentMode === mode) {
      switch (mode) {
        case 'shortBreak':
          return `${baseClasses} bg-green-500 hover:bg-green-600 text-white border-green-500 text-lg h-12 px-6`;
        case 'longBreak':
          return `${baseClasses} bg-blue-500 hover:bg-blue-600 text-white border-blue-500 text-lg h-12 px-6`;
        case 'work':
          return `${baseClasses} bg-red-500 hover:bg-red-600 text-white border-red-500 text-lg h-12 px-6`;
        default:
          return baseClasses;
      }
    }
    
    return `${baseClasses} hover:bg-gray-100 hover:text-black border border-black text-lg h-12 px-6`;
  };

  const handleSettingsChange = (key: keyof TimerSettings, value: number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div>
      <div className='flex flex-col justify-center items-center'>
        {/* Settings Modal */}
        {showSettings && (
          <div className='fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50'>
            <div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='text-lg font-semibold'>Timer Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className='text-gray-500 hover:text-gray-700 text-xl'
                >
                  ×
                </button>
              </div>
              
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium mb-1'>Work Time (minutes)</label>
                  <input
                    type='number'
                    value={Math.round(settings.workTime / 60)}
                    onChange={(e) => handleSettingsChange('workTime', parseInt(e.target.value) * 60 || 1500)}
                    className='w-full p-2 border rounded'
                    min='1'
                    max='120'
                  />
                </div>
                
                <div>
                  <label className='block text-sm font-medium mb-1'>Short Break (minutes)</label>
                  <input
                    type='number'
                    value={Math.round(settings.shortBreakTime / 60)}
                    onChange={(e) => handleSettingsChange('shortBreakTime', parseInt(e.target.value) * 60 || 300)}
                    className='w-full p-2 border rounded'
                    min='1'
                    max='30'
                  />
                </div>
                
                <div>
                  <label className='block text-sm font-medium mb-1'>Long Break (minutes)</label>
                  <input
                    type='number'
                    value={Math.round(settings.longBreakTime / 60)}
                    onChange={(e) => handleSettingsChange('longBreakTime', parseInt(e.target.value) * 60 || 900)}
                    className='w-full p-2 border rounded'
                    min='1'
                    max='60'
                  />
                </div>
                
                <div>
                  <label className='block text-sm font-medium mb-1'>Long Break Interval (work sessions)</label>
                  <input
                    type='number'
                    value={settings.longBreakInterval}
                    onChange={(e) => handleSettingsChange('longBreakInterval', parseInt(e.target.value) || 4)}
                    className='w-full p-2 border rounded'
                    min='2'
                    max='10'
                  />
                </div>
              </div>
              
              <div className='mt-4 text-sm text-gray-600'>
                <p>Completed work sessions: {completedWorkSessions}</p>
                <p>Next break: {completedWorkSessions % settings.longBreakInterval === settings.longBreakInterval - 1 ? 'Long' : 'Short'}</p>
              </div>
              
              <div className='mt-6 flex justify-end space-x-2'>
                <Button
                    onClick={handleSaveSettings}
                    className='bg-green-500 hover:bg-green-600 text-white px-4 py-2'
                >
                    Save
                </Button>
                <Button
                    onClick={() => setShowSettings(false)}
                    className='bg-gray-500 hover:bg-gray-600 text-white px-4 py-2'
                >
                    Cancel
                </Button>
            </div>
            </div>
          </div>
        )}

        {/* Mode Buttons */}
        <div className='mb-8 flex justify-center items-center'>
          <Button 
            className={getButtonClassName('work')}
            onClick={() => handleModeChange('work')}
          >
            Work
          </Button>
          <Button 
            className={getButtonClassName('shortBreak')}
            onClick={() => handleModeChange('shortBreak')}
          >
            Short Break
          </Button>
          <Button 
            className={getButtonClassName('longBreak')}
            onClick={() => handleModeChange('longBreak')}
          >
            Long Break
          </Button>
        </div>
        
        {/* Current Mode Display */}
        <div className='mb-4 text-2xl font-medium text-gray-600'>
          {currentMode === 'work' && 'Focus Time'}
          {currentMode === 'shortBreak' && 'Short Break'}
          {currentMode === 'longBreak' && 'Long Break'}
        </div>
        
        {/* Timer Display */}
        <div className='text-9xl font-bold'>{formatTime(timeLeft)}</div>
        
        {/* Control Buttons */}
        <div className='mt-8 flex justify-center items-center'>
          <Button 
            className='mx-4 h-12 px-6 cursor-pointer hover:bg-white hover:text-black border border-black text-lg' 
            onClick={stopTimer}
          >
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <RotateCcw 
            className='cursor-pointer mx-4 size-10 hover:text-gray-600 transition-colors'
            onClick={resetTimer}
          />
          <Settings 
            className='cursor-pointer mx-4 size-10 hover:text-gray-600 transition-colors'
            onClick={() => setShowSettings(true)}
          />
        </div>
      </div>
    </div>
  );
};

export default Timer;