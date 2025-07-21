import React, { useState, useEffect } from 'react';
import { Coffee, ArrowRight, SkipForward, Play, Brain, Heart } from 'lucide-react';
import { StudySession, MoodEntry } from '../utils/types';
import { BREAK_SUGGESTIONS } from '../utils/constants';
import { StudyAnalytics } from '../utils/analytics';

interface BreakScreenProps {
  session: StudySession;
  moodEntries: MoodEntry[];
  onCompleteBreak: () => void;
  onSkipBreak: () => void;
}

export const BreakScreen: React.FC<BreakScreenProps> = ({
  session,
  moodEntries,
  onCompleteBreak,
  onSkipBreak
}) => {
  const optimalBreakTime = StudyAnalytics.calculateOptimalBreakTime(moodEntries);
  const [timeLeft, setTimeLeft] = useState(optimalBreakTime * 60);
  const [selectedSuggestion, setSelectedSuggestion] = useState(BREAK_SUGGESTIONS[0]);
  const [isActive, setIsActive] = useState(false);
  const [motivationalTip, setMotivationalTip] = useState('');

  useEffect(() => {
    // Generate personalized motivational tip based on recent mood
    const recentMoods = moodEntries.slice(-3);
    const avgRecentMood = recentMoods.length > 0 
      ? recentMoods.reduce((sum, entry) => sum + entry.mood, 0) / recentMoods.length 
      : 3;

    if (avgRecentMood < 2.5) {
      setMotivationalTip("Remember: Every small step counts. You're building great study habits! 💪");
    } else if (avgRecentMood > 4) {
      setMotivationalTip("You're on fire! Keep up this amazing momentum! 🔥");
    } else {
      setMotivationalTip("You're doing great! This break will help you stay focused. 🌟");
    }
  }, [moodEntries]);

  useEffect(() => {
    setTimeLeft(selectedSuggestion.duration * 60);
  }, [selectedSuggestion]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => {
          if (timeLeft <= 1) {
            setIsActive(false);
            return 0;
          }
          return timeLeft - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startBreak = () => {
    setIsActive(true);
  };

  const resetBreak = () => {
    setIsActive(false);
    setTimeLeft(selectedSuggestion.duration * 60);
  };

  const IconComponent = require('lucide-react')[selectedSuggestion.icon] || Coffee;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          {/* Header */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Coffee className="w-10 h-10 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Time for a Break!
            </h2>
            <p className="text-gray-600">
              You've been studying hard. Let's recharge your mind.
            </p>
            {motivationalTip && (
              <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center">
                  <Heart className="w-5 h-5 text-blue-600 mr-2" />
                  <p className="text-sm text-blue-800">{motivationalTip}</p>
                </div>
              </div>
            )}
          </div>

          {/* Timer */}
          <div className="mb-8">
            <div className="text-6xl font-mono font-bold text-orange-600 mb-4">
              {formatTime(timeLeft)}
            </div>
            <p className="text-sm text-gray-500 mb-2">
              Optimal break time: {optimalBreakTime} minutes
            </p>
            {timeLeft === 0 && (
              <p className="text-green-600 font-semibold">Break complete! 🎉</p>
            )}
          </div>

          {/* Break Suggestions */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Break Activities</h3>
            <div className="grid grid-cols-2 gap-3">
              {BREAK_SUGGESTIONS.map((suggestion) => {
                const SuggestionIcon = require('lucide-react')[suggestion.icon] || Coffee;
                return (
                  <button
                    key={suggestion.id}
                    onClick={() => setSelectedSuggestion(suggestion)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      selectedSuggestion.id === suggestion.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <SuggestionIcon className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                    <p className="text-sm font-medium text-gray-900">
                      {suggestion.title}
                    </p>
                    <p className="text-xs text-gray-600">
                      {suggestion.duration} min
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Activity */}
          <div className="bg-orange-50 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <IconComponent className="w-6 h-6 text-orange-600 mr-2" />
              <h4 className="font-semibold text-gray-900">{selectedSuggestion.title}</h4>
            </div>
            <p className="text-sm text-gray-600">{selectedSuggestion.description}</p>
          </div>

          {/* Controls */}
          <div className="space-y-3">
            {!isActive && timeLeft > 0 && (
              <button
                onClick={startBreak}
                className="w-full bg-orange-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-orange-700 transition-colors flex items-center justify-center"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Break Timer
              </button>
            )}

            {isActive && timeLeft > 0 && (
              <button
                onClick={resetBreak}
                className="w-full bg-yellow-500 text-white font-semibold py-3 px-4 rounded-xl hover:bg-yellow-600 transition-colors"
              >
                Reset Timer
              </button>
            )}

            {timeLeft === 0 && (
              <button
                onClick={onCompleteBreak}
                className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                Back to Studying
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            )}

            <button
              onClick={onSkipBreak}
              className="w-full bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors flex items-center justify-center"
            >
              <SkipForward className="w-5 h-5 mr-2" />
              Skip Break
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};