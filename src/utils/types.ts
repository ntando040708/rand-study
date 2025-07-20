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
}

export interface AppState {
  user: User | null;
  modules: Module[];
  todaysSessions: StudySession[];
  currentSession: StudySession | null;
  isOnBreak: boolean;
  breakTimeLeft: number;
  moodEntries: MoodEntry[];
  currentScreen: 'welcome' | 'auth' | 'modules' | 'dashboard' | 'break' | 'mood';
}