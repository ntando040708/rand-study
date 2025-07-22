import { WellnessData, MoodEntry } from './types';

export class WellnessManager {
  static calculateStressLevel(moodEntries: MoodEntry[], sessionCount: number): number {
    const recentMoods = moodEntries.slice(-7);
    if (recentMoods.length === 0) return 0;

    const avgMood = recentMoods.reduce((sum, entry) => sum + entry.mood, 0) / recentMoods.length;
    const moodVariance = this.calculateVariance(recentMoods.map(e => e.mood));
    
    // High variance + low mood = high stress
    const stressFromMood = (5 - avgMood) / 4; // 0-1 scale
    const stressFromVariance = Math.min(moodVariance / 2, 1); // 0-1 scale
    
    // Factor in session completion rate
    const incompleteSessions = sessionCount > 0 ? 0.2 : 0; // Assume some incomplete sessions add stress
    
    return Math.min((stressFromMood * 0.5 + stressFromVariance * 0.3 + incompleteSessions * 0.2) * 10, 10);
  }

  private static calculateVariance(numbers: number[]): number {
    const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / numbers.length;
  }

  static generateWellnessReminders(wellnessData: WellnessData): string[] {
    const reminders: string[] = [];
    const now = new Date();
    const lastCheck = new Date(wellnessData.lastWellnessCheck);
    const hoursSinceCheck = (now.getTime() - lastCheck.getTime()) / (1000 * 60 * 60);

    // Hydration reminders
    if (hoursSinceCheck > 1) {
      reminders.push('💧 Time to hydrate! Drink some water to stay focused.');
    }

    // Eye strain reminders
    if (hoursSinceCheck > 0.5) {
      reminders.push('👀 Give your eyes a break! Look at something 20 feet away for 20 seconds.');
    }

    // Posture reminders
    if (hoursSinceCheck > 0.75) {
      reminders.push('🧘 Check your posture! Sit up straight and stretch your shoulders.');
    }

    // Stress level warnings
    if (wellnessData.stressLevel > 7) {
      reminders.push('😌 Your stress levels seem high. Consider taking a longer break or trying some breathing exercises.');
    }

    // Sleep reminders
    if (wellnessData.sleepHours < 7) {
      reminders.push('😴 You might need more sleep. Good rest improves focus and memory!');
    }

    return reminders;
  }

  static generateBreathingExercise(): {
    name: string;
    description: string;
    steps: string[];
    duration: number;
  } {
    const exercises = [
      {
        name: '4-7-8 Breathing',
        description: 'A calming technique to reduce stress and anxiety',
        steps: [
          'Inhale through your nose for 4 counts',
          'Hold your breath for 7 counts',
          'Exhale through your mouth for 8 counts',
          'Repeat 3-4 times'
        ],
        duration: 2 // minutes
      },
      {
        name: 'Box Breathing',
        description: 'Used by Navy SEALs to stay calm under pressure',
        steps: [
          'Inhale for 4 counts',
          'Hold for 4 counts',
          'Exhale for 4 counts',
          'Hold empty for 4 counts',
          'Repeat 5-10 times'
        ],
        duration: 3
      },
      {
        name: 'Progressive Muscle Relaxation',
        description: 'Release tension from your body',
        steps: [
          'Tense your toes for 5 seconds, then relax',
          'Tense your calves for 5 seconds, then relax',
          'Continue up your body to your head',
          'Focus on the contrast between tension and relaxation'
        ],
        duration: 10
      }
    ];

    return exercises[Math.floor(Math.random() * exercises.length)];
  }

  static trackWellnessMetrics(
    currentData: WellnessData,
    action: 'hydration' | 'eye-break' | 'posture-check' | 'stress-check'
  ): WellnessData {
    const updated = { ...currentData };
    updated.lastWellnessCheck = new Date().toISOString();

    switch (action) {
      case 'hydration':
        updated.hydrationReminders += 1;
        break;
      case 'eye-break':
        updated.eyeStrainBreaks += 1;
        break;
      case 'posture-check':
        // Could track posture checks if needed
        break;
      case 'stress-check':
        // Stress level would be recalculated based on recent mood data
        break;
    }

    return updated;
  }
}