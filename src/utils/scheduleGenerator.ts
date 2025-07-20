import { Module, StudySession } from './types';

export function generateDailySchedule(modules: Module[]): StudySession[] {
  if (modules.length === 0) return [];

  const sessions: StudySession[] = [];
  const startHour = 9; // 9 AM
  const endHour = 17; // 5 PM
  const sessionLength = 30; // 30 minutes
  const breakLength = 15; // 15 minutes between sessions
  
  let currentTime = startHour * 60; // Convert to minutes
  const endTime = endHour * 60;
  
  // Shuffle modules for randomization
  const shuffledModules = [...modules].sort(() => Math.random() - 0.5);
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