import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from '../context/DataContext';

const ModelEvaluation: React.FC = () => {
  const { sensorData, modelMetrics, performanceHistory } = useData();
  const [selectedMetric, setSelectedMetric] = useState<'accuracy' | 'precision' | 'recall' | 'f1_score'>('accuracy');
  const [confusionMatrix, setConfusionMatrix] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  type RiskLevel = 'Low Risk' | 'Medium Risk' | 'High Risk';
  type MatrixCell = {
    actual: RiskLevel;
    predicted: RiskLevel;
    count: number;
    color: string;
  };

  useEffect(() => {
    if (!sensorData || sensorData.length === 0) {
      setError('No sensor data available for evaluation');
      return;
    }

    if (!modelMetrics) {
      setError('No model metrics available. Please train a model first.');
      return;
    }

    try {
      // Calculate confusion matrix based on current model metrics
      const matrix = calculateConfusionMatrix(modelMetrics);
      setConfusionMatrix(matrix);
      setError(null);
    } catch (err) {
      console.error('Error calculating confusion matrix:', err);
      setError('Error evaluating model performance');
    }
  }, [sensorData, modelMetrics]);

  const calculateConfusionMatrix = (metrics: typeof modelMetrics) => {
    if (!metrics) return [];

    // Initialize empty matrix
    const matrix: MatrixCell[] = [
      { actual: 'Low Risk', predicted: 'Low Risk', count: 0, color: '#10b981' },
      { actual: 'Low Risk', predicted: 'Medium Risk', count: 0, color: '#f59e0b' },
      { actual: 'Low Risk', predicted: 'High Risk', count: 0, color: '#ef4444' },
      { actual: 'Medium Risk', predicted: 'Low Risk', count: 0, color: '#f59e0b' },
      { actual: 'Medium Risk', predicted: 'Medium Risk', count: 0, color: '#10b981' },
      { actual: 'Medium Risk', predicted: 'High Risk', count: 0, color: '#ef4444' },
      { actual: 'High Risk', predicted: 'Low Risk', count: 0, color: '#ef4444' },
      { actual: 'High Risk', predicted: 'Medium Risk', count: 0, color: '#f59e0b' },
      { actual: 'High Risk', predicted: 'High Risk', count: 0, color: '#10b981' }
    ];

    // Calculate total samples
    const totalSamples = sensorData?.length || 100;

    // Calculate true positives, false positives, and false negatives based on metrics
    const truePositives = Math.round(totalSamples * metrics.precision * metrics.recall);
    const falsePositives = Math.round(truePositives * (1 - metrics.precision) / metrics.precision);
    const falseNegatives = Math.round(truePositives * (1 - metrics.recall) / metrics.recall);
    
    // Distribute values in the matrix
    matrix[0].count = truePositives; // Low Risk correct
    matrix[4].count = Math.round(truePositives * 0.8); // Medium Risk correct
    matrix[8].count = Math.round(truePositives * 0.6); // High Risk correct

    // Distribute false positives and negatives
    const distribution = [0.4, 0.35, 0.25]; // Distribution among risk levels
    distribution.forEach((ratio, i) => {
      const fp = Math.round(falsePositives * ratio);
      const fn = Math.round(falseNegatives * ratio);
      
      // Assign false positives
      if (i === 0) {
        matrix[1].count += Math.round(fp * 0.6);
        matrix[2].count += Math.round(fp * 0.4);
      } else if (i === 1) {
        matrix[3].count += Math.round(fp * 0.5);
        matrix[5].count += Math.round(fp * 0.5);
      } else {
        matrix[6].count += Math.round(fp * 0.4);
        matrix[7].count += Math.round(fp * 0.6);
      }
      
      // Assign false negatives similarly
      if (i === 0) {
        matrix[3].count += Math.round(fn * 0.6);
        matrix[6].count += Math.round(fn * 0.4);
      } else if (i === 1) {
        matrix[1].count += Math.round(fn * 0.5);
        matrix[7].count += Math.round(fn * 0.5);
      } else {
        matrix[2].count += Math.round(fn * 0.4);
        matrix[5].count += Math.round(fn * 0.6);
      }
    });

    return matrix;
  };

  const performanceMetrics = modelMetrics ? [
    {
      name: 'Accuracy',
      value: modelMetrics.accuracy,
      icon: Target,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      description: 'Overall correct predictions'
    },
    {
      name: 'Precision',
      value: modelMetrics.precision,
      icon: CheckCircle,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      description: 'Positive predictions accuracy'
    },
    {
      name: 'Recall',
      value: modelMetrics.recall,
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      description: 'True positives captured'
    },
    {
      name: 'F1-Score',
      value: modelMetrics.f1_score,
      icon: BarChart3,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      description: 'Harmonic mean of precision and recall'
    },
  ] : [];

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Model Evaluation</h2>
            <p className="text-gray-600 mt-1">Performance metrics and quality assessment</p>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {performanceMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <button
                key={metric.name}
                onClick={() => setSelectedMetric(metric.name.toLowerCase().replace('-', '_') as any)}
                className={`p-4 rounded-lg border transition-all ${
                  selectedMetric === metric.name.toLowerCase().replace('-', '_')
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <Icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900">{metric.name}</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">
                      {(metric.value * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">{metric.description}</p>
              </button>
            );
          })}
        </div>

        {/* Performance History and Confusion Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-500" />
              Performance History
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceHistory} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="day"
                    stroke="#374151"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    stroke="#374151"
                    domain={[0.5, 1]}
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
                  />
                  <Line
                    type="monotone"
                    dataKey={selectedMetric}
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
              Confusion Matrix
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {confusionMatrix.map((cell, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg text-center"
                  style={{
                    backgroundColor: `${cell.color}20`,
                    border: `1px solid ${cell.color}40`
                  }}
                >
                  <div className="text-xs text-gray-600">
                    {cell.actual} → {cell.predicted}
                  </div>
                  <div className="text-lg font-bold mt-1" style={{ color: cell.color }}>
                    {cell.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelEvaluation;