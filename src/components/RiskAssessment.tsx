import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, TrendingUp, Clock, User, Phone } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'high':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Risk Assessment</h2>
            <p className="text-gray-600 mt-1">Real-time mental health risk monitoring</p>
          </div>
          <button
            onClick={() => setIsMonitoring(prev => !prev)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isMonitoring
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-500" />
              Current Risk Status
            </h3>
            {currentPrediction && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Risk Level</p>
                    <p className={`text-2xl font-bold ${getRiskColor(currentPrediction.risk_level)}`}>
                      {currentPrediction.risk_level.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Risk Score</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {currentPrediction.risk_score.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className={`h-2.5 rounded-full ${
                      currentPrediction.risk_level === 'high'
                        ? 'bg-red-500'
                        : currentPrediction.risk_level === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${currentPrediction.risk_score * 100}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  {currentPrediction.contributing_factors.map((factor, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border">
                      <p className="text-xs text-gray-600">{factor.name}</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        Score: {factor.value.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Risk History
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={riskHistory} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
                      value: "Risk Score", 
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
                    dataKey="risk_score"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
            Alerts & Notifications
          </h3>
          <div className="space-y-3">
            {alerts.map(alert => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${
                  alert.type === 'critical'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex items-start">
                  <AlertTriangle
                    className={`w-5 h-5 mr-3 ${
                      alert.type === 'critical' ? 'text-red-500' : 'text-yellow-500'
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 flex items-start">
            <User className="w-5 h-5 text-blue-500 mt-1 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Personal Support</h4>
              <p className="text-sm text-gray-600 mt-1">
                Connect with your assigned mental health professional for guidance
              </p>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 flex items-start">
            <Clock className="w-5 h-5 text-green-500 mt-1 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Regular Check-ins</h4>
              <p className="text-sm text-gray-600 mt-1">
                Schedule recurring wellness assessments
              </p>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 flex items-start">
            <Phone className="w-5 h-5 text-purple-500 mt-1 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Emergency Contact</h4>
              <p className="text-sm text-gray-600 mt-1">
                24/7 crisis helpline available
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessment;