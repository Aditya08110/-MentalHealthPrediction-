import React, { useState, useEffect } from 'react';

interface FeedbackEntry {
    text: string;
    date: string;
}

const FeedbackJournal: React.FC = () => {
    const [entry, setEntry] = useState('');
    const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>([]);
    const [analysis, setAnalysis] = useState<string>('');

    useEffect(() => {
        // Simple analysis: count positive/negative words (demo purpose)
        if (feedbacks.length === 0) {
            setAnalysis('No feedback yet. Your suggestions will appear here.');
            return;
        }
        const allText = feedbacks.map(f => f.text).join(' ').toLowerCase();
        const positiveWords = ['good', 'happy', 'improve', 'better', 'relaxed', 'enjoy'];
        const negativeWords = ['bad', 'sad', 'stress', 'anxious', 'worse', 'tired'];
        let pos = 0, neg = 0;
        positiveWords.forEach(word => { if (allText.includes(word)) pos++; });
        negativeWords.forEach(word => { if (allText.includes(word)) neg++; });
        if (pos > neg) setAnalysis('You seem to be having more positive days. Keep it up!');
        else if (neg > pos) setAnalysis('You may be experiencing some stress. Consider more relaxation or talking to someone.');
        else setAnalysis('Your mood seems balanced. Continue journaling for more tailored suggestions.');
    }, [feedbacks]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!entry.trim()) return;
        setFeedbacks([
            { text: entry, date: new Date().toLocaleString() },
            ...feedbacks
        ]);
        setEntry('');
    };

    return (
        <div className="p-6 bg-white rounded shadow-md max-w-xl mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Feedback & Journal</h2>
            <form onSubmit={handleSubmit} className="mb-6">
                <textarea
                    value={entry}
                    onChange={e => setEntry(e.target.value)}
                    className="w-full border rounded px-3 py-2 mb-2"
                    rows={4}
                    placeholder="Write your feedback or journal entry here..."
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Submit
                </button>
            </form>
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Your Journal & Feedback</h3>
                {feedbacks.length === 0 ? (
                    <p className="text-gray-500">No entries yet.</p>
                ) : (
                    <ul className="space-y-2">
                        {feedbacks.map((f, idx) => (
                            <li key={idx} className="border rounded p-2 bg-gray-50">
                                <div className="text-sm text-gray-400 mb-1">{f.date}</div>
                                <div>{f.text}</div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-2">Personalized Suggestion</h3>
                <div className="bg-gray-100 p-3 rounded text-gray-700">{analysis}</div>
            </div>
        </div>
    );
};

export default FeedbackJournal;
