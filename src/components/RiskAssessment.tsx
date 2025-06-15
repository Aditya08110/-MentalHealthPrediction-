import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, Phone, Heart, BrainCircuit, ArrowRight, Shield } from 'lucide-react';
import { useData } from '../context/DataContext';

const RiskAssessment: React.FC = () => {
  const { sensorData } = useData();
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high' | null>(null);

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

  // Check if we have enough data
  if (!sensorData || sensorData.length < 5) {
    return (
      <div className="min-h-screen p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Emergency Notice - Always show this */}
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

          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Insufficient Data</h2>
            <p className="text-gray-600 mb-4">
              Please collect at least 5 data points using the Data Collection page to perform a risk assessment.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
    if (avgScreenTime > 480) riskScore += 2; // More than 8 hours
    if (avgSleep < 6) riskScore += 2; // Less than 6 hours
    if (avgSteps < 4000) riskScore += 1; // Less than 4000 steps
    if (avgSocial < 3) riskScore += 1; // Less than 3 social interactions

    return {
      screenTime: avgScreenTime,
      sleep: avgSleep,
      steps: avgSteps,
      social: avgSocial,
      riskScore
    };
  };

  const metrics = calculateRiskMetrics();
  const riskColor = metrics.riskScore <= 2 ? 'green' : metrics.riskScore <= 4 ? 'yellow' : 'red';

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Emergency Notice - Always show this */}
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

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Mental Health Risk Assessment</h2>
          <p className="text-gray-600 mt-1">Based on your recent behavioral patterns</p>
        </div>

        {/* Risk Score Card */}
        <div className={`bg-${riskColor}-50 border border-${riskColor}-200 rounded-lg p-6 mb-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-${riskColor}-800 text-lg font-semibold`}>
                Current Risk Level: {metrics.riskScore <= 2 ? 'Low' : metrics.riskScore <= 4 ? 'Moderate' : 'High'}
              </h3>
              <p className={`text-${riskColor}-600 mt-1`}>
                Based on analysis of your last 7 days of data
              </p>
            </div>
            <div className={`w-16 h-16 rounded-full bg-${riskColor}-100 flex items-center justify-center`}>
              <span className={`text-2xl font-bold text-${riskColor}-600`}>{metrics.riskScore}/6</span>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-blue-800 font-semibold">Screen Time</h4>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {Math.round(metrics.screenTime)} min
            </p>
            <p className="text-sm text-blue-500 mt-1">Daily average</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="text-purple-800 font-semibold">Sleep Duration</h4>
            <p className="text-2xl font-bold text-purple-600 mt-2">
              {metrics.sleep.toFixed(1)} hours
            </p>
            <p className="text-sm text-purple-500 mt-1">Daily average</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="text-green-800 font-semibold">Physical Activity</h4>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {Math.round(metrics.steps)} steps
            </p>
            <p className="text-sm text-green-500 mt-1">Daily average</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="text-yellow-800 font-semibold">Social Interaction</h4>
            <p className="text-2xl font-bold text-yellow-600 mt-2">
              {Math.round(metrics.social)}
            </p>
            <p className="text-sm text-yellow-500 mt-1">Daily interactions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessment;
