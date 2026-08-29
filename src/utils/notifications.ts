import { Notification, Achievement, StudyGoal, User, StudySession, MoodEntry } from './types';

export class NotificationManager {
  static createSessionReminder(session: StudySession, moduleName: string): Notification {
    return {
      id: `session_${session.id}_${Date.now()}`,
      type: 'session',
      title: 'Study Session Starting Soon',
      message: `Your ${moduleName} session starts in 5 minutes`,
      timestamp: new Date().toISOString(),
      read: false,
      actionUrl: '/dashboard'
    };
  }

  static createBreakReminder(): Notification {
    return {
      id: `break_${Date.now()}`,
      type: 'break',
      title: 'Time for a Break!',
      message: "You've been studying for a while. Take a well-deserved break.",
      timestamp: new Date().toISOString(),
      read: false,
      actionUrl: '/break'
    };
  }

  static createAchievementNotification(achievement: Achievement): Notification {
    return {
      id: `achievement_${achievement.id}_${Date.now()}`,
      type: 'achievement',
      title: 'Achievement Unlocked! 🎉',
      message: `You earned: ${achievement.title}`,
      timestamp: new Date().toISOString(),
      read: false
    };
  }

  static checkForAchievements(
    user: User, 
    sessions: StudySession[], 
    moodEntries: MoodEntry[],
    existingAchievements: Achievement[] = [] // Added to prevent duplicate awards
  ): Achievement[] {
    const newAchievements: Achievement[] = [];
    const hasAchievement = (id: string) => existingAchievements.some(a => a.id === id);

    // Streak achievements
    if (user.streak >= 7 && !hasAchievement('week_streak')) {
      newAchievements.push({
        id: 'week_streak',
        title: 'Week Warrior',
        description: 'Maintained a 7-day study streak',
        icon: 'Flame',
        unlockedAt: new Date().toISOString(),
        category: 'streak'
      });
    }

    if (user.streak >= 30 && !hasAchievement('month_master')) {
      newAchievements.push({
        id: 'month_master',
        title: 'Month Master',
        description: 'Incredible 30-day study streak!',
        icon: 'Crown',
        unlockedAt: new Date().toISOString(),
        category: 'streak'
      });
    }

    // Session achievements
    if (user.totalSessions >= 10 && !hasAchievement('first_ten')) {
      newAchievements.push({
        id: 'first_ten',
        title: 'Getting Started',
        description: 'Completed your first 10 study sessions',
        icon: 'Target',
        unlockedAt: new Date().toISOString(),
        category: 'sessions'
      });
    }

    if (user.totalSessions >= 100 && !hasAchievement('century')) {
      newAchievements.push({
        id: 'century',
        title: 'Century Club',
        description: 'Completed 100 study sessions!',
        icon: 'Trophy',
        unlockedAt: new Date().toISOString(),
        category: 'sessions'
      });
    }

    // Mood achievements
    if (!hasAchievement('positive_vibes')) {
      const recentMoods = moodEntries.slice(-10);
      const highMoodCount = recentMoods.filter(m => m.mood >= 4).length;
      
      if (highMoodCount >= 8 && recentMoods.length >= 8) {
        newAchievements.push({
          id: 'positive_vibes',
          title: 'Positive Vibes',
          description: 'Maintained high mood in 8 out of 10 recent sessions',
          icon: 'Heart',
          unlockedAt: new Date().toISOString(),
          category: 'mood'
        });
      }
    }

    return newAchievements;
  }
}

export class GoalManager {
  static createDefaultGoals(): StudyGoal[] {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    return [
      {
        id: 'weekly_sessions',
        title: 'Weekly Study Goal',
        description: 'Complete 20 study sessions this week',
        targetValue: 20,
        currentValue: 0,
        unit: 'sessions',
        deadline: nextWeek.toISOString(),
        completed: false
      },
      {
        id: 'monthly_hours',
        title: 'Monthly Study Hours',
        description: 'Study for 40 hours this month',
        targetValue: 40,
        currentValue: 0,
        unit: 'hours',
        deadline: nextMonth.toISOString(),
        completed: false
      },
      {
        id: 'streak_goal',
        title: 'Build a Streak',
        description: 'Maintain a 14-day study streak',
        targetValue: 14,
        currentValue: 0,
        unit: 'days',
        deadline: new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        completed: false
      }
    ];
  }

  static updateGoalProgress(
    goals: StudyGoal[], 
    user: User, 
    sessions: StudySession[]
  ): StudyGoal[] {
    // Optimization: Calculate relative dates once before the loop
    const now = new Date();
    
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const monthAgo = new Date(now);
    monthAgo.setDate(monthAgo.getDate() - 30);

    return goals.map(goal => {
      let currentValue = goal.currentValue;

      switch (goal.id) {
        case 'weekly_sessions':
          currentValue = sessions.filter(s => 
            s.completed && new Date(s.date) >= weekAgo
          ).length;
          break;

        case 'monthly_hours':
          currentValue = Math.round(
            sessions
              .filter(s => s.completed && new Date(s.date) >= monthAgo)
              .reduce((sum, s) => sum + s.duration, 0) / 60
          );
          break;

        case 'streak_goal':
          currentValue = user.streak;
          break;
      }

      return {
        ...goal,
        currentValue,
        completed: currentValue >= goal.targetValue
      };
    });
  }
}
