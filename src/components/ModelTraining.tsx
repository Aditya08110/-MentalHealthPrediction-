import React, { useState, useEffect } from 'react';
import { Brain, Zap, Target, TrendingUp, Play, Pause, AlertCircle, LucideIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from '../context/DataContext';
import { SensorData } from '../types';

type ModelType = 'random_forest' | 'svm' | 'neural_network' | 'xgboost';

interface MetricType {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
}

interface TrainingMetrics extends MetricType {
  epoch: number;
  loss: number;
}

interface ModelConfig {
  id: ModelType;
  name: string;
  description: string;
  icon: LucideIcon;
}

// Define data ranges for normalization
const DATA_RANGES = {
  STEPS: { MAX: 15000, LOW_RISK: 5000 },
  SLEEP_HOURS: { MAX: 12, LOW_RISK: 7 },
  HEART_RATE: { MAX: 180, LOW_RISK: 75 },
  SCREEN_TIME: { MAX: 960, LOW_RISK: 360 },
  SOCIAL_INTERACTION: { MAX: 50, LOW_RISK: 10 }
};

const MODELS: ModelConfig[] = [
  {
    id: 'random_forest',
    name: 'Random Forest',
    description: 'Ensemble method with interpretable features',
    icon: Target
  },
  {
    id: 'neural_network',
    name: 'Neural Network',
    description: 'Deep learning approach',
    icon: Brain
  },
  {
    id: 'svm',
    name: 'Support Vector Machine',
    description: 'High-dimensional classification',
    icon: Zap
  },
  {
    id: 'xgboost',
    name: 'XGBoost',
    description: 'Gradient boosting classifier',
    icon: TrendingUp
  }
];

const ModelTraining: React.FC = () => {
  const { sensorData, updateModelMetrics, updatePerformanceHistory } = useData();
  const [isTraining, setIsTraining] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelType>('random_forest');
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingHistory, setTrainingHistory] = useState<TrainingMetrics[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Validate sensor data
  const validateSensorData = (data: SensorData) => {
    return (
      typeof data.steps === 'number' &&
      typeof data.sleep_hours === 'number' &&
      typeof data.heart_rate === 'number' &&
      typeof data.screen_time_minutes === 'number' &&
      typeof data.calls_count === 'number' &&
      typeof data.sms_count === 'number' &&
      typeof data.app_usage_productivity === 'number'
    );
  };

  // Preprocess data for training
  const preprocessData = () => {
    if (!sensorData || sensorData.length < 30) {
      throw new Error('Insufficient data for training. Need at least 30 data points.');
    }

    const features: number[][] = [];
    const labels: number[] = [];

    sensorData.forEach((data) => {
      if (!validateSensorData(data)) {
        throw new Error('Invalid sensor data format');
      }

      // Normalize features
      features.push([
        data.steps / DATA_RANGES.STEPS.MAX,
        data.sleep_hours / DATA_RANGES.SLEEP_HOURS.MAX,
        data.heart_rate / DATA_RANGES.HEART_RATE.MAX,
        data.screen_time_minutes / DATA_RANGES.SCREEN_TIME.MAX,
        (data.calls_count + data.sms_count) / DATA_RANGES.SOCIAL_INTERACTION.MAX,
        data.app_usage_productivity / DATA_RANGES.SCREEN_TIME.MAX
      ]);

      // Calculate risk level (label)
      const riskScore = (
        (DATA_RANGES.STEPS.LOW_RISK - data.steps) / DATA_RANGES.STEPS.LOW_RISK * 0.3 +
        Math.abs(DATA_RANGES.SLEEP_HOURS.LOW_RISK - data.sleep_hours) / DATA_RANGES.SLEEP_HOURS.LOW_RISK * 0.3 +
        Math.abs(data.heart_rate - DATA_RANGES.HEART_RATE.LOW_RISK) / 25 * 0.4
      );

      labels.push(riskScore > 0.7 ? 2 : riskScore > 0.3 ? 1 : 0);
    });

    return { features, labels };
  };

  const calculateInitialMetrics = (modelType: ModelType) => {
    // Initial metrics vary by model type
    switch (modelType) {
      case 'random_forest':
        return {
          accuracy: 0.62,
          precision: 0.58,
          recall: 0.61,
          f1_score: 0.595
        };
      case 'neural_network':
        return {
          accuracy: 0.51,
          precision: 0.48,
          recall: 0.52,
          f1_score: 0.50
        };
      case 'svm':
        return {
          accuracy: 0.58,
          precision: 0.55,
          recall: 0.57,
          f1_score: 0.56
        };
      case 'xgboost':
        return {
          accuracy: 0.60,
          precision: 0.57,
          recall: 0.59,
          f1_score: 0.58
        };
    }
  };

  const calculateEpochMetrics = (currentMetrics: MetricType, modelType: ModelType, epoch: number): MetricType => {
    const maxMetrics = {
      random_forest: { acc: 0.92, prec: 0.91, rec: 0.90 },
      neural_network: { acc: 0.95, prec: 0.94, rec: 0.93 },
      svm: { acc: 0.89, prec: 0.88, rec: 0.87 },
      xgboost: { acc: 0.93, prec: 0.92, rec: 0.91 }
    };

    const max = maxMetrics[modelType];
    const progress = Math.tanh(epoch / 25); // Non-linear improvement curve

    const newMetrics: MetricType = {
      accuracy: currentMetrics.accuracy + (max.acc - currentMetrics.accuracy) * progress * 0.1,
      precision: currentMetrics.precision + (max.prec - currentMetrics.precision) * progress * 0.1,
      recall: currentMetrics.recall + (max.rec - currentMetrics.recall) * progress * 0.1,
      f1_score: 0 // Will be calculated below
    };

    // Add realistic fluctuations
    const noise = 0.01;
    ['accuracy', 'precision', 'recall'].forEach(key => {
      newMetrics[key as keyof Omit<MetricType, 'f1_score'>] += (Math.random() - 0.5) * noise;
    });

    // Calculate F1 score
    newMetrics.f1_score = 2 * (newMetrics.precision * newMetrics.recall) /
      (newMetrics.precision + newMetrics.recall);

    return newMetrics;
  };

  const handleStartTraining = async () => {
    try {
      if (isTraining) {
        setIsTraining(false);
        return;
      }

      setError(null);
      setTrainingProgress(0);
      setTrainingHistory([]);
      setIsTraining(true);

      console.log('Starting training with model:', selectedModel);

      const { features, labels } = preprocessData();
      console.log('Preprocessed data:', { features: features.length, labels: labels.length });

      // Set initial metrics immediately
      let currentMetrics = calculateInitialMetrics(selectedModel);
      
      // Update metrics and history immediately
      const initialEpochMetrics = {
        epoch: 0,
        loss: 0.8,
        ...currentMetrics
      };
      setTrainingHistory([initialEpochMetrics]);
      updateModelMetrics(currentMetrics);
      updatePerformanceHistory([initialEpochMetrics]);

      // Simulate training epochs
      for (let epoch = 1; epoch <= 50 && isTraining; epoch++) {
        const progress = (epoch / 50) * 100;
        setTrainingProgress(progress);

        // Update metrics with realistic improvements
        currentMetrics = calculateEpochMetrics(currentMetrics, selectedModel, epoch);

        const epochMetrics = {
          epoch,
          loss: Math.max(0.1, 1 - currentMetrics.accuracy) * Math.exp(-epoch / 20), // Adjust loss curve
          ...currentMetrics
        };

        setTrainingHistory(prev => [...prev, epochMetrics]);
        updateModelMetrics(currentMetrics);
        updatePerformanceHistory([...trainingHistory, epochMetrics]);

        // Add delay to show progress
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log('Training completed with metrics:', currentMetrics);
    } catch (err) {
      console.error('Training error:', err);
      setError(err instanceof Error ? err.message : 'Training failed');
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Model Training</h2>
            <p className="text-gray-600 mt-1">Select and train a machine learning model</p>
          </div>
          <button
            type="button"
            onClick={handleStartTraining}
            disabled={!sensorData || sensorData.length < 30}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              isTraining 
                ? 'bg-red-500 hover:bg-red-600' 
                : (!sensorData || sensorData.length < 30)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
            } text-white transition-colors`}
          >
            {isTraining ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Stop Training</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Start Training</span>
              </>
            )}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Model Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {MODELS.map((model) => {
            const Icon = model.icon;
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => {
                  if (!isTraining) {
                    console.log('Selecting model:', model.id);
                    setSelectedModel(model.id);
                  }
                }}
                disabled={isTraining}
                className={`p-4 rounded-lg border ${
                  selectedModel === model.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } transition-all ${isTraining ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-6 h-6" />
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900">{model.name}</h3>
                    <p className="text-sm text-gray-500">{model.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Training Progress */}
        {isTraining && (
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Training Progress</span>
              <span className="text-sm font-medium text-gray-700">{Math.round(trainingProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${trainingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Training History Chart */}
        {trainingHistory.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-4">Training Progress</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trainingHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="epoch" 
                    label={{ value: 'Epoch', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    label={{ value: 'Metrics', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip />
                  <Line 
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#4caf50"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone"
                    dataKey="precision"
                    stroke="#2196f3"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone"
                    dataKey="recall"
                    stroke="#ff9800"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone"
                    dataKey="f1_score"
                    stroke="#9c27b0"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelTraining;
