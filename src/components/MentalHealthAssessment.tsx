import React, { useState } from 'react';
import { Brain, CheckCircle, AlertCircle } from 'lucide-react';
import DoctorRecommendation from './DoctorRecommendation';

interface AssessmentQuestion {
    id: string;
    question: string;
    options: {
        value: number;
        label: string;
    }[];
}

const MentalHealthAssessment: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<'form' | 'result'>('form');
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [predictedCondition, setPredictedCondition] = useState<string>('');

    const questions: AssessmentQuestion[] = [
        {
            id: 'mood',
            question: 'How are you feeling today?',
            options: [
                { value: 1, label: 'Very low' },
                { value: 2, label: 'Low' },
                { value: 3, label: 'Neutral' },
                { value: 4, label: 'Good' },
                { value: 5, label: 'Very good' }
            ]
        },
        {
            id: 'sleep',
            question: 'How has your sleep been?',
            options: [
                { value: 1, label: 'Severe insomnia' },
                { value: 2, label: 'Difficulty sleeping' },
                { value: 3, label: 'Normal' },
                { value: 4, label: 'Good' },
                { value: 5, label: 'Excellent' }
            ]
        },
        {
            id: 'anxiety',
            question: 'How anxious or worried do you feel?',
            options: [
                { value: 1, label: 'Extremely anxious' },
                { value: 2, label: 'Very anxious' },
                { value: 3, label: 'Moderately anxious' },
                { value: 4, label: 'Slightly anxious' },
                { value: 5, label: 'Not anxious' }
            ]
        },
        {
            id: 'mood_swings',
            question: 'How would you describe your mood stability?',
            options: [
                { value: 1, label: 'Severe mood swings' },
                { value: 2, label: 'Frequent changes' },
                { value: 3, label: 'Some fluctuations' },
                { value: 4, label: 'Mostly stable' },
                { value: 5, label: 'Very stable' }
            ]
        },
        {
            id: 'irritability',
            question: 'How irritable or easily annoyed do you feel?',
            options: [
                { value: 1, label: 'Extremely irritable' },
                { value: 2, label: 'Very irritable' },
                { value: 3, label: 'Moderately irritable' },
                { value: 4, label: 'Slightly irritable' },
                { value: 5, label: 'Not irritable' }
            ]
        }
    ];

    const handleAnswer = (questionId: string, value: number) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const predictCondition = () => {
        // Simple scoring system - in a real application, this would use a more sophisticated algorithm
        const scores = {
            Depression: 0,
            Anxiety: 0,
            Bipolar: 0,
            Insomnia: 0,
            PTSD: 0,
            Stress: 0
        };

        // Calculate scores based on answers
        if (answers.mood <= 2) scores.Depression += 2;
        if (answers.anxiety >= 4) scores.Anxiety += 2;
        if (answers.mood_swings <= 2) scores.Bipolar += 2;
        if (answers.sleep <= 2) scores.Insomnia += 2;
        if (answers.irritability >= 4) scores.PTSD += 1;
        if (answers.anxiety >= 3 && answers.irritability >= 3) scores.Stress += 2;

        // Find the condition with the highest score
        const predictedCondition = Object.entries(scores).reduce((a, b) =>
            (b[1] > a[1] ? b : a)
        )[0];

        setPredictedCondition(predictedCondition);
        setCurrentStep('result');
    };

    const isFormComplete = Object.keys(answers).length === questions.length;

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Mental Health Assessment</h2>
                        <p className="text-gray-600 mt-1">Answer a few questions to get personalized recommendations</p>
                    </div>
                    <Brain className="w-8 h-8 text-indigo-500" />
                </div>

                {currentStep === 'form' ? (
                    <div className="space-y-6">
                        {questions.map((question) => (
                            <div key={question.id} className="space-y-3">
                                <h3 className="text-lg font-medium text-gray-900">{question.question}</h3>
                                <div className="grid grid-cols-1 gap-2">
                                    {question.options.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleAnswer(question.id, option.value)}
                                            className={`p-3 text-left rounded-lg border transition-all ${answers[question.id] === option.value
                                                    ? 'border-indigo-500 bg-indigo-50'
                                                    : 'border-gray-200 hover:border-indigo-200'
                                                }`}
                                        >
                                            <div className="flex items-center">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${answers[question.id] === option.value
                                                        ? 'border-indigo-500 bg-indigo-500'
                                                        : 'border-gray-300'
                                                    }`}>
                                                    {answers[question.id] === option.value && (
                                                        <CheckCircle className="w-4 h-4 text-white" />
                                                    )}
                                                </div>
                                                <span className="text-gray-700">{option.label}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={predictCondition}
                            disabled={!isFormComplete}
                            className={`w-full py-3 rounded-lg text-white font-medium transition-all ${isFormComplete
                                    ? 'bg-indigo-500 hover:bg-indigo-600'
                                    : 'bg-gray-300 cursor-not-allowed'
                                }`}
                        >
                            Get Recommendations
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                            <div className="flex items-center">
                                <AlertCircle className="w-5 h-5 text-green-500 mr-2" />
                                <h3 className="text-lg font-semibold text-green-900">
                                    Based on your responses, we recommend consulting a specialist for:
                                </h3>
                            </div>
                            <p className="mt-2 text-green-700 font-medium">
                                {predictedCondition}
                            </p>
                        </div>

                        <DoctorRecommendation predictedCondition={predictedCondition} />

                        <button
                            onClick={() => {
                                setCurrentStep('form');
                                setAnswers({});
                                setPredictedCondition('');
                            }}
                            className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Take Assessment Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MentalHealthAssessment; 