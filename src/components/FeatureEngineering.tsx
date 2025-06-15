import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Target, Settings } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateMockSensorData, generateProcessedFeatures } from '../utils/mockData';
import { SensorData, ProcessedFeatures } from '../types';

const FeatureEngineering: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [features, setFeatures] = useState<ProcessedFeatures[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<keyof ProcessedFeatures>('social_interaction_score');

  useEffect(() => {
    // Generate initial data when component mounts
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
    }
  ];

  const featureTimeline = features.map((feature, index) => ({
    day: index + 1,
    ...feature
  }));

  const currentFeatureStats = features.length > 0 ? {
    mean: features.reduce((sum, f) => sum + f[selectedFeature], 0) / features.length,
    min: Math.min(...features.map(f => f[selectedFeature])),
    max: Math.max(...features.map(f => f[selectedFeature])),
    variance: features.reduce((sum, f) => sum + Math.pow(f[selectedFeature] - features.reduce((s, ft) => s + ft[selectedFeature], 0) / features.length, 2), 0) / features.length
  } : null;

  const featureCorrelations = [
    { feature1: 'Mobility', feature2: 'Social', correlation: 0.75 },
    { feature1: 'Sleep', feature2: 'Activity', correlation: 0.62 },
    { feature1: 'Social', feature2: 'Activity', correlation: 0.58 },
    { feature1: 'Mobility', feature2: 'Sleep', correlation: 0.45 }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Feature Engineering</h2>
            <p className="text-gray-600 mt-1">Transform raw sensor data into meaningful features</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {featureDefinitions.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => setSelectedFeature(feature.id)}
                className={`p-4 rounded-lg border transition-all ${selectedFeature === feature.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${feature.bgColor}`}>
                    <Icon className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900">{feature.name}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {feature.description}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Timeline</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={featureTimeline} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="day"
                    stroke="#374151"
                    label={{
                      value: "Day",
                      position: "bottom",
                      offset: -10,
                      style: { textAnchor: 'middle', fill: '#374151', fontSize: '12px' }
                    }}
                  />
                  <YAxis
                    stroke="#374151"
                    label={{
                      value: "Feature Value",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: 'middle', fill: '#374151', fontSize: '12px' }
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={selectedFeature}
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            {currentFeatureStats && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4">Feature Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Mean</p>
                    <p className="text-lg font-medium text-gray-900">
                      {currentFeatureStats.mean.toFixed(3)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Variance</p>
                    <p className="text-lg font-medium text-gray-900">
                      {currentFeatureStats.variance.toFixed(3)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Min</p>
                    <p className="text-lg font-medium text-gray-900">
                      {currentFeatureStats.min.toFixed(3)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Max</p>
                    <p className="text-lg font-medium text-gray-900">
                      {currentFeatureStats.max.toFixed(3)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Feature Correlations</h4>
              <div className="space-y-3">
                {featureCorrelations.map((correlation, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg border">
                    <span className="text-sm text-gray-900">
                      {correlation.feature1} × {correlation.feature2}
                    </span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${correlation.correlation * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {(correlation.correlation * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureEngineering;