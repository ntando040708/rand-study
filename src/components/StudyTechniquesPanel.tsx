import React, { useState, useEffect } from 'react';
import { Clock, Brain, Repeat, MessageSquare, Settings, X } from 'lucide-react';
import { StudyTechnique } from '../utils/types';
// Note: StudyTechniqueManager import was unused, so I removed it to pass strict linting

interface StudyTechniquesPanelProps {
  techniques: StudyTechnique[];
  onUpdateTechniques: (techniques: StudyTechnique[]) => void;
  onActivateTechnique: (techniqueId: string) => void;
}

export const StudyTechniquesPanel: React.FC<StudyTechniquesPanelProps> = ({
  techniques,
  onUpdateTechniques,
  onActivateTechnique
}) => {
  const [selectedTechnique, setSelectedTechnique] = useState<StudyTechnique | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedTechnique) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedTechnique]);

  const getTechniqueIcon = (type: string) => {
    switch (type) {
      case 'pomodoro': return Clock;
      case 'spaced-repetition': return Repeat;
      case 'active-recall': return Brain;
      case 'feynman': return MessageSquare;
      default: return Brain;
    }
  };

  // Mapped full class strings to prevent Tailwind purging in production
  const getThemeClasses = (type: string) => {
    switch (type) {
      case 'pomodoro': return {
        bg: 'bg-red-50', bgLight: 'bg-red-100', text: 'text-red-800', 
        textIcon: 'text-red-600', borderActive: 'border-red-500', focusRing: 'peer-focus:ring-red-300', toggleBg: 'peer-checked:bg-red-600'
      };
      case 'spaced-repetition': return {
        bg: 'bg-blue-50', bgLight: 'bg-blue-100', text: 'text-blue-800', 
        textIcon: 'text-blue-600', borderActive: 'border-blue-500', focusRing: 'peer-focus:ring-blue-300', toggleBg: 'peer-checked:bg-blue-600'
      };
      case 'active-recall': return {
        bg: 'bg-green-50', bgLight: 'bg-green-100', text: 'text-green-800', 
        textIcon: 'text-green-600', borderActive: 'border-green-500', focusRing: 'peer-focus:ring-green-300', toggleBg: 'peer-checked:bg-green-600'
      };
      case 'feynman': return {
        bg: 'bg-purple-50', bgLight: 'bg-purple-100', text: 'text-purple-800', 
        textIcon: 'text-purple-600', borderActive: 'border-purple-500', focusRing: 'peer-focus:ring-purple-300', toggleBg: 'peer-checked:bg-purple-600'
      };
      default: return {
        bg: 'bg-gray-50', bgLight: 'bg-gray-100', text: 'text-gray-800', 
        textIcon: 'text-gray-600', borderActive: 'border-gray-500', focusRing: 'peer-focus:ring-gray-300', toggleBg: 'peer-checked:bg-gray-600'
      };
    }
  };

  const toggleTechnique = (techniqueId: string) => {
    const updatedTechniques = techniques.map(technique =>
      technique.id === techniqueId
        ? { ...technique, isActive: !technique.isActive }
        : technique
    );
    onUpdateTechniques(updatedTechniques);
    
    const technique = updatedTechniques.find(t => t.id === techniqueId);
    if (technique?.isActive) {
      onActivateTechnique(techniqueId);
    }
  };

  const activeTechniques = techniques.filter(t => t.isActive);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <Brain className="w-5 h-5 text-indigo-600 mr-2" />
          Study Techniques
        </h3>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
          aria-label="Toggle settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Active Techniques Summary */}
      {activeTechniques.length > 0 && (
        <div className="mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
          <h4 className="font-medium text-indigo-900 mb-2">Active Techniques</h4>
          <div className="flex flex-wrap gap-2">
            {activeTechniques.map((technique) => {
              const IconComponent = getTechniqueIcon(technique.type);
              const theme = getThemeClasses(technique.type);
              return (
                <div
                  key={technique.id}
                  className={`flex items-center px-3 py-1 ${theme.bgLight} ${theme.text} rounded-full text-sm`}
                >
                  <IconComponent className="w-4 h-4 mr-1" />
                  {technique.name}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Technique Cards */}
      <div className="space-y-4">
        {techniques.map((technique) => {
          const IconComponent = getTechniqueIcon(technique.type);
          const theme = getThemeClasses(technique.type);

          return (
            <div
              key={technique.id}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                technique.isActive
                  ? `${theme.borderActive} ${theme.bg}`
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
              onClick={() => setSelectedTechnique(technique)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-12 h-12 ${theme.bgLight} rounded-xl flex items-center justify-center mr-4 shrink-0`}>
                    <IconComponent className={`w-6 h-6 ${theme.textIcon}`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{technique.name}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{technique.description}</p>
                  </div>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer ml-4 shrink-0">
                  <input
                    type="checkbox"
                    checked={technique.isActive}
                    onChange={() => toggleTechnique(technique.id)}
                    className="sr-only peer"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 ${theme.focusRing} rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${theme.toggleBg}`}></div>
                </label>
              </div>

              {/* Technique-specific info */}
              {technique.isActive && (
                <div className="mt-4 pt-4 border-t border-gray-200/60">
                  {technique.type === 'pomodoro' && (
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 block text-xs uppercase tracking-wider mb-1">Work</span>
                        <span className="font-medium text-gray-900">{technique.settings.workDuration}m</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block text-xs uppercase tracking-wider mb-1">Break</span>
                        <span className="font-medium text-gray-900">{technique.settings.shortBreakDuration}m</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block text-xs uppercase tracking-wider mb-1">Long Break</span>
                        <span className="font-medium text-gray-900">{technique.settings.longBreakDuration}m</span>
                      </div>
                    </div>
                  )}
                  
                  {technique.type === 'active-recall' && (
                    <div className="text-sm">
                      <span className="text-gray-600">Prompt frequency: </span>
                      <span className="font-medium text-gray-900">Every {technique.settings.promptFrequency} minutes</span>
                    </div>
                  )}
                  
                  {technique.type === 'spaced-repetition' && (
                    <div className="text-sm">
                      <span className="text-gray-600">Initial review interval: </span>
                      <span className="font-medium text-gray-900">{technique.settings.initialInterval} day(s)</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Technique Detail Modal */}
      {selectedTechnique && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedTechnique(null)}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                {(() => {
                  const Icon = getTechniqueIcon(selectedTechnique.type);
                  const themeClasses = getThemeClasses(selectedTechnique.type);
                  return <Icon className={`w-6 h-6 mr-2 ${themeClasses.textIcon}`} />;
                })()}
                {selectedTechnique.name}
              </h3>
              <button
                onClick={() => setSelectedTechnique(null)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 mb-6 text-base leading-relaxed">{selectedTechnique.description}</p>

            {/* Technique-specific settings guide */}
            <div className="space-y-4 bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-3">How it works</h4>
              
              {selectedTechnique.type === 'pomodoro' && (
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start"><span className="text-red-500 mr-2 font-bold">•</span> Work in focused {selectedTechnique.settings.workDuration}-minute intervals</li>
                  <li className="flex items-start"><span className="text-red-500 mr-2 font-bold">•</span> Take {selectedTechnique.settings.shortBreakDuration}-minute breaks between sessions</li>
                  <li className="flex items-start"><span className="text-red-500 mr-2 font-bold">•</span> After {selectedTechnique.settings.sessionsUntilLongBreak} sessions, take a longer {selectedTechnique.settings.longBreakDuration}-minute break</li>
                </ul>
              )}

              {selectedTechnique.type === 'active-recall' && (
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start"><span className="text-green-500 mr-2 font-bold">•</span> Receive a recall prompt every {selectedTechnique.settings.promptFrequency} minutes</li>
                  <li className="flex items-start"><span className="text-green-500 mr-2 font-bold">•</span> Test yourself without looking at source material</li>
                  <li className="flex items-start"><span className="text-green-500 mr-2 font-bold">•</span> Rate your understanding to track retention</li>
                </ul>
              )}

              {selectedTechnique.type === 'spaced-repetition' && (
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start"><span className="text-blue-500 mr-2 font-bold">•</span> Review material at mathematically increasing intervals</li>
                  <li className="flex items-start"><span className="text-blue-500 mr-2 font-bold">•</span> Start with an initial {selectedTechnique.settings.initialInterval}-day gap</li>
                  <li className="flex items-start"><span className="text-blue-500 mr-2 font-bold">•</span> Difficult material is surfaced more frequently automatically</li>
                </ul>
              )}

              {selectedTechnique.type === 'feynman' && (
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start"><span className="text-purple-500 mr-2 font-bold">•</span> Explain concepts in simple, foundational terms</li>
                  <li className="flex items-start"><span className="text-purple-500 mr-2 font-bold">•</span> Immediately identify gaps in your understanding</li>
                  <li className="flex items-start"><span className="text-purple-500 mr-2 font-bold">•</span> Return to source material only for unclear areas</li>
                </ul>
              )}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  toggleTechnique(selectedTechnique.id);
                  setSelectedTechnique(null);
                }}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                  selectedTechnique.isActive
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {selectedTechnique.isActive ? 'Deactivate Technique' : 'Activate Technique'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
