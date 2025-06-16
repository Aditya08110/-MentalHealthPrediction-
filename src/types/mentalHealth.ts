export type MentalHealthLevel = 'healthy' | 'mild' | 'moderate' | 'severe' | 'crisis';

export interface MentalHealthCondition {
    level: MentalHealthLevel;
    color: string;
    title: string;
    description: string;
    symptoms: string[];
    conditions?: string[];
    behavioralSignals: string[];
    treatment: string[];
}

export const mentalHealthLevels: Record<MentalHealthLevel, MentalHealthCondition> = {
    healthy: {
        level: 'healthy',
        color: 'bg-blue-500',
        title: 'Healthy / No Distress',
        description: 'Maintaining good mental health with no significant concerns.',
        symptoms: [
            'No signs of anxiety, depression, or stress',
            'Balanced sleep, activity, and mood',
            'Engaged socially and emotionally'
        ],
        behavioralSignals: [
            'Regular sleep patterns',
            'Active social engagement',
            'Consistent daily routines'
        ],
        treatment: [
            'Maintain healthy lifestyle',
            'Regular exercise',
            'Social connections'
        ]
    },
    mild: {
        level: 'mild',
        color: 'bg-yellow-500',
        title: 'Mild Mental Health Distress',
        description: 'Early signs of mental health concerns that may need attention.',
        symptoms: [
            'Low energy',
            'Occasional sadness',
            'Irritability',
            'Slight sleep disturbances'
        ],
        conditions: [
            'Mild anxiety',
            'Mild depressive symptoms',
            'Minor stress episodes'
        ],
        behavioralSignals: [
            'Slight social withdrawal',
            'Increased screen time',
            'Inconsistent routines'
        ],
        treatment: [
            'Self-care',
            'Mindfulness',
            'Journaling',
            'Light exercise'
        ]
    },
    moderate: {
        level: 'moderate',
        color: 'bg-orange-500',
        title: 'Moderate Mental Health Disorder',
        description: 'Significant symptoms requiring professional attention.',
        symptoms: [
            'Frequent sadness',
            'Anxiety',
            'Poor concentration',
            'Disturbed sleep',
            'Appetite changes'
        ],
        conditions: [
            'Generalized Anxiety Disorder (GAD)',
            'Moderate Depression',
            'Adjustment Disorder',
            'Burnout Syndrome'
        ],
        behavioralSignals: [
            'Avoidance behaviors',
            'Mood volatility',
            'Decline in physical activity'
        ],
        treatment: [
            'Therapy (CBT)',
            'Supervised interventions',
            'Lifestyle changes'
        ]
    },
    severe: {
        level: 'severe',
        color: 'bg-red-500',
        title: 'Severe Mental Health Disorder',
        description: 'Serious conditions requiring immediate professional intervention.',
        symptoms: [
            'Persistent hopelessness',
            'Panic attacks',
            'Suicidal thoughts',
            'Hallucinations',
            'Extreme fatigue'
        ],
        conditions: [
            'Major Depressive Disorder (Severe)',
            'Bipolar Disorder',
            'PTSD',
            'Severe Anxiety/Panic Disorder'
        ],
        behavioralSignals: [
            'Isolation',
            'Disrupted sleep/wake cycles',
            'Complete loss of motivation',
            'Dangerous habits (e.g., substance abuse)'
        ],
        treatment: [
            'Psychiatric help',
            'Medication',
            'Hospitalization if needed'
        ]
    },
    crisis: {
        level: 'crisis',
        color: 'bg-gray-900',
        title: 'Crisis Stage / Emergency',
        description: 'Emergency situation requiring immediate professional help.',
        symptoms: [
            'Active suicidal ideation',
            'Psychosis',
            'Self-harm',
            'Manic episodes'
        ],
        conditions: [
            'Psychotic Disorders (e.g., Schizophrenia)',
            'Severe Major Depressive Episode with suicidal intent',
            'Acute PTSD breakdown'
        ],
        behavioralSignals: [
            'Immediate danger to self or others',
            'Loss of touch with reality',
            'Unable to perform basic self-care'
        ],
        treatment: [
            'Emergency psychiatric services',
            'Immediate medical attention',
            'Crisis intervention',
            'Possible hospitalization'
        ]
    }
};

// Data validation ranges
export const DATA_RANGES = {
  STEPS: {
    MIN: 0,
    MAX: 25000,
    LOW_RISK: 7500,
    HIGH_RISK: 3000
  },
  HEART_RATE: {
    MIN: 40,
    MAX: 180,
    LOW_RISK: 60,
    HIGH_RISK: 100
  },
  SLEEP_HOURS: {
    MIN: 0,
    MAX: 24,
    LOW_RISK: 7,
    HIGH_RISK: 6
  },
  SCREEN_TIME: {
    MIN: 0,
    MAX: 1440, // 24 hours in minutes
    LOW_RISK: 240, // 4 hours
    HIGH_RISK: 480 // 8 hours
  },
  SOCIAL_INTERACTION: {
    MIN: 0,
    MAX: 1000,
    LOW_RISK: 60,
    HIGH_RISK: 20
  }
} as const;

// Feature importance weights for risk calculation
export const FEATURE_WEIGHTS = {
  steps: 0.25,
  sleep_hours: 0.25,
  heart_rate: 0.15,
  screen_time: 0.15,
  social_interaction: 0.20
} as const;

export interface SensorDataValidation {
  isValid: boolean;
  errors: string[];
}

export interface SensorMetadata {
  timestamp: string;
  userId: string;
  deviceType: string;
  dataQuality: number; // 0-1 score
  validationResult: SensorDataValidation;
}

export interface ProcessedFeatures {
  mobility_variance: number;
  social_interaction_score: number;
  sleep_regularity: number;
  activity_level: number;
  digital_wellbeing_score: number;
  circadian_rhythm_score: number;
  feature_importance: Record<string, number>;
  confidence_score: number;
}
