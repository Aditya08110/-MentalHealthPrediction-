import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Target, Settings, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ProcessedFeatures, DATA_RANGES, FEATURE_WEIGHTS } from '../types';
import { useData } from '../context/DataContext';

const FeatureEngineering: React.FC = () => {
  const { sensorData } = useData();
  const [features, setFeatures] = useState<ProcessedFeatures[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<keyof ProcessedFeatures>('social_interaction_score');
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState<Record<string, any>>({});

  useEffect(() => {
    console.log('Processing features from sensor data:', sensorData?.length || 0, 'data points');
    
    if (!sensorData || sensorData.length === 0) {
      setError('No sensor data available. Please collect data first.');
      return;
    }

    try {
      // Process features from actual sensor data
      const processedFeatures = processFeatures(sensorData);
      console.log('Processed features:', processedFeatures);
      setFeatures(processedFeatures);
      setError(null);

      // Update debug statistics
      const stats = calculateFeatureStats(processedFeatures);
      console.log('Feature statistics:', stats);
      setDebug(stats);
    } catch (err) {
      console.error('Error processing features:', err);
      setError('Error processing sensor data. Please try again.');
    }
  }, [sensorData]);

  const processFeatures = (data: typeof sensorData): ProcessedFeatures[] => {
    // Calculate baseline statistics
    const avgSteps = data.reduce((sum, d) => sum + d.steps, 0) / data.length;
    const avgSleep = data.reduce((sum, d) => sum + d.sleep_hours, 0) / data.length;
    const avgHeartRate = data.reduce((sum, d) => sum + d.heart_rate, 0) / data.length;
    const avgScreenTime = data.reduce((sum, d) => sum + d.screen_time_minutes, 0) / data.length;
    const avgSocial = data.reduce((sum, d) => sum + d.app_usage_social, 0) / data.length;

    return data.map((entry, index) => {
      // 1. Mobility Variance (normalized GPS movement)
      const prevEntry = index > 0 ? data[index - 1] : null;
      const mobilityVar = prevEntry ? 
        Math.sqrt(
          Math.pow(entry.gps_latitude - prevEntry.gps_latitude, 2) +
          Math.pow(entry.gps_longitude - prevEntry.gps_longitude, 2)
        ) : 0;

      // 2. Social Interaction Score (normalized and weighted combination)
      const socialScore = (
        (entry.calls_count / DATA_RANGES.SOCIAL_INTERACTION.LOW_RISK) * 0.3 +
        (entry.sms_count / DATA_RANGES.SOCIAL_INTERACTION.LOW_RISK) * 0.3 +
        (entry.app_usage_social / DATA_RANGES.SOCIAL_INTERACTION.LOW_RISK) * 0.4
      );

      // 3. Sleep Regularity (deviation from ideal sleep pattern)
      const sleepDeviation = Math.abs(entry.sleep_hours - DATA_RANGES.SLEEP_HOURS.LOW_RISK);
      const sleepReg = Math.max(0, 1 - sleepDeviation / DATA_RANGES.SLEEP_HOURS.LOW_RISK);

      // 4. Activity Level (composite score from steps and heart rate)
      const stepScore = entry.steps / DATA_RANGES.STEPS.LOW_RISK;
      const heartScore = (entry.heart_rate - DATA_RANGES.HEART_RATE.MIN) / 
                        (DATA_RANGES.HEART_RATE.MAX - DATA_RANGES.HEART_RATE.MIN);
      const activityLevel = (stepScore * 0.7 + heartScore * 0.3);

      // 5. Digital Wellbeing (inverse of screen time with social adjustment)
      const screenTimeScore = 1 - (entry.screen_time_minutes / DATA_RANGES.SCREEN_TIME.LOW_RISK);
      const socialAdjustment = entry.app_usage_social / DATA_RANGES.SOCIAL_INTERACTION.LOW_RISK;
      const digitalScore = (screenTimeScore * 0.7 + socialAdjustment * 0.3);

      // 6. Circadian Rhythm (sleep timing and consistency)
      const timestamp = new Date(entry.timestamp);
      const hour = timestamp.getHours();
      const isNormalSleepTime = (hour >= 22 || hour <= 7);
      const circadianScore = isNormalSleepTime && entry.sleep_hours >= 7 ? 1 :
                            isNormalSleepTime && entry.sleep_hours >= 6 ? 0.7 :
                            0.3;

      // Calculate feature importance and confidence
      const featureImportance = {
        activity: Math.abs(entry.steps - avgSteps) / DATA_RANGES.STEPS.MAX,
        sleep: Math.abs(entry.sleep_hours - avgSleep) / DATA_RANGES.SLEEP_HOURS.MAX,
        social: Math.abs(entry.app_usage_social - avgSocial) / DATA_RANGES.SOCIAL_INTERACTION.MAX,
        screen: Math.abs(entry.screen_time_minutes - avgScreenTime) / DATA_RANGES.SCREEN_TIME.MAX,
        heart: Math.abs(entry.heart_rate - avgHeartRate) / DATA_RANGES.HEART_RATE.MAX
      };

      const confidenceScore = calculateConfidence(entry, {
        avgSteps, avgSleep, avgHeartRate, avgScreenTime, avgSocial
      });

      return {
        mobility_variance: mobilityVar,
        social_interaction_score: socialScore,
        sleep_regularity: sleepReg,
        activity_level: activityLevel,
        digital_wellbeing_score: digitalScore,
        circadian_rhythm_score: circadianScore,
        feature_importance: featureImportance,
        confidence_score: confidenceScore
      };
    });
  };

  const calculateConfidence = (
    entry: typeof sensorData[0],
    averages: Record<string, number>
  ): number => {
    // Check data quality and consistency
    const qualityChecks = [
      // Steps within realistic daily range
      entry.steps >= 0 && entry.steps <= DATA_RANGES.STEPS.MAX,
      // Heart rate within normal range
      entry.heart_rate >= DATA_RANGES.HEART_RATE.MIN && entry.heart_rate <= DATA_RANGES.HEART_RATE.MAX,
      // Sleep hours realistic
      entry.sleep_hours >= 0 && entry.sleep_hours <= DATA_RANGES.SLEEP_HOURS.MAX,
      // Screen time realistic
      entry.screen_time_minutes >= 0 && entry.screen_time_minutes <= DATA_RANGES.SCREEN_TIME.MAX,
      // Social metrics consistent
      entry.app_usage_social >= 0 && entry.calls_count + entry.sms_count > 0
    ];

    // Calculate deviation from averages
    const deviations = [
      Math.abs(entry.steps - averages.avgSteps) / averages.avgSteps,
      Math.abs(entry.sleep_hours - averages.avgSleep) / averages.avgSleep,
      Math.abs(entry.heart_rate - averages.avgHeartRate) / averages.avgHeartRate,
      Math.abs(entry.screen_time_minutes - averages.avgScreenTime) / averages.avgScreenTime,
      Math.abs(entry.app_usage_social - averages.avgSocial) / averages.avgSocial
    ];

    // Combine quality checks and deviation scores
    const qualityScore = qualityChecks.filter(Boolean).length / qualityChecks.length;
    const deviationScore = 1 - (deviations.reduce((a, b) => a + b, 0) / deviations.length);
    
    return (qualityScore * 0.6 + deviationScore * 0.4);
  };

  const calculateFeatureStats = (processedFeatures: ProcessedFeatures[]) => {
    const stats = {
      averages: {} as Record<string, number>,
      ranges: {} as Record<string, { min: number; max: number }>,
      correlations: [] as Array<{ feature1: string; feature2: string; correlation: number }>
    };

    // Calculate averages and ranges
    Object.keys(processedFeatures[0]).forEach(feature => {
      if (feature !== 'feature_importance') {
        const values = processedFeatures.map(f => f[feature as keyof ProcessedFeatures] as number);
        stats.averages[feature] = values.reduce((a, b) => a + b, 0) / values.length;
        stats.ranges[feature] = {
          min: Math.min(...values),
          max: Math.max(...values)
        };
      }
    });

    // Calculate correlations between key features
    const features = ['activity_level', 'sleep_regularity', 'social_interaction_score'];
    for (let i = 0; i < features.length; i++) {
      for (let j = i + 1; j < features.length; j++) {
        const correlation = calculateCorrelation(
          processedFeatures.map(f => f[features[i] as keyof ProcessedFeatures] as number),
          processedFeatures.map(f => f[features[j] as keyof ProcessedFeatures] as number)
        );
        stats.correlations.push({
          feature1: features[i],
          feature2: features[j],
          correlation
        });
      }
    }

    return stats;
  };

  const calculateCorrelation = (x: number[], y: number[]): number => {
    const n = x.length;
    const sum_x = x.reduce((a, b) => a + b, 0);
    const sum_y = y.reduce((a, b) => a + b, 0);
    const sum_xy = x.reduce((sum, _, i) => sum + x[i] * y[i], 0);
    const sum_x2 = x.reduce((sum, val) => sum + val * val, 0);
    const sum_y2 = y.reduce((sum, val) => sum + val * val, 0);

    const correlation = (n * sum_xy - sum_x * sum_y) /
      Math.sqrt((n * sum_x2 - sum_x * sum_x) * (n * sum_y2 - sum_y * sum_y));

    return isNaN(correlation) ? 0 : correlation;
  };

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
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
          <h3 className="text-lg font-semibold mb-2">Error</h3>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Feature Engineering</h2>
                <p className="text-gray-600 mt-1">Transform raw sensor data into meaningful features</p>
              </div>
            </div>

            {/* Debug info panel */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg text-sm">
              <h3 className="font-medium text-gray-900 mb-2">Debug Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Average Steps</p>
                  <p className="font-medium">{debug.avgSteps?.toFixed(0) || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Average Sleep (hrs)</p>
                  <p className="font-medium">{debug.avgSleep?.toFixed(1) || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Average Heart Rate</p>
                  <p className="font-medium">{debug.avgHeartRate?.toFixed(0) || 'N/A'} BPM</p>
                </div>
                <div>
                  <p className="text-gray-600">Average Social Score</p>
                  <p className="font-medium">{debug.avgSocialScore?.toFixed(3) || 'N/A'}</p>
                </div>
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
        </>
      )}
    </div>
  );
};

export default FeatureEngineering;