"use client"

import { useState } from 'react'
import { Button } from './ui/button';
import { RotateCcw, Settings } from 'lucide-react';
import { useTimer } from './TimerContext';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

interface TimerSettings {
  workTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  longBreakInterval: number;
}

const Timer = () => {
  const {
    settings,
    setSettings,
    isRunning,
    timeLeft,
    currentMode,
    completedWorkSessions,
    formatTime,
    stopTimer,
    resetTimer,
    getCurrentModeTime,
    handleModeChange
  } = useTimer();

  const [showSettings, setShowSettings] = useState(false);
  const [tempSettings, setTempSettings] = useState<TimerSettings>(settings);

  // Update temp settings when modal opens
  const handleOpenSettings = () => {
    setTempSettings(settings);
    setShowSettings(true);
  };

  const handleSaveSettings = () => {
    setSettings(tempSettings);
    setShowSettings(false);
  };

  const handleCancelSettings = () => {
    setTempSettings(settings); // Reset to current settings
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

  const handleTempSettingsChange = (key: keyof TimerSettings, value: number) => {
    setTempSettings(prev => ({
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
                  onClick={handleCancelSettings}
                  className='text-gray-500 hover:text-gray-700 text-xl cursor-pointer'
                >
                  ×
                </button>
              </div>
              
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium mb-1'>Work Time (minutes)</label>
                  <input
                    type='number'
                    value={Math.round(tempSettings.workTime / 60)}
                    onChange={(e) => handleTempSettingsChange('workTime', Math.max(1, parseInt(e.target.value) || 1) * 60)}
                    className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                    min='1'
                    max='120'
                  />
                </div>
                
                <div>
                  <label className='block text-sm font-medium mb-1'>Short Break (minutes)</label>
                  <input
                    type='number'
                    value={Math.round(tempSettings.shortBreakTime / 60)}
                    onChange={(e) => handleTempSettingsChange('shortBreakTime', Math.max(1, parseInt(e.target.value) || 1) * 60)}
                    className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                    min='1'
                    max='30'
                  />
                </div>
                
                <div>
                  <label className='block text-sm font-medium mb-1'>Long Break (minutes)</label>
                  <input
                    type='number'
                    value={Math.round(tempSettings.longBreakTime / 60)}
                    onChange={(e) => handleTempSettingsChange('longBreakTime', Math.max(1, parseInt(e.target.value) || 1) * 60)}
                    className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                    min='1'
                    max='60'
                  />
                </div>
                
                <div>
                  <label className='block text-sm font-medium mb-1'>Long Break Interval (work sessions)</label>
                  <input
                    type='number'
                    value={tempSettings.longBreakInterval}
                    onChange={(e) => handleTempSettingsChange('longBreakInterval', Math.max(2, parseInt(e.target.value) || 2))}
                    className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
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
                  onClick={handleCancelSettings}
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
            onClick={handleOpenSettings}
          />
        </div>
      </div>
    </div>
  );
};

export default Timer;