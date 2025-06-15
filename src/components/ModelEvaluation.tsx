import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockModelMetrics } from '../utils/mockData';

const ModelEvaluation: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<'accuracy' | 'precision' | 'recall' | 'f1_score'>('accuracy');

  const performanceMetrics = [
    {
      name: 'Accuracy',
      value: mockModelMetrics.accuracy,
      icon: Target,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      description: 'Overall correct predictions'
    },
    {
      name: 'Precision',
      value: mockModelMetrics.precision,
      icon: CheckCircle,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      description: 'Positive predictions accuracy'
    },
    {
      name: 'Recall',
      value: mockModelMetrics.recall,
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      description: 'True positives captured'
    },
    {
      name: 'F1-Score',
      value: mockModelMetrics.f1_score,
      icon: BarChart3,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      description: 'Harmonic mean of precision and recall'
    },
  ];

  const confusionMatrixData = [
    { actual: 'Low Risk', predicted: 'Low Risk', count: 45, color: '#10b981' },
    { actual: 'Low Risk', predicted: 'Medium Risk', count: 5, color: '#f59e0b' },
    { actual: 'Low Risk', predicted: 'High Risk', count: 2, color: '#ef4444' },
    { actual: 'Medium Risk', predicted: 'Low Risk', count: 3, color: '#f59e0b' },
    { actual: 'Medium Risk', predicted: 'Medium Risk', count: 38, color: '#10b981' },
    { actual: 'Medium Risk', predicted: 'High Risk', count: 4, color: '#ef4444' },
    { actual: 'High Risk', predicted: 'Low Risk', count: 1, color: '#ef4444' },
    { actual: 'High Risk', predicted: 'Medium Risk', count: 3, color: '#f59e0b' },
    { actual: 'High Risk', predicted: 'High Risk', count: 42, color: '#10b981' },
  ];

  const timeBasedMetrics = [
    { month: 'Jan', accuracy: 0.82, precision: 0.79, recall: 0.85, f1_score: 0.81 },
    { month: 'Feb', accuracy: 0.84, precision: 0.81, recall: 0.86, f1_score: 0.83 },
    { month: 'Mar', accuracy: 0.85, precision: 0.83, recall: 0.87, f1_score: 0.85 },
    { month: 'Apr', accuracy: 0.87, precision: 0.85, recall: 0.88, f1_score: 0.86 },
    { month: 'May', accuracy: 0.89, precision: 0.86, recall: 0.89, f1_score: 0.87 },
    { month: 'Jun', accuracy: 0.91, precision: 0.88, recall: 0.90, f1_score: 0.89 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Model Evaluation</h2>
            <p className="text-gray-600 mt-1">Performance metrics and quality assessment</p>
          </div>
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-500" />
              Performance History
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeBasedMetrics} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="month" 
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
              {confusionMatrixData.map((cell, index) => (
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