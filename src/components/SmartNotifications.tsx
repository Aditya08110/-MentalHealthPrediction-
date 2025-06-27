import React, { useState, useEffect } from 'react';
import { Bell, X, Clock, Brain, HeartPulse, Footprints, BookOpen } from 'lucide-react';

interface Notification {
    id: string;
    message: string;
    type: 'focus' | 'activity' | 'mood' | 'journal';
    timestamp: number;
    read: boolean;
}

interface ActivityData {
    lastActive: number;
    focusPeaks: string[];
    lastJournal: number;
    moodEntries: number;
}

const SmartNotifications: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [activityData, setActivityData] = useState<ActivityData>({
        lastActive: Date.now(),
        focusPeaks: ['10:00', '15:00'],
        lastJournal: Date.now() - 86400000, // 24 hours ago
        moodEntries: 0,
    });

    // Notification templates
    const notificationTemplates = {
        focus: [
            "Your focus is usually best around {time}. Consider journaling or deep work now.",
            "Peak productivity time approaching at {time}. Want to plan your important tasks?",
            "Historical data shows you're most focused at {time}. Make the most of it!"
        ],
        activity: [
            "You've been inactive for {duration}. How about a quick walk while listening to a positive podcast?",
            "Time for a movement break! ({duration} of inactivity)",
            "Regular movement helps mental clarity. You haven't moved in {duration}."
        ],
        mood: [
            "How are you feeling right now? Quick mood check-in?",
            "Notice any patterns in your mood today?",
            "Taking a moment for emotional awareness can boost your day."
        ],
        journal: [
            "It's been a while since you journaled. Want to reflect on your thoughts?",
            "Journaling helps process emotions. Ready for a quick entry?",
            "Your last journal entry was {duration} ago. Time for an update?"
        ]
    };

    // Generate a notification
    const generateNotification = (type: 'focus' | 'activity' | 'mood' | 'journal'): Notification => {
        const templates = notificationTemplates[type];
        const template = templates[Math.floor(Math.random() * templates.length)];
        let message = template;

        switch (type) {
            case 'focus':
                message = template.replace('{time}', activityData.focusPeaks[0]);
                break;
            case 'activity':
                const inactiveDuration = Math.floor((Date.now() - activityData.lastActive) / (1000 * 60));
                message = template.replace('{duration}', `${inactiveDuration} minutes`);
                break;
            case 'journal':
                const journalDuration = Math.floor((Date.now() - activityData.lastJournal) / (1000 * 60 * 60));
                message = template.replace('{duration}', `${journalDuration} hours`);
                break;
        }

        return {
            id: Math.random().toString(36).substr(2, 9),
            message,
            type,
            timestamp: Date.now(),
            read: false
        };
    };

    // Check conditions and create notifications
    useEffect(() => {
        const checkAndNotify = () => {
            const currentTime = new Date();
            const currentHour = `${currentTime.getHours()}:${String(currentTime.getMinutes()).padStart(2, '0')}`;

            // Focus time notification
            if (activityData.focusPeaks.includes(currentHour)) {
                const notification = generateNotification('focus');
                setNotifications(prev => [notification, ...prev].slice(0, 5));
            }

            // Inactivity notification (3 hours)
            const inactiveTime = (Date.now() - activityData.lastActive) / (1000 * 60 * 60);
            if (inactiveTime >= 3) {
                const notification = generateNotification('activity');
                setNotifications(prev => [notification, ...prev].slice(0, 5));
            }

            // Journal reminder (24 hours)
            const lastJournalTime = (Date.now() - activityData.lastJournal) / (1000 * 60 * 60);
            if (lastJournalTime >= 24) {
                const notification = generateNotification('journal');
                setNotifications(prev => [notification, ...prev].slice(0, 5));
            }

            // Mood check-in (every 6 hours)
            if (activityData.moodEntries === 0 || (Date.now() - notifications[0]?.timestamp) > 6 * 60 * 60 * 1000) {
                const notification = generateNotification('mood');
                setNotifications(prev => [notification, ...prev].slice(0, 5));
            }
        };

        // Check every 15 minutes
        const interval = setInterval(checkAndNotify, 15 * 60 * 1000);
        return () => clearInterval(interval);
    }, [activityData]);

    // Update activity when user interacts
    useEffect(() => {
        const updateActivity = () => {
            setActivityData(prev => ({ ...prev, lastActive: Date.now() }));
        };

        window.addEventListener('mousemove', updateActivity);
        window.addEventListener('keydown', updateActivity);
        window.addEventListener('click', updateActivity);

        return () => {
            window.removeEventListener('mousemove', updateActivity);
            window.removeEventListener('keydown', updateActivity);
            window.removeEventListener('click', updateActivity);
        };
    }, []);

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
    };

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'focus':
                return <Brain className="w-5 h-5 text-blue-500" />;
            case 'activity':
                return <Footprints className="w-5 h-5 text-green-500" />;
            case 'mood':
                return <HeartPulse className="w-5 h-5 text-red-500" />;
            case 'journal':
                return <BookOpen className="w-5 h-5 text-purple-500" />;
            default:
                return <Bell className="w-5 h-5 text-gray-500" />;
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="fixed bottom-4 right-4 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
                <Bell className="w-6 h-6 text-gray-700" />
                {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {notifications.filter(n => !n.read).length}
                    </span>
                )}
            </button>

            {showNotifications && (
                <div className="fixed bottom-20 right-4 w-80 max-h-96 bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-700">Mental Fitness Coach</h3>
                        <button
                            onClick={() => setShowNotifications(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="overflow-y-auto max-h-80">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${notification.read ? 'opacity-75' : ''
                                        }`}
                                >
                                    <div className="flex items-start space-x-3">
                                        {getNotificationIcon(notification.type)}
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-700">{notification.message}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xs text-gray-400">
                                                    <Clock className="w-3 h-3 inline mr-1" />
                                                    {new Date(notification.timestamp).toLocaleTimeString()}
                                                </span>
                                                <div className="space-x-2">
                                                    {!notification.read && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="text-xs text-blue-500 hover:text-blue-600"
                                                        >
                                                            Mark as read
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => removeNotification(notification.id)}
                                                        className="text-xs text-gray-400 hover:text-gray-500"
                                                    >
                                                        Dismiss
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SmartNotifications;
