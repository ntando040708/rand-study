import { User, Achievement, Challenge } from './types';

export class GamificationEngine {
  static calculateXP(user: User, sessionCompleted: boolean = false): number {
    let xp = user.totalSessions * 10; // Base XP
    xp += user.streak * 5; // Streak bonus
    
    if (sessionCompleted) {
      xp += 10; // Session completion bonus
      if (user.streak > 0) {
        xp += Math.min(user.streak, 10); // Streak multiplier (max 10)
      }
    }
    
    return xp;
  }

  static calculateLevel(xp: number): number {
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  }

  static getXPForNextLevel(currentXP: number): number {
    const currentLevel = this.calculateLevel(currentXP);
    const nextLevelXP = Math.pow(currentLevel, 2) * 100;
    return nextLevelXP - currentXP;
  }

  static generateDailyChallenges(): Challenge[] {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return [
      {
        id: `daily-sessions-${today}`,
        title: 'Study Warrior',
        description: 'Complete 5 study sessions today',
        type: 'daily',
        target: 5,
        progress: 0,
        reward: '50 XP + Focus Badge',
        deadline: tomorrow.toISOString(),
        completed: false
      },
      {
        id: `daily-streak-${today}`,
        title: 'Consistency Champion',
        description: 'Maintain your study streak',
        type: 'daily',
        target: 1,
        progress: 0,
        reward: '25 XP + Streak Multiplier',
        deadline: tomorrow.toISOString(),
        completed: false
      },
      {
        id: `daily-mood-${today}`,
        title: 'Positive Vibes',
        description: 'Log a mood rating of 4 or higher',
        type: 'daily',
        target: 1,
        progress: 0,
        reward: '30 XP + Happiness Badge',
        deadline: tomorrow.toISOString(),
        completed: false
      }
    ];
  }

  static generateWeeklyChallenges(): Challenge[] {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    return [
      {
        id: `weekly-hours-${Date.now()}`,
        title: 'Study Marathon',
        description: 'Study for 20 hours this week',
        type: 'weekly',
        target: 1200, // minutes
        progress: 0,
        reward: '200 XP + Marathon Badge',
        deadline: nextWeek.toISOString(),
        completed: false
      },
      {
        id: `weekly-modules-${Date.now()}`,
        title: 'Subject Master',
        description: 'Study all your modules this week',
        type: 'weekly',
        target: 1, // will be set based on user modules
        progress: 0,
        reward: '150 XP + Versatility Badge',
        deadline: nextWeek.toISOString(),
        completed: false
      }
    ];
  }

  static checkChallengeCompletion(
    challenge: Challenge,
    userProgress: number
  ): { completed: boolean; xpReward: number } {
    const completed = userProgress >= challenge.target;
    let xpReward = 0;

    if (completed && !challenge.completed) {
      switch (challenge.type) {
        case 'daily':
          xpReward = 50;
          break;
        case 'weekly':
          xpReward = 200;
          break;
        case 'monthly':
          xpReward = 500;
          break;
      }
    }

    return { completed, xpReward };
  }

  static generateAchievements(): Achievement[] {
    return [
      // Streak Achievements
      {
        id: 'first-week',
        title: 'Week Warrior',
        description: 'Maintain a 7-day study streak',
        icon: 'Flame',
        unlockedAt: '',
        category: 'streak'
      },
      {
        id: 'month-master',
        title: 'Month Master',
        description: 'Incredible 30-day study streak!',
        icon: 'Crown',
        unlockedAt: '',
        category: 'streak'
      },
      {
        id: 'century-streak',
        title: 'Centurion',
        description: '100-day study streak achieved!',
        icon: 'Trophy',
        unlockedAt: '',
        category: 'streak'
      },

      // Session Achievements
      {
        id: 'first-session',
        title: 'Getting Started',
        description: 'Complete your first study session',
        icon: 'Play',
        unlockedAt: '',
        category: 'sessions'
      },
      {
        id: 'hundred-sessions',
        title: 'Century Club',
        description: 'Complete 100 study sessions',
        icon: 'Target',
        unlockedAt: '',
        category: 'sessions'
      },
      {
        id: 'thousand-sessions',
        title: 'Study Legend',
        description: '1000 study sessions completed!',
        icon: 'Crown',
        unlockedAt: '',
        category: 'sessions'
      },

      // Time Achievements
      {
        id: 'ten-hours',
        title: 'Time Keeper',
        description: 'Study for 10 hours total',
        icon: 'Clock',
        unlockedAt: '',
        category: 'time'
      },
      {
        id: 'hundred-hours',
        title: 'Dedicated Scholar',
        description: '100 hours of focused study',
        icon: 'BookOpen',
        unlockedAt: '',
        category: 'time'
      },

      // Mood Achievements
      {
        id: 'positive-week',
        title: 'Positive Vibes',
        description: 'Maintain high mood for a week',
        icon: 'Heart',
        unlockedAt: '',
        category: 'mood'
      },
      {
        id: 'mood-tracker',
        title: 'Self-Aware',
        description: 'Log 50 mood entries',
        icon: 'Brain',
        unlockedAt: '',
        category: 'mood'
      }
    ];
  }
}