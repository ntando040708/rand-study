import { MoodEntry, StudySession, Module, StudyPattern, AIRecommendation } from './types';

// Define strict types for the accumulator to avoid 'any'
interface TimeSlotStats {
  total: number;
  count: number;
  avgMood: number;
  avgProductivity: number;
}

export class AIRecommendationEngine {
  static generateRecommendations(
    moodEntries: MoodEntry[],
    sessions: StudySession[],
    modules: Module[],
    patterns: StudyPattern[]
  ): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];

    // Analyze study patterns
    const timePatterns = this.analyzeTimePatterns(patterns);
    const moodPatterns = this.analyzeMoodPatterns(moodEntries);
    const productivityPatterns = this.analyzeProductivityPatterns(sessions, moodEntries);

    // Generate schedule recommendations
    if (timePatterns.bestTime) {
      recommendations.push({
        id: 'optimal-time',
        type: 'schedule',
        title: 'Optimal Study Time Detected',
        description: `Your performance peaks at ${timePatterns.bestTime}`,
        confidence: timePatterns.confidence,
        actionable: `Schedule your most challenging subjects during the ${timePatterns.bestTime}`
      });
    }

    // Generate technique recommendations
    if (moodPatterns.averageMood < 3) {
      recommendations.push({
        id: 'technique-pomodoro',
        type: 'technique',
        title: 'Try Shorter Study Sessions',
        description: 'Your mood data suggests shorter, focused sessions might help',
        confidence: 0.8,
        actionable: 'Enable Pomodoro Technique with 25-minute sessions'
      });
    }

    // Generate wellness recommendations
    const stressIndicators = this.detectStressIndicators(moodEntries, sessions);
    if (stressIndicators.isStressed) {
      recommendations.push({
        id: 'wellness-stress',
        type: 'wellness',
        title: 'Stress Management Needed',
        description: 'Your study patterns indicate elevated stress levels',
        confidence: stressIndicators.confidence,
        actionable: 'Take longer breaks and try breathing exercises'
      });
    }

    return recommendations.sort((a, b) => b.confidence - a.confidence);
  }

  private static analyzeTimePatterns(patterns: StudyPattern[]) {
    if (patterns.length < 5) {
      return { bestTime: null, confidence: 0 };
    }

    const timePerformance = patterns.reduce((acc, pattern) => {
      const hour = parseInt(pattern.timeOfDay.split(':')[0], 10);
      const timeSlot = this.getTimeSlot(hour);
      
      if (!acc[timeSlot]) {
        acc[timeSlot] = { total: 0, count: 0, avgMood: 0, avgProductivity: 0 };
      }
      
      acc[timeSlot].total += pattern.mood + pattern.productivity;
      acc[timeSlot].count += 1;
      acc[timeSlot].avgMood += pattern.mood;
      acc[timeSlot].avgProductivity += pattern.productivity;
      
      return acc;
    }, {} as Record<string, TimeSlotStats>);

    const bestSlot = Object.entries(timePerformance)
      .map(([slot, data]) => ({
        slot,
        score: data.total / data.count,
        confidence: Math.min(data.count / 10, 1)
      }))
      .sort((a, b) => b.score - a.score)[0];

    return {
      bestTime: bestSlot?.slot || null,
      confidence: bestSlot?.confidence || 0
    };
  }

  private static getTimeSlot(hour: number): string {
    if (hour >= 6 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 17) return 'Afternoon';
    if (hour >= 17 && hour < 21) return 'Evening';
    return 'Night';
  }

  private static analyzeMoodPatterns(moodEntries: MoodEntry[]) {
    if (moodEntries.length === 0) {
      return { averageMood: 3, trend: 'stable' };
    }

    const recentMoods = moodEntries.slice(-10);
    const averageMood = recentMoods.reduce((sum, entry) => sum + entry.mood, 0) / recentMoods.length;
    
    // Safely calculate trend, preventing division by zero if less than 2 entries exist
    let trend = 'stable';
    if (recentMoods.length >= 2) {
      const midPoint = Math.floor(recentMoods.length / 2);
      const firstHalf = recentMoods.slice(0, midPoint);
      const secondHalf = recentMoods.slice(midPoint);
      
      const firstAvg = firstHalf.length > 0 ? firstHalf.reduce((sum, entry) => sum + entry.mood, 0) / firstHalf.length : averageMood;
      const secondAvg = secondHalf.length > 0 ? secondHalf.reduce((sum, entry) => sum + entry.mood, 0) / secondHalf.length : averageMood;
      
      if (secondAvg > firstAvg + 0.5) trend = 'improving';
      if (secondAvg < firstAvg - 0.5) trend = 'declining';
    }

    return { averageMood, trend };
  }

  private static analyzeProductivityPatterns(sessions: StudySession[], moodEntries: MoodEntry[]) {
    const completionRate = sessions.length > 0 ? 
      sessions.filter(s => s.completed).length / sessions.length : 0;
    
    const sessionMoods = moodEntries.filter(entry => 
      sessions.some(session => session.id === entry.sessionId)
    );
    
    const avgSessionMood = sessionMoods.length > 0 ?
      sessionMoods.reduce((sum, entry) => sum + entry.mood, 0) / sessionMoods.length : 3;

    return {
      completionRate,
      avgSessionMood,
      productivity: (completionRate * 0.7) + ((avgSessionMood / 5) * 0.3)
    };
  }

  private static detectStressIndicators(moodEntries: MoodEntry[], sessions: StudySession[]) {
    // Look at recent history rather than all-time history
    const recentMoods = moodEntries.slice(-7);
    const recentSessions = sessions.slice(-7);

    const lowMoodCount = recentMoods.filter(entry => entry.mood <= 2).length;
    const incompleteSessions = recentSessions.filter(s => !s.completed).length;
    
    const stressScore = (lowMoodCount / Math.max(recentMoods.length, 1)) * 0.6 + 
                        (incompleteSessions / Math.max(recentSessions.length, 1)) * 0.4;
    
    return {
      isStressed: stressScore > 0.4,
      confidence: Math.min(stressScore * 2, 1)
    };
  }
}
