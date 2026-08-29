import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Brain, Lightbulb, TrendingUp, Clock, Target, Zap } from 'lucide-react';
import { AIRecommendation, MoodEntry, StudySession, Module, StudyPattern } from '../utils/types';
import { AIRecommendationEngine } from '../utils/aiRecommendations';

interface AIInsightsPanelProps {
  moodEntries: MoodEntry[];
  sessions: StudySession[];
  modules: Module[];
  onApplyRecommendation: (recommendation: AIRecommendation) => void;
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  moodEntries,
  sessions,
  modules,
  onApplyRecommendation
}) => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [studyPatterns, setStudyPatterns] = useState<StudyPattern[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Memoized pattern generation to prevent recalculations
  const patterns = useMemo(() => {
    return sessions
      .filter(session => session.completed)
      .map(session => {
        const moodEntry = moodEntries.find(entry => entry.sessionId === session.id);
        return {
          timeOfDay: session.startTime,
          duration: session.duration,
          mood: moodEntry?.mood || 3,
          productivity: session.completed ? 5 : 2,
          moduleId: session.moduleId
        };
      });
  }, [sessions, moodEntries]);

  // Wrapped in useCallback to satisfy React dependency rules
  const generateInsights = useCallback(async () => {
    setIsAnalyzing(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setStudyPatterns(patterns);
    
    // Generate AI recommendations
    const newRecommendations = AIRecommendationEngine.generateRecommendations(
      moodEntries,
      sessions,
      modules,
      patterns
    );
    
    setRecommendations(newRecommendations);
    setIsAnalyzing(false);
  }, [moodEntries, sessions, modules, patterns]);

  // Execute on mount and when dependencies change
  useEffect(() => {
    generateInsights();
  }, [generateInsights]);

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'schedule': return Clock;
      case 'technique': return Target;
      case 'wellness': return Zap;
      default: return Lightbulb;
    }
  };

  // Fixed Tailwind purging issue by mapping to full class strings
  const getThemeClasses = (type: string) => {
    switch (type) {
      case 'schedule': return { bg: 'bg-blue-100', text: 'text-blue-600', button: 'bg-blue-600 hover:bg-blue-700' };
      case 'technique': return { bg: 'bg-purple-100', text: 'text-purple-600', button: 'bg-purple-600 hover:bg-purple-700' };
      case 'wellness': return { bg: 'bg-green-100', text: 'text-green-600', button: 'bg-green-600 hover:bg-green-700' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600', button: 'bg-gray-600 hover:bg-gray-700' };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-400 bg-red-50';
      case 'medium': return 'border-yellow-400 bg-yellow-50';
      case 'low': return 'border-green-400 bg-green-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <Brain className="w-5 h-5 text-purple-600 mr-2" />
          AI Study Insights
        </h3>
        <button
          onClick={generateInsights}
          disabled={isAnalyzing}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 text-sm"
        >
          {isAnalyzing ? 'Analyzing...' : 'Refresh Insights'}
        </button>
      </div>

      {isAnalyzing ? (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">AI is analyzing your study patterns...</p>
        </div>
      ) : (
        <>
          {/* Study Pattern Summary */}
          {studyPatterns.length > 0 && (
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <TrendingUp className="w-4 h-4 text-purple-600 mr-2" />
                Pattern Analysis
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Best Performance Time:</span>
                  <span className="font-medium text-gray-900 ml-2">
                    {studyPatterns.length > 0 ? 
                      studyPatterns.reduce((best, current) => 
                        current.mood > best.mood ? current : best
                      ).timeOfDay : 'N/A'
                    }
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Avg Session Mood:</span>
                  <span className="font-medium text-gray-900 ml-2">
                    {studyPatterns.length > 0 ? 
                      (studyPatterns.reduce((sum, p) => sum + p.mood, 0) / studyPatterns.length).toFixed(1) : 'N/A'
                    }/5
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* AI Recommendations */}
          {recommendations.length > 0 ? (
            <div className="space-y-4">
              {recommendations.map((recommendation) => {
                const IconComponent = getRecommendationIcon(recommendation.type);
                const themeClasses = getThemeClasses(recommendation.type);
                const priorityStyle = getPriorityColor(
                  recommendation.confidence > 0.8 ? 'high' : 
                  recommendation.confidence > 0.6 ? 'medium' : 'low'
                );

                return (
                  <div
                    key={recommendation.id}
                    className={`p-4 rounded-xl border-l-4 ${priorityStyle}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 ${themeClasses.bg} rounded-full flex items-center justify-center mr-3`}>
                          <IconComponent className={`w-5 h-5 ${themeClasses.text}`} />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">{recommendation.title}</h5>
                          <p className="text-sm text-gray-600">{recommendation.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="text-right mr-3">
                          <div className="text-xs text-gray-500">Confidence</div>
                          <div className="font-medium text-gray-900">
                            {Math.round(recommendation.confidence * 100)}%
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-900 mb-1">Recommended Action:</p>
                      <p className="text-sm text-gray-700">{recommendation.actionable}</p>
                    </div>

                    <button
                      onClick={() => onApplyRecommendation(recommendation)}
                      className={`w-full py-2 px-4 ${themeClasses.button} text-white rounded-lg transition-colors text-sm font-medium`}
                    >
                      Apply Recommendation
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">No insights available yet</p>
              <p className="text-sm text-gray-400">
                Complete more study sessions to unlock AI-powered recommendations
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
