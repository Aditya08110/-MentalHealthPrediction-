import React, { useState } from 'react';
import { Music, Headphones, Heart, Volume2, ListMusic } from 'lucide-react';

interface PlaylistType {
    name: string;
    description: string;
    embedUrl: string;
    icon: React.ReactNode;
    mood: string;
}

const RelaxAndHeal: React.FC = () => {
    const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);

    const playlists: PlaylistType[] = [
        {
            name: "Comfort Zone",
            description: "Calming melodies for anxiety relief",
            embedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DX2x1COalpsUi",
            icon: <Heart className="w-5 h-5 text-pink-500" />,
            mood: "Anxiety Relief"
        },
        {
            name: "Deep Focus",
            description: "Concentrate and find your flow",
            embedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ",
            icon: <Volume2 className="w-5 h-5 text-blue-500" />,
            mood: "Focus"
        },
        {
            name: "Sleep & Relax",
            description: "Peaceful sounds for better sleep",
            embedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DWYcDQ1hSjOpY",
            icon: <Music className="w-5 h-5 text-purple-500" />,
            mood: "Sleep"
        },
        {
            name: "Mood Boost",
            description: "Uplift your spirits with positive vibes",
            embedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DX3rxVfibe1L0",
            icon: <Headphones className="w-5 h-5 text-green-500" />,
            mood: "Happy"
        }
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Relax & Heal</h2>
                        <p className="text-gray-600 mt-1">Music therapy for emotional wellness</p>
                    </div>
                    <ListMusic className="w-8 h-8 text-indigo-500" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="bg-indigo-50 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Your Mood</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Select a playlist that matches how you want to feel
                            </p>
                            <div className="grid grid-cols-1 gap-3">
                                {playlists.map((playlist) => (
                                    <button
                                        key={playlist.name}
                                        onClick={() => setSelectedPlaylist(playlist.embedUrl)}
                                        className={`flex items-center space-x-4 p-4 rounded-lg transition-all ${selectedPlaylist === playlist.embedUrl
                                                ? 'bg-indigo-100 border-indigo-200'
                                                : 'bg-white border-gray-200 hover:bg-indigo-50'
                                            } border`}
                                    >
                                        <div className="flex-shrink-0">
                                            {playlist.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{playlist.name}</h4>
                                            <p className="text-sm text-gray-500">{playlist.description}</p>
                                        </div>
                                        <span className="text-xs font-medium text-indigo-500 bg-indigo-50 px-2 py-1 rounded">
                                            {playlist.mood}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        {selectedPlaylist ? (
                            <iframe
                                src={selectedPlaylist}
                                width="100%"
                                height="580"
                                frameBorder="0"
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                loading="lazy"
                                className="rounded-lg"
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">
                                <div className="text-center">
                                    <Music className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                    <p>Select a playlist to start your healing journey</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RelaxAndHeal;
