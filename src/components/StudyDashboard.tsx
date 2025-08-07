import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, TrendingUp, Clock, Calendar, Settings, Brain, Target, Lightbulb, Bell, Trophy, CalendarDays } from 'lucide-react';
import { StudySession, Module, User, MoodEntry, StudyInsight, Notification, Achievement, StudyGoal } from '../utils/types';
import { StudyAnalytics } from '../utils/analytics';
import { NotificationCenter } from './NotificationCenter';
import { GoalsPanel } from './GoalsPanel';

interface StudyDashboardProps {
  user: User;
  modules: Module[];
  sessions: StudySession[];
  moodEntries: MoodEntry[];
  onStartBreak: (session: StudySession) => void;
  onCompleteSession: (sessionId: string) => void;
  onEditModules: () => void;
  onViewMood: () => void;
  notifications: Notification[];
  achievements: Achievement[];
  goals: StudyGoal[];
  onMarkNotificationRead: (id: string) => void;
  onClearNotifications: () => void;
  onOpenSettings: () => void;
  onOpenCalendar: () => void;
}

export const StudyDashboard: React.FC<StudyDashboardProps> = ({
  user,
  modules,
  sessions,
  moodEntries,
  onStartBreak,
  onCompleteSession,
  onEditModules,
  onViewMood,
  notifications,
  achievements,
  goals,
  onMarkNotificationRead,
  onClearNotifications,
  onOpenSettings,
  onOpenCalendar
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [showInsights, setShowInsights] = useState(false);
  const [insights, setInsights] = useState<StudyInsight[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const generatedInsights = StudyAnalytics.generateInsights(moodEntries, sessions, modules);
    setInsights(generatedInsights);
  }, [moodEntries, sessions, modules]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (activeSession) {
        setSessionTime(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeSession]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const formatSessionTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getModuleById = (moduleId: string) => {
    return modules.find(m => m.id === moduleId);
  };

  const completedSessions = sessions.filter(s => s.completed).length;
  const totalSessions = sessions.length;
  const progressPercentage = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
  const weeklyStats = StudyAnalytics.getWeeklyStats(moodEntries, sessions, modules);

  const currentSession = sessions.find(s => !s.completed);
  const upcomingSessions = sessions.filter(s => !s.completed).slice(1, 4);

  const startSession = (sessionId: string) => {
    setActiveSession(sessionId);
    setSessionTime(0);
  };

  const pauseSession = () => {
    setActiveSession(null);
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const completeCurrentSession = () => {
    if (currentSession) {
      onCompleteSession(currentSession.id);
      setActiveSession(null);
      setSessionTime(0);
    }
  };

  const takeBreak = () => {
    if (currentSession) {
      onStartBreak(currentSession);
      setActiveSession(null);
      setSessionTime(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user.name}!
            </h1>
            <p className="text-gray-600">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            {insights.length > 0 && (
              <div className="mt-2">
                <button
                  onClick={() => setShowInsights(!showInsights)}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <Brain className="w-4 h-4 mr-1" />
                  {insights.length} AI Insights Available
                </button>
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowNotifications(true)}
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>
            <button
             onClick={onOpenCalendar}
             className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
             title="Calendar Sync"
           >
             <CalendarDays className="w-5 h-5" />
           </button>
           <button
              onClick={onViewMood}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="Mood Tracker"
            >
              <TrendingUp className="w-5 h-5" />
            </button>
            <button
              onClick={onOpenSettings}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AI Insights Panel */}
        {showInsights && insights.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 border border-blue-100">
            <div className="flex items-center mb-4">
              <Brain className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="font-semibold text-gray-900">AI Study Insights</h3>
            </div>
            <div className="space-y-3">
              {insights.slice(0, 2).map((insight, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-l-4 ${
                    insight.priority === 'high' 
                      ? 'bg-red-50 border-red-400' 
                      : insight.priority === 'medium'
                      ? 'bg-yellow-50 border-yellow-400'
                      : 'bg-green-50 border-green-400'
                  }`}
                >
                  <div className="flex items-start">
                    <Lightbulb className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">{insight.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                      <p className="text-sm font-medium text-blue-700">{insight.actionable}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Study Streak</p>
                <p className="text-2xl font-bold text-blue-600">{user.streak} days</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Progress</p>
                <p className="text-2xl font-bold text-green-600">
                  {completedSessions}/{totalSessions}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Weekly Hours</p>
                <p className="text-2xl font-bold text-purple-600">{Math.round(weeklyStats.totalStudyTime / 60)}h</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Mood</p>
                <p className="text-2xl font-bold text-orange-600">
                  {weeklyStats.averageMood > 0 ? weeklyStats.averageMood.toFixed(1) : 'N/A'}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Achievements</p>
                <p className="text-2xl font-bold text-yellow-600">{achievements.length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900">Daily Progress</h3>
            <span className="text-sm text-gray-600">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Current Session */}
        {currentSession && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Current Session</h3>
              {activeSession && (
                <div className="text-2xl font-mono font-bold text-blue-600">
                  {formatSessionTime(sessionTime)}
                </div>
              )}
            </div>

            <div className="flex items-center mb-6">
              <div
                className="w-6 h-6 rounded-full mr-4"
                style={{ backgroundColor: getModuleById(currentSession.moduleId)?.color }}
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">
                  {getModuleById(currentSession.moduleId)?.code}
                </h4>
                <p className="text-sm text-gray-600">
                  {getModuleById(currentSession.moduleId)?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatTime(currentSession.duration)} session • {currentSession.startTime} - {currentSession.endTime}
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              {!activeSession ? (
                <button
                  onClick={() => startSession(currentSession.id)}
                  className="flex-1 bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Session
                </button>
              ) : (
                <>
                  <button
                    onClick={pauseSession}
                    className="flex-1 bg-yellow-500 text-white font-semibold py-3 px-4 rounded-xl hover:bg-yellow-600 transition-colors flex items-center justify-center"
                  >
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </button>
                  <button
                    onClick={takeBreak}
                    className="flex-1 bg-orange-500 text-white font-semibold py-3 px-4 rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center"
                  >
                    <SkipForward className="w-5 h-5 mr-2" />
                    Take Break
                  </button>
                  <button
                    onClick={completeCurrentSession}
                    className="flex-1 bg-green-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-green-700 transition-colors"
                  >
                    Complete
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Goals Panel */}
        <div className="mb-8">
          <GoalsPanel goals={goals} />
        </div>

        {/* Upcoming Sessions */}
        {upcomingSessions.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Coming Up</h3>
            <div className="space-y-3">
              {upcomingSessions.map((session) => {
                const module = getModuleById(session.moduleId);
                return (
                  <div key={session.id} className="flex items-center p-3 bg-gray-50 rounded-xl">
                    <div
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: module?.color }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{module?.code}</h4>
                      <p className="text-sm text-gray-600">
                        {session.startTime} - {session.endTime} ({formatTime(session.duration)})
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!currentSession && totalSessions === completedSessions && totalSessions > 0 && (
          <div className="bg-green-50 rounded-2xl p-8 text-center border border-green-200">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-green-900 mb-2">
              Congratulations! 🎉
            </h3>
            <p className="text-green-700 mb-4">
              You've completed all your study sessions for today!
            </p>
            <button
              onClick={onViewMood}
              className="bg-green-600 text-white font-semibold py-2 px-6 rounded-xl hover:bg-green-700 transition-colors"
            >
              Log Your Mood
            </button>
          </div>
        )}
      </div>

      {/* Notification Center */}
      <NotificationCenter
        notifications={notifications}
        achievements={achievements}
        onMarkAsRead={onMarkNotificationRead}
        onClearAll={onClearNotifications}
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
};