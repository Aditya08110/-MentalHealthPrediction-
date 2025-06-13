import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';
import { generateMockSensorData } from '../utils/mockData';
import { SensorData } from '../types';

const ExploratoryAnalysis: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [analysisType, setAnalysisType] = useState<'trends' | 'correlations' | 'distributions' | 'patterns'>('trends');

  useEffect(() => {
    const data = generateMockSensorData(30);
    setSensorData(data);
  }, []);

  const trendsData = sensorData.map((data, index) => ({
    day: index + 1,
    screenTime: data.screen_time_minutes,
    socialInteraction: data.calls_count + data.sms_count,
    activity: data.steps,
    sleep: data.sleep_hours,
    digitalWellbeing: Math.max(0, 600 - data.screen_time_minutes) / 6,
  }));

  const correlationData = sensorData.map(data => ({
    screenTime: data.screen_time_minutes,
    socialInteraction: data.calls_count + data.sms_count,
    activity: data.steps / 100,
    sleep: data.sleep_hours,
  }));

  const sleepDistribution = [
    { range: '< 6h', count: sensorData.filter(d => d.sleep_hours < 6).length, color: '#ef4444' },
    { range: '6-8h', count: sensorData.filter(d => d.sleep_hours >= 6 && d.sleep_hours <= 8).length, color: '#f59e0b' },
    { range: '> 8h', count: sensorData.filter(d => d.sleep_hours > 8).length, color: '#10b981' },
  ];

  const insights = [
    {
      icon: TrendingDown,
      title: 'Declining Social Interaction',
      description: 'Social interactions decreased by 45% over the past month',
      value: '-45%',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      icon: Activity,
      title: 'Reduced Physical Activity',
      description: 'Daily steps below recommended threshold',
      value: '6,200',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      icon: BarChart3,
      title: 'Increased Screen Time',
      description: 'Screen usage above healthy limits',
      value: '+32%',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: TrendingUp,
      title: 'Sleep Pattern Disruption',
      description: 'Irregular sleep schedule detected',
      value: '73%',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
  ];

  const renderAnalysis = () => {
    switch (analysisType) {
      case 'trends':
        return (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendsData}>
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
                <Line type="monotone" dataKey="screenTime" stroke="#3b82f6" strokeWidth={2} name="Screen Time" />
                <Line type="monotone" dataKey="socialInteraction" stroke="#10b981" strokeWidth={2} name="Social Interaction" />
                <Line type="monotone" dataKey="sleep" stroke="#f59e0b" strokeWidth={2} name="Sleep Hours" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'correlations':
        return (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={correlationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="screenTime" stroke="#6b7280" name="Screen Time" />
                <YAxis dataKey="socialInteraction" stroke="#6b7280" name="Social Interaction" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Scatter dataKey="socialInteraction" fill="#3b82f6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'distributions':
        return (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sleepDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ range, count }) => `${range}: ${count}`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {sleepDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'patterns':
        return (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendsData.slice(-7)}>
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
                <Bar dataKey="screenTime" fill="#3b82f6" name="Screen Time" />
                <Bar dataKey="activity" fill="#10b981" name="Activity Level" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Exploratory Data Analysis</h2>
            <p className="text-gray-600 mt-1">Behavioral patterns and mental health indicators</p>
          </div>
          <div className="flex space-x-2">
            {['trends', 'correlations', 'distributions', 'patterns'].map((type) => (
              <button
                key={type}
                onClick={() => setAnalysisType(type as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  analysisType === type
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div key={index} className={`${insight.bgColor} rounded-lg p-4 border border-gray-100`}>
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-6 h-6 ${insight.color}`} />
                  <span className={`text-lg font-bold ${insight.color}`}>{insight.value}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{insight.title}</h3>
                <p className="text-sm text-gray-600">{insight.description}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Visualization</h3>
          {renderAnalysis()}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistical Analysis Code</h3>
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-green-400 text-sm">
{`# exploratory_analysis.py
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
from sklearn.preprocessing import StandardScaler

class ExploratoryAnalysis:
    def __init__(self, data: pd.DataFrame):
        self.data = data
        self.processed_data = None
        
    def basic_statistics(self) -> dict:
        """Generate basic statistical summaries"""
        return {
            'descriptive_stats': self.data.describe(),
            'missing_values': self.data.isnull().sum(),
            'data_types': self.data.dtypes,
            'correlation_matrix': self.data.corr()
        }
    
    def detect_patterns(self) -> dict:
        """Detect behavioral patterns indicative of mental health decline"""
        patterns = {}
        
        # Social interaction patterns
        patterns['social_decline'] = self.detect_declining_trend('social_interaction_score')
        
        # Sleep pattern irregularities
        patterns['sleep_irregularity'] = np.std(self.data['sleep_hours'])
        
        # Activity level changes
        patterns['activity_decline'] = self.detect_declining_trend('steps')
        
        # Screen time increases
        patterns['screen_time_increase'] = self.detect_increasing_trend('screen_time_minutes')
        
        return patterns
    
    def correlation_analysis(self) -> pd.DataFrame:
        """Analyze correlations between features and mental health indicators"""
        correlation_matrix = self.data.corr()
        
        # Focus on correlations with mental health proxy variables
        mental_health_indicators = [
            'social_interaction_score',
            'sleep_regularity',
            'activity_level',
            'digital_wellbeing_score'
        ]
        
        return correlation_matrix[mental_health_indicators]
    
    def visualize_trends(self, feature: str, window: int = 7):
        """Create trend visualizations with moving averages"""
        plt.figure(figsize=(12, 6))
        
        # Original data
        plt.plot(self.data.index, self.data[feature], alpha=0.3, label='Raw Data')
        
        # Moving average
        rolling_mean = self.data[feature].rolling(window=window).mean()
        plt.plot(self.data.index, rolling_mean, linewidth=2, label=f'{window}-day Moving Average')
        
        plt.title(f'{feature} Trend Analysis')
        plt.xlabel('Days')
        plt.ylabel(feature)
        plt.legend()
        plt.grid(True, alpha=0.3)
        plt.show()`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ExploratoryAnalysis;