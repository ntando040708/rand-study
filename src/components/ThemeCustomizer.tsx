import React, { useState, useEffect } from 'react';
import { Palette, Settings, Eye, Download, Upload, RotateCcw, Sparkles } from 'lucide-react';
import { ThemeConfig, ColorScheme, LayoutConfig } from '../utils/types';
import { ThemeManager } from '../utils/themes';

interface ThemeCustomizerProps {
  currentTheme: ThemeConfig;
  onThemeChange: (theme: ThemeConfig) => void;
  onClose: () => void;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  currentTheme,
  onThemeChange,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'colors' | 'layout' | 'advanced'>('presets');
  const [workingTheme, setWorkingTheme] = useState<ThemeConfig>(currentTheme);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (previewMode) {
      ThemeManager.applyTheme(workingTheme);
    }
  }, [workingTheme, previewMode]);

  const handlePresetSelect = (presetName: string) => {
    const preset = ThemeManager.PREDEFINED_THEMES[presetName];
    if (preset) {
      setWorkingTheme(preset);
      if (previewMode) {
        ThemeManager.applyTheme(preset);
      }
    }
  };

  const handleColorChange = (colorKey: keyof ColorScheme, value: string) => {
    const updatedTheme = {
      ...workingTheme,
      colorScheme: {
        ...workingTheme.colorScheme,
        [colorKey]: value
      }
    };
    setWorkingTheme(updatedTheme);
  };

  const handleLayoutChange = (layoutKey: keyof LayoutConfig, value: any) => {
    const updatedTheme = {
      ...workingTheme,
      layout: {
        ...workingTheme.layout,
        [layoutKey]: value
      }
    };
    setWorkingTheme(updatedTheme);
  };

  const handleApplyTheme = () => {
    ThemeManager.applyTheme(workingTheme);
    onThemeChange(workingTheme);
    onClose();
  };

  const handleResetToDefault = () => {
    const defaultTheme = ThemeManager.PREDEFINED_THEMES['modern-light'];
    setWorkingTheme(defaultTheme);
    if (previewMode) {
      ThemeManager.applyTheme(defaultTheme);
    }
  };

  const generateRandomTheme = () => {
    const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const generatedPalette = ThemeManager.generateColorPalette(randomColor);
    
    const randomTheme = ThemeManager.createCustomTheme('modern-light', {
      name: 'Generated Theme',
      colorScheme: {
        ...workingTheme.colorScheme,
        ...generatedPalette
      }
    });
    
    setWorkingTheme(randomTheme);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Palette className="w-6 h-6 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Theme Customizer</h2>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                previewMode 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Eye className="w-4 h-4 mr-2" />
              {previewMode ? 'Exit Preview' : 'Live Preview'}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <nav className="space-y-2">
              {[
                { id: 'presets', label: 'Theme Presets', icon: Sparkles },
                { id: 'colors', label: 'Colors', icon: Palette },
                { id: 'layout', label: 'Layout', icon: Settings },
                { id: 'advanced', label: 'Advanced', icon: Settings }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                    activeTab === id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {label}
                </button>
              ))}
            </nav>

            {/* Quick Actions */}
            <div className="mt-8 space-y-2">
              <button
                onClick={generateRandomTheme}
                className="w-full flex items-center px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Random
              </button>
              <button
                onClick={handleResetToDefault}
                className="w-full flex items-center px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Default
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'presets' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Choose a Theme Preset</h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(ThemeManager.PREDEFINED_THEMES).map(([key, theme]) => (
                    <div
                      key={key}
                      onClick={() => handlePresetSelect(key)}
                      className={`cursor-pointer p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                        workingTheme.name === theme.name
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="mb-3">
                        <div 
                          className="w-full h-20 rounded-lg mb-2"
                          style={{ 
                            background: `linear-gradient(135deg, ${theme.colorScheme.gradient.join(', ')})` 
                          }}
                        />
                        <div className="flex space-x-1">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: theme.colorScheme.primary }}
                          />
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: theme.colorScheme.secondary }}
                          />
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: theme.colorScheme.accent }}
                          />
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-900">{theme.name}</h4>
                      <p className="text-sm text-gray-600 capitalize">{theme.mode} mode</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'colors' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Customize Colors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(workingTheme.colorScheme).map(([key, value]) => {
                    if (key === 'gradient') return null;
                    return (
                      <div key={key} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={value}
                            onChange={(e) => handleColorChange(key as keyof ColorScheme, e.target.value)}
                            className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => handleColorChange(key as keyof ColorScheme, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'layout' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Layout Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Density</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['compact', 'comfortable', 'spacious'] as const).map((density) => (
                        <button
                          key={density}
                          onClick={() => handleLayoutChange('density', density)}
                          className={`p-3 rounded-lg border-2 transition-colors capitalize ${
                            workingTheme.layout.density === density
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {density}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Border Radius</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['sharp', 'rounded', 'extra-rounded'] as const).map((radius) => (
                        <button
                          key={radius}
                          onClick={() => handleLayoutChange('borderRadius', radius)}
                          className={`p-3 border-2 transition-colors capitalize ${
                            workingTheme.layout.borderRadius === radius
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          } ${
                            radius === 'sharp' ? 'rounded-none' :
                            radius === 'rounded' ? 'rounded-lg' : 'rounded-2xl'
                          }`}
                        >
                          {radius.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Shadows</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['none', 'subtle', 'prominent'] as const).map((shadow) => (
                        <button
                          key={shadow}
                          onClick={() => handleLayoutChange('shadows', shadow)}
                          className={`p-3 rounded-lg border-2 transition-colors capitalize ${
                            workingTheme.layout.shadows === shadow
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          } ${
                            shadow === 'none' ? '' :
                            shadow === 'subtle' ? 'shadow-sm' : 'shadow-lg'
                          }`}
                        >
                          {shadow}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Animations</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['none', 'reduced', 'full'] as const).map((animation) => (
                        <button
                          key={animation}
                          onClick={() => handleLayoutChange('animations', animation)}
                          className={`p-3 rounded-lg border-2 transition-colors capitalize ${
                            workingTheme.layout.animations === animation
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {animation}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'advanced' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Advanced Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                    <select
                      value={workingTheme.customizations.fontFamily}
                      onChange={(e) => setWorkingTheme({
                        ...workingTheme,
                        customizations: {
                          ...workingTheme.customizations,
                          fontFamily: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="Inter, system-ui, sans-serif">Inter (Default)</option>
                      <option value="JetBrains Mono, monospace">JetBrains Mono</option>
                      <option value="Georgia, serif">Georgia</option>
                      <option value="Arial, sans-serif">Arial</option>
                      <option value="Helvetica, sans-serif">Helvetica</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Font Size</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['small', 'medium', 'large'] as const).map((size) => (
                        <button
                          key={size}
                          onClick={() => setWorkingTheme({
                            ...workingTheme,
                            customizations: {
                              ...workingTheme.customizations,
                              fontSize: size
                            }
                          })}
                          className={`p-3 rounded-lg border-2 transition-colors capitalize ${
                            workingTheme.customizations.fontSize === size
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Theme Name</label>
                    <input
                      type="text"
                      value={workingTheme.name}
                      onChange={(e) => setWorkingTheme({
                        ...workingTheme,
                        name: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter custom theme name"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors">
              <Upload className="w-4 h-4 mr-2" />
              Import Theme
            </button>
            <button className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export Theme
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyTheme}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Apply Theme
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};