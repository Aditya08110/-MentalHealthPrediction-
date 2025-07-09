import React, { useState, useEffect } from 'react';
import { AlertTriangle, AlertCircle, Phone, Heart, BrainCircuit, ArrowRight, Shield } from 'lucide-react';
import { useData } from '../context/DataContext';

const RiskAssessment: React.FC = () => {
  const { sensorData } = useData();
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high' | null>(null);
  const [riskMetrics, setRiskMetrics] = useState<any>(null);

  // Emergency contacts - always visible for safety
  const emergencyContacts = [
    {
      name: 'National Crisis Lifeline',
      number: '988',
      hours: '24/7',
      description: 'Suicide and crisis lifeline'
    },
    {
      name: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      hours: '24/7',
      description: 'Crisis counseling via text'
    }
  ];

  useEffect(() => {
    if (sensorData && sensorData.length >= 5) {
      const metrics = calculateRiskMetrics();
      setRiskMetrics(metrics);
      setRiskLevel(metrics.riskScore <= 2 ? 'low' : metrics.riskScore <= 4 ? 'medium' : 'high');
    }
  }, [sensorData]);

  // Calculate risk metrics based on sensor data
  const calculateRiskMetrics = () => {
    const recentData = sensorData.slice(-7); // Last 7 days
    
    // Calculate average metrics
    const avgScreenTime = recentData.reduce((sum, d) => sum + d.screen_time_minutes, 0) / recentData.length;
    const avgSleep = recentData.reduce((sum, d) => sum + d.sleep_hours, 0) / recentData.length;
    const avgSteps = recentData.reduce((sum, d) => sum + d.steps, 0) / recentData.length;
    const avgSocial = recentData.reduce((sum, d) => sum + (d.calls_count + d.sms_count), 0) / recentData.length;

    // Determine risk level based on combined factors
    let riskScore = 0;
    const riskFactors = [];

    // Screen time risk (more than 8 hours)
    if (avgScreenTime > 480) {
      riskScore += 2;
      riskFactors.push('High screen time');
    }

    // Sleep risk (less than 6 hours)
    if (avgSleep < 6) {
      riskScore += 2;
      riskFactors.push('Insufficient sleep');
    }

    // Physical activity risk (less than 4000 steps)
    if (avgSteps < 4000) {
      riskScore += 1;
      riskFactors.push('Low physical activity');
    }

    // Social interaction risk (less than 3 interactions)
    if (avgSocial < 3) {
      riskScore += 1;
      riskFactors.push('Limited social interaction');
    }

    return {
      screenTime: avgScreenTime,
      sleep: avgSleep,
      steps: avgSteps,
      social: avgSocial,
      riskScore,
      riskFactors
    };
  };

  const renderEmergencyNotice = () => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Important Notice</h3>
          <p className="mt-1 text-sm text-red-700">
            If you're experiencing thoughts of self-harm or suicide, please seek immediate help.
            Professional support is available 24/7.
          </p>
          <div className="mt-3 space-y-2">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-red-700">{contact.name}:</span>
                <span className="text-sm text-red-600">{contact.number}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // If no data, show appropriate message
  if (!sensorData || sensorData.length < 5) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {renderEmergencyNotice()}
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Insufficient Data</h2>
            <p className="text-gray-600 mb-4">
              Please collect at least 5 data points using the Data Collection page to perform a risk assessment.
              This helps us provide more accurate predictions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Helper function to get risk level color
  const getRiskColor = (level: string) => {
    switch (level) {
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
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {renderEmergencyNotice()}

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Mental Health Risk Assessment</h2>
          <p className="text-gray-600">
            Based on your recent activity patterns and behavioral indicators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Risk Level Card */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Shield className={`w-8 h-8 ${getRiskColor(riskLevel || '')}`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Overall Risk Level</h3>
            <p className={`text-2xl font-bold mt-2 ${getRiskColor(riskLevel || '')}`}>
              {riskLevel?.charAt(0).toUpperCase() + riskLevel?.slice(1) || 'Unknown'}
            </p>
          </div>

          {/* Screen Time Card */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900">Daily Screen Time</h3>
            <p className="text-2xl font-bold mt-2">
              {Math.round(riskMetrics?.screenTime / 60 * 10) / 10}h
            </p>
            {riskMetrics?.screenTime > 480 && (
              <p className="text-sm text-red-500 mt-2">Above recommended limit</p>
            )}
          </div>

          {/* Sleep Card */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900">Average Sleep</h3>
            <p className="text-2xl font-bold mt-2">
              {Math.round(riskMetrics?.sleep * 10) / 10}h
            </p>
            {riskMetrics?.sleep < 6 && (
              <p className="text-sm text-red-500 mt-2">Below recommended amount</p>
            )}
          </div>

          {/* Activity Card */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900">Daily Steps</h3>
            <p className="text-2xl font-bold mt-2">
              {Math.round(riskMetrics?.steps).toLocaleString()}
            </p>
            {riskMetrics?.steps < 4000 && (
              <p className="text-sm text-red-500 mt-2">Below recommended amount</p>
            )}
          </div>
        </div>

        {/* Risk Factors */}
        {riskMetrics?.riskFactors.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Risk Factors Identified</h3>
                <ul className="mt-2 space-y-1">
                  {riskMetrics.riskFactors.map((factor: string, index: number) => (
                    <li key={index} className="text-sm text-yellow-700 flex items-center">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Heart className="w-5 h-5 text-blue-500 mr-2" />
                <h4 className="font-medium text-blue-900">Self-Care Activities</h4>
              </div>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Take regular breaks from screen time</li>
                <li>• Maintain a consistent sleep schedule</li>
                <li>• Get at least 30 minutes of physical activity</li>
                <li>• Practice mindfulness or meditation</li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <BrainCircuit className="w-5 h-5 text-blue-500 mr-2" />
                <h4 className="font-medium text-blue-900">Mental Wellness Tips</h4>
              </div>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Stay connected with friends and family</li>
                <li>• Set boundaries with work and technology</li>
                <li>• Engage in activities you enjoy</li>
                <li>• Seek professional help if needed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessment;
