import React, { useState, useEffect } from 'react';
import { Eye, Brain, Target, Info, TrendingUp, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface ExplanationData {
  feature: string;
  shap_value: number;
  feature_value: number;
}

const ExplainableAI: React.FC = () => {
  const [shapValues, setShapValues] = useState<ExplanationData[]>([]);
  const [explanationType, setExplanationType] = useState<'local' | 'global'>('local');

  useEffect(() => {
    // Generate mock SHAP values
    const mockShapValues = [
      { feature: 'social_interaction', shap_value: -0.15, feature_value: 0.3 },
      { feature: 'sleep_regularity', shap_value: -0.12, feature_value: 0.6 },
      { feature: 'activity_level', shap_value: -0.08, feature_value: 0.4 },
      { feature: 'digital_wellbeing', shap_value: 0.10, feature_value: 0.7 },
      { feature: 'circadian_rhythm', shap_value: -0.05, feature_value: 0.8 },
      { feature: 'mobility_variance', shap_value: 0.03, feature_value: 0.2 },
    ];
    setShapValues(mockShapValues);
  }, []);

  const globalFeatureImportance = [
    { feature: 'Social Interaction', importance: 0.25, description: 'Communication patterns and social connectivity' },
    { feature: 'Sleep Regularity', importance: 0.22, description: 'Sleep quality and consistency patterns' },
    { feature: 'Activity Level', importance: 0.20, description: 'Physical activity and movement behavior' },
    { feature: 'Digital Wellbeing', importance: 0.18, description: 'Screen time and technology usage patterns' },
    { feature: 'Circadian Rhythm', importance: 0.15, description: 'Sleep-wake cycle alignment' },
  ];

  const featureInteractions = [
    { feature1: 'Sleep', feature2: 'Activity', interaction_strength: 0.45, effect: 'positive' },
    { feature1: 'Social', feature2: 'Digital', interaction_strength: 0.38, effect: 'negative' },
    { feature1: 'Sleep', feature2: 'Social', interaction_strength: 0.32, effect: 'positive' },
    { feature1: 'Activity', feature2: 'Circadian', interaction_strength: 0.28, effect: 'positive' },
  ];

  const decisionPath = [
    { step: 1, condition: 'Social Interaction < 0.4', probability: 0.3, decision: 'Continue' },
    { step: 2, condition: 'Sleep Regularity < 0.6', probability: 0.5, decision: 'Continue' },
    { step: 3, condition: 'Activity Level < 0.5', probability: 0.7, decision: 'High Risk' },
  ];

  const shapWaterfallData = shapValues.map((item, index) => ({
    feature: item.feature.replace('_', ' '),
    cumulative: shapValues.slice(0, index + 1).reduce((sum, val) => sum + val.shap_value, 0.5),
    contribution: item.shap_value,
  }));

  const getContributionColor = (value: number): string => {
    return value > 0 ? '#ef4444' : '#10b981'; // Red for increasing risk, green for decreasing
  };

  return (
    <div className="space-y-6">
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
                      type="number"
                      stroke="#374151"
                      tickSize={8}
                      label={{ value: "SHAP Value", position: "bottom", offset: 0 }}
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis
                      dataKey="feature"
                      type="category"
                      width={120}
                      stroke="#374151"
                      tickFormatter={(value: string) => value.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value: any) => [value.toFixed(3), 'SHAP Value']}
                    />
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
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                Waterfall Chart
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={shapWaterfallData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="feature"
                      stroke="#374151"
                      angle={-35}
                      textAnchor="end"
                      height={60}
                      tick={{ fontSize: 12 }}
                      interval={0}
                      tickFormatter={(value: string) => value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    />
                    <YAxis
                      stroke="#374151"
                      tick={{ fontSize: 12 }}
                      label={{
                        value: "Cumulative Impact",
                        angle: -90,
                        position: "insideLeft",
                        style: { textAnchor: 'middle', fill: '#374151', fontSize: '12px' }
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="cumulative"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-500" />
                Global Feature Importance
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={globalFeatureImportance}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="feature"
                      stroke="#374151"
                      angle={-35}
                      textAnchor="end"
                      height={60}
                      tick={{ fontSize: 12 }}
                      interval={0}
                      label={{
                        value: "Feature",
                        position: "bottom",
                        offset: 40,
                        style: { textAnchor: 'middle', fill: '#374151', fontSize: '12px' }
                      }}
                    />
                    <YAxis
                      stroke="#374151"
                      tick={{ fontSize: 12 }}
                      label={{
                        value: "Importance Score",
                        angle: -90,
                        position: "insideLeft",
                        offset: -10,
                        style: { textAnchor: 'middle', fill: '#374151', fontSize: '12px' }
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Bar
                      dataKey="importance"
                      fill="#8b5cf6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-orange-500" />
                Feature Interactions
              </h3>
              <div className="space-y-3">
                {featureInteractions.map((interaction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${interaction.effect === 'positive' ? 'bg-green-400' : 'bg-red-400'
                        }`}></div>
                      <span className="text-sm font-medium text-gray-900">
                        {interaction.feature1} × {interaction.feature2}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${interaction.interaction_strength * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 w-8">
                        {(interaction.interaction_strength * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
              Decision Path
            </h3>
            <div className="space-y-3">
              {decisionPath.map((step, index) => (
                <div key={index} className="flex items-center p-3 bg-white rounded-lg border">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{step.condition}</p>
                    <p className="text-xs text-gray-600">Risk probability: {(step.probability * 100).toFixed(0)}%</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${step.decision === 'High Risk' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                    {step.decision}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-green-500" />
              Model Interpretation Guide
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">SHAP Values</h4>
                <p className="text-gray-700">
                  Positive values (red) increase risk prediction, negative values (green) decrease risk.
                  Larger absolute values indicate stronger influence.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Feature Importance</h4>
                <p className="text-gray-700">
                  Shows average contribution of each feature across all predictions.
                  Higher values indicate more influential features.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Interactions</h4>
                <p className="text-gray-700">
                  Measures how features work together. Positive interactions amplify effects,
                  negative interactions can counteract each other.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplainableAI;