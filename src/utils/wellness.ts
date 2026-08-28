import { WellnessData, MoodEntry } from './types';

export class WellnessManager {
  /**
   * Calculates a dynamic stress score (0-10) based on mood variance and session completion.
   */
  static calculateStressLevel(
    moodEntries: MoodEntry[], 
    totalSessions: number, 
    incompleteSessions: number
  ): number {
    const recentMoods = moodEntries.slice(-7);
    if (recentMoods.length === 0) return 0;

    const moodValues = recentMoods.map(e => e.mood);
    const avgMood = moodValues.reduce((sum, mood) => sum + mood, 0) / moodValues.length;
    const moodVariance = this.calculateVariance(moodValues);
    
    // High variance + low mood = high stress
    const stressFromMood = (5 - avgMood) / 4; // Normalized 0-1 scale
    const stressFromVariance = Math.min(moodVariance / 2, 1); // Normalized 0-1 scale
    
    // Dynamically factor in session completion rate
    const incompletePenalty = totalSessions > 0 ? (incompleteSessions / totalSessions) : 0;
    
    // Weighted formula: 50% Mood, 30% Variance, 20% Task Completion
    const rawStressScore = (stressFromMood * 0.5) + (stressFromVariance * 0.3) + (incompletePenalty * 0.2);
    
    // Return final score capped at 10
    return Math.min(rawStressScore * 10, 10);
  }

  private static calculateVariance(numbers: number[]): number {
    if (numbers.length === 0) return 0; // Prevent Division by Zero
    
    const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / numbers.length;
  }

  static generateWellnessReminders(wellnessData: WellnessData): string[] {
    const reminders: string[] = [];
    const now = new Date();
    const lastCheck = new Date(wellnessData.lastWellnessCheck);
    
    // Calculate hours safely, preventing negative time if system clocks skew
    const hoursSinceCheck = Math.max((now.getTime() - lastCheck.getTime()) / (1000 * 60 * 60), 0);

    if (hoursSinceCheck > 1) {
      reminders.push('💧 Time to hydrate! Drink some water to stay focused.');
    }

    if (hoursSinceCheck > 0.5) {
      reminders.push('👀 Give your eyes a break! Look at something 20 feet away for 20 seconds.');
    }

    if (hoursSinceCheck > 0.75) {
      reminders.push('🧘 Check your posture! Sit up straight and stretch your shoulders.');
    }

    if (wellnessData.stressLevel > 7) {
      reminders.push('😌 Your stress levels seem high. Consider taking a longer break or trying some breathing exercises.');
    }

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
        duration: 2
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
    // Return a new immutable object instead of mutating a spread copy
    return {
      ...currentData,
      lastWellnessCheck: new Date().toISOString(),
      hydrationReminders: action === 'hydration' ? currentData.hydrationReminders + 1 : currentData.hydrationReminders,
      eyeStrainBreaks: action === 'eye-break' ? currentData.eyeStrainBreaks + 1 : currentData.eyeStrainBreaks
    };
  }
}
