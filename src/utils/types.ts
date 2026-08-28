// Extracted Union Types for Reusability and DRY Code
export type ScreenType = 'welcome' | 'auth' | 'modules' | 'dashboard' | 'break' | 'mood' | 'settings' | 'analytics' | 'social' | 'wellness' | 'calendar';
export type PriorityLevel = 'low' | 'medium' | 'high';
export type CalendarProvider = 'google' | 'outlook' | 'apple' | 'ical';
export type ThemeMode = 'light' | 'dark' | 'auto';

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
  currentScreen: ScreenType; // Fixed duplicate identifier
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
  priority: PriorityLevel;
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
  settings: Record<string, unknown>; // Fixed 'any' type for strict enterprise standards
}

export interface CalendarIntegration {
  id: string;
  provider: CalendarProvider;
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
  suggestResolution: 'reschedule' | 'shorten' | 'skip';
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
  mode: ThemeMode;
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

// Placeholder to close the interface cleanly based on your cut-off snippet
export interface StudySoundSettings {
  enabled: boolean;
  volume: number;
}
