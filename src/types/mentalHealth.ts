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
