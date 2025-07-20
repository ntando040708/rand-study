import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AuthScreen } from './components/AuthScreen';
import { ModuleEntry } from './components/ModuleEntry';
import { StudyDashboard } from './components/StudyDashboard';
import { BreakScreen } from './components/BreakScreen';
import { MoodTracker } from './components/MoodTracker';
import { storage } from './utils/storage';
import { generateDailySchedule } from './utils/scheduleGenerator';
import { User, Module, StudySession, MoodEntry, AppState } from './utils/types';

function App() {
  const [appState, setAppState] = useState<AppState>({
    user: null,
    modules: [],
    todaysSessions: [],
    currentSession: null,
    isOnBreak: false,
    breakTimeLeft: 0,
    moodEntries: [],
    currentScreen: 'welcome'
  });

  // Initialize app state from localStorage
  useEffect(() => {
    const user = storage.getUser();
    const modules = storage.getModules();
    const moodEntries = storage.getMoodEntries();
    const today = new Date().toISOString().split('T')[0];
    const todaysSessions = storage.getSessions(today);

    if (user && modules.length > 0) {
      setAppState(prev => ({
        ...prev,
        user,
        modules,
        moodEntries,
        todaysSessions: todaysSessions.length > 0 ? todaysSessions : generateDailySchedule(modules),
        currentScreen: 'dashboard'
      }));
    } else if (user) {
      setAppState(prev => ({
        ...prev,
        user,
        modules,
        moodEntries,
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
    const sessions = generateDailySchedule(modules);
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

    setAppState(prev => ({
      ...prev,
      user: updatedUser,
      todaysSessions: updatedSessions,
      currentSession: null
    }));
  };

  const handleAddMood = (mood: number, note: string) => {
    const moodEntry: MoodEntry = {
      id: Date.now().toString(),
      mood,
      note,
      sessionId: appState.currentSession?.id || '',
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
          onStartBreak={handleStartBreak}
          onCompleteSession={handleCompleteSession}
          onEditModules={navigateToModules}
          onViewMood={navigateToMood}
        />
      );

    case 'break':
      return (
        <BreakScreen
          session={appState.currentSession!}
          onCompleteBreak={handleCompleteBreak}
          onSkipBreak={handleSkipBreak}
        />
      );

    case 'mood':
      return (
        <MoodTracker
          moodEntries={appState.moodEntries}
          lastSession={appState.currentSession || undefined}
          onAddMood={handleAddMood}
          onBack={navigateToDashboard}
        />
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