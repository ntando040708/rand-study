import { Module, StudySession } from './types';
import { StudyAnalytics } from './analytics';

export function generateDailySchedule(
  modules: Module[], 
  moodEntries: any[] = [], 
  previousSessions: StudySession[] = []
): StudySession[] {
  if (modules.length === 0) return [];

  // Analyze previous performance to optimize schedule
  const modulePerformance = StudyAnalytics.analyzeModulePerformance(moodEntries, modules);
  
  // Prioritize modules with lower mood scores (need more attention)
  const prioritizedModules = modules.sort((a, b) => {
    const aPerf = modulePerformance.find(p => p.moduleId === a.id);
    const bPerf = modulePerformance.find(p => p.moduleId === b.id);
    return (aPerf?.avgMood || 3) - (bPerf?.avgMood || 3);
  });

  const sessions: StudySession[] = [];
  const startHour = 9; // 9 AM
  const endHour = 17; // 5 PM
  
  // Adaptive session length based on mood data
  const avgMood = moodEntries.length > 0 
    ? moodEntries.reduce((sum: number, entry: any) => sum + entry.mood, 0) / moodEntries.length 
    : 3;
  
  const sessionLength = avgMood > 3.5 ? 45 : 30; // Longer sessions if mood is good
  const breakLength = StudyAnalytics.calculateOptimalBreakTime(moodEntries);
  
  let currentTime = startHour * 60; // Convert to minutes
  const endTime = endHour * 60;
  
  // Smart randomization - prioritize struggling modules early in the day
  const shuffledModules = [...prioritizedModules];
  // Add some randomization while keeping priority
  for (let i = shuffledModules.length - 1; i > 0; i--) {
    if (Math.random() > 0.3) { // 70% chance to maintain priority order
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

    // Limit to 8 sessions per day
    if (sessions.length >= 8) break;
  }

  return sessions;
}

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  
  return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
}