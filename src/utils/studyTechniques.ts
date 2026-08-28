import { StudyTechnique, PomodoroSettings } from './types';

const ALGORITHM_CONSTANTS = {
  MAX_SPACED_REPETITION_DAYS: 365,
  MIN_INTERVAL_DAYS: 1,
  DEFAULT_POMODORO_INTERVAL: 4
} as const;

export class StudyTechniqueManager {
  static getDefaultTechniques(): StudyTechnique[] {
    return [
      {
        id: 'pomodoro',
        name: 'Pomodoro Technique',
        description: 'Work in focused 25-minute intervals with short breaks',
        type: 'pomodoro',
        settings: {
          workDuration: 25,
          shortBreakDuration: 5,
          longBreakDuration: 15,
          sessionsUntilLongBreak: 4,
          autoStartBreaks: false,
          autoStartSessions: false
        },
        isActive: true
      },
      {
        id: 'spaced-repetition',
        name: 'Spaced Repetition',
        description: 'Review material at increasing intervals for better retention',
        type: 'spaced-repetition',
        settings: {
          initialInterval: 1, // days
          multiplier: 2.5,
          maxInterval: 365,
          difficultyAdjustment: true
        },
        isActive: false
      },
      {
        id: 'active-recall',
        name: 'Active Recall',
        description: 'Test yourself regularly instead of passive reading',
        type: 'active-recall',
        settings: {
          promptFrequency: 10, // minutes
          questionTypes: ['definition', 'application', 'comparison'],
          selfAssessment: true
        },
        isActive: false
      },
      {
        id: 'feynman',
        name: 'Feynman Technique',
        description: 'Explain concepts in simple terms to identify knowledge gaps',
        type: 'feynman',
        settings: {
          explanationTime: 5, // minutes
          simplificationLevel: 'beginner',
          recordExplanations: true
        },
        isActive: false
      }
    ];
  }

  static calculatePomodoroSession(settings: PomodoroSettings, sessionNumber: number) {
    // Prevent Modulo by Zero and prevent Session 0 from triggering an immediate long break
    const safeInterval = settings.sessionsUntilLongBreak > 0 
      ? settings.sessionsUntilLongBreak 
      : ALGORITHM_CONSTANTS.DEFAULT_POMODORO_INTERVAL;
      
    const isLongBreak = sessionNumber > 0 && sessionNumber % safeInterval === 0;
    
    return {
      workDuration: settings.workDuration,
      breakDuration: isLongBreak ? settings.longBreakDuration : settings.shortBreakDuration,
      isLongBreak,
      autoStart: settings.autoStartSessions
    };
  }

  static generateActiveRecallPrompts(moduleId: string, topic: string): string[] {
    return [
      `Explain ${topic} in your own words without looking at notes.`,
      `What are the key concepts related to ${topic}?`,
      `How does ${topic} connect to other concepts you've learned?`,
      `Can you think of a real-world example of ${topic}?`,
      `What questions would you ask about ${topic} on an exam?`
    ];
  }

  static calculateSpacedRepetitionSchedule(difficulty: number, previousInterval: number): number {
    const multiplier = difficulty >= 3 ? 2.5 : difficulty >= 2 ? 1.8 : 1.3;
    
    // Prevent the zero-interval trap where 0 * multiplier = 0 indefinitely
    const safeInterval = Math.max(previousInterval, ALGORITHM_CONSTANTS.MIN_INTERVAL_DAYS);
    
    return Math.min(
      Math.ceil(safeInterval * multiplier), 
      ALGORITHM_CONSTANTS.MAX_SPACED_REPETITION_DAYS
    );
  }
}
