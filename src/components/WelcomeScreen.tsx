import React from 'react';
import { BookOpen, Target, TrendingUp } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGetStarted,
  onLogin
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col">
      {/* Header */}
      <header className="pt-8 pb-6 px-6 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">RandStudy</h1>
        </div>
        <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
          Smart randomized study scheduling that adapts to your learning style
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mx-auto mb-8 flex items-center justify-center shadow-inner">
              <Target className="w-16 h-16 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Study Smarter, Not Harder
            </h2>
            <p className="text-gray-600 max-w-lg mx-auto leading-relaxed">
              Let AI create randomized study schedules that keep you engaged, 
              motivated, and on track to achieve your academic goals.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Scheduling</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Randomized study sessions prevent monotony and improve retention
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Focused Sessions</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Timed study blocks with built-in breaks for optimal concentration
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Track Progress</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Monitor your streaks and mood to maintain motivation
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="text-center space-y-4">
            <button
              onClick={onGetStarted}
              className="w-full max-w-sm bg-blue-600 text-white font-semibold py-4 px-8 rounded-2xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Get Started
            </button>
            <button
              onClick={onLogin}
              className="w-full max-w-sm bg-white text-blue-600 font-semibold py-4 px-8 rounded-2xl border-2 border-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              Already have an account? Login
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};