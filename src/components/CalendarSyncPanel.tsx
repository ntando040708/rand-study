import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Settings, RefreshCw, AlertTriangle, Check, X, Clock, ExternalLink } from 'lucide-react';
import { CalendarIntegration, CalendarConflict, StudySession, Module } from '../utils/types';
import { CalendarSyncManager } from '../utils/calendarSync';

interface CalendarSyncPanelProps {
  integrations: CalendarIntegration[];
  sessions: StudySession[];
  modules: Module[];
  onUpdateIntegrations: (integrations: CalendarIntegration[]) => void;
}

export const CalendarSyncPanel: React.FC<CalendarSyncPanelProps> = ({
  integrations,
  sessions,
  modules,
  onUpdateIntegrations
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [conflicts, setConflicts] = useState<CalendarConflict[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<CalendarIntegration | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [syncResults, setSyncResults] = useState<{ success: number; failed: number } | null>(null);

  useEffect(() => {
    checkForConflicts();
  }, [integrations, sessions]);

  const checkForConflicts = async () => {
    const allConflicts: CalendarConflict[] = [];
    
    for (const integration of integrations.filter(i => i.isConnected && i.syncEnabled)) {
      const integrationConflicts = await CalendarSyncManager.checkConflicts(integration, sessions);
      allConflicts.push(...integrationConflicts);
    }
    
    setConflicts(allConflicts);
  };

  const connectCalendar = async (provider: 'google' | 'outlook') => {
    setIsConnecting(true);
    
    try {
      let newIntegration: CalendarIntegration | null = null;
      
      if (provider === 'google') {
        newIntegration = await CalendarSyncManager.connectGoogleCalendar();
      } else if (provider === 'outlook') {
        newIntegration = await CalendarSyncManager.connectOutlookCalendar();
      }
      
      if (newIntegration) {
        const updatedIntegrations = [...integrations, newIntegration];
        onUpdateIntegrations(updatedIntegrations);
      }
    } catch (error) {
      console.error('Calendar connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectCalendar = async (integration: CalendarIntegration) => {
    const success = await CalendarSyncManager.disconnectCalendar(integration);
    
    if (success) {
      const updatedIntegrations = integrations.filter(i => i.id !== integration.id);
      onUpdateIntegrations(updatedIntegrations);
    }
  };

  const syncToCalendar = async (integration: CalendarIntegration) => {
    setIsSyncing(true);
    
    try {
      const results = await CalendarSyncManager.syncStudySessions(integration, sessions, modules);
      setSyncResults(results);
      
      // Update integration last sync time
      const updatedIntegrations = integrations.map(i => 
        i.id === integration.id ? { ...i, lastSync: new Date().toISOString() } : i
      );
      onUpdateIntegrations(updatedIntegrations);
      
      // Recheck conflicts after sync
      await checkForConflicts();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const updateSyncSettings = (integration: CalendarIntegration, settings: any) => {
    const updatedIntegrations = integrations.map(i =>
      i.id === integration.id ? { ...i, syncSettings: { ...i.syncSettings, ...settings } } : i
    );
    onUpdateIntegrations(updatedIntegrations);
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google': return '📅';
      case 'outlook': return '📧';
      case 'apple': return '🍎';
      default: return '📅';
    }
  };

  const connectedIntegrations = integrations.filter(i => i.isConnected);
  const hasConflicts = conflicts.length > 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <Calendar className="w-5 h-5 text-blue-600 mr-2" />
          Calendar Sync
        </h3>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Connection Status */}
      {connectedIntegrations.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">Connect your calendar to sync study sessions</p>
          
          <div className="space-y-3">
            <button
              onClick={() => connectCalendar('google')}
              disabled={isConnecting}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <span className="mr-2">📅</span>
              {isConnecting ? 'Connecting...' : 'Connect Google Calendar'}
            </button>
            
            <button
              onClick={() => connectCalendar('outlook')}
              disabled={isConnecting}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <span className="mr-2">📧</span>
              {isConnecting ? 'Connecting...' : 'Connect Outlook Calendar'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Connected Calendars */}
          {connectedIntegrations.map((integration) => (
            <div key={integration.id} className="p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{getProviderIcon(integration.provider)}</span>
                  <div>
                    <h4 className="font-medium text-gray-900">{integration.name}</h4>
                    <p className="text-sm text-gray-600">{integration.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-green-600">
                    <Check className="w-4 h-4 mr-1" />
                    <span className="text-sm">Connected</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <span>Last sync: {new Date(integration.lastSync).toLocaleString()}</span>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={integration.syncEnabled}
                    onChange={(e) => updateSyncSettings(integration, { syncEnabled: e.target.checked })}
                    className="mr-2"
                  />
                  Auto-sync enabled
                </label>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => syncToCalendar(integration)}
                  disabled={isSyncing}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Syncing...' : 'Sync Now'}
                </button>
                
                <button
                  onClick={() => setSelectedIntegration(integration)}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => disconnectCalendar(integration)}
                  className="px-3 py-2 bg-red-200 text-red-700 rounded-lg hover:bg-red-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Sync Results */}
          {syncResults && (
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Sync Complete</h4>
              <p className="text-sm text-blue-800">
                ✅ {syncResults.success} events created successfully
                {syncResults.failed > 0 && (
                  <span className="block">❌ {syncResults.failed} events failed to create</span>
                )}
              </p>
            </div>
          )}

          {/* Conflicts Warning */}
          {hasConflicts && (
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="flex items-center mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                <h4 className="font-medium text-yellow-900">Schedule Conflicts Detected</h4>
              </div>
              <p className="text-sm text-yellow-800 mb-3">
                {conflicts.length} study session{conflicts.length !== 1 ? 's' : ''} conflict with existing calendar events.
              </p>
              
              <div className="space-y-2">
                {conflicts.slice(0, 3).map((conflict) => (
                  <div key={conflict.id} className="p-3 bg-white rounded-lg border border-yellow-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Study Session Conflict</p>
                        <p className="text-sm text-gray-600">
                          Conflicts with: {conflict.conflictingEvent.title}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-yellow-700">
                          Suggested: {conflict.suggestedResolution}
                        </p>
                        {conflict.alternativeSlots.length > 0 && (
                          <p className="text-xs text-gray-500">
                            Alt: {conflict.alternativeSlots[0]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add More Calendars */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <h4 className="font-medium text-gray-900 mb-3">Add More Calendars</h4>
            <div className="flex space-x-2">
              {!integrations.some(i => i.provider === 'google') && (
                <button
                  onClick={() => connectCalendar('google')}
                  disabled={isConnecting}
                  className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="mr-2">📅</span>
                  Google
                </button>
              )}
              
              {!integrations.some(i => i.provider === 'outlook') && (
                <button
                  onClick={() => connectCalendar('outlook')}
                  disabled={isConnecting}
                  className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="mr-2">📧</span>
                  Outlook
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Calendar Settings</h3>
              <button
                onClick={() => setSelectedIntegration(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Auto-create events</h4>
                  <p className="text-sm text-gray-600">Automatically create calendar events for study sessions</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedIntegration.syncSettings.autoCreateEvents}
                    onChange={(e) => updateSyncSettings(selectedIntegration, { autoCreateEvents: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Include breaks</h4>
                  <p className="text-sm text-gray-600">Create separate events for break times</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedIntegration.syncSettings.includeBreaks}
                    onChange={(e) => updateSyncSettings(selectedIntegration, { includeBreaks: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Prefix
                </label>
                <input
                  type="text"
                  value={selectedIntegration.syncSettings.eventPrefix}
                  onChange={(e) => updateSyncSettings(selectedIntegration, { eventPrefix: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="[Study]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reminder (minutes before)
                </label>
                <select
                  value={selectedIntegration.syncSettings.reminderMinutes}
                  onChange={(e) => updateSyncSettings(selectedIntegration, { reminderMinutes: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conflict Resolution
                </label>
                <select
                  value={selectedIntegration.syncSettings.conflictResolution}
                  onChange={(e) => updateSyncSettings(selectedIntegration, { conflictResolution: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="notify">Notify me</option>
                  <option value="skip">Skip conflicting sessions</option>
                  <option value="reschedule">Auto-reschedule</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setSelectedIntegration(null)}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};