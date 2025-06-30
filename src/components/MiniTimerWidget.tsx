"use client"

import { useTimer } from './TimerContext'; // Adjust the import path as needed
import { Play, Pause, RotateCcw } from 'lucide-react';

const MiniTimerWidget = () => {
  const {
    isRunning,
    timeLeft,
    currentMode,
    formatTime,
    stopTimer,
    resetTimer
  } = useTimer();

  const getModeColor = () => {
    switch (currentMode) {
      case 'work':
        return 'text-red-500';
      case 'shortBreak':
        return 'text-green-500';
      case 'longBreak':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const getModeText = () => {
    switch (currentMode) {
      case 'work':
        return 'Focus';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return 'Timer';
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-3 border border-gray-200 z-50">
      <div className="flex items-center space-x-3">
        <div className="text-center">
          <div className={`text-xs font-medium ${getModeColor()}`}>
            {getModeText()}
          </div>
          <div className="text-lg font-mono font-bold">
            {formatTime(timeLeft)}
          </div>
        </div>
        
        <div className="flex space-x-1">
          <button
            onClick={stopTimer}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title={isRunning ? 'Pause' : 'Start'}
          >
            {isRunning ? (
              <Pause className="w-4 h-4 cursor-pointer" />
            ) : (
              <Play className="w-4 h-4 cursor-pointer" />
            )}
          </button>
          
          <button
            onClick={resetTimer}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4 cursor-pointer" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniTimerWidget;