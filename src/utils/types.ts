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
  currentScreen: 'welcome' | 'auth' | 'modules' | 'dashboard' | 'break' | 'mood' | 'settings' | 'analytics' | 'social' | 'wellness' | 'calendar';
  isLoginMode?: boolean;
  notifications: Notification[];
  achievements: Achievement[];
  goals: StudyGoal[];
  settings: AppSettings;
  calendarIntegrations: CalendarIntegration[];
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
}

export interface ExternalIntegration {
  id: string;
  name: string;
  type: 'calendar' | 'notes' | 'flashcards' | 'lms';
  isConnected: boolean;
  settings: any;
}

export interface CalendarIntegration {
  id: string;
  provider: 'google' | 'outlook' | 'apple' | 'ical';
  name: string;
  email: string;
  isConnected: boolean;
  accessToken?: string;
  refreshToken?: string;
  calendarId?: string;
  syncEnabled: boolean;
  lastSync: string;
  syncSettings: CalendarSyncSettings;
}

export interface CalendarSyncSettings {
  autoCreateEvents: boolean;
  syncCompletedSessions: boolean;
  includeBreaks: boolean;
  eventPrefix: string;
  reminderMinutes: number;
  colorCoding: boolean;
  conflictResolution: 'skip' | 'reschedule' | 'notify';
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location?: string;
  attendees?: string[];
  reminders?: number[];
  color?: string;
  source: 'randstudy' | 'external';
  studySessionId?: string;
}

export interface CalendarConflict {
  id: string;
  studySessionId: string;
  conflictingEvent: CalendarEvent;
  suggestedResolution: 'reschedule' | 'shorten' | 'skip';
  alternativeSlots: string[];
}

export interface AppSettings {
  notifications: boolean;
  soundEnabled: boolean;
  theme: ThemeConfig;
  sessionReminders: boolean;
  breakReminders: boolean;
  defaultSessionLength: number;
  defaultBreakLength: number;
  studySounds: StudySoundSettings;
  privacy: PrivacySettings;
  integrations: IntegrationSettings;
  gamification: GamificationSettings;
}

export interface ThemeConfig {
  name: string;
  mode: 'light' | 'dark' | 'auto';
  colorScheme: ColorScheme;
  layout: LayoutConfig;
  customizations: ThemeCustomizations;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  success: string;
  warning: string;
  error: string;
  gradient: string[];
}

export interface LayoutConfig {
  density: 'compact' | 'comfortable' | 'spacious';
  borderRadius: 'sharp' | 'rounded' | 'extra-rounded';
  shadows: 'none' | 'subtle' | 'prominent';
  animations: 'none' | 'reduced' | 'full';
}

export interface ThemeCustomizations {
  customColors: { [key: string]: string };
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
  moduleColorOverrides: { [moduleId: string]: string };
}

export interface StudySoundSettings {