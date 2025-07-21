import React, { useState } from 'react';
import { Bell, X, Check, Trophy, Clock, Coffee, Target } from 'lucide-react';
import { Notification, Achievement } from '../utils/types';

interface NotificationCenterProps {
  notifications: Notification[];
  achievements: Achievement[];
  onMarkAsRead: (notificationId: string) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  achievements,
  onMarkAsRead,
  onClearAll,
  isOpen,
  onClose
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'session': return Clock;
      case 'break': return Coffee;
      case 'achievement': return Trophy;
      default: return Bell;
    }
  };

  const getAchievementIcon = (iconName: string) => {
    const icons: any = { Trophy, Target, Clock, Coffee };
    return icons[iconName] || Trophy;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Bell className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {/* Recent Achievements */}
          {achievements.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                Recent Achievements
              </h3>
              <div className="space-y-2">
                {achievements.slice(0, 3).map((achievement) => {
                  const IconComponent = getAchievementIcon(achievement.icon);
                  return (
                    <div
                      key={achievement.id}
                      className="flex items-center p-3 bg-yellow-50 rounded-xl border border-yellow-200"
                    >
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                        <IconComponent className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notifications */}
          <div className="p-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.slice(0, 10).map((notification) => {
                  const IconComponent = getNotificationIcon(notification.type);
                  return (
                    <div
                      key={notification.id}
                      className={`flex items-start p-3 rounded-xl border transition-all ${
                        notification.read
                          ? 'bg-gray-50 border-gray-200'
                          : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        notification.read ? 'bg-gray-200' : 'bg-blue-100'
                      }`}>
                        <IconComponent className={`w-4 h-4 ${
                          notification.read ? 'text-gray-500' : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${
                          notification.read ? 'text-gray-700' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h4>
                        <p className={`text-sm ${
                          notification.read ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => onMarkAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={onClearAll}
              className="w-full text-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Mark All as Read
            </button>
          </div>
        )}
      </div>
    </div>
  );
};