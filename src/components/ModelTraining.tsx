import React, { useState } from 'react';
import { Brain, Zap, Target, TrendingUp, Play, Pause, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from '../context/DataContext';

type ModelType = 'random_forest' | 'svm' | 'neural_network' | 'xgboost';

const ModelTraining: React.FC = () => {
  console.log('ModelTraining component rendering');
  const { sensorData } = useData();
  console.log('Sensor data:', sensorData);
  
  const [isTraining, setIsTraining] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelType>('random_forest');
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingHistory, setTrainingHistory] = useState<Array<{ epoch: number; loss: number; accuracy: number }>>([]);

  const models: Array<{
    id: ModelType;
    name: string;
    description: string;
    accuracy: number;
    icon: React.ComponentType<any>;
  }> = [
    {
      id: 'random_forest',
      name: 'Random Forest',
      description: 'Ensemble method with interpretable features',
      accuracy: 0.87,
      icon: Target
    },
    {
      id: 'neural_network',
      name: 'Neural Network',
      description: 'Deep learning approach',
      accuracy: 0.89,
      icon: Brain
    },
    {
      id: 'svm',
      name: 'Support Vector Machine',
      description: 'High-dimensional classification',
      accuracy: 0.82,
      icon: Zap
    },
    {
      id: 'xgboost',
      name: 'XGBoost',
      description: 'Gradient boosting classifier',
      accuracy: 0.91,
      icon: TrendingUp
    }
  ];

  const startTraining = () => {
    console.log('Starting training...');
    setIsTraining(true);
    setTrainingProgress(0);
    setTrainingHistory([]);

    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        const next = prev + 2;
        if (next >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          return 100;
        }
        return next;
      });

      setTrainingHistory(prev => {
        const epoch = prev.length + 1;
        return [...prev, {
          epoch,
          loss: 0.5 * Math.exp(-epoch / 20) + 0.1 * Math.random(),
          accuracy: 0.8 + 0.15 * (1 - Math.exp(-epoch / 15)) + 0.02 * Math.random()
        }];
      });
    }, 200);
  };

  // Basic error boundary
  if (!sensorData) {
    console.log('No sensor data available');
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Data Available</h2>
            <p className="text-gray-600">
              Please collect some data first using the Data Collection page.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
            onClick={!isTraining ? startTraining : () => setIsTraining(false)}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              isTraining ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
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

        {/* Model Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {models.map(model => {
            const Icon = model.icon;
            return (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`p-4 rounded-lg border ${
                  selectedModel === model.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } transition-all`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-6 h-6" />
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900">{model.name}</h3>
                    <p className="text-sm text-gray-500">{model.description}</p>
                  </div>
                  <span className="font-mono text-blue-600">
                    {(model.accuracy * 100).toFixed(1)}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Training Progress */}
        {isTraining && (
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Training Progress</span>
                <span className="text-sm font-medium text-gray-700">{trainingProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${trainingProgress}%` }}
                />
              </div>
            </div>

            {/* Training Metrics Chart */}
            {trainingHistory.length > 0 && (
              <div className="h-80 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trainingHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="epoch" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="loss" stroke="#ef4444" name="Loss" strokeWidth={2} />
                    <Line type="monotone" dataKey="accuracy" stroke="#10b981" name="Accuracy" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelTraining;