import { User, Module, StudySession, MoodEntry } from './types';

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

  clearAll: (): void => {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('randstudy_'));
    keys.forEach(key => localStorage.removeItem(key));
  }
};