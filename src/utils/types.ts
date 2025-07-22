export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  streak: number;
  totalSessions: number;
}

export interface Module {
  id: string;
  code: string;
  name: string;
  preferredHours: number;
  color: string;
}

export interface StudySession {
  id: string;
  moduleId: string;
  startTime: string;
  endTime: string;
  duration: number;
  completed: boolean;
  date: string;
}

export interface BreakSuggestion {
  id: string;
  title: string;
  description: string;
  duration: number;
  icon: string;
}

export interface MoodEntry {
  id: string;
  mood: number;
  note: string;
  sessionId: string;
  timestamp: string;
  moduleId: string;
  sessionDuration: number;
  wasBreakTaken: boolean;
}

export interface AppState {
  user: User | null;
  modules: Module[];
  todaysSessions: StudySession[];
  currentSession: StudySession | null;
  isOnBreak: boolean;
  breakTimeLeft: number;
  moodEntries: MoodEntry[];
  currentScreen: 'welcome' | 'auth' | 'modules' | 'dashboard' | 'break' | 'mood' | 'settings' | 'analytics' | 'social' | 'wellness';
  isLoginMode?: boolean;
  notifications: Notification[];
  achievements: Achievement[];
  goals: StudyGoal[];
  settings: AppSettings;
  studyTechniques: StudyTechnique[];
  socialFeatures: SocialFeatures;
  wellnessData: WellnessData;
}

export interface WeeklyStats {
  totalStudyTime: number;
  averageMood: number;
  completedSessions: number;
  favoriteModule: string;
  bestStudyTime: string;
}

export interface StudyInsight {
  type: 'mood' | 'productivity' | 'streak' | 'module';
  title: string;
  description: string;
  actionable: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Notification {
  id: string;
  type: 'session' | 'break' | 'achievement' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'streak' | 'sessions' | 'mood' | 'time';
}

export interface StudyGoal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  completed: boolean;
  moduleId?: string;