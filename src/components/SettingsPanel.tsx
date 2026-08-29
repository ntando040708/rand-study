import React, { useState } from 'react';
import { Settings, Bell, Volume2, Palette, Clock, ArrowLeft, Save, Sparkles } from 'lucide-react';
import { ThemeCustomizer } from './ThemeCustomizer';
import { ThemeManager } from '../utils/themes';
import { ThemeConfig, AppSettings } from '../utils/types';

interface SettingsPanelProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onBack: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onUpdateSettings,
  onBack
}) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
  
  // FIX: Use an actual theme that exists in PREDEFINED_THEMES
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(
    ThemeManager.getStoredTheme() || ThemeManager.PREDEFINED_THEMES['ocean-blue']
  );

  const handleSave = () => {
    onUpdateSettings(localSettings);
    onBack();
  };

  const updateSetting = (key: keyof AppSettings, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleSetting = (key: keyof AppSettings) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleThemeChange = (theme: ThemeConfig) => {
    setCurrentTheme(theme);
    updateSetting('theme', theme);
    ThemeManager.applyTheme(theme);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Customize your study experience</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <Bell className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Notifications</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Enable Notifications</h4>
                  <p className="text-sm text-gray-600">Receive study reminders and updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.notifications}
                    onChange={() => toggleSetting('notifications')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Session Reminders</h4>
                  <p className="text-sm text-gray-600">Get notified before study sessions</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.sessionReminders}
                    onChange={() => toggleSetting('sessionReminders')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Break Reminders</h4>
                  <p className="text-sm text-gray-600">Get reminded to take breaks</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.breakReminders}
                    onChange={() => toggleSetting('breakReminders')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Audio */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <Volume2 className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Audio</h3>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Sound Effects</h4>
                <p className="text-sm text-gray-600">Play sounds for notifications and timers</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.soundEnabled}
                  onChange={() => toggleSetting('soundEnabled')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>

          {/* Study Preferences */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <Clock className="w-5 h-5 text-purple-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Study Preferences</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Session Length
                </label>
                <select
                  value={localSettings.defaultSessionLength || 30}
                  onChange={(e) => updateSetting('defaultSessionLength', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value={15}>15 minutes</option>
                  <option value={25}>25 minutes (Pomodoro)</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Break Length
                </label>
                <select
                  value={localSettings.defaultBreakLength || 10}
                  onChange={(e) => updateSetting('defaultBreakLength', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={20}>20 minutes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Theme */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <Palette className="w-5 h-5 text-purple-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Appearance</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Current Theme</h4>
                  <p className="text-sm text-gray-600">{currentTheme?.name || 'Loading...'}</p>
                </div>
                {currentTheme && (
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: currentTheme.colorScheme.primary }}
                    />
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: currentTheme.colorScheme.secondary }}
                    />
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setShowThemeCustomizer(true)}
                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-colors"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Customize Theme
              </button>
              
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(ThemeManager.PREDEFINED_THEMES).slice(0, 3).map(([key, theme]) => (
                  <button
                    key={key}
                    onClick={() => handleThemeChange(theme)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      currentTheme?.name === theme.name
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div 
                      className="w-full h-8 rounded mb-2"
                      style={{ 
                        background: `linear-gradient(135deg, ${theme.colorScheme.gradient.join(', ')})` 
                      }}
                    />
                    <span className="text-xs font-medium">{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Settings
          </button>
        </div>
      </div>
      
      {/* Theme Customizer Modal */}
      {showThemeCustomizer && currentTheme && (
        <ThemeCustomizer
          currentTheme={currentTheme}
          onThemeChange={handleThemeChange}
          onClose={() => setShowThemeCustomizer(false)}
        />
      )}
    </div>
  );
};
