export * from './mentalHealth';
export * from './multimodal';

export interface SensorData {
  timestamp: string;
  screen_time_minutes: number;
  calls_count: number;
  sms_count: number;
  steps: number;
  sleep_hours: number;
  heart_rate: number;
  app_usage_social: number;
  app_usage_productivity: number;
  app_usage_entertainment: number;
  location_changes: number;
  mood_score: number;
}

export interface ProcessedFeatures {
  mobility_variance: number;
  social_interaction_score: number;
  sleep_regularity: number;
  activity_level: number;
  digital_wellbeing_score: number;
  circadian_rhythm_score: number;
}

export interface ModelPrediction {
  risk_level: 'low' | 'medium' | 'high';
  confidence: number;
  risk_score: number;
  contributing_factors: Array<{
    feature: string;
    importance: number;
    value: number;
  }>;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  auc_roc: number;
}