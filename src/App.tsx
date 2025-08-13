import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AuthScreen } from './components/AuthScreen';
import { ModuleEntry } from './components/ModuleEntry';
import { StudyDashboard } from './components/StudyDashboard';
import { BreakScreen } from './components/BreakScreen';
import { MoodTracker } from './components/MoodTracker';
import { SettingsPanel } from './components/SettingsPanel';
import { CalendarSyncPanel } from './components/CalendarSyncPanel';
import { ThemeManager } from './utils/themes';
import { storage } from './utils/storage';
import { generateDailySchedule } from './utils/scheduleGenerator';
import { User, Module, StudySession, MoodEntry, AppState, Notification, Achievement, StudyGoal, CalendarIntegration } from './utils/types';
import { NotificationManager, GoalManager } from './utils/notifications';

function App() {
  // Initialize theme on app start
  useEffect(() => {
    const storedTheme = ThemeManager.getStoredTheme();
    if (storedTheme) {
      ThemeManager.applyTheme(storedTheme);
    } else {
      // Apply default theme
      ThemeManager.applyTheme(ThemeManager.PREDEFINED_THEMES['orange-energy']);
    }
  }, []);

  const [appState, setAppState] = useState<AppState>({
    user: null,
    modules: [],
    todaysSessions: [],
    currentSession: null,
    isOnBreak: false,
    breakTimeLeft: 0,
    moodEntries: [],
    currentScreen: 'welcome',
    notifications: [],
    achievements: [],
    goals: [],
    settings: {},
    calendarIntegrations: []
  });

  // Initialize app state from localStorage
  useEffect(() => {
    const user = storage.getUser();
    const modules = storage.getModules();
    const moodEntries = storage.getMoodEntries();
    const notifications = storage.getNotifications();
    const achievements = storage.getAchievements();
    const goals = storage.getGoals();
    const settings = storage.getSettings();
    const calendarIntegrations = storage.getCalendarIntegrations();
    const today = new Date().toISOString().split('T')[0];
    const todaysSessions = storage.getSessions(today);

    // Initialize default goals if none exist
    let initialGoals = goals;
    if (goals.length === 0 && user) {
      initialGoals = GoalManager.createDefaultGoals();
      storage.setGoals(initialGoals);
    }

    if (user && modules.length > 0) {
      // Update goal progress
      const updatedGoals = GoalManager.updateGoalProgress(initialGoals, user, todaysSessions);
      if (JSON.stringify(updatedGoals) !== JSON.stringify(initialGoals)) {
        storage.setGoals(updatedGoals);
      }

      setAppState(prev => ({
        ...prev,
        user,
        modules,
        moodEntries,
        notifications,
        achievements,
        goals: updatedGoals,
        settings,
        calendarIntegrations,
        todaysSessions: todaysSessions.length > 0 ? todaysSessions : generateDailySchedule(modules),
        currentScreen: 'dashboard'
      }));
    } else if (user) {
      setAppState(prev => ({
        ...prev,
        user,
        modules,
        moodEntries,
        notifications,
        achievements,
        goals: initialGoals,
        settings,
        calendarIntegrations,
        currentScreen: 'modules'
      }));
    }
  }, []);

  const handleAuth = (user: User) => {
    storage.setUser(user);
    setAppState(prev => ({
      ...prev,
      user,
      currentScreen: 'modules'
    }));
  };

  const handleModulesComplete = (modules: Module[]) => {
    storage.setModules(modules);
    const sessions = generateDailySchedule(modules, appState.moodEntries, appState.todaysSessions);
    const today = new Date().toISOString().split('T')[0];
    storage.setSessions(today, sessions);

    setAppState(prev => ({
      ...prev,
      modules,
      todaysSessions: sessions,
      currentScreen: 'dashboard'
    }));
  };

  const handleStartBreak = (session: StudySession) => {
    setAppState(prev => ({
      ...prev,
      currentSession: session,
      isOnBreak: true,
      breakTimeLeft: 600, // 10 minutes
      currentScreen: 'break'
    }));
  };

  const handleCompleteBreak = () => {
    setAppState(prev => ({
      ...prev,
      isOnBreak: false,
      currentScreen: 'dashboard'
    }));
  };

  const handleSkipBreak = () => {
    setAppState(prev => ({
      ...prev,
      isOnBreak: false,
      currentScreen: 'dashboard'
    }));
  };

  const handleCompleteSession = (sessionId: string) => {
    const updatedSessions = appState.todaysSessions.map(session =>
      session.id === sessionId ? { ...session, completed: true } : session
    );

    const today = new Date().toISOString().split('T')[0];
    storage.setSessions(today, updatedSessions);

    // Update user stats
    const updatedUser = {
      ...appState.user!,
      totalSessions: appState.user!.totalSessions + 1,
      streak: appState.user!.streak + 1
    };
    storage.setUser(updatedUser);

    // Check for new achievements
    const newAchievements = NotificationManager.checkForAchievements(
      updatedUser, 
      updatedSessions, 
      appState.moodEntries
    );

    if (newAchievements.length > 0) {
      const updatedAchievements = [...appState.achievements, ...newAchievements];
      storage.setAchievements(updatedAchievements);

      // Create achievement notifications
      const achievementNotifications = newAchievements.map(achievement =>
        NotificationManager.createAchievementNotification(achievement)
      );
      const updatedNotifications = [...appState.notifications, ...achievementNotifications];
      storage.setNotifications(updatedNotifications);

      setAppState(prev => ({
        ...prev,
        achievements: updatedAchievements,
        notifications: updatedNotifications
      }));
    }

    // Update goals progress
    const updatedGoals = GoalManager.updateGoalProgress(appState.goals, updatedUser, updatedSessions);
    storage.setGoals(updatedGoals);

    setAppState(prev => ({
      ...prev,
      user: updatedUser,
      todaysSessions: updatedSessions,
      currentSession: null,
      goals: updatedGoals
    }));
  };

  const handleAddMood = (mood: number, note: string) => {
    const moodEntry: MoodEntry = {
      id: Date.now().toString(),
      mood,
      note,
      sessionId: appState.currentSession?.id || '',
      moduleId: appState.currentSession?.moduleId || '',
      sessionDuration: appState.currentSession?.duration || 0,
      wasBreakTaken: appState.isOnBreak,
      timestamp: new Date().toISOString()
    };

    const updatedMoodEntries = [...appState.moodEntries, moodEntry];
    storage.setMoodEntries(updatedMoodEntries);

    setAppState(prev => ({
      ...prev,
      moodEntries: updatedMoodEntries,
      currentScreen: 'dashboard'
    }));
  };

  const handleMarkNotificationRead = (notificationId: string) => {
    const updatedNotifications = appState.notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    storage.setNotifications(updatedNotifications);
    setAppState(prev => ({ ...prev, notifications: updatedNotifications }));
  };

  const handleClearNotifications = () => {
    const updatedNotifications = appState.notifications.map(n => ({ ...n, read: true }));
    storage.setNotifications(updatedNotifications);
    setAppState(prev => ({ ...prev, notifications: updatedNotifications }));
  };

  const handleUpdateSettings = (newSettings: any) => {
    storage.setSettings(newSettings);
    setAppState(prev => ({ ...prev, settings: newSettings }));
  };

  const handleUpdateCalendarIntegrations = (integrations: CalendarIntegration[]) => {
    storage.setCalendarIntegrations(integrations);
    setAppState(prev => ({ ...prev, calendarIntegrations: integrations }));
  };

  const navigateToWelcome = () => {
    setAppState(prev => ({ ...prev, currentScreen: 'welcome' }));
  };

  const navigateToAuth = (isLogin: boolean = false) => {
    setAppState(prev => ({ 
      ...prev, 
      currentScreen: 'auth',
      isLoginMode: isLogin 
    }));
  };

  const navigateToModules = () => {
    setAppState(prev => ({ ...prev, currentScreen: 'modules' }));
  };

  const navigateToMood = () => {
    setAppState(prev => ({ ...prev, currentScreen: 'mood' }));
  };

  const navigateToDashboard = () => {
    setAppState(prev => ({ ...prev, currentScreen: 'dashboard' }));
  };

  const navigateToSettings = () => {
    setAppState(prev => ({ ...prev, currentScreen: 'settings' }));
  };

  const navigateToCalendar = () => {
    setAppState(prev => ({ ...prev, currentScreen: 'calendar' }));
  };

  // Render current screen
  switch (appState.currentScreen) {
    case 'welcome':
      return (
        <WelcomeScreen
          onGetStarted={() => navigateToAuth(false)}
          onLogin={() => navigateToAuth(true)}
        />
      );

    case 'auth':
      return (
        <AuthScreen
          isLogin={appState.isLoginMode || false}
          onAuth={handleAuth}
          onBack={navigateToWelcome}
          onToggleMode={() => setAppState(prev => ({ 
            ...prev, 
            isLoginMode: !prev.isLoginMode 
          }))}
        />
      );

    case 'modules':
      return (
        <ModuleEntry
          onComplete={handleModulesComplete}
          existingModules={appState.modules}
        />
      );

    case 'dashboard':
      return (
        <StudyDashboard
          user={appState.user!}
          modules={appState.modules}
          sessions={appState.todaysSessions}
          moodEntries={appState.moodEntries}
          onStartBreak={handleStartBreak}
          onCompleteSession={handleCompleteSession}
          onEditModules={navigateToModules}
          onViewMood={navigateToMood}
          notifications={appState.notifications}
          achievements={appState.achievements}
          goals={appState.goals}
          onMarkNotificationRead={handleMarkNotificationRead}
          onClearNotifications={handleClearNotifications}
          onOpenSettings={navigateToSettings}
          onOpenCalendar={navigateToCalendar}
        />
      );

    case 'break':
      return (
        <BreakScreen
          session={appState.currentSession!}
          moodEntries={appState.moodEntries}
          onCompleteBreak={handleCompleteBreak}
          onSkipBreak={handleSkipBreak}
        />
      );

    case 'mood':
      return (
        <MoodTracker
          moodEntries={appState.moodEntries}
          lastSession={appState.currentSession || undefined}
          modules={appState.modules}
          onAddMood={handleAddMood}
          onBack={navigateToDashboard}
        />
      );

    case 'settings':
      return (
        <SettingsPanel
          settings={appState.settings}
          onUpdateSettings={handleUpdateSettings}
          onBack={navigateToDashboard}
        />
      );

    case 'calendar':
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-8">
              <button
                onClick={navigateToDashboard}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Calendar Integration</h1>
                <p className="text-gray-600">Sync your study sessions with your calendar</p>
              </div>
            </div>
            
            <CalendarSyncPanel
              integrations={appState.calendarIntegrations}
              sessions={appState.todaysSessions}
              modules={appState.modules}
              onUpdateIntegrations={handleUpdateCalendarIntegrations}
            />
          </div>
        </div>
      );

    default:
      return (
        <WelcomeScreen
          onGetStarted={() => navigateToAuth(false)}
          onLogin={() => navigateToAuth(true)}
        />
      );
  }
}

export default App;