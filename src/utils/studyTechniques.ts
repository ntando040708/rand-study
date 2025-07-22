import { StudyTechnique, PomodoroSettings } from './types';

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
    const isLongBreak = sessionNumber % settings.sessionsUntilLongBreak === 0;
    return {
      workDuration: settings.workDuration,
      breakDuration: isLongBreak ? settings.longBreakDuration : settings.shortBreakDuration,
      isLongBreak,
      autoStart: settings.autoStartSessions
    };
  }

  static generateActiveRecallPrompts(moduleId: string, topic: string) {
    return [
      `Explain ${topic} in your own words without looking at notes`,
      `What are the key concepts related to ${topic}?`,
      `How does ${topic} connect to other concepts you've learned?`,
      `Can you think of a real-world example of ${topic}?`,
      `What questions would you ask about ${topic} on an exam?`
    ];
  }

  static calculateSpacedRepetitionSchedule(difficulty: number, previousInterval: number) {
    const multiplier = difficulty >= 3 ? 2.5 : difficulty >= 2 ? 1.8 : 1.3;
    return Math.min(Math.ceil(previousInterval * multiplier), 365);
  }
}