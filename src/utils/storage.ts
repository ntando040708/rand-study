import { User, Module, StudySession, MoodEntry, Notification, Achievement, StudyGoal } from './types';

export const storage = {
  getUser: (): User | null => {
    const user = localStorage.getItem('randstudy_user');
    return user ? JSON.parse(user) : null;
  },

  setUser: (user: User): void => {
    localStorage.setItem('randstudy_user', JSON.stringify(user));
  },

  getModules: (): Module[] => {
    const modules = localStorage.getItem('randstudy_modules');
    return modules ? JSON.parse(modules) : [];
  },

  setModules: (modules: Module[]): void => {
    localStorage.setItem('randstudy_modules', JSON.stringify(modules));
  },

  getSessions: (date: string): StudySession[] => {
    const sessions = localStorage.getItem(`randstudy_sessions_${date}`);
    return sessions ? JSON.parse(sessions) : [];
  },

  setSessions: (date: string, sessions: StudySession[]): void => {
    localStorage.setItem(`randstudy_sessions_${date}`, JSON.stringify(sessions));
  },

  getMoodEntries: (): MoodEntry[] => {
    const entries = localStorage.getItem('randstudy_moods');
    return entries ? JSON.parse(entries) : [];
  },

  setMoodEntries: (entries: MoodEntry[]): void => {
    localStorage.setItem('randstudy_moods', JSON.stringify(entries));
  },

  getNotifications: (): Notification[] => {
    const notifications = localStorage.getItem('randstudy_notifications');
    return notifications ? JSON.parse(notifications) : [];
  },

  setNotifications: (notifications: Notification[]): void => {
    localStorage.setItem('randstudy_notifications', JSON.stringify(notifications));
  },

  getAchievements: (): Achievement[] => {
    const achievements = localStorage.getItem('randstudy_achievements');
    return achievements ? JSON.parse(achievements) : [];
  },

  setAchievements: (achievements: Achievement[]): void => {
    localStorage.setItem('randstudy_achievements', JSON.stringify(achievements));
  },

  getGoals: (): StudyGoal[] => {
    const goals = localStorage.getItem('randstudy_goals');
    return goals ? JSON.parse(goals) : [];
  },

  setGoals: (goals: StudyGoal[]): void => {
    localStorage.setItem('randstudy_goals', JSON.stringify(goals));
  },

  getSettings: (): AppSettings => {
    const settings = localStorage.getItem('randstudy_settings');
    return settings ? JSON.parse(settings) : {
      notifications: true,
      soundEnabled: true,
      theme: 'light',
      sessionReminders: true,
      breakReminders: true,
      defaultSessionLength: 30,
      defaultBreakLength: 10,
      pomodoroSettings: {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        sessionsUntilLongBreak: 4,
        autoStartBreaks: false,
        autoStartSessions: false
      },
      studySounds: {
        enabled: false,
        type: 'white-noise',
        volume: 50
      },
      wellness: {
        eyeStrainReminders: true,
        hydrationReminders: true,
        postureReminders: true,
        stressMonitoring: true,
        sleepTracking: false
      },
      gamification: {
        xpSystem: true,
        streakChallenges: true,
        leaderboards: false,
        achievements: true
      }
    };
  },

  setSettings: (settings: AppSettings): void => {
    localStorage.setItem('randstudy_settings', JSON.stringify(settings));
  },

  getStudyTechniques: (): StudyTechnique[] => {
    const techniques = localStorage.getItem('randstudy_techniques');
    return techniques ? JSON.parse(techniques) : [];
  },

  setStudyTechniques: (techniques: StudyTechnique[]): void => {
    localStorage.setItem('randstudy_techniques', JSON.stringify(techniques));
  },

  getChallenges: (): Challenge[] => {
    const challenges = localStorage.getItem('randstudy_challenges');
    return challenges ? JSON.parse(challenges) : [];
  },

  setChallenges: (challenges: Challenge[]): void => {
    localStorage.setItem('randstudy_challenges', JSON.stringify(challenges));
  },

  getWellnessData: (): WellnessData => {
    const data = localStorage.getItem('randstudy_wellness');
    return data ? JSON.parse(data) : {
      stressLevel: 0,
      hydrationReminders: 0,
      eyeStrainBreaks: 0,
      sleepHours: 8,
      lastWellnessCheck: new Date().toISOString()
    };
  },

  setWellnessData: (data: WellnessData): void => {
    localStorage.setItem('randstudy_wellness', JSON.stringify(data));
  },

  clearAll: (): void => {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('randstudy_'));
    keys.forEach(key => localStorage.removeItem(key));
  }