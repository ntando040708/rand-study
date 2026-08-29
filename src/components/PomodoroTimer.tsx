import React, { useState, useEffect, useRef } from 'react';
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

  // Keep track of the latest state to avoid stale closures in the interval
  const stateRef = useRef({ isBreak, sessionCount, settings });
  
  useEffect(() => {
    stateRef.current = { isBreak, sessionCount, settings };
  }, [isBreak, sessionCount, settings]);

  // 1. Sync timer if settings change while paused
  useEffect(() => {
    if (!isRunning) {
      const currentDuration = isBreak 
        ? (sessionCount % settings.sessionsUntilLongBreak === 0 ? settings.longBreakDuration : settings.shortBreakDuration)
        : settings.workDuration;
      setTimeLeft(currentDuration * 60);
    }
  }, [settings.workDuration, settings.shortBreakDuration, settings.longBreakDuration]);

  // 2. Update Browser Tab Title
  useEffect(() => {
    if (isActive) {
      const mins = Math.floor(timeLeft / 60);
      const secs = timeLeft % 60;
      const formattedTime = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      document.title = `${formattedTime} - ${isBreak ? 'Break' : 'Focus'}`;
    }
  }, [timeLeft, isBreak, isActive]);

  const playNotificationSound = () => {
    // Standard browser beep (you can replace this with a nice bell .mp3)
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4 note
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
  };

  const handleTimerComplete = () => {
    const { isBreak: currentIsBreak, sessionCount: currentSessionCount, settings: currentSettings } = stateRef.current;
    
    setIsRunning(false);
    playNotificationSound();
    
    if (!currentIsBreak) {
      const newSessionCount = currentSessionCount + 1;
      setSessionCount(newSessionCount);
      onSessionComplete();
      
      const isLongBreak = newSessionCount % currentSettings.sessionsUntilLongBreak === 0;
      const breakDuration = isLongBreak ? currentSettings.longBreakDuration : currentSettings.shortBreakDuration;
      
      setTimeLeft(breakDuration * 60);
      setIsBreak(true);
      
      if (currentSettings.autoStartBreaks) {
        setIsRunning(true);
      }
    } else {
      setTimeLeft(currentSettings.workDuration * 60);
      setIsBreak(false);
      
      if (currentSettings.autoStartSessions) {
        setIsRunning(true);
      }
    }
  };

  // 3. Optimized Interval (Doesn't recreate every second)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval!); // Stop immediately
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]); // Only re-run when play/pause is toggled

  const toggleTimer = () => setIsRunning(!isRunning);

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
    // Your existing JSX rendering goes here exactly as you wrote it.
    // The UI logic is already perfectly fine!
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      {/* ... Rest of your UI ... */}
    </div>
  );
};
