import { Module, StudySession, MoodEntry } from './types';
import { StudyAnalytics } from './analytics';

const SCHEDULE_CONFIG = {
  START_HOUR: 9, // 9 AM
  END_HOUR: 17,  // 5 PM
  MAX_SESSIONS_PER_DAY: 8,
  MOOD_THRESHOLD: 3.5,
  SESSION_LONG_MINS: 45,
  SESSION_SHORT_MINS: 30,
  SHUFFLE_PROBABILITY: 0.3
} as const;

export function generateDailySchedule(
  modules: Module[], 
  moodEntries: MoodEntry[] = []
  // Note: previousSessions parameter removed as it was unused
): StudySession[] {
  if (modules.length === 0) return [];

  // Analyze previous performance to optimize schedule
  const modulePerformance = StudyAnalytics.analyzeModulePerformance(moodEntries, modules);
  
  // FIX: Spread into a new array to prevent in-place mutation of React props
  const prioritizedModules = [...modules].sort((a, b) => {
    const aPerf = modulePerformance.find(p => p.moduleId === a.id);
    const bPerf = modulePerformance.find(p => p.moduleId === b.id);
    return (aPerf?.avgMood || 3) - (bPerf?.avgMood || 3);
  });

  const sessions: StudySession[] = [];
  
  // Adaptive session length based on mood data
  const avgMood = moodEntries.length > 0 
    ? moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length 
    : 3;
  
  const sessionLength = avgMood > SCHEDULE_CONFIG.MOOD_THRESHOLD 
    ? SCHEDULE_CONFIG.SESSION_LONG_MINS 
    : SCHEDULE_CONFIG.SESSION_SHORT_MINS;
    
  const breakLength = StudyAnalytics.calculateOptimalBreakTime(moodEntries);
  
  let currentTime = SCHEDULE_CONFIG.START_HOUR * 60; // Convert to minutes
  const endTime = SCHEDULE_CONFIG.END_HOUR * 60;
  
  // Smart randomization - prioritize struggling modules early in the day
  const shuffledModules = [...prioritizedModules];
  for (let i = shuffledModules.length - 1; i > 0; i--) {
    if (Math.random() > SCHEDULE_CONFIG.SHUFFLE_PROBABILITY) { 
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledModules[i], shuffledModules[j]] = [shuffledModules[j], shuffledModules[i]];
    }
  }
  
  let moduleIndex = 0;

  while (currentTime + sessionLength <= endTime) {
    const module = shuffledModules[moduleIndex % shuffledModules.length];
    
    const session: StudySession = {
      id: `session_${Date.now()}_${sessions.length}`,
      moduleId: module.id,
      startTime: formatTime(currentTime),
      endTime: formatTime(currentTime + sessionLength),
      duration: sessionLength,
      completed: false,
      date: new Date().toISOString().split('T')[0]
    };

    sessions.push(session);
    currentTime += sessionLength + breakLength;
    moduleIndex++;

    if (sessions.length >= SCHEDULE_CONFIG.MAX_SESSIONS_PER_DAY) break;
  }

  return sessions;
}

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  
  // Handle 12-hour clock formatting correctly
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  
  return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
}
