import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, TrendingUp, Clock, User, Phone } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { generateMockSensorData, generateProcessedFeatures, generateModelPrediction } from '../utils/mockData';
import { SensorData, ProcessedFeatures, ModelPrediction } from '../types';

const RiskAssessment: React.FC = () => {
  const [currentPrediction, setCurrentPrediction] = useState<ModelPrediction | null>(null);
  const [riskHistory, setRiskHistory] = useState<Array<{ day: number; risk_score: number; risk_level: string }>>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [alerts, setAlerts] = useState<Array<{ id: string; type: 'warning' | 'critical'; message: string; timestamp: string }>>([]);

  useEffect(() => {
    const sensorData = generateMockSensorData(30);
    const features = generateProcessedFeatures(sensorData);
    
    const history = features.map((feature, index) => {
      const prediction = generateModelPrediction(feature);
      return {
        day: index + 1,
        risk_score: prediction.risk_score,
        risk_level: prediction.risk_level,
      };
    });
    
    setRiskHistory(history);
    
    if (features.length > 0) {
      const latestPrediction = generateModelPrediction(features[features.length - 1]);
      setCurrentPrediction(latestPrediction);
      
      // Generate alerts based on risk level
      if (latestPrediction.risk_level === 'high') {
        setAlerts(prev => [...prev, {
          id: Date.now().toString(),
          type: 'critical',
          message: 'High mental health risk detected. Immediate intervention recommended.',
          timestamp: new Date().toISOString(),
        }]);
      } else if (latestPrediction.risk_level === 'medium') {
        setAlerts(prev => [...prev, {
          id: Date.now().toString(),
          type: 'warning',
          message: 'Moderate risk indicators detected. Consider supportive measures.',
          timestamp: new Date().toISOString(),
        }]);
      }
    }
  }, []);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getRiskBgColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-50';
      case 'medium': return 'bg-yellow-50';
      case 'high': return 'bg-red-50';
      default: return 'bg-gray-50';
    }
  };

  const interventionRecommendations = {
    low: [
      'Continue current positive behaviors',
      'Maintain regular sleep schedule',
      'Keep up social connections',
      'Regular physical activity'
    ],
    medium: [
      'Schedule check-in with mental health professional',
      'Increase social activities',
      'Consider mindfulness practices',
      'Monitor sleep patterns closely'
    ],
    high: [
      'Urgent consultation with mental health specialist',
      'Contact crisis helpline if needed',
      'Immediate family/friend support activation',
      'Consider intensive intervention programs'
    ]
  };

  const radarData = currentPrediction?.contributing_factors.map(factor => ({
    factor: factor.feature.replace('_', ' '),
    value: factor.value,
    importance: factor.importance,
    fullMark: 1,
  })) || [];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Risk Assessment</h2>
            <p className="text-gray-600 mt-1">Real-time mental health risk monitoring and alerting</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isMonitoring
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isMonitoring ? 'Monitoring Active' : 'Start Monitoring'}
            </button>
            <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
          </div>
        </div>

        {currentPrediction && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className={`${getRiskBgColor(currentPrediction.risk_level)} rounded-lg p-6 lg:col-span-2`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <AlertTriangle className={`w-8 h-8 ${getRiskColor(currentPrediction.risk_level)} mr-3`} />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {currentPrediction.risk_level.toUpperCase()} RISK
                    </h3>
                    <p className="text-gray-600">
                      Confidence: {(currentPrediction.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">
                    {(currentPrediction.risk_score * 100).toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-600">Risk Score</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Contributing Factors</h4>
                  <div className="space-y-2">
                    {currentPrediction.contributing_factors.slice(0, 3).map((factor, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 capitalize">
                          {factor.feature.replace('_', ' ')}
                        </span>
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${factor.importance * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">
                            {(factor.importance * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Recommendations</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {interventionRecommendations[currentPrediction.risk_level].slice(0, 3).map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Factor Analysis</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="factor" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 1]} />
                    <Radar
                      name="Current Value"
                      dataKey="value"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Trend (30 Days)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={riskHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis domain={[0, 1]} stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                    formatter={(value: any) => [(value * 100).toFixed(0) + '%', 'Risk Score']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="risk_score" 
                    stroke="#ef4444" 
                    strokeWidth={3} 
                    dot={{ fill: '#ef4444', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                {alerts.length} Active
              </span>
            </div>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {alerts.slice(-5).reverse().map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start p-3 rounded-lg ${
                    alert.type === 'critical' ? 'bg-red-100 border border-red-200' : 'bg-yellow-100 border border-yellow-200'
                  }`}
                >
                  <AlertTriangle className={`w-5 h-5 mt-0.5 mr-3 ${
                    alert.type === 'critical' ? 'text-red-500' : 'text-yellow-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              {alerts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Shield className="w-12 h-12 mx-auto mb-2 text-green-400" />
                  <p>No alerts - All indicators normal</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center mb-2">
            <Phone className="w-5 h-5 text-blue-600 mr-2" />
            <h4 className="font-semibold text-blue-900">Emergency Resources</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-900">Crisis Hotline:</span>
              <span className="ml-2 text-blue-700">988 (US)</span>
            </div>
            <div>
              <span className="font-medium text-blue-900">Emergency:</span>
              <span className="ml-2 text-blue-700">911</span>
            </div>
            <div>
              <span className="font-medium text-blue-900">Text Crisis Line:</span>
              <span className="ml-2 text-blue-700">Text HOME to 741741</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment System</h3>
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-green-400 text-sm">
{`# risk_assessment.py
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import joblib
from typing import Dict, List, Tuple
import logging

class RiskAssessmentSystem:
    def __init__(self, model_path: str, threshold_config: Dict):
        self.model = joblib.load(model_path)
        self.thresholds = threshold_config
        self.risk_history = []
        self.alert_system = AlertSystem()
        
    def assess_current_risk(self, features: Dict) -> Dict:
        """Assess current mental health risk level"""
        # Convert features to model input format
        feature_vector = self.prepare_features(features)
        
        # Get prediction probabilities
        risk_probabilities = self.model.predict_proba([feature_vector])[0]
        risk_score = np.max(risk_probabilities)
        predicted_class = self.model.predict([feature_vector])[0]
        
        # Determine risk level
        risk_level = self.classify_risk(risk_score, predicted_class)
        
        # Get feature importance for explanation
        feature_importance = self.get_feature_contributions(feature_vector)
        
        assessment = {
            'timestamp': datetime.now().isoformat(),
            'risk_level': risk_level,
            'risk_score': float(risk_score),
            'confidence': float(np.max(risk_probabilities)),
            'probabilities': {
                'low': float(risk_probabilities[0]),
                'medium': float(risk_probabilities[1]),
                'high': float(risk_probabilities[2])
            },
            'contributing_factors': feature_importance,
            'recommendations': self.generate_recommendations(risk_level),
            'next_assessment': (datetime.now() + timedelta(hours=24)).isoformat()
        }
        
        # Store in history
        self.risk_history.append(assessment)
        
        # Trigger alerts if necessary
        self.check_and_trigger_alerts(assessment)
        
        return assessment
    
    def classify_risk(self, risk_score: float, predicted_class: int) -> str:
        """Classify risk level based on model output and thresholds"""
        if predicted_class == 2 or risk_score > self.thresholds['high']:
            return 'high'
        elif predicted_class == 1 or risk_score > self.thresholds['medium']:
            return 'medium'
        else:
            return 'low'
    
    def get_feature_contributions(self, feature_vector: np.ndarray) -> List[Dict]:
        """Get feature contributions using SHAP or similar explainability method"""
        # This would typically use SHAP values
        # For demonstration, using feature importance from the model
        if hasattr(self.model, 'feature_importances_'):
            importances = self.model.feature_importances_
        else:
            # For models without feature_importances_, use coefficient magnitudes
            importances = np.abs(self.model.coef_[0]) if hasattr(self.model, 'coef_') else None
        
        if importances is not None:
            feature_names = [
                'social_interaction_score', 'sleep_regularity', 'activity_level',
                'digital_wellbeing_score', 'circadian_rhythm_score', 'mobility_variance'
            ]
            
            contributions = []
            for i, (name, importance, value) in enumerate(zip(feature_names, importances, feature_vector)):
                contributions.append({
                    'feature': name,
                    'importance': float(importance),
                    'value': float(value),
                    'impact': 'positive' if value > 0.5 else 'negative'
                })
            
            # Sort by importance
            contributions.sort(key=lambda x: x['importance'], reverse=True)
            return contributions[:5]  # Top 5 contributors
        
        return []
    
    def generate_recommendations(self, risk_level: str) -> List[str]:
        """Generate personalized recommendations based on risk level"""
        recommendations = {
            'low': [
                "Continue maintaining healthy routines",
                "Keep up regular social connections",
                "Maintain consistent sleep schedule",
                "Continue physical activity routine"
            ],
            'medium': [
                "Consider scheduling a check-in with a mental health professional",
                "Increase social activities and connections",
                "Practice mindfulness or relaxation techniques",
                "Monitor sleep patterns more closely",
                "Reduce excessive screen time"
            ],
            'high': [
                "Seek immediate consultation with a mental health specialist",
                "Activate support network (family, friends, healthcare providers)",
                "Consider crisis helpline: 988 (US) or local emergency services",
                "Avoid isolation - stay with trusted individuals",
                "Remove access to harmful means if applicable",
                "Consider intensive outpatient or inpatient programs"
            ]
        }
        
        return recommendations.get(risk_level, [])
    
    def check_and_trigger_alerts(self, assessment: Dict):
        """Check if alerts should be triggered based on assessment"""
        risk_level = assessment['risk_level']
        
        if risk_level == 'high':
            self.alert_system.trigger_critical_alert(assessment)
        elif risk_level == 'medium':
            self.alert_system.trigger_warning_alert(assessment)
        
        # Check for rapid deterioration
        if len(self.risk_history) >= 3:
            recent_scores = [r['risk_score'] for r in self.risk_history[-3:]]
            if self.detect_rapid_decline(recent_scores):
                self.alert_system.trigger_deterioration_alert(assessment)
    
    def detect_rapid_decline(self, recent_scores: List[float]) -> bool:
        """Detect rapid decline in mental health indicators"""
        if len(recent_scores) < 3:
            return False
        
        # Check if there's a consistent increase in risk scores
        increases = [recent_scores[i+1] - recent_scores[i] for i in range(len(recent_scores)-1)]
        
        # Alert if risk has increased significantly over short period
        total_increase = sum(increases)
        return total_increase > 0.3  # 30% increase threshold
    
    def get_risk_trends(self, days: int = 30) -> Dict:
        """Get risk trends over specified period"""
        cutoff_date = datetime.now() - timedelta(days=days)
        
        recent_history = [
            assessment for assessment in self.risk_history
            if datetime.fromisoformat(assessment['timestamp']) > cutoff_date
        ]
        
        if not recent_history:
            return {}
        
        risk_scores = [r['risk_score'] for r in recent_history]
        timestamps = [r['timestamp'] for r in recent_history]
        
        return {
            'trend_data': list(zip(timestamps, risk_scores)),
            'average_risk': np.mean(risk_scores),
            'risk_volatility': np.std(risk_scores),
            'high_risk_days': sum(1 for r in recent_history if r['risk_level'] == 'high'),
            'improvement_trend': risk_scores[-1] < risk_scores[0] if len(risk_scores) > 1 else None
        }`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessment;