import React, { useMemo, useEffect } from 'react';
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

// Extract static mappings OUTSIDE the component to prevent memory reallocation on every render
const ACHIEVEMENT_ICONS: Record<string, React.ElementType> = { 
  Trophy, 
  Target, 
  Clock, 
  Coffee 
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  achievements,
  onMarkAsRead,
  onClearAll,
  isOpen,
  onClose
}) => {
  // Lock background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function in case component unmounts while open
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'session': return Clock;
      case 'break': return Coffee;
      case 'achievement': return Trophy;
      default: return Bell;
    }
  };

  const getAchievementIcon = (iconName: string) => {
    return ACHIEVEMENT_ICONS[iconName] || Trophy;
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20 backdrop-blur-sm"
      onClick={onClose} // Close modal when clicking the dark backdrop
      role="dialog"
      aria-modal="true"
      aria-labelledby="notification-title"
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from bubbling up and closing it
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 shrink-0">
          <div className="flex items-center">
            <Bell className="w-6 h-6 text-blue-600 mr-2" />
            <h2 id="notification-title" className="text-xl font-bold text-gray-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            aria-label="Close notifications"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-0">
          {/* Recent Achievements */}
          {achievements.length > 0 && (
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
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
                      className="flex items-center p-3 bg-yellow-50 rounded-xl border border-yellow-200 shadow-sm"
                    >
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3 shrink-0">
                        <IconComponent className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{achievement.title}</h4>
                        <p className="text-sm text-gray-600 truncate">{achievement.description}</p>
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
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No notifications yet</p>
                <p className="text-sm text-gray-400 mt-1">We'll let you know when something happens.</p>
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
                          ? 'bg-white border-gray-100'
                          : 'bg-blue-50/50 border-blue-200 shadow-sm'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 shrink-0 ${
                        notification.read ? 'bg-gray-100' : 'bg-blue-100'
                      }`}>
                        <IconComponent className={`w-4 h-4 ${
                          notification.read ? 'text-gray-500' : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium truncate ${
                          notification.read ? 'text-gray-700' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h4>
                        <p className={`text-sm mt-0.5 ${
                          notification.read ? 'text-gray-500' : 'text-gray-700'
                        }`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1.5 font-medium">
                          {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => onMarkAsRead(notification.id)}
                          className="ml-2 p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors shrink-0"
                          title="Mark as read"
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
        {notifications.length > 0 && unreadCount > 0 && (
          <div className="p-4 border-t border-gray-200 shrink-0 bg-gray-50">
            <button
              onClick={onClearAll}
              className="w-full text-center text-blue-600 hover:text-blue-700 font-medium transition-colors py-2 rounded-lg hover:bg-blue-50"
            >
              Mark All as Read
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
