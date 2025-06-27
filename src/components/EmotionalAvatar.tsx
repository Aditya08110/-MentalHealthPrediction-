import React, { useState, useEffect } from 'react';
import { Heart, Brain, MessageCircle, PenTool, Timer, HelpCircle } from 'lucide-react';

interface MoodEntry {
    timestamp: string;
    mood: string;
    intensity: number;
    note: string;
}

interface AvatarResponse {
    message: string;
    suggestion: string;
    type: 'question' | 'empathy' | 'suggestion';
}

const EmotionalAvatar: React.FC = () => {
    const [currentMood, setCurrentMood] = useState<string>('');
    const [moodIntensity, setMoodIntensity] = useState<number>(5);
    const [journalEntry, setJournalEntry] = useState<string>('');
    const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
    const [avatarResponse, setAvatarResponse] = useState<AvatarResponse | null>(null);
    const [showJournal, setShowJournal] = useState<boolean>(false);
    const [showMeditation, setShowMeditation] = useState<boolean>(false);
    const [meditationTime, setMeditationTime] = useState<number>(0);
    const [isMediating, setIsMediating] = useState<boolean>(false);
    const [showInstructions, setShowInstructions] = useState<boolean>(true);

    const moodOptions = [
        { emoji: '😊', label: 'Happy' },
        { emoji: '😔', label: 'Sad' },
        { emoji: '😌', label: 'Calm' },
        { emoji: '😤', label: 'Anxious' },
        { emoji: '😡', label: 'Angry' },
        { emoji: '😴', label: 'Tired' },
    ];

    const generateAvatarResponse = (mood: string, intensity: number): AvatarResponse => {
        const intensityText = intensity <= 3 ? 'mildly' : intensity >= 8 ? 'very' : 'quite';
        const responses: { [key: string]: AvatarResponse[] } = {
            'Happy': [
                {
                    message: `It's wonderful to see you're feeling ${intensityText} happy!`,
                    suggestion: "Would you like to journal about what made your day special?",
                    type: 'question'
                }
            ],
            'Sad': [
                {
                    message: "I'm here to listen if you want to talk about what's troubling you.",
                    suggestion: "A brief meditation session might help lift your mood.",
                    type: 'empathy'
                }
            ],
            'Calm': [
                {
                    message: "It's great that you're feeling balanced.",
                    suggestion: "This would be a perfect time for some mindful reflection.",
                    type: 'suggestion'
                }
            ],
            'Anxious': [
                {
                    message: "I understand that anxiety can be overwhelming.",
                    suggestion: "Let's try a quick breathing exercise together.",
                    type: 'empathy'
                }
            ],
            'Angry': [
                {
                    message: "It's okay to feel angry. Let's work through this together.",
                    suggestion: "Would you like to try a calming meditation?",
                    type: 'empathy'
                }
            ],
            'Tired': [
                {
                    message: "I notice you're feeling low on energy.",
                    suggestion: "A short energizing meditation might help refresh you.",
                    type: 'suggestion'
                }
            ]
        };

        const moodResponses = responses[mood] || responses['Calm'];
        return moodResponses[0];
    };

    const handleMoodSelection = (mood: string) => {
        setCurrentMood(mood);
        const response = generateAvatarResponse(mood, moodIntensity);
        setAvatarResponse(response);
    };

    const saveMoodEntry = () => {
        if (!currentMood) return;

        const newEntry: MoodEntry = {
            timestamp: new Date().toISOString(),
            mood: currentMood,
            intensity: moodIntensity,
            note: journalEntry
        };

        setMoodHistory(prev => [...prev, newEntry]);
        setJournalEntry('');
        setShowJournal(false);
    };

    const startMeditation = () => {
        setIsMediating(true);
        setShowMeditation(true);
        const timer = setInterval(() => {
            setMeditationTime(prev => {
                if (prev >= 300) { // 5 minutes
                    clearInterval(timer);
                    setIsMediating(false);
                    return 0;
                }
                return prev + 1;
            });
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Emotional Self-Awareness AI</h2>
                        <p className="text-gray-600 mt-1">Your personal emotional wellness companion</p>
                    </div>
                    <button
                        onClick={() => setShowInstructions(!showInstructions)}
                        className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <HelpCircle className="w-6 h-6" />
                    </button>
                </div>

                {showInstructions && (
                    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">How to use this feature:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-gray-700">
                            <li>Select your current mood from the emoji options below</li>
                            <li>Adjust the intensity slider to indicate how strongly you feel</li>
                            <li>The AI will respond with personalized suggestions</li>
                            <li>Choose to journal your thoughts or try a meditation session</li>
                            <li>Your mood history will be tracked on the right</li>
                        </ol>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <div className="bg-blue-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Brain className="w-5 h-5 mr-2 text-blue-500" />
                                How are you feeling today?
                            </h3>
                            <div className="grid grid-cols-3 gap-3">
                                {moodOptions.map((option) => (
                                    <button
                                        key={option.label}
                                        onClick={() => handleMoodSelection(option.label)}
                                        className={`p-3 rounded-lg border transition-all ${currentMood === option.label
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                                            }`}
                                    >
                                        <div className="text-2xl mb-1">{option.emoji}</div>
                                        <div className="text-sm font-medium text-gray-900">{option.label}</div>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-4">
                                <label className="text-sm font-medium text-gray-700">Intensity</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={moodIntensity}
                                    onChange={(e) => setMoodIntensity(Number(e.target.value))}
                                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-gray-600">
                                    <span>Mild</span>
                                    <span>Moderate</span>
                                    <span>Intense</span>
                                </div>
                            </div>
                        </div>

                        {avatarResponse && (
                            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-100 shadow-sm">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <MessageCircle className="w-6 h-6 mr-2 text-purple-500" />
                                    AI Response
                                </h3>
                                <div className="space-y-4">
                                    <div className="bg-white rounded-lg p-4 border border-purple-100">
                                        <p className="text-lg text-gray-800 font-medium">{avatarResponse.message}</p>
                                        <p className="text-gray-600 mt-2 italic">{avatarResponse.suggestion}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-3 mt-6">
                                        <button
                                            onClick={() => setShowJournal(true)}
                                            className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-sm"
                                        >
                                            <PenTool className="w-5 h-5 mr-2" />
                                            Start Journaling
                                        </button>
                                        <button
                                            onClick={startMeditation}
                                            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-sm"
                                        >
                                            <Timer className="w-5 h-5 mr-2" />
                                            Begin Meditation
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        {showJournal && (
                            <div className="bg-green-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <PenTool className="w-5 h-5 mr-2 text-green-500" />
                                    Journal Entry
                                </h3>
                                <textarea
                                    value={journalEntry}
                                    onChange={(e) => setJournalEntry(e.target.value)}
                                    placeholder="Write your thoughts here..."
                                    className="w-full h-32 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                                <button
                                    onClick={saveMoodEntry}
                                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    Save Entry
                                </button>
                            </div>
                        )}

                        {showMeditation && (
                            <div className="bg-orange-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <Timer className="w-5 h-5 mr-2 text-orange-500" />
                                    Meditation Timer
                                </h3>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-gray-900 mb-4">
                                        {Math.floor(meditationTime / 60)}:{(meditationTime % 60).toString().padStart(2, '0')}
                                    </div>
                                    {!isMediating ? (
                                        <button
                                            onClick={startMeditation}
                                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                        >
                                            Start New Session
                                        </button>
                                    ) : (
                                        <p className="text-gray-600">Take deep breaths and focus on the present moment...</p>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Heart className="w-5 h-5 mr-2 text-red-500" />
                                Mood History
                            </h3>
                            <div className="space-y-3">
                                {moodHistory.slice(-5).reverse().map((entry, index) => (
                                    <div key={index} className="bg-white rounded-lg border p-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-gray-900">{entry.mood}</p>
                                                <p className="text-sm text-gray-600">
                                                    {new Date(entry.timestamp).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Intensity: {entry.intensity}
                                            </div>
                                        </div>
                                        {entry.note && (
                                            <p className="text-sm text-gray-700 mt-2">{entry.note}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmotionalAvatar;
