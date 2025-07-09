import { SensorData, ProcessedFeatures, ModelPrediction, ModelMetrics } from '../types';

export const generateMockSensorData = (days: number = 30): SensorData[] => {
  const data: SensorData[] = [];
  const baseDate = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);
    
    // Simulate declining patterns for demonstration
    const declineMultiplier = 1 - (i / days) * 0.3;
    
    data.push({
      timestamp: date.toISOString(),
      gps_latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
      gps_longitude: -74.0060 + (Math.random() - 0.5) * 0.1,
      screen_time_minutes: Math.floor(300 + Math.random() * 200 + (1 - declineMultiplier) * 100),
      calls_count: Math.floor(Math.random() * 10 * declineMultiplier),
      sms_count: Math.floor(Math.random() * 20 * declineMultiplier),
      steps: Math.floor(8000 * declineMultiplier + Math.random() * 2000),
      sleep_hours: 6 + Math.random() * 3 * declineMultiplier,
      heart_rate: Math.floor(70 + Math.random() * 20),
      app_usage_social: Math.floor(60 + Math.random() * 120 + (1 - declineMultiplier) * 60),
      app_usage_productivity: Math.floor(30 + Math.random() * 60 * declineMultiplier),
      battery_level: Math.floor(20 + Math.random() * 80),
    });
  }
  
  return data.reverse();
};

export const generateProcessedFeatures = (sensorData: SensorData[]): ProcessedFeatures[] => {
  return sensorData.map((data, index) => ({
    mobility_variance: Math.abs(data.gps_latitude - 40.7128) + Math.abs(data.gps_longitude + 74.0060),
    social_interaction_score: (data.calls_count + data.sms_count) / 30,
    sleep_regularity: 1 - Math.abs(data.sleep_hours - 8) / 8,
    activity_level: data.steps / 10000,
    digital_wellbeing_score: Math.max(0, 1 - data.screen_time_minutes / 600),
    circadian_rhythm_score: data.sleep_hours > 6 && data.sleep_hours < 9 ? 1 : 0.5,
  }));
};

export const generateModelPrediction = (features: ProcessedFeatures): ModelPrediction => {
  const riskFactors = [
    features.social_interaction_score < 0.3,
    features.sleep_regularity < 0.7,
    features.activity_level < 0.5,
    features.digital_wellbeing_score < 0.4,
  ];
  
  const riskCount = riskFactors.filter(Boolean).length;
  const risk_score = riskCount / 4;
  
  let risk_level: 'low' | 'medium' | 'high';
  if (risk_score < 0.3) risk_level = 'low';
  else if (risk_score < 0.7) risk_level = 'medium';
  else risk_level = 'high';
  
  return {
    risk_level,
    confidence: 0.85 + Math.random() * 0.1,
    risk_score,
    contributing_factors: [
      { feature: 'social_interaction', importance: 0.25, value: features.social_interaction_score },
      { feature: 'sleep_regularity', importance: 0.22, value: features.sleep_regularity },
      { feature: 'activity_level', importance: 0.20, value: features.activity_level },
      { feature: 'digital_wellbeing', importance: 0.18, value: features.digital_wellbeing_score },
      { feature: 'circadian_rhythm', importance: 0.15, value: features.circadian_rhythm_score },
    ],
  };
};

export const mockModelMetrics: ModelMetrics = {
  accuracy: 0.87,
  precision: 0.84,
  recall: 0.89,
  f1_score: 0.86,
  auc_roc: 0.91,
};