import React, { useState, useEffect, useMemo } from 'react';
import { Heart, Droplets, Eye, Wind, Moon, Activity, X } from 'lucide-react';
import { WellnessData, WellnessSettings } from '../utils/types';
import { WellnessManager } from '../utils/wellness';

interface WellnessPanelProps {
  wellnessData: WellnessData;
  settings: WellnessSettings;
  onUpdateWellness: (data: WellnessData) => void;
  onUpdateSettings: (settings: WellnessSettings) => void;
}

export const WellnessPanel: React.FC<WellnessPanelProps> = ({
  wellnessData,
  settings,
  onUpdateWellness,
  onUpdateSettings
}) => {
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [breathingExercise, setBreathingExercise] = useState(WellnessManager.generateBreathingExercise());

  // Derive reminders synchronously to prevent double-renders
  const reminders = useMemo(() => {
    return WellnessManager.generateWellnessReminders(wellnessData);
  }, [wellnessData]);

  // Lock background scrolling when modal is open
  useEffect(() => {
    if (showBreathingExercise) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showBreathingExercise]);

  const handleWellnessAction = (action: 'hydration' | 'eye-break' | 'posture-check' | 'stress-check') => {
    const updatedData = WellnessManager.trackWellnessMetrics(wellnessData, action);
    onUpdateWellness(updatedData);
  };

  const getStressLevelColor = (level: number) => {
    if (level <= 3) return 'text-green-600 bg-green-100';
    if (level <= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStressLevelText = (level: number) => {
    if (level <= 3) return 'Low';
    if (level <= 6) return 'Moderate';
    return 'High';
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <Heart className="w-5 h-5 text-pink-600 mr-2" />
          Wellness Center
        </h3>
      </div>

      {/* Stress Level Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Stress Level</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStressLevelColor(wellnessData.stressLevel)}`}>
            {getStressLevelText(wellnessData.stressLevel)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              wellnessData.stressLevel <= 3 ? 'bg-green-500' :
              wellnessData.stressLevel <= 6 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(wellnessData.stressLevel * 10, 100)}%` }}
          />
        </div>
      </div>

      {/* Wellness Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => handleWellnessAction('hydration')}
          className="flex items-center p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors text-left"
        >
          <Droplets className="w-5 h-5 text-blue-600 mr-2 shrink-0" />
          <div>
            <div className="font-medium text-gray-900 text-sm">Hydrate</div>
            <div className="text-xs text-gray-600">{wellnessData.hydrationReminders} today</div>
          </div>
        </button>

        <button
          onClick={() => handleWellnessAction('eye-break')}
          className="flex items-center p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors text-left"
        >
          <Eye className="w-5 h-5 text-green-600 mr-2 shrink-0" />
          <div>
            <div className="font-medium text-gray-900 text-sm">Eye Break</div>
            <div className="text-xs text-gray-600">{wellnessData.eyeStrainBreaks} today</div>
          </div>
        </button>

        <button
          onClick={() => handleWellnessAction('posture-check')}
          className="flex items-center p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors text-left"
        >
          <Activity className="w-5 h-5 text-purple-600 mr-2 shrink-0" />
          <div>
            <div className="font-medium text-gray-900 text-sm">Posture</div>
            <div className="text-xs text-gray-600">Check & stretch</div>
          </div>
        </button>

        <button
          onClick={() => setShowBreathingExercise(true)}
          className="flex items-center p-3 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors text-left"
        >
          <Wind className="w-5 h-5 text-indigo-600 mr-2 shrink-0" />
          <div>
            <div className="font-medium text-gray-900 text-sm">Breathe</div>
            <div className="text-xs text-gray-600">Stress relief</div>
          </div>
        </button>
      </div>

      {/* Sleep Tracking */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="sleep-tracker" className="text-sm font-medium text-gray-700 flex items-center">
            <Moon className="w-4 h-4 mr-1 text-indigo-500" />
            Sleep Last Night
          </label>
          <span className="text-sm text-gray-600 font-medium">{wellnessData.sleepHours}h</span>
        </div>
        <input
          id="sleep-tracker"
          type="range"
          min="4"
          max="12"
          step="0.5"
          value={wellnessData.sleepHours}
          onChange={(e) => onUpdateWellness({
            ...wellnessData,
            sleepHours: parseFloat(e.target.value)
          })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          aria-label="Hours of sleep"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
          <span>4h</span>
          <span>8h</span>
          <span>12h</span>
        </div>
      </div>

      {/* Active Reminders */}
      {reminders.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 text-sm">Active Reminders</h4>
          {reminders.map((reminder, index) => (
            <div key={index} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">{reminder}</p>
            </div>
          ))}
        </div>
      )}

      {/* Breathing Exercise Modal */}
      {showBreathingExercise && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setShowBreathingExercise(false)}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowBreathingExercise(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-6 pt-2">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wind className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{breathingExercise.name}</h3>
              <p className="text-gray-600 text-sm px-4">{breathingExercise.description}</p>
            </div>

            <div className="space-y-3 mb-8">
              {breathingExercise.steps.map((step, index) => (
                <div key={index} className="flex items-center p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 shrink-0 shadow-sm">
                    {index + 1}
                  </div>
                  <p className="text-sm text-indigo-900 font-medium">{step}</p>
                </div>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowBreathingExercise(false);
                  setTimeout(() => setBreathingExercise(WellnessManager.generateBreathingExercise()), 300);
                }}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition-colors font-semibold shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
