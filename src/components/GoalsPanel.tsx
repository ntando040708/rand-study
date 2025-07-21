import React from 'react';
import { Target, Calendar, Clock, TrendingUp, CheckCircle } from 'lucide-react';
import { StudyGoal } from '../utils/types';

interface GoalsPanelProps {
  goals: StudyGoal[];
  onCreateGoal?: () => void;
}

export const GoalsPanel: React.FC<GoalsPanelProps> = ({ goals, onCreateGoal }) => {
  const getGoalIcon = (goal: StudyGoal) => {
    switch (goal.unit) {
      case 'sessions': return Target;
      case 'hours': return Clock;
      case 'days': return Calendar;
      default: return TrendingUp;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <Target className="w-5 h-5 text-blue-600 mr-2" />
          Study Goals
        </h3>
        {onCreateGoal && (
          <button
            onClick={onCreateGoal}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            + Add Goal
          </button>
        )}
      </div>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div className="space-y-4 mb-6">
          {activeGoals.map((goal) => {
            const IconComponent = getGoalIcon(goal);
            const progress = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
            const daysLeft = Math.ceil(
              (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );

            return (
              <div key={goal.id} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{goal.title}</h4>
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {goal.currentValue}/{goal.targetValue} {goal.unit}
                    </p>
                    <p className="text-xs text-gray-500">
                      {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">{Math.round(progress)}% complete</span>
                  {progress >= 100 && (
                    <span className="text-xs text-green-600 font-medium">Goal achieved! 🎉</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-700 mb-3 flex items-center">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
            Completed Goals ({completedGoals.length})
          </h4>
          <div className="space-y-2">
            {completedGoals.slice(0, 3).map((goal) => {
              const IconComponent = getGoalIcon(goal);
              return (
                <div key={goal.id} className="flex items-center p-3 bg-green-50 rounded-xl border border-green-200">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <IconComponent className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{goal.title}</h5>
                    <p className="text-sm text-green-600">
                      Completed {goal.targetValue} {goal.unit}
                    </p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {goals.length === 0 && (
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No study goals set yet</p>
          {onCreateGoal && (
            <button
              onClick={onCreateGoal}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Goal
            </button>
          )}
        </div>
      )}
    </div>
  );
};