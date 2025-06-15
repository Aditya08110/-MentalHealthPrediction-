export interface SmartphoneData {
    screenTime: number;  // in minutes
    appUsage: {
        appName: string;
        timeSpent: number;  // in minutes
        category: 'social' | 'productivity' | 'entertainment' | 'health' | 'other';
    }[];
    lastActive: string;  // ISO timestamp
}

export interface LocationData {
    timestamp: string;
    latitude: number;
    longitude: number;
    locationType: 'home' | 'work' | 'outside' | 'unknown';
    timeSpentAtLocation: number;  // in minutes
    locationChanges: number;  // number of significant location changes in last 24h
}

export interface HealthData {
    timestamp: string;
    steps: number;
    sleepDuration: number;  // in hours
    sleepQuality: number;  // 0-100
    heartRate: number;  // bpm
    physicalActivity: number;  // minutes of exercise
}

export interface MusicData {
    timestamp: string;
    trackId: string;
    trackName: string;
    artist: string;
    valence: number;  // 0-1 (sad to happy)
    tempo: number;  // BPM
    energy: number;  // 0-1
    duration: number;  // in seconds
    timePlayed: number;  // in seconds
}

export interface JournalEntry {
    timestamp: string;
    content: string;
    sentiment: {
        score: number;  // -1 to 1
        magnitude: number;  // 0 to +inf
        emotions: {
            joy: number;
            sadness: number;
            anger: number;
            fear: number;
            surprise: number;
        };
    };
    topics: string[];
}

export interface VoiceData {
    timestamp: string;
    duration: number;  // in seconds
    metrics: {
        pitch: number;
        volume: number;
        speakingRate: number;
        emotions: {
            neutral: number;
            happy: number;
            sad: number;
            angry: number;
            anxious: number;
        };
    };
}

export interface MultimodalPrediction {
    timestamp: string;
    riskLevel: 'low' | 'moderate' | 'high' | 'severe' | 'crisis';
    riskScore: number;  // 0-100
    confidence: number;  // 0-1
    contributing_factors: {
        source: 'smartphone' | 'location' | 'health' | 'music' | 'journal' | 'voice';
        factor: string;
        impact: number;  // 0-100
    }[];
    insights: string[];
    recommendations: string[];
}

export interface DataSources {
    hasSmartphoneAccess: boolean;
    hasLocationAccess: boolean;
    hasHealthAccess: boolean;
    hasSpotifyAccess: boolean;
    hasJournalAccess: boolean;
    hasVoiceAccess: boolean;
}
