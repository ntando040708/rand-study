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
    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const deadlineStr = tomorrow.toISOString();

    return [
      {
        id: `daily-sessions-${todayStr}`, // Deterministic ID
        title: 'Study Warrior',
        description: 'Complete 5 study sessions today',
        type: 'daily',
        target: 5,
        progress: 0,
        reward: '50 XP + Focus Badge',
        deadline: deadlineStr,
        completed: false
      },
      {
        id: `daily-streak-${todayStr}`,
        title: 'Consistency Champion',
        description: 'Maintain your study streak',
        type: 'daily',
        target: 1,
        progress: 0,
        reward: '25 XP + Streak Multiplier',
        deadline: deadlineStr,
        completed: false
      },
      {
        id: `daily-mood-${todayStr}`,
        title: 'Positive Vibes',
        description: 'Log a mood rating of 4 or higher',
        type: 'daily',
        target: 1,
        progress: 0,
        reward: '30 XP + Happiness Badge',
        deadline: deadlineStr,
        completed: false
      }
    ];
  }

  static generateWeeklyChallenges(): Challenge[] {
    const today = new Date();
    // Get a deterministic string for the current week (e.g., "2026-W35")
    const getWeekNumber = (d: Date) => {
      const date = new Date(d.getTime());
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
      const week1 = new Date(date.getFullYear(), 0, 4);
      return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    };
    
    const weekId = `${today.getFullYear()}-W${getWeekNumber(today)}`;
    
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const deadlineStr = nextWeek.toISOString();

    return [
      {
        id: `weekly-hours-${weekId}`, // Deterministic ID based on calendar week
        title: 'Study Marathon',
        description: 'Study for 20 hours this week',
        type: 'weekly',
        target: 1200, // minutes
        progress: 0,
        reward: '200 XP + Marathon Badge',
        deadline: deadlineStr,
        completed: false
      },
      {
        id: `weekly-modules-${weekId}`,
        title: 'Subject Master',
        description: 'Study all your modules this week',
        type: 'weekly',
        target: 1, 
        progress: 0,
        reward: '150 XP + Versatility Badge',
        deadline: deadlineStr,
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
        case 'daily': xpReward = 50; break;
        case 'weekly': xpReward = 200; break;
        case 'monthly': xpReward = 500; break;
      }
    }

    return { completed, xpReward };
  }
}
