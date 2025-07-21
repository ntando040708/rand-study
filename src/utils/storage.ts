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

  getSettings: (): any => {
    const settings = localStorage.getItem('randstudy_settings');
    return settings ? JSON.parse(settings) : {
      notifications: true,
      soundEnabled: true,
      theme: 'light',
      sessionReminders: true,
      breakReminders: true
    };
  },

  setSettings: (settings: any): void => {
    localStorage.setItem('randstudy_settings', JSON.stringify(settings));
  },

  clearAll: (): void => {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('randstudy_'));
    keys.forEach(key => localStorage.removeItem(key));
  }
};