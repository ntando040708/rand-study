import React, { useState, useEffect } from 'react';
import { Plus, Trash2, BookOpen, Clock, Check } from 'lucide-react';
import { Module } from '../utils/types';
import { MODULE_COLORS } from '../utils/constants';

interface ModuleEntryProps {
  onComplete: (modules: Module[]) => void;
  existingModules?: Module[];
}

export const ModuleEntry: React.FC<ModuleEntryProps> = ({
  onComplete,
  existingModules = []
}) => {
  const [modules, setModules] = useState<Module[]>(existingModules);
  const [newModule, setNewModule] = useState({ code: '', name: '', hours: 2 });

  // Sync local state if parent prop updates after initial mount
  useEffect(() => {
    setModules(existingModules);
  }, [existingModules]);

  const addModule = () => {
    if (newModule.code.trim() && newModule.name.trim()) {
      const module: Module = {
        id: Date.now().toString(),
        code: newModule.code.trim().toUpperCase(),
        name: newModule.name.trim(),
        preferredHours: newModule.hours,
        color: MODULE_COLORS[modules.length % MODULE_COLORS.length]
      };
      setModules([...modules, module]);
      setNewModule({ code: '', name: '', hours: 2 });
    }
  };

  const removeModule = (id: string) => {
    setModules(modules.filter(m => m.id !== id));
  };

  const updateModuleHours = (id: string, hours: number) => {
    setModules(modules.map(m => 
      m.id === id ? { ...m, preferredHours: hours } : m
    ));
  };

  const handleSubmit = () => {
    if (modules.length > 0) {
      onComplete(modules);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Add Your Modules</h1>
          <p className="text-gray-600">
            Tell us about your subjects and preferred study hours
          </p>
        </div>

        {/* Add Module Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Add New Module</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                {/* A11y linkage */}
                <label htmlFor="module-code" className="block text-sm font-medium text-gray-700 mb-2">
                  Module Code
                </label>
                <input
                  id="module-code"
                  type="text"
                  value={newModule.code}
                  onChange={(e) => setNewModule({ ...newModule, code: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., CS101"
                />
              </div>
              
              <div>
                <label htmlFor="module-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Module Name
                </label>
                <input
                  id="module-name"
                  type="text"
                  value={newModule.name}
                  onChange={(e) => setNewModule({ ...newModule, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Computer Science Fundamentals"
                />
              </div>
            </div>

            <div>
              <label htmlFor="preferred-hours" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Weekly Hours: {newModule.hours}h
              </label>
              <input
                id="preferred-hours"
                type="range"
                min="1"
                max="10"
                value={newModule.hours}
                onChange={(e) => setNewModule({ ...newModule, hours: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1h</span>
                <span>5h</span>
                <span>10h</span>
              </div>
            </div>

            <button
              onClick={addModule}
              disabled={!newModule.code.trim() || !newModule.name.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Module
            </button>
          </div>
        </div>

        {/* Modules List */}
        {modules.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Your Modules</h3>
            
            <div className="space-y-3">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: module.color }}
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {module.code}
                      </h4>
                      <p className="text-sm text-gray-600">{module.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={module.preferredHours}
                        onChange={(e) => updateModuleHours(module.id, parseInt(e.target.value) || 1)}
                        className="w-12 text-center border border-gray-300 rounded px-1 py-0.5"
                        aria-label={`Preferred hours for ${module.code}`}
                      />
                      <span className="ml-1">h/week</span>
                    </div>
                    
                    <button
                      onClick={() => removeModule(module.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      aria-label={`Remove ${module.code}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        {modules.length > 0 && (
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white font-semibold py-4 px-6 rounded-xl hover:from-slate-900 hover:to-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
          >
            <Check className="w-5 h-5 mr-2" />
            Generate My Study Schedule
          </button>
        )}

        {modules.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Add at least one module to continue</p>
          </div>
        )}
      </div>
    </div>
  );
};
