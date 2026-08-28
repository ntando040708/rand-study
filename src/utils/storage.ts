import { 
  User, 
  Module, 
  StudySession, 
  MoodEntry, 
  Notification, 
  Achievement, 
  StudyGoal,
  AppSettings,
  CalendarIntegration
  // Assuming these are exported from types based on your usage:
  // StudyTechnique, Challenge, WellnessData 
} from './types';

// Centralized dictionary for all storage keys to prevent typos
const STORAGE_KEYS = {
  USER: 'randstudy_user',
  MODULES: 'randstudy_modules',
  MOODS: 'randstudy_moods',
  NOTIFICATIONS: 'randstudy_notifications',
  ACHIEVEMENTS: 'randstudy_achievements',
  GOALS: 'randstudy_goals',
  SETTINGS: 'randstudy_settings',
  TECHNIQUES: 'randstudy_techniques',
  CHALLENGES: 'randstudy_challenges',
  WELLNESS: 'randstudy_wellness',
  CALENDAR: 'randstudy_calendar_integrations',
} as const;

// Generic, safe getter that prevents JSON.parse crashes
const getSafeItem = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Storage Error: Failed to parse key "${key}"`, error);
    return fallback;
  }
};

// Generic, safe setter
const setSafeItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Storage Error: Failed to write to key "${key}"`, error);
  }
};

// Default structures
const defaultSettings: AppSettings = {
  notifications: true,
  soundEnabled: true,
  theme: {
    name: 'default',
    mode: 'light',
    colorScheme: { primary: '', secondary: '', accent: '', background: '', surface: '', text: '', textSecondary: '', success: '', warning: '', error: '', gradient: [] },
    layout: { density: 'comfortable', borderRadius: 'rounded', shadows: 'subtle', animations: 'full' },
    customizations: { customColors: {}, fontFamily: '', fontSize: 'medium', moduleColorOverrides: {} }
  },
  sessionReminders: true,
  breakReminders: true,
  defaultSessionLength: 30,
  defaultBreakLength: 10,
  studySounds: { enabled: false, volume: 50 },
  privacy: { /* default privacy settings */ } as any,
  integrations: { /* default integrations */ } as any,
  gamification: { /* default gamification */ } as any,
};

const defaultWellnessData = {
  stressLevel: 0,
  hydrationReminders: 0,
  eyeStrainBreaks: 0,
  sleepHours: 8,
  lastWellnessCheck: new Date().toISOString()
};

export const storage = {
  getUser: () => getSafeItem<User | null>(STORAGE_KEYS.USER, null),
  setUser: (user: User) => setSafeItem(STORAGE_KEYS.USER, user),

  getModules: () => getSafeItem<Module[]>(STORAGE_KEYS.MODULES, []),
  setModules: (modules: Module[]) => setSafeItem(STORAGE_KEYS.MODULES, modules),

  // Dynamic keys are handled directly
  getSessions: (date: string) => getSafeItem<StudySession[]>(`randstudy_sessions_${date}`, []),
  setSessions: (date: string, sessions: StudySession[]) => setSafeItem(`randstudy_sessions_${date}`, sessions),

  getMoodEntries: () => getSafeItem<MoodEntry[]>(STORAGE_KEYS.MOODS, []),
  setMoodEntries: (entries: MoodEntry[]) => setSafeItem(STORAGE_KEYS.MOODS, entries),

  getNotifications: () => getSafeItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []),
  setNotifications: (notifications: Notification[]) => setSafeItem(STORAGE_KEYS.NOTIFICATIONS, notifications),

  getAchievements: () => getSafeItem<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS, []),
  setAchievements: (achievements: Achievement[]) => setSafeItem(STORAGE_KEYS.ACHIEVEMENTS, achievements),

  getGoals: () => getSafeItem<StudyGoal[]>(STORAGE_KEYS.GOALS, []),
  setGoals: (goals: StudyGoal[]) => setSafeItem(STORAGE_KEYS.GOALS, goals),

  getSettings: () => getSafeItem<AppSettings>(STORAGE_KEYS.SETTINGS, defaultSettings),
  setSettings: (settings: AppSettings) => setSafeItem(STORAGE_KEYS.SETTINGS, settings),

  getStudyTechniques: () => getSafeItem<any[]>(STORAGE_KEYS.TECHNIQUES, []), // Replace 'any' with StudyTechnique when available
  setStudyTechniques: (techniques: any[]) => setSafeItem(STORAGE_KEYS.TECHNIQUES, techniques),

  getChallenges: () => getSafeItem<any[]>(STORAGE_KEYS.CHALLENGES, []), // Replace 'any' with Challenge when available
  setChallenges: (challenges: any[]) => setSafeItem(STORAGE_KEYS.CHALLENGES, challenges),

  getWellnessData: () => getSafeItem<any>(STORAGE_KEYS.WELLNESS, defaultWellnessData), // Replace 'any' with WellnessData when available
  setWellnessData: (data: any) => setSafeItem(STORAGE_KEYS.WELLNESS, data),

  getCalendarIntegrations: () => getSafeItem<CalendarIntegration[]>(STORAGE_KEYS.CALENDAR, []),
  setCalendarIntegrations: (integrations: CalendarIntegration[]) => setSafeItem(STORAGE_KEYS.CALENDAR, integrations),

  clearAll: (): void => {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('randstudy_'));
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Storage Error: Failed to clear local storage', error);
    }
  },
};
