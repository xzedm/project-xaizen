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
    const baseClasses = 'px-2 sm:px-4 py-2 cursor-pointer transition-all duration-200 text-sm sm:text-base lg:text-lg h-10 sm:h-12';
    
    if (currentMode === mode) {
      switch (mode) {
        case 'shortBreak':
          return `${baseClasses} bg-green-500 hover:bg-green-600 text-white border-green-500`;
        case 'longBreak':
          return `${baseClasses} bg-blue-500 hover:bg-blue-600 text-white border-blue-500`;
        case 'work':
          return `${baseClasses} bg-red-500 hover:bg-red-600 text-white border-red-500`;
        default:
          return baseClasses;
      }
    }
    
    return `${baseClasses} hover:bg-gray-100 hover:text-black border border-black dark:text-white dark:bg-transparent dark:border-white dark:hover:bg-white dark:hover:text-black`;
  };

  const handleTempSettingsChange = (key: keyof TimerSettings, value: number) => {
    setTempSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className='flex flex-col justify-center items-center'>
        {/* Settings Modal */}
        {showSettings && (
          <div className='fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-lg shadow-lg w-full max-w-md mx-4 dark:bg-[#1a1a1a] max-h-[90vh] overflow-y-auto'>
              <div className='p-4 sm:p-6'>
                <div className='flex justify-between items-center mb-4'>
                  <h3 className='text-lg sm:text-xl font-semibold'>Timer Settings</h3>
                  <button
                    onClick={handleCancelSettings}
                    className='text-gray-500 hover:text-gray-700 text-xl sm:text-2xl cursor-pointer p-1'
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
                      className='w-full p-2 sm:p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-base dark:bg-[#111111] dark:border-white dark:text-white'
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
                      className='w-full p-2 sm:p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-base dark:bg-[#111111] dark:border-white dark:text-white'
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
                      className='w-full p-2 sm:p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-base dark:bg-[#111111] dark:border-white dark:text-white'
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
                      className='w-full p-2 sm:p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-base dark:bg-[#111111] dark:border-white dark:text-white'
                      min='2'
                      max='10'
                    />
                  </div>
                </div>
                
                <div className='mt-4 text-sm text-gray-600 dark:text-gray-300 space-y-1'>
                  <p>Completed work sessions: {completedWorkSessions}</p>
                  <p>Next break: {completedWorkSessions % settings.longBreakInterval === settings.longBreakInterval - 1 ? 'Long' : 'Short'}</p>
                </div>
                
                <div className='mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2'>
                  <Button
                    onClick={handleSaveSettings}
                    className='w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white px-4 py-2 order-2 sm:order-1'
                  >
                    Save
                  </Button>
                  <Button
                    onClick={handleCancelSettings}
                    className='w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 order-1 sm:order-2'
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mode Buttons */}
        <div className='mb-6 sm:mb-8 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-0 w-full max-w-lg'>
          <Button 
            className={`${getButtonClassName('work')} w-full sm:w-auto sm:mx-2`}
            onClick={() => handleModeChange('work')}
          >
            Work
          </Button>
          <Button 
            className={`${getButtonClassName('shortBreak')} w-full sm:w-auto sm:mx-2`}
            onClick={() => handleModeChange('shortBreak')}
          >
            Short Break
          </Button>
          <Button 
            className={`${getButtonClassName('longBreak')} w-full sm:w-auto sm:mx-2`}
            onClick={() => handleModeChange('longBreak')}
          >
            Long Break
          </Button>
        </div>
        
        {/* Current Mode Display */}
        <div className='mb-4 text-lg sm:text-xl lg:text-2xl font-medium text-gray-600 dark:text-white text-center'>
          {currentMode === 'work' && 'Focus Time'}
          {currentMode === 'shortBreak' && 'Short Break'}
          {currentMode === 'longBreak' && 'Long Break'}
        </div>
        
        {/* Timer Display */}
        <div className='text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-center mb-6 sm:mb-8 break-all sm:break-normal'>
          {formatTime(timeLeft)}
        </div>
        
        {/* Control Buttons */}
        <div className='flex justify-center items-center gap-4 sm:gap-6 flex-wrap'>
          <Button 
            className='h-10 sm:h-12 px-4 sm:px-6 cursor-pointer hover:bg-white hover:text-black border border-black text-sm sm:text-base lg:text-lg dark:text-white dark:bg-transparent dark:border-white dark:hover:bg-white dark:hover:text-black min-w-[80px] sm:min-w-[100px]' 
            onClick={stopTimer}
          >
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <RotateCcw 
            className='cursor-pointer size-8 sm:size-10 hover:text-gray-600 transition-colors touch-manipulation'
            onClick={resetTimer}
          />
          <Settings 
            className='cursor-pointer size-8 sm:size-10 hover:text-gray-600 transition-colors touch-manipulation'
            onClick={handleOpenSettings}
          />
        </div>
      </div>
    </div>
  );
};

export default Timer;