import React, { useState } from 'react';

const selfCareTips = {
    'Low Risk': [
        'Maintain your healthy routine and stay active.',
        'Keep a gratitude journal.',
        'Continue socializing and doing things you enjoy.'
    ],
    'Moderate Risk': [
        'Practice daily mindfulness or meditation.',
        'Limit screen time and take regular breaks.',
        'Reach out to friends or family for support.'
    ],
    'High Risk': [
        'Seek support from a mental health professional.',
        'Try guided breathing or progressive muscle relaxation.',
        'Don’t hesitate to talk to someone you trust.'
    ]
};

const counselingLinks = [
    { name: '7 Cups (Free Online Counseling)', url: 'https://www.7cups.com/' },
    { name: 'iCALL (India)', url: 'https://icallhelpline.org/' },
    { name: 'BetterHelp (Free Trial)', url: 'https://www.betterhelp.com/' },
    { name: 'Find a Helpline (Global)', url: 'https://findahelpline.com/' }
];

const mindfulnessExercises = [
    { name: '5-Minute Mindful Breathing', url: 'https://www.youtube.com/watch?v=nmFUDkj1Aq0' },
    { name: 'Body Scan Meditation', url: 'https://www.youtube.com/watch?v=ihO02wUzgkc' },
    { name: 'Guided Relaxation for Stress', url: 'https://www.youtube.com/watch?v=MIr3RsUWrdo' }
];

const SelfCareSupport: React.FC = () => {
    const [risk, setRisk] = useState<'Low Risk' | 'Moderate Risk' | 'High Risk'>('Low Risk');

    return (
        <div className="p-6 bg-white rounded shadow-md max-w-xl mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Self-Care & Support</h2>
            <div className="mb-6">
                <label className="block mb-2 font-medium">Select Your Risk Level:</label>
                <select
                    value={risk}
                    onChange={e => setRisk(e.target.value as 'Low Risk' | 'Moderate Risk' | 'High Risk')}
                    className="w-full border rounded px-3 py-2"
                >
                    <option value="Low Risk">Low Risk</option>
                    <option value="Moderate Risk">Moderate Risk</option>
                    <option value="High Risk">High Risk</option>
                </select>
            </div>
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Tips for Self-Care</h3>
                <ul className="list-disc list-inside text-gray-700">
                    {selfCareTips[risk].map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                    ))}
                </ul>
            </div>
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Free Counseling Resources</h3>
                <ul className="list-disc list-inside text-blue-700">
                    {counselingLinks.map(link => (
                        <li key={link.url}>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500">{link.name}</a>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-2">Mindfulness Exercises</h3>
                <ul className="list-disc list-inside text-blue-700">
                    {mindfulnessExercises.map(ex => (
                        <li key={ex.url}>
                            <a href={ex.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500">{ex.name}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SelfCareSupport;
