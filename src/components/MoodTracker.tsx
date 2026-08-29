import React, { useState, useMemo } from 'react';
import { ArrowLeft, TrendingUp, Calendar, MessageCircle, BarChart3, BookOpen } from 'lucide-react';
import { MoodEntry, StudySession, Module } from '../utils/types';
import { MOOD_EMOJIS } from '../utils/constants';
import { StudyAnalytics } from '../utils/analytics';

interface MoodTrackerProps {
  moodEntries: MoodEntry[];
  lastSession?: StudySession;
  modules: Module[];
  onAddMood: (mood: number, note: string) => void;
  onBack: () => void;
}

export const MoodTracker: React.FC<MoodTrackerProps> = ({
  moodEntries,
  lastSession,
  modules,
  onAddMood,
  onBack
}) => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<'add' | 'analytics'>('add');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMood === null) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    
    onAddMood(selectedMood, note);
    setSelectedMood(null);
    setNote('');
    setIsSubmitting(false);
  };

  // Memoize heavy calculations to prevent lag when typing in the input field
  const recentMoods = useMemo(() => {
    return [...moodEntries].slice(-7).reverse();
  }, [moodEntries]);

  const averageMood = useMemo(() => {
    if (moodEntries.length === 0) return 0;
    const sum = moodEntries.reduce((acc, entry) => acc + entry.mood, 0);
    return sum / moodEntries.length;
  }, [moodEntries]);

  const modulePerformance = useMemo(() => {
    return StudyAnalytics.analyzeModulePerformance(moodEntries, modules);
  }, [moodEntries, modules]);

  // Safe emoji retrieval that prevents negative indexing
  const getEmojiSafe = (moodValue: number) => {
    if (moodValue === 0) return '😐'; // Default for no data
    const index = Math.min(Math.max(Math.round(moodValue) - 1, 0), 4);
    return MOOD_EMOJIS[index] || '😐';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mood Tracker</h1>
            <p className="text-gray-600">How are you feeling about your studies?</p>
          </div>
          <div className="flex space-x-2 ml-auto">
            <button
              onClick={() => setViewMode('add')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'add' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Add Mood
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'analytics' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <BarChart3 className="w-4 h-4 mr-1 inline" />
              Analytics
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Mood</p>
                <div className="flex items-center">
                  <span className="text-2xl mr-2">
                    {getEmojiSafe(averageMood)}
                  </span>
                  <span className="text-2xl font-bold text-purple-600">
                    {averageMood > 0 ? averageMood.toFixed(1) : 'N/A'}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Entries</p>
                <p className="text-2xl font-bold text-blue-600">{moodEntries.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Best Module</p>
                <p className="text-lg font-bold text-green-600 truncate max-w-[100px]">
                  {modulePerformance.length > 0 
                    ? modulePerformance.reduce((prev, current) => 
                        current.avgMood > prev.avgMood ? current : prev
                      ).moduleCode
                    : 'N/A'
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {viewMode === 'add' ? (
          /* Add Mood Entry */
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-6 text-center">
              How was your {lastSession ? 'study session' : 'day'}?
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Mood Selection */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-4 text-center">
                  Select your mood
                </p>
                <div className="flex justify-center space-x-4">
                  {MOOD_EMOJIS.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedMood(index + 1)}
                      className={`text-4xl p-3 rounded-2xl transition-all transform hover:scale-110 ${
                        selectedMood === index + 1
                          ? 'bg-purple-100 scale-110 shadow-lg border-2 border-purple-400'
                          : 'hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2 px-4 max-w-sm mx-auto">
                  <span>Very Bad</span>
                  <span>Excellent</span>
                </div>
              </div>

              {/* Note Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageCircle className="w-4 h-4 inline mr-1" />
                  How was your session? (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Share your thoughts about the study session..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={selectedMood === null || isSubmitting}
                className="w-full bg-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save Mood Entry'}
              </button>
            </form>
          </div>
        ) : (
          /* Analytics View */
          <div className="space-y-6">
            {/* Module Performance */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Module Performance</h3>
              <div className="space-y-3">
                {modulePerformance.length > 0 ? (
                  modulePerformance.map((module) => (
                    <div key={module.moduleId} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <h4 className="font-medium text-gray-900">{module.moduleCode}</h4>
                        <p className="text-sm text-gray-600">{module.sessionCount} sessions</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">
                          {getEmojiSafe(module.avgMood)}
                        </span>
                        <span className="text-lg font-semibold text-purple-600">
                          {module.avgMood.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No module data available yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recent Moods */}
        {recentMoods.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Moods</h3>
            <div className="space-y-3">
              {recentMoods.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start justify-between p-3 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">
                      {MOOD_EMOJIS[entry.mood - 1]}
                    </span>
                    <div>
                      <p className="text-sm text-gray-600">
                        {new Date(entry.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      {entry.note && (
                        <p className="text-sm text-gray-900 mt-1">{entry.note}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-purple-600">
                    {entry.mood}/5
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {moodEntries.length === 0 && (
          <div className="text-center py-8 mt-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-gray-600">
              Start tracking your mood to see insights about your study sessions!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
