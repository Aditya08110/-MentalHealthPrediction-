import React, { useState, useEffect } from 'react';
import { Brain, Zap, Target, TrendingUp, Play, Pause } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrainingData {
  epoch: number;
  loss: number;
  accuracy: number;
}

const ModelTraining: React.FC = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [selectedModel, setSelectedModel] = useState<'random_forest' | 'svm' | 'neural_network' | 'xgboost'>('random_forest');
  const [trainingHistory, setTrainingHistory] = useState<TrainingData[]>([]);

  const models = [
    {
      id: 'random_forest' as const,
      name: 'Random Forest',
      description: 'Ensemble method with interpretable features',
      accuracy: 0.87,
      icon: Target,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      id: 'svm' as const,
      name: 'Support Vector Machine',
      description: 'High-dimensional classification',
      accuracy: 0.82,
      icon: Zap,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'neural_network' as const,
      name: 'Neural Network',
      description: 'Deep learning approach',
      accuracy: 0.89,
      icon: Brain,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'xgboost' as const,
      name: 'XGBoost',
      description: 'Gradient boosting classifier',
      accuracy: 0.91,
      icon: TrendingUp,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
  ];

  const initialTrainingHistory: TrainingData[] = [
    { epoch: 1, loss: 0.42, accuracy: 0.78 },
    { epoch: 2, loss: 0.38, accuracy: 0.82 },
    { epoch: 3, loss: 0.35, accuracy: 0.85 },
    { epoch: 4, loss: 0.32, accuracy: 0.87 },
    { epoch: 5, loss: 0.30, accuracy: 0.89 },
    { epoch: 6, loss: 0.28, accuracy: 0.90 },
  ];

  useEffect(() => {
    if (isTraining) {
      // Reset training history when starting new training
      setTrainingHistory([]);
      
      const interval = setInterval(() => {
        setTrainingProgress((prev) => {
          if (prev >= 100) {
            setIsTraining(false);
            clearInterval(interval);
            return 100;
          }
          return prev + 2; // Increase by 2% each time for smoother progress
        });

        setCurrentEpoch((prev) => {
          const newEpoch = prev + 0.2;
          if (newEpoch >= 10) {
            return 10;
          }
          // Add new training data point
          if (Number.isInteger(newEpoch)) {
            const epochData = {
              epoch: newEpoch,
              loss: 0.42 * Math.exp(-newEpoch * 0.2) + 0.1 * Math.random(),
              accuracy: 0.78 + (1 - Math.exp(-newEpoch * 0.2)) * 0.15 + 0.02 * Math.random()
            };
            setTrainingHistory(history => [...history, epochData]);
          }
          return newEpoch;
        });
      }, 200); // Update more frequently for smoother animation

      return () => clearInterval(interval);
    }
  }, [isTraining]);

  const toggleTraining = () => {
    if (!isTraining) {
      setTrainingProgress(0);
      setCurrentEpoch(0);
      setTrainingHistory([]);
    }
    setIsTraining(prev => !prev);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Model Training</h2>
            <p className="text-gray-600 mt-1">Train and optimize model performance</p>
          </div>
          <button
            onClick={toggleTraining}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isTraining
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            <div className="flex items-center">
              {isTraining ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Stop Training
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Training
                </>
              )}
            </div>
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {models.map((model) => {
            const Icon = model.icon;
            return (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`p-4 rounded-lg border transition-all ${
                  selectedModel === model.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${model.bgColor}`}>
                    <Icon className={`w-5 h-5 ${model.color}`} />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900">{model.name}</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">
                      {(model.accuracy * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">{model.description}</p>
              </button>
            );
          })}
        </div>

        {isTraining && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-blue-900">Training Progress</p>
              <p className="text-sm font-medium text-blue-900">{trainingProgress.toFixed(1)}%</p>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-200"
                style={{ width: `${trainingProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-blue-800 mt-2">
              Current Epoch: {currentEpoch.toFixed(1)}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Training History</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={trainingHistory.length > 0 ? trainingHistory : initialTrainingHistory}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="epoch"
                    stroke="#374151"
                    label={{
                      value: "Epoch",
                      position: "bottom",
                      offset: -10,
                      style: { textAnchor: 'middle', fill: '#374151', fontSize: '12px' }
                    }}
                  />
                  <YAxis
                    stroke="#374151"
                    label={{
                      value: "Metrics",
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
                    formatter={(value: number) => value.toFixed(3)}
                  />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    name="Accuracy"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="loss"
                    name="Loss"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: '#ef4444', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Model Settings</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Learning Rate</p>
                  <p className="text-lg font-medium text-gray-900">0.001</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Batch Size</p>
                  <p className="text-lg font-medium text-gray-900">32</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Epochs</p>
                  <p className="text-lg font-medium text-gray-900">10</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Optimizer</p>
                  <p className="text-lg font-medium text-gray-900">Adam</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Training Stats</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Best Accuracy</p>
                  <p className="text-lg font-medium text-green-600">
                    {Math.max(...(trainingHistory.length > 0 ? trainingHistory : initialTrainingHistory).map(d => d.accuracy * 100)).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Loss</p>
                  <p className="text-lg font-medium text-gray-900">
                    {(trainingHistory.length > 0 ? trainingHistory : initialTrainingHistory).slice(-1)[0].loss.toFixed(3)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Training Time</p>
                  <p className="text-lg font-medium text-gray-900">
                    {Math.floor(trainingProgress / 10)}m {(trainingProgress % 10 * 6).toFixed(0)}s
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dataset Size</p>
                  <p className="text-lg font-medium text-gray-900">10,240</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelTraining;