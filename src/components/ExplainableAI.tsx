import React, { useState, useEffect } from 'react';
import { Eye, Brain, Target, Info, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from '../context/DataContext';

interface ExplanationData {
  feature: string;
  shap_value: number;
  feature_value: number;
}

interface FeatureInteraction {
  feature1: string;
  feature2: string;
  interaction_strength: number;
  effect: 'positive' | 'negative';
}

interface GlobalFeature {
  feature: string;
  importance: number;
  description: string;
}

const ExplainableAI: React.FC = () => {
  console.log('ExplainableAI component rendering');
  const { sensorData } = useData();
  const [shapValues, setShapValues] = useState<ExplanationData[]>([]);
  const [explanationType, setExplanationType] = useState<'local' | 'global'>('local');

  console.log('Sensor data received:', sensorData);

  useEffect(() => {
    console.log('ExplainableAI useEffect running with sensorData:', sensorData);
    if (!sensorData || sensorData.length === 0) {
      console.log('No sensor data available');
      return;
    }

    // Generate SHAP values based on actual sensor data
    const latestData = sensorData[sensorData.length - 1];
    console.log('Latest sensor data:', latestData);

    const mockShapValues = [
      {
        feature: 'social_interaction',
        shap_value: calculateShapValue(latestData.calls_count + latestData.sms_count, 10),
        feature_value: (latestData.calls_count + latestData.sms_count) / 10
      },
      {
        feature: 'sleep_regularity',
        shap_value: calculateShapValue(latestData.sleep_hours, 8),
        feature_value: latestData.sleep_hours / 8
      },
      {
        feature: 'activity_level',
        shap_value: calculateShapValue(latestData.steps, 10000),
        feature_value: latestData.steps / 10000
      },
      {
        feature: 'digital_wellbeing',
        shap_value: -calculateShapValue(latestData.screen_time_minutes, 480),
        feature_value: latestData.screen_time_minutes / 480
      },
      {
        feature: 'circadian_rhythm',
        shap_value: calculateShapValue(latestData.sleep_hours, 8) * 0.8,
        feature_value: latestData.sleep_hours / 8
      },
    ];
    console.log('Generated SHAP values:', mockShapValues);
    setShapValues(mockShapValues);
  }, [sensorData]);

  const calculateShapValue = (value: number, reference: number): number => {
    const normalized = value / reference;
    return ((normalized - 0.5) * 0.3);
  };

  // Show loading state if no data is available
  if (!sensorData || sensorData.length === 0) {
    console.log('Rendering no data state');
    return (
      <div className="min-h-screen p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <Brain className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Data Available</h2>
            <p className="text-gray-600 mb-4">
              Please collect some data using the Data Collection page before viewing AI explanations.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const globalFeatureImportance: GlobalFeature[] = [
    { feature: 'Social Interaction', importance: 0.25, description: 'Communication patterns and social connectivity' },
    { feature: 'Sleep Regularity', importance: 0.22, description: 'Sleep quality and consistency patterns' },
    { feature: 'Activity Level', importance: 0.20, description: 'Physical activity and movement behavior' },
    { feature: 'Digital Wellbeing', importance: 0.18, description: 'Screen time and technology usage patterns' },
    { feature: 'Circadian Rhythm', importance: 0.15, description: 'Sleep-wake cycle alignment' },
  ];

  const featureInteractions: FeatureInteraction[] = [
    { feature1: 'Sleep', feature2: 'Activity', interaction_strength: 0.45, effect: 'positive' },
    { feature1: 'Social', feature2: 'Digital', interaction_strength: 0.38, effect: 'negative' },
    { feature1: 'Sleep', feature2: 'Social', interaction_strength: 0.32, effect: 'positive' },
    { feature1: 'Activity', feature2: 'Circadian', interaction_strength: 0.28, effect: 'positive' },
  ];

  console.log('Rendering charts with explanationType:', explanationType);
  console.log('SHAP values for charts:', shapValues);

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Explainable AI</h2>
            <p className="text-gray-600 mt-1">Understanding model decisions and feature impacts</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setExplanationType('local')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${explanationType === 'local'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Local Explanation
            </button>
            <button
              onClick={() => setExplanationType('global')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${explanationType === 'global'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Global Explanation
            </button>
          </div>
        </div>

        {explanationType === 'local' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-blue-500" />
                SHAP Values (Individual Prediction)
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={shapValues} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="feature"
                      angle={-30}
                      textAnchor="end"
                      interval={0}
                      height={70}
                      tick={{ fontSize: 16, fill: '#1e293b', fontWeight: 600 }}
                    />
                    <YAxis label={{ value: 'SHAP Value', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar
                      dataKey="shap_value"
                      fill="#3b82f6"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-500" />
                Feature Values
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={shapValues} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="feature"
                      angle={-30}
                      textAnchor="end"
                      interval={0}
                      height={70}
                      tick={{ fontSize: 16, fill: '#1e293b', fontWeight: 600 }}
                    />
                    <YAxis label={{ value: 'Feature Value', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="feature_value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-500" />
                Global Feature Importance
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={globalFeatureImportance} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="feature"
                      angle={-30}
                      textAnchor="end"
                      interval={0}
                      height={70}
                      tick={{ fontSize: 16, fill: '#1e293b', fontWeight: 600 }}
                    />
                    <YAxis label={{ value: 'Importance', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="importance" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                Feature Interactions
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={featureInteractions} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="feature1"
                      angle={-30}
                      textAnchor="end"
                      interval={0}
                      height={70}
                      tick={{ fontSize: 16, fill: '#1e293b', fontWeight: 600 }}
                    />
                    <YAxis label={{ value: 'Interaction Strength', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar
                      dataKey="interaction_strength"
                      fill="#10b981"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplainableAI;