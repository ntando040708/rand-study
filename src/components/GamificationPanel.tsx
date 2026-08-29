import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Star, Target, Zap, Crown, Gift, Flame, Heart, BookOpen, Clock, Play } from 'lucide-react';
import { User, Challenge, Achievement } from '../utils/types';
import { GamificationEngine } from '../utils/gamification';

interface GamificationPanelProps {
  user: User;
  challenges: Challenge[];
  achievements: Achievement[];
  onUpdateChallenges: (challenges: Challenge[]) => void;
}

// Statically map icon strings to imported components to prevent Vite build crashes
const ICON_MAP: Record<string, React.ElementType> = {
  Trophy,
  Star,
  Target,
  Crown,
  Flame,
  Heart,
  BookOpen,
  Clock,
  Play
};

export const GamificationPanel: React.FC<GamificationPanelProps> = ({
  user,
  challenges,
  achievements,
  onUpdateChallenges
}) => {
  const [currentXP, setCurrentXP] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [xpToNextLevel, setXPToNextLevel] = useState(100);

  useEffect(() => {
    const xp = GamificationEngine.calculateXP(user);
    const level = GamificationEngine.calculateLevel(xp);
    const xpNeeded = GamificationEngine.getXPForNextLevel(xp);

    setCurrentXP(xp);
    setCurrentLevel(level);
    setXPToNextLevel(xpNeeded);
  }, [user]);

  const activeChallenges = useMemo(() => challenges.filter(c => !c.completed), [challenges]);
  const completedChallenges = useMemo(() => challenges.filter(c => c.completed), [challenges]);
  const recentAchievements = useMemo(() => achievements.slice(-3), [achievements]);

  const getLevelIcon = (level: number) => {
    if (level >= 50) return Crown;
    if (level >= 25) return Trophy;
    if (level >= 10) return Star;
    return Target;
  };

  const LevelIcon = getLevelIcon(currentLevel);
  
  // Safe calculation preventing division by zero
  const safeLevel = Math.max(1, currentLevel);
  const progressPercentage = Math.max(10, 100 - (xpToNextLevel / (Math.pow(safeLevel, 2) * 100)) * 100);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <Trophy className="w-5 h-5 text-yellow-600 mr-2" />
          Progress & Rewards
        </h3>
      </div>

      {/* Level & XP Display */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center mr-3">
              <LevelIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Level {currentLevel}</h4>
              <p className="text-sm text-gray-600">{currentXP.toLocaleString()} XP</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{xpToNextLevel} XP to next level</p>
            <p className="text-xs text-gray-500">Keep studying to level up!</p>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <Star className="w-4 h-4 text-yellow-500 mr-2" />
            Recent Achievements
          </h4>
          <div className="space-y-2">
            {recentAchievements.map((achievement) => {
              const IconComponent = ICON_MAP[achievement.icon] || Trophy;
              return (
                <div
                  key={achievement.id}
                  className="flex items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200"
                >
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                    <IconComponent className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{achievement.title}</h5>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                  <div className="text-yellow-600">
                    <Trophy className="w-5 h-5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Challenges */}
      {activeChallenges.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <Target className="w-4 h-4 text-blue-500 mr-2" />
            Active Challenges
          </h4>
          <div className="space-y-3">
            {activeChallenges.slice(0, 3).map((challenge) => {
              const challengeProgress = Math.min((challenge.progress / challenge.target) * 100, 100);
              const isDaily = challenge.type === 'daily';
              const isWeekly = challenge.type === 'weekly';
              
              return (
                <div key={challenge.id} className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h5 className="font-medium text-gray-900">{challenge.title}</h5>
                      <p className="text-sm text-gray-600">{challenge.description}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isDaily ? 'bg-green-100 text-green-700' :
                      isWeekly ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {challenge.type}
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">
                        {challenge.progress}/{challenge.target}
                      </span>
                      <span className="text-gray-600">{Math.round(challengeProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${challengeProgress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Ends: {new Date(challenge.deadline).toLocaleDateString()}
                    </span>
                    <div className="flex items-center text-sm font-medium text-yellow-600">
                      <Gift className="w-4 h-4 mr-1" />
                      {challenge.reward}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
          <Zap className="w-6 h-6 text-blue-600 mx-auto mb-1" />
          <div className="font-bold text-blue-900">{user.streak}</div>
          <div className="text-xs text-blue-700">Day Streak</div>
        </div>
        
        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
          <Target className="w-6 h-6 text-green-600 mx-auto mb-1" />
          <div className="font-bold text-green-900">{user.totalSessions}</div>
          <div className="text-xs text-green-700">Sessions</div>
        </div>
        
        <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
          <Trophy className="w-6 h-6 text-purple-600 mx-auto mb-1" />
          <div className="font-bold text-purple-900">{achievements.length}</div>
          <div className="text-xs text-purple-700">Achievements</div>
        </div>
      </div>

      {/* Completed Challenges Summary */}
      {completedChallenges.length > 0 && (
        <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-200">
          <p className="text-sm text-green-800 text-center">
            🎉 You've completed {completedChallenges.length} challenge{completedChallenges.length !== 1 ? 's' : ''} recently!
          </p>
        </div>
      )}
    </div>
  );
};
