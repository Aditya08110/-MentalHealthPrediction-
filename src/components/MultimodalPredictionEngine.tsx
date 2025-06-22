import React, { useState, useEffect } from 'react';
import {
    Smartphone,
    MapPin,
    Activity,
    Music2,
    BookText,
    Mic,
    AlertTriangle,
    Settings,
    RefreshCcw
} from 'lucide-react';
import {
    SmartphoneData,
    LocationData,
    HealthData,
    MusicData,
    JournalEntry,
    VoiceData,
    MultimodalPrediction,
    DataSources
} from '../types/multimodal';
import {
    collectSmartphoneData,
    collectLocationData,
    collectHealthData,
    collectMusicData,
    analyzeJournalSentiment,
    analyzeVoice,
    getAvailableDataSources,
    generateMultimodalPrediction
} from '../utils/predictionEngine';
import ManualDataEntry, { ManualData } from './ManualDataEntry';
import ScreenshotUpload from './ScreenshotUpload';

const MultimodalPredictionEngine: React.FC = () => {
    const [dataSources, setDataSources] = useState<DataSources | null>(null);
    const [prediction, setPrediction] = useState<MultimodalPrediction | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [manualData, setManualData] = useState<ManualData | null>(null);
    const [useManual, setUseManual] = useState(true);
    const [uploadedData, setUploadedData] = useState<{ instagramScreenTime: number } | null>(null);
    const [trendHistory, setTrendHistory] = useState<{ appUsages: { appName: string; timeSpent: number }[]; date: string }[]>([]);

    // Initialize available data sources
    useEffect(() => {
        const initDataSources = async () => {
            try {
                const sources = await getAvailableDataSources();
                setDataSources(sources);
            } catch (err) {
                setError('Failed to initialize data sources');
            }
        };
        initDataSources();
    }, []);

    // Generate a new prediction using available data sources
    const generatePrediction = async () => {
        if (!dataSources) return;

        setLoading(true);
        setError(null);
        try {
            const data: {
                smartphone?: SmartphoneData;
                location?: LocationData;
                health?: HealthData;
                music?: MusicData;
                journal?: JournalEntry;
                voice?: VoiceData;
            } = {};

            if (uploadedData) {
                data.smartphone = {
                    screenTime: uploadedData.instagramScreenTime,
                    appUsage: [
                        {
                            appName: 'Instagram',
                            timeSpent: uploadedData.instagramScreenTime,
                            category: 'social',
                        },
                    ],
                    lastActive: new Date().toISOString(),
                };
            } else if (manualData) {
                data.smartphone = {
                    screenTime: manualData.instagramScreenTime,
                    appUsage: [
                        {
                            appName: 'Instagram',
                            timeSpent: manualData.instagramScreenTime,
                            category: 'social',
                        },
                    ],
                    lastActive: new Date().toISOString(),
                };
                data.health = {
                    timestamp: new Date().toISOString(),
                    steps: manualData.steps,
                    sleepDuration: manualData.sleepHours,
                    sleepQuality: 80, // Placeholder
                    heartRate: 70, // Placeholder
                    physicalActivity: 30, // Placeholder
                };
            } else {
                if (dataSources.hasSmartphoneAccess) {
                    data.smartphone = await collectSmartphoneData();
                }
                if (dataSources.hasLocationAccess) {
                    data.location = await collectLocationData();
                }
                if (dataSources.hasHealthAccess) {
                    data.health = await collectHealthData();
                }
                if (dataSources.hasSpotifyAccess) {
                    data.music = await collectMusicData();
                }
            }

            const result = await generateMultimodalPrediction(
                data.smartphone,
                data.location,
                data.health,
                data.music
            );
            setPrediction(result);
        } catch (err) {
            setError('Failed to generate prediction');
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (level: MultimodalPrediction['riskLevel']) => {
        switch (level) {
            case 'crisis':
                return 'text-red-600 bg-red-50';
            case 'severe':
                return 'text-orange-600 bg-orange-50';
            case 'high':
                return 'text-yellow-600 bg-yellow-50';
            case 'moderate':
                return 'text-blue-600 bg-blue-50';
            default:
                return 'text-green-600 bg-green-50';
        }
    };

    const DataSourceIcon = ({ source, active }: { source: keyof DataSources; active: boolean }) => {
        const icons = {
            hasSmartphoneAccess: Smartphone,
            hasLocationAccess: MapPin,
            hasHealthAccess: Activity,
            hasSpotifyAccess: Music2,
            hasJournalAccess: BookText,
            hasVoiceAccess: Mic
        };
        const Icon = icons[source];
        return (
            <div className={`p-2 rounded-lg ${active ? 'bg-blue-50' : 'bg-gray-50'}`}>
                <Icon className={`w-5 h-5 ${active ? 'text-blue-500' : 'text-gray-400'}`} />
            </div>
        );
    };

    const handleExtractedData = (data: { appUsages: { appName: string; timeSpent: number }[] }) => {
        setUploadedData(data);
        setTrendHistory(prev => [...prev, { ...data, date: new Date().toISOString() }]);
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-4 justify-center mt-4">
                <button
                    className={`btn ${useManual ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setUseManual(true)}
                >
                    Enter Manually
                </button>
                <button
                    className={`btn ${!useManual ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setUseManual(false)}
                >
                    Upload Screenshot
                </button>
            </div>
            {useManual ? (
                <ManualDataEntry onSubmit={setManualData} />
            ) : (
                <ScreenshotUpload onExtract={handleExtractedData} />
            )}
            {/* Trend Detection & Insights */}
            {trendHistory.length > 1 && (
                <div className="bg-blue-50 rounded-lg p-4 mt-4">
                    <div className="font-semibold mb-2">Usage Trends:</div>
                    <ul>
                        {trendHistory.slice(-5).map((entry, idx) => (
                            <li key={idx}>
                                <span className="text-gray-700">{new Date(entry.date).toLocaleDateString()}: </span>
                                {entry.appUsages.map(app => `${app.appName}: ${app.timeSpent} min`).join(', ')}
                            </li>
                        ))}
                    </ul>
                    {/* Simple trend detection example */}
                    {(() => {
                        const app = 'Instagram';
                        const times = trendHistory.map(e => e.appUsages.find(a => a.appName === app)?.timeSpent || 0);
                        if (times.length > 1) {
                            const diff = times[times.length - 1] - times[times.length - 2];
                            if (diff > 0) return <div className="text-red-600 mt-2">Your Instagram usage increased by {diff} min since last entry.</div>;
                            if (diff < 0) return <div className="text-green-600 mt-2">Your Instagram usage decreased by {Math.abs(diff)} min since last entry.</div>;
                        }
                        return null;
                    })()}
                </div>
            )}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Multimodal Mental Health Prediction</h2>
                        <p className="text-gray-600 mt-1">Using multiple data sources for accurate assessment</p>
                    </div>
                    <Settings className="w-8 h-8 text-gray-400" />
                </div>

                {/* Data Sources */}
                <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Data Sources</h3>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                        {dataSources && Object.entries(dataSources).map(([source, active]) => (
                            <div key={source} className="text-center">
                                <DataSourceIcon source={source as keyof DataSources} active={active} />
                                <p className="text-xs text-gray-500 mt-1">
                                    {source.replace('has', '').replace('Access', '')}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Generate Prediction Button */}
                <div className="flex justify-center mb-6">
                    <button
                        onClick={generatePrediction}
                        disabled={loading || !dataSources}
                        className={`flex items-center px-6 py-3 rounded-lg text-white font-medium transition-colors ${loading
                                ? 'bg-gray-400'
                                : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                    >
                        {loading ? (
                            <RefreshCcw className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                            <Activity className="w-5 h-5 mr-2" />
                        )}
                        {loading ? 'Analyzing...' : 'Generate Prediction'}
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                {/* Prediction Results */}
                {prediction && (
                    <div className="space-y-6">
                        {/* Risk Level */}
                        <div className={`p-6 rounded-lg ${getRiskColor(prediction.riskLevel)}`}>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold">Risk Level</h3>
                                    <p className="text-sm opacity-75">Based on multimodal analysis</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold capitalize">{prediction.riskLevel}</p>
                                    <p className="text-sm">Score: {prediction.riskScore.toFixed(1)}/100</p>
                                </div>
                            </div>
                            <div className="w-full bg-white/50 rounded-full h-2.5">
                                <div
                                    className="h-2.5 rounded-full bg-current"
                                    style={{ width: `${prediction.riskScore}%`, opacity: 0.8 }}
                                />
                            </div>
                        </div>

                        {/* Contributing Factors */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contributing Factors</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {prediction.contributing_factors.map((factor, index) => (
                                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center">
                                                <DataSourceIcon
                                                    source={`has${factor.source.charAt(0).toUpperCase() + factor.source.slice(1)}Access` as keyof DataSources}
                                                    active={true}
                                                />
                                                <span className="ml-2 font-medium text-gray-900">{factor.factor}</span>
                                            </div>
                                            <span className="text-sm text-gray-500">Impact: {factor.impact}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Insights */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights</h3>
                            <div className="bg-blue-50 rounded-lg p-4">
                                <ul className="space-y-2">
                                    {prediction.insights.map((insight, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2" />
                                            <span className="text-sm text-gray-700">{insight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
                            <div className="bg-green-50 rounded-lg p-4">
                                <ul className="space-y-2">
                                    {prediction.recommendations.map((recommendation, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2" />
                                            <span className="text-sm text-gray-700">{recommendation}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MultimodalPredictionEngine;
