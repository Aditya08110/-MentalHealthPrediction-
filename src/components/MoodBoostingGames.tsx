import React, { useState } from 'react';
import { Heart, Wind, Brain, Star } from 'lucide-react';

interface Game {
    id: string;
    title: string;
    description: string;
    icon: any;
    component: React.FC;
}

const GratitudeJournal: React.FC = () => {
    const [entries, setEntries] = useState<string[]>(['', '', '']);
    const [timeLeft, setTimeLeft] = useState<number>(60);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);

    const startGame = () => {
        setIsActive(true);
        setIsCompleted(false);
        setEntries(['', '', '']);
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsActive(false);
                    setIsCompleted(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    return (
        <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Gratitude Journal</h3>
            {!isActive && !isCompleted && (
                <button
                    onClick={startGame}
                    className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Start 60-Second Challenge
                </button>
            )}
            {isActive && (
                <div className="space-y-4">
                    <div className="text-center text-xl font-bold text-blue-500 mb-4">
                        Time Left: {timeLeft}s
                    </div>
                    {entries.map((entry, index) => (
                        <div key={index} className="space-y-2">
                            <label className="text-sm text-gray-600">Good thing #{index + 1}:</label>
                            <input
                                type="text"
                                value={entry}
                                onChange={(e) => {
                                    const newEntries = [...entries];
                                    newEntries[index] = e.target.value;
                                    setEntries(newEntries);
                                }}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="I'm grateful for..."
                            />
                        </div>
                    ))}
                </div>
            )}
            {isCompleted && (
                <div className="space-y-4">
                    <div className="text-green-500 font-semibold mb-4">Great job! Here's what you wrote:</div>
                    <ul className="list-disc list-inside space-y-2">
                        {entries.map((entry, index) => (
                            <li key={index} className="text-gray-700">{entry || '(empty)'}</li>
                        ))}
                    </ul>
                    <button
                        onClick={startGame}
                        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
};

const BreathingGame: React.FC = () => {
    const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('rest');
    const [isActive, setIsActive] = useState(false);

    const startBreathing = () => {
        setIsActive(true);
        setPhase('inhale');

        const cycle = () => {
            setPhase('inhale');
            setTimeout(() => {
                setPhase('hold');
                setTimeout(() => {
                    setPhase('exhale');
                    setTimeout(() => {
                        setPhase('rest');
                    }, 4000); // Exhale for 4s
                }, 4000); // Hold for 4s
            }, 4000); // Inhale for 4s
        };

        cycle();
        const interval = setInterval(cycle, 16000); // Complete cycle is 16s

        return () => clearInterval(interval);
    };

    return (
        <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Breathing Pattern Game</h3>
            {!isActive ? (
                <button
                    onClick={startBreathing}
                    className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Start Breathing Exercise
                </button>
            ) : (
                <div className="text-center">
                    <div className={`text-2xl font-bold mb-4 transition-colors ${phase === 'inhale' ? 'text-blue-500' :
                            phase === 'hold' ? 'text-purple-500' :
                                phase === 'exhale' ? 'text-green-500' :
                                    'text-gray-500'
                        }`}>
                        {phase.charAt(0).toUpperCase() + phase.slice(1)}
                    </div>
                    <div className={`w-32 h-32 mx-auto rounded-full border-4 transition-all duration-1000 ${phase === 'inhale' ? 'scale-150 border-blue-500' :
                            phase === 'hold' ? 'scale-150 border-purple-500' :
                                phase === 'exhale' ? 'scale-100 border-green-500' :
                                    'scale-100 border-gray-300'
                        }`} />
                    <button
                        onClick={() => setIsActive(false)}
                        className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Stop
                    </button>
                </div>
            )}
        </div>
    );
};

const MemoryGame: React.FC = () => {
    const [cards, setCards] = useState<Array<{ id: number; symbol: string; isFlipped: boolean; isMatched: boolean }>>(
        [
            { id: 1, symbol: '😊', isFlipped: false, isMatched: false },
            { id: 2, symbol: '😊', isFlipped: false, isMatched: false },
            { id: 3, symbol: '🌟', isFlipped: false, isMatched: false },
            { id: 4, symbol: '🌟', isFlipped: false, isMatched: false },
            { id: 5, symbol: '❤️', isFlipped: false, isMatched: false },
            { id: 6, symbol: '❤️', isFlipped: false, isMatched: false },
            { id: 7, symbol: '🌈', isFlipped: false, isMatched: false },
            { id: 8, symbol: '🌈', isFlipped: false, isMatched: false },
        ].sort(() => Math.random() - 0.5)
    );

    const [selectedCards, setSelectedCards] = useState<number[]>([]);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showCongrats, setShowCongrats] = useState(false);

    const handleCardClick = (id: number) => {
        if (selectedCards.length === 2) return;

        const newCards = cards.map(card =>
            card.id === id ? { ...card, isFlipped: true } : card
        );
        setCards(newCards);
        setSelectedCards([...selectedCards, id]);

        if (selectedCards.length === 1) {
            const firstCard = cards.find(card => card.id === selectedCards[0]);
            const secondCard = cards.find(card => card.id === id);

            setTimeout(() => {
                if (firstCard?.symbol === secondCard?.symbol) {
                    setCards(cards.map(card =>
                        card.id === selectedCards[0] || card.id === id
                            ? { ...card, isMatched: true, isFlipped: true }
                            : card
                    ));
                } else {
                    setCards(cards.map(card =>
                        card.id === selectedCards[0] || card.id === id
                            ? { ...card, isFlipped: false }
                            : card
                    ));
                }
                setSelectedCards([]);

                // Check if all cards are matched
                if (cards.every(card => (card.id === selectedCards[0] || card.id === id ? true : card.isMatched))) {
                    setIsCompleted(true);
                    setShowCongrats(true);
                }
            }, 1000);
        }
    };

    const resetGame = () => {
        setCards(cards.sort(() => Math.random() - 0.5).map(card => ({
            ...card,
            isFlipped: false,
            isMatched: false
        })));
        setSelectedCards([]);
        setIsCompleted(false);
        setShowCongrats(false);
    };

    return (
        <div className="p-4 relative">
            <h3 className="text-lg font-semibold mb-4">Memory Game</h3>
            <div className="grid grid-cols-4 gap-2 mb-4">
                {cards.map(card => (
                    <button
                        key={card.id}
                        onClick={() => !card.isMatched && !card.isFlipped && handleCardClick(card.id)}
                        className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl
              ${card.isFlipped || card.isMatched
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 hover:bg-gray-300'} 
              transition-all duration-200`}
                    >
                        {(card.isFlipped || card.isMatched) ? card.symbol : '?'}
                    </button>
                ))}
            </div>

            {showCongrats && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={resetGame}>
                    <div className="bg-white p-6 rounded-xl shadow-2xl text-center transform transition-all animate-bounce" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold text-green-600 mb-4">🎉 Congratulations! 🎉</h2>
                        <p className="text-gray-700 mb-6">You've won the Memory Game!</p>
                        <button
                            onClick={resetGame}
                            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                            Play Again
                        </button>
                    </div>
                </div>
            )}

            {isCompleted && !showCongrats && (
                <button
                    onClick={resetGame}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                    Play Again
                </button>
            )}
        </div>
    );
};

const AffirmationGame: React.FC = () => {
    const [selectedAffirmation, setSelectedAffirmation] = useState<string>('');
    const [isCustom, setIsCustom] = useState<boolean>(false);
    const [customAffirmation, setCustomAffirmation] = useState<string>('');

    const affirmations = [
        "I am capable and strong",
        "Today is full of possibilities",
        "I choose to be confident",
        "I radiate positive energy",
        "I trust in my abilities",
        "I am worthy of good things",
    ];

    const handleSelection = (affirmation: string) => {
        setSelectedAffirmation(affirmation);
        setIsCustom(false);
    };

    const handleCustomSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (customAffirmation.trim()) {
            setSelectedAffirmation(customAffirmation);
            setIsCustom(true);
        }
    };

    return (
        <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Daily Affirmation Challenge</h3>
            {!selectedAffirmation ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-2">
                        {affirmations.map((affirmation, index) => (
                            <button
                                key={index}
                                onClick={() => handleSelection(affirmation)}
                                className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-colors text-left"
                            >
                                {affirmation}
                            </button>
                        ))}
                    </div>
                    <div className="border-t pt-4">
                        <form onSubmit={handleCustomSubmit} className="space-y-2">
                            <input
                                type="text"
                                value={customAffirmation}
                                onChange={(e) => setCustomAffirmation(e.target.value)}
                                placeholder="Write your own affirmation..."
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                            >
                                Use Custom Affirmation
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                        <p className="text-white text-center text-xl font-bold">
                            {selectedAffirmation}
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setSelectedAffirmation('');
                            setCustomAffirmation('');
                        }}
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Choose Another Affirmation
                    </button>
                </div>
            )}
        </div>
    );
};

const MoodBoostingGames: React.FC = () => {
    const [activeGame, setActiveGame] = useState<string | null>(null);

    const games: Game[] = [
        {
            id: 'gratitude',
            title: 'Gratitude Journal',
            description: 'Write 3 good things in 60 seconds',
            icon: Heart,
            component: GratitudeJournal
        },
        {
            id: 'breathing',
            title: 'Breathing Patterns',
            description: 'Follow the breathing rhythm',
            icon: Wind,
            component: BreathingGame
        },
        {
            id: 'memory',
            title: 'Memory Game',
            description: 'Break negative focus with a memory challenge',
            icon: Brain,
            component: MemoryGame
        },
        {
            id: 'affirmation',
            title: 'Affirmation Challenge',
            description: 'Choose your power statement for today',
            icon: Star,
            component: AffirmationGame
        }
    ];

    const ActiveGameComponent = activeGame
        ? games.find(game => game.id === activeGame)?.component
        : null;

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Mood-Boosting Games</h2>
                        <p className="text-gray-600 mt-1">Interactive activities to improve your mood and focus</p>
                    </div>
                </div>

                {!activeGame ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {games.map((game) => {
                            const Icon = game.icon;
                            return (
                                <button
                                    key={game.id}
                                    onClick={() => setActiveGame(game.id)}
                                    className="flex items-start p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all duration-200"
                                >
                                    <Icon className="w-6 h-6 text-blue-500 mt-1 mr-3" />
                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-900">{game.title}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{game.description}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <button
                            onClick={() => setActiveGame(null)}
                            className="text-blue-500 hover:text-blue-600 flex items-center"
                        >
                            ← Back to Games
                        </button>
                        {ActiveGameComponent && <ActiveGameComponent />}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MoodBoostingGames;
