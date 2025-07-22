import React, { useState } from 'react';
import { Clock, Brain, Repeat, MessageSquare, Settings } from 'lucide-react';
import { StudyTechnique } from '../utils/types';
import { StudyTechniqueManager } from '../utils/studyTechniques';

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

  const getTechniqueIcon = (type: string) => {
    switch (type) {
      case 'pomodoro': return Clock;
      case 'spaced-repetition': return Repeat;
      case 'active-recall': return Brain;
      case 'feynman': return MessageSquare;
      default: return Brain;
    }
  };

  const getTechniqueColor = (type: string) => {
    switch (type) {
      case 'pomodoro': return 'red';
      case 'spaced-repetition': return 'blue';
      case 'active-recall': return 'green';
      case 'feynman': return 'purple';
      default: return 'gray';
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
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
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
              const color = getTechniqueColor(technique.type);
              return (
                <div
                  key={technique.id}
                  className={`flex items-center px-3 py-1 bg-${color}-100 text-${color}-800 rounded-full text-sm`}
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
          const color = getTechniqueColor(technique.type);

          return (
            <div
              key={technique.id}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                technique.isActive
                  ? `border-${color}-500 bg-${color}-50`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedTechnique(technique)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center mr-4`}>
                    <IconComponent className={`w-6 h-6 text-${color}-600`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{technique.name}</h4>
                    <p className="text-sm text-gray-600">{technique.description}</p>
                  </div>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={technique.isActive}
                    onChange={() => toggleTechnique(technique.id)}
                    className="sr-only peer"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-${color}-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-${color}-600`}></div>
                </label>
              </div>

              {/* Technique-specific info */}
              {technique.isActive && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  {technique.type === 'pomodoro' && (
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Work:</span>
                        <span className="font-medium ml-1">{technique.settings.workDuration}min</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Break:</span>
                        <span className="font-medium ml-1">{technique.settings.shortBreakDuration}min</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Long Break:</span>
                        <span className="font-medium ml-1">{technique.settings.longBreakDuration}min</span>
                      </div>
                    </div>
                  )}
                  
                  {technique.type === 'active-recall' && (
                    <div className="text-sm">
                      <span className="text-gray-600">Prompt every:</span>
                      <span className="font-medium ml-1">{technique.settings.promptFrequency} minutes</span>
                    </div>
                  )}
                  
                  {technique.type === 'spaced-repetition' && (
                    <div className="text-sm">
                      <span className="text-gray-600">Initial interval:</span>
                      <span className="font-medium ml-1">{technique.settings.initialInterval} day(s)</span>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">{selectedTechnique.name}</h3>
              <button
                onClick={() => setSelectedTechnique(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-600 mb-6">{selectedTechnique.description}</p>

            {/* Technique-specific settings */}
            <div className="space-y-4">
              {selectedTechnique.type === 'pomodoro' && (
                <>
                  <h4 className="font-medium text-gray-900">How it works:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Work in focused {selectedTechnique.settings.workDuration}-minute intervals</li>
                    <li>• Take {selectedTechnique.settings.shortBreakDuration}-minute breaks between sessions</li>
                    <li>• After {selectedTechnique.settings.sessionsUntilLongBreak} sessions, take a {selectedTechnique.settings.longBreakDuration}-minute break</li>
                    <li>• Repeat the cycle throughout your study session</li>
                  </ul>
                </>
              )}

              {selectedTechnique.type === 'active-recall' && (
                <>
                  <h4 className="font-medium text-gray-900">How it works:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Every {selectedTechnique.settings.promptFrequency} minutes, you'll get a recall prompt</li>
                    <li>• Test yourself on what you just learned</li>
                    <li>• Rate your understanding to track progress</li>
                    <li>• Focus on areas where recall is difficult</li>
                  </ul>
                </>
              )}

              {selectedTechnique.type === 'spaced-repetition' && (
                <>
                  <h4 className="font-medium text-gray-900">How it works:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Review material at increasing intervals</li>
                    <li>• Start with {selectedTechnique.settings.initialInterval}-day intervals</li>
                    <li>• Intervals increase based on how well you remember</li>
                    <li>• Difficult material is reviewed more frequently</li>
                  </ul>
                </>
              )}

              {selectedTechnique.type === 'feynman' && (
                <>
                  <h4 className="font-medium text-gray-900">How it works:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Explain concepts in simple terms</li>
                    <li>• Identify gaps in your understanding</li>
                    <li>• Go back to source material for unclear areas</li>
                    <li>• Simplify and use analogies</li>
                  </ul>
                </>
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
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {selectedTechnique.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => setSelectedTechnique(null)}
                className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};