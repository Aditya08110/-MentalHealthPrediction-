import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Target, Settings } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { generateMockSensorData, generateProcessedFeatures } from '../utils/mockData';
import { SensorData, ProcessedFeatures } from '../types';

const FeatureEngineering: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [features, setFeatures] = useState<ProcessedFeatures[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<keyof ProcessedFeatures>('social_interaction_score');

  useEffect(() => {
    const rawData = generateMockSensorData(30);
    const processedFeatures = generateProcessedFeatures(rawData);
    setSensorData(rawData);
    setFeatures(processedFeatures);
  }, []);

  const featureDefinitions = [
    {
      id: 'mobility_variance' as keyof ProcessedFeatures,
      name: 'Mobility Variance',
      description: 'Measures changes in location patterns',
      icon: Target,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'social_interaction_score' as keyof ProcessedFeatures,
      name: 'Social Interaction Score',
      description: 'Quantifies social connectivity levels',
      icon: Zap,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      id: 'sleep_regularity' as keyof ProcessedFeatures,
      name: 'Sleep Regularity',
      description: 'Measures sleep pattern consistency',
      icon: Settings,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'activity_level' as keyof ProcessedFeatures,
      name: 'Activity Level',
      description: 'Physical activity and movement patterns',
      icon: Cpu,
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      id: 'digital_wellbeing_score' as keyof ProcessedFeatures,
      name: 'Digital Wellbeing',
      description: 'Healthy technology usage patterns',
      icon: Target,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'circadian_rhythm_score' as keyof ProcessedFeatures,
      name: 'Circadian Rhythm',
      description: 'Sleep-wake cycle regularity',
      icon: Zap,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50'
    },
  ];

  const chartData = features.map((feature, index) => ({
    day: index + 1,
    ...feature,
  }));

  const radarData = featureDefinitions.map(def => ({
    feature: def.name,
    value: features.length > 0 ? features[features.length - 1][def.id] : 0,
    fullMark: 1,
  }));

  const featureStats = features.length > 0 ? {
    mean: features.reduce((sum, f) => sum + f[selectedFeature], 0) / features.length,
    std: Math.sqrt(features.reduce((sum, f) => sum + Math.pow(f[selectedFeature] - features.reduce((s, feat) => s + feat[selectedFeature], 0) / features.length, 2), 0) / features.length),
    min: Math.min(...features.map(f => f[selectedFeature])),
    max: Math.max(...features.map(f => f[selectedFeature])),
  } : { mean: 0, std: 0, min: 0, max: 0 };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Feature Engineering</h2>
            <p className="text-gray-600 mt-1">Transform raw sensor data into meaningful predictors</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              {features.length} samples processed
            </div>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {featureDefinitions.map((feature) => {
            const Icon = feature.icon;
            const currentValue = features.length > 0 ? features[features.length - 1][feature.id] : 0;
            return (
              <div
                key={feature.id}
                onClick={() => setSelectedFeature(feature.id)}
                className={`${feature.bgColor} rounded-lg p-4 border border-gray-100 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedFeature === feature.id ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                  <span className={`text-lg font-bold ${feature.color}`}>
                    {(currentValue * 100).toFixed(0)}%
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{feature.name}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Trends</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.slice(-14)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey={selectedFeature} fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Profile</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="feature" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 1]} />
                  <Radar
                    name="Current Score"
                    dataKey="value"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Feature Statistics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Mean:</span>
              <span className="ml-2 font-medium">{featureStats.mean.toFixed(3)}</span>
            </div>
            <div>
              <span className="text-gray-600">Std Dev:</span>
              <span className="ml-2 font-medium">{featureStats.std.toFixed(3)}</span>
            </div>
            <div>
              <span className="text-gray-600">Min:</span>
              <span className="ml-2 font-medium">{featureStats.min.toFixed(3)}</span>
            </div>
            <div>
              <span className="text-gray-600">Max:</span>
              <span className="ml-2 font-medium">{featureStats.max.toFixed(3)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Engineering Pipeline</h3>
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-green-400 text-sm">
{`# feature_engineering.py
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from scipy.stats import entropy
from datetime import datetime, timedelta

class FeatureEngineer:
    def __init__(self):
        self.scaler = StandardScaler()
        self.feature_history = []
    
    def extract_behavioral_features(self, sensor_data: pd.DataFrame) -> pd.DataFrame:
        """Extract meaningful behavioral features from raw sensor data"""
        features = pd.DataFrame()
        
        # Social Interaction Features
        features['social_interaction_score'] = self.calculate_social_score(
            sensor_data['calls_count'], 
            sensor_data['sms_count']
        )
        
        # Mobility and Location Features
        features['mobility_variance'] = self.calculate_mobility_variance(
            sensor_data['gps_latitude'], 
            sensor_data['gps_longitude']
        )
        
        # Sleep Quality Features
        features['sleep_regularity'] = self.calculate_sleep_regularity(
            sensor_data['sleep_hours']
        )
        
        # Physical Activity Features
        features['activity_level'] = self.normalize_activity(
            sensor_data['steps']
        )
        
        # Digital Wellbeing Features
        features['digital_wellbeing_score'] = self.calculate_digital_wellbeing(
            sensor_data['screen_time_minutes'],
            sensor_data['app_usage_social'],
            sensor_data['app_usage_productivity']
        )
        
        # Circadian Rhythm Features
        features['circadian_rhythm_score'] = self.calculate_circadian_score(
            sensor_data['sleep_hours'],
            sensor_data['screen_time_minutes']
        )
        
        return features
    
    def calculate_social_score(self, calls: pd.Series, sms: pd.Series) -> pd.Series:
        """Calculate social interaction score based on communication patterns"""
        total_interactions = calls + sms
        
        # Normalize by rolling 7-day average
        rolling_avg = total_interactions.rolling(window=7, min_periods=1).mean()
        social_score = np.clip(total_interactions / (rolling_avg + 1), 0, 2)
        
        return MinMaxScaler().fit_transform(social_score.values.reshape(-1, 1)).flatten()
    
    def calculate_mobility_variance(self, lat: pd.Series, lon: pd.Series) -> pd.Series:
        """Calculate mobility variance using GPS coordinates"""
        # Calculate distance from home base (first location)
        home_lat, home_lon = lat.iloc[0], lon.iloc[0]
        
        distances = np.sqrt((lat - home_lat)**2 + (lon - home_lon)**2)
        
        # Rolling variance over 7-day window
        mobility_var = distances.rolling(window=7, min_periods=1).var()
        
        return MinMaxScaler().fit_transform(mobility_var.values.reshape(-1, 1)).flatten()
    
    def calculate_sleep_regularity(self, sleep_hours: pd.Series) -> pd.Series:
        """Calculate sleep regularity score"""
        # Optimal sleep range: 7-9 hours
        optimal_sleep = 8
        sleep_deviation = np.abs(sleep_hours - optimal_sleep)
        
        # Convert deviation to regularity score (lower deviation = higher regularity)
        regularity_score = np.exp(-sleep_deviation / 2)
        
        return regularity_score
    
    def temporal_features(self, timestamps: pd.Series) -> pd.DataFrame:
        """Extract temporal patterns from timestamps"""
        dt_series = pd.to_datetime(timestamps)
        
        temporal_features = pd.DataFrame()
        temporal_features['hour_of_day'] = dt_series.dt.hour
        temporal_features['day_of_week'] = dt_series.dt.dayofweek
        temporal_features['is_weekend'] = (dt_series.dt.dayofweek >= 5).astype(int)
        
        # Circadian rhythm features
        temporal_features['morning_activity'] = ((dt_series.dt.hour >= 6) & 
                                               (dt_series.dt.hour <= 10)).astype(int)
        temporal_features['evening_activity'] = ((dt_series.dt.hour >= 18) & 
                                                (dt_series.dt.hour <= 22)).astype(int)
        
        return temporal_features`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default FeatureEngineering;