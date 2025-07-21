import { MoodEntry, StudySession, Module, StudyInsight } from './types';

export class StudyAnalytics {
  static generateInsights(
    moodEntries: MoodEntry[],
    sessions: StudySession[],
    modules: Module[]
  ): StudyInsight[] {
    const insights: StudyInsight[] = [];
    
    // Mood-based insights
    const recentMoods = moodEntries.slice(-7);
    if (recentMoods.length >= 3) {
      const avgMood = recentMoods.reduce((sum, entry) => sum + entry.mood, 0) / recentMoods.length;
      
      if (avgMood < 2.5) {
        insights.push({
          type: 'mood',
          title: 'Low Study Mood Detected',
          description: 'Your recent study sessions show lower satisfaction levels.',
          actionable: 'Try shorter sessions or different break activities.',
          priority: 'high'
        });
      } else if (avgMood > 4) {
        insights.push({
          type: 'mood',
          title: 'Great Study Momentum!',
          description: 'You\'re feeling positive about your study sessions.',
          actionable: 'Keep up the current routine and consider extending sessions.',
          priority: 'low'
        });
      }
    }

    // Productivity insights
    const completedSessions = sessions.filter(s => s.completed);
    const completionRate = sessions.length > 0 ? completedSessions.length / sessions.length : 0;
    
    if (completionRate < 0.6) {
      insights.push({
        type: 'productivity',
        title: 'Session Completion Could Improve',
        description: `You're completing ${Math.round(completionRate * 100)}% of planned sessions.`,
        actionable: 'Try scheduling fewer but more focused sessions.',
        priority: 'medium'
      });
    }

    // Module-specific insights
    const modulePerformance = this.analyzeModulePerformance(moodEntries, modules);
    const strugglingModule = modulePerformance.find(m => m.avgMood < 2.5);
    
    if (strugglingModule) {
      insights.push({
        type: 'module',
        title: `${strugglingModule.moduleCode} Needs Attention`,
        description: 'This module consistently shows lower satisfaction scores.',
        actionable: 'Consider changing study approach or seeking additional resources.',
        priority: 'high'
      });
    }

    return insights;
  }

  static analyzeModulePerformance(moodEntries: MoodEntry[], modules: Module[]) {
    return modules.map(module => {
      const moduleMoods = moodEntries.filter(entry => entry.moduleId === module.id);
      const avgMood = moduleMoods.length > 0 
        ? moduleMoods.reduce((sum, entry) => sum + entry.mood, 0) / moduleMoods.length 
        : 3;
      
      return {
        moduleId: module.id,
        moduleCode: module.code,
        avgMood,
        sessionCount: moduleMoods.length
      };
    });
  }

  static calculateOptimalBreakTime(moodEntries: MoodEntry[]): number {
    // Analyze mood patterns to suggest optimal break duration
    const breakSessions = moodEntries.filter(entry => entry.wasBreakTaken);
    const noBreakSessions = moodEntries.filter(entry => !entry.wasBreakTaken);
    
    const avgMoodWithBreak = breakSessions.length > 0 
      ? breakSessions.reduce((sum, entry) => sum + entry.mood, 0) / breakSessions.length 
      : 3;
    
    const avgMoodWithoutBreak = noBreakSessions.length > 0 
      ? noBreakSessions.reduce((sum, entry) => sum + entry.mood, 0) / noBreakSessions.length 
      : 3;
    
    // Recommend longer breaks if mood improves significantly with breaks
    if (avgMoodWithBreak > avgMoodWithoutBreak + 0.5) {
      return 15; // 15 minutes
    }
    return 10; // 10 minutes default
  }

  static getWeeklyStats(moodEntries: MoodEntry[], sessions: StudySession[], modules: Module[]) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weeklyMoods = moodEntries.filter(entry => 
      new Date(entry.timestamp) >= weekAgo
    );
    
    const weeklySessions = sessions.filter(session => 
      new Date(session.date) >= weekAgo && session.completed
    );
    
    const totalStudyTime = weeklySessions.reduce((sum, session) => sum + session.duration, 0);
    const averageMood = weeklyMoods.length > 0 
      ? weeklyMoods.reduce((sum, entry) => sum + entry.mood, 0) / weeklyMoods.length 
      : 0;
    
    // Find favorite module (most completed sessions)
    const moduleStats = modules.map(module => ({
      module,
      sessions: weeklySessions.filter(s => s.moduleId === module.id).length
    }));
    
    const favoriteModule = moduleStats.reduce((prev, current) => 
      current.sessions > prev.sessions ? current : prev
    ).module?.code || 'None';
    
    return {
      totalStudyTime,
      averageMood,
      completedSessions: weeklySessions.length,
      favoriteModule,
      bestStudyTime: this.findBestStudyTime(weeklySessions)
    };
  }

  private static findBestStudyTime(sessions: StudySession[]): string {
    const timeSlots = sessions.reduce((acc, session) => {
      const hour = parseInt(session.startTime.split(':')[0]);
      const period = session.startTime.includes('AM') ? 'AM' : 'PM';
      const key = `${hour}${period}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const bestTime = Object.entries(timeSlots).reduce((prev, current) => 
      current[1] > prev[1] ? current : prev
    );
    
    return bestTime[0] || 'Morning';
  }
}