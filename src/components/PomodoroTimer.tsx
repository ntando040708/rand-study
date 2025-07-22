import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings, Clock } from 'lucide-react';
import { PomodoroSettings } from '../utils/types';

interface PomodoroTimerProps {
  settings: PomodoroSettings;
  onSettingsChange: (settings: PomodoroSettings) => void;
  onSessionComplete: () => void;
  isActive: boolean;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  settings,
  onSettingsChange,
  onSessionComplete,
  isActive
}) => {
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => {
          if (timeLeft <= 1) {
            handleTimerComplete();
            return 0;
          }
          return timeLeft - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (!isBreak) {
      // Work session completed
      const newSessionCount = sessionCount + 1;
      setSessionCount(newSessionCount);
      onSessionComplete();
      
      // Start break
      const isLongBreak = newSessionCount % settings.sessionsUntilLongBreak === 0;
      const breakDuration = isLongBreak ? settings.longBreakDuration : settings.shortBreakDuration;
      
      setTimeLeft(breakDuration * 60);
      setIsBreak(true);
      
      if (settings.autoStartBreaks) {
        setIsRunning(true);
      }
    } else {
      // Break completed
      setTimeLeft(settings.workDuration * 60);
      setIsBreak(false);
      
      if (settings.autoStartSessions) {
        setIsRunning(true);
      }
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isBreak ? 
      (sessionCount % settings.sessionsUntilLongBreak === 0 ? settings.longBreakDuration : settings.shortBreakDuration) * 60 :
      settings.workDuration * 60
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isBreak ? 
    1 - (timeLeft / ((sessionCount % settings.sessionsUntilLongBreak === 0 ? settings.longBreakDuration : settings.shortBreakDuration) * 60)) :
    1 - (timeLeft / (settings.workDuration * 60));

  if (!isActive) return null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <Clock className="w-5 h-5 text-red-500 mr-2" />
          Pomodoro Timer
        </h3>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Timer Display */}
      <div className="text-center mb-6">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke={isBreak ? "#10b981" : "#ef4444"}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-gray-900">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-600">
                {isBreak ? 'Break Time' : 'Focus Time'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2 mb-4">
          {Array.from({ length: settings.sessionsUntilLongBreak }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < sessionCount % settings.sessionsUntilLongBreak
                  ? 'bg-red-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <p className="text-sm text-gray-600">
          Session {sessionCount + 1} • {sessionCount} completed today
        </p>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-3">
        <button
          onClick={toggleTimer}
          className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-colors ${
            isRunning
              ? 'bg-yellow-500 text-white hover:bg-yellow-600'
              : isBreak
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-red-500 text-white hover:bg-red-600'
          }`}
        >
          {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {isRunning ? 'Pause' : 'Start'}
        </button>
        
        <button
          onClick={resetTimer}
          className="flex items-center px-4 py-3 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-4">Pomodoro Settings</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Work Duration: {settings.workDuration} minutes
              </label>
              <input
                type="range"
                min="15"
                max="60"
                value={settings.workDuration}
                onChange={(e) => onSettingsChange({
                  ...settings,
                  workDuration: parseInt(e.target.value)
                })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Break: {settings.shortBreakDuration} minutes
              </label>
              <input
                type="range"
                min="3"
                max="15"
                value={settings.shortBreakDuration}
                onChange={(e) => onSettingsChange({
                  ...settings,
                  shortBreakDuration: parseInt(e.target.value)
                })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Long Break: {settings.longBreakDuration} minutes
              </label>
              <input
                type="range"
                min="15"
                max="45"
                value={settings.longBreakDuration}
                onChange={(e) => onSettingsChange({
                  ...settings,
                  longBreakDuration: parseInt(e.target.value)
                })}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Auto-start breaks</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoStartBreaks}
                  onChange={(e) => onSettingsChange({
                    ...settings,
                    autoStartBreaks: e.target.checked
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};