import React, { useState, useEffect } from 'react';
import { Eye, Brain, Target, Info, TrendingUp, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';
import { generateMockSensorData, generateProcessedFeatures, generateModelPrediction } from '../utils/mockData';

const ExplainableAI: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<string>('social_interaction');
  const [shapValues, setShapValues] = useState<Array<{ feature: string; shap_value: number; feature_value: number }>>([]);
  const [explanationType, setExplanationType] = useState<'local' | 'global'>('local');

  useEffect(() => {
    // Generate mock SHAP values
    const mockShapValues = [
      { feature: 'social_interaction', shap_value: -0.15, feature_value: 0.3 },
      { feature: 'sleep_regularity', shap_value: -0.12, feature_value: 0.6 },
      { feature: 'activity_level', shap_value: -0.08, feature_value: 0.4 },
      { feature: 'digital_wellbeing', shap_value: 0.10, feature_value: 0.7 },
      { feature: 'circadian_rhythm', shap_value: -0.05, feature_value: 0.8 },
      { feature: 'mobility_variance', shap_value: 0.03, feature_value: 0.2 },
    ];
    setShapValues(mockShapValues);
  }, []);

  const globalFeatureImportance = [
    { feature: 'Social Interaction', importance: 0.25, description: 'Communication patterns and social connectivity' },
    { feature: 'Sleep Regularity', importance: 0.22, description: 'Sleep quality and consistency patterns' },
    { feature: 'Activity Level', importance: 0.20, description: 'Physical activity and movement behavior' },
    { feature: 'Digital Wellbeing', importance: 0.18, description: 'Screen time and technology usage patterns' },
    { feature: 'Circadian Rhythm', importance: 0.15, description: 'Sleep-wake cycle alignment' },
  ];

  const featureInteractions = [
    { feature1: 'Sleep', feature2: 'Activity', interaction_strength: 0.45, effect: 'positive' },
    { feature1: 'Social', feature2: 'Digital', interaction_strength: 0.38, effect: 'negative' },
    { feature1: 'Sleep', feature2: 'Social', interaction_strength: 0.32, effect: 'positive' },
    { feature1: 'Activity', feature2: 'Circadian', interaction_strength: 0.28, effect: 'positive' },
  ];

  const decisionPath = [
    { step: 1, condition: 'Social Interaction < 0.4', probability: 0.3, decision: 'Continue' },
    { step: 2, condition: 'Sleep Regularity < 0.6', probability: 0.5, decision: 'Continue' },
    { step: 3, condition: 'Activity Level < 0.5', probability: 0.7, decision: 'High Risk' },
  ];

  const shapWaterfallData = shapValues.map((item, index) => ({
    feature: item.feature.replace('_', ' '),
    cumulative: shapValues.slice(0, index + 1).reduce((sum, val) => sum + val.shap_value, 0.5),
    contribution: item.shap_value,
  }));

  const getContributionColor = (value: number) => {
    return value > 0 ? '#ef4444' : '#10b981'; // Red for increasing risk, green for decreasing
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Explainable AI</h2>
            <p className="text-gray-600 mt-1">Understanding model decisions and feature impacts</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setExplanationType('local')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                explanationType === 'local'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Local Explanation
            </button>
            <button
              onClick={() => setExplanationType('global')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                explanationType === 'global'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Global Explanation
            </button>
          </div>
        </div>

        {explanationType === 'local' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-blue-500" />
                SHAP Values (Individual Prediction)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={shapValues} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#6b7280" />
                    <YAxis dataKey="feature" type="category" width={100} stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                      formatter={(value: any) => [value.toFixed(3), 'SHAP Value']}
                    />
                    <Bar 
                      dataKey="shap_value" 
                      fill={(entry: any) => getContributionColor(entry.shap_value)}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                Waterfall Chart
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={shapWaterfallData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="feature" stroke="#6b7280" angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Line type="monotone" dataKey="cumulative" stroke="#3b82f6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-500" />
                Global Feature Importance
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={globalFeatureImportance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="feature" stroke="#6b7280" angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="importance" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-orange-500" />
                Feature Interactions
              </h3>
              <div className="space-y-3">
                {featureInteractions.map((interaction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        interaction.effect === 'positive' ? 'bg-green-400' : 'bg-red-400'
                      }`}></div>
                      <span className="text-sm font-medium text-gray-900">
                        {interaction.feature1} × {interaction.feature2}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${interaction.interaction_strength * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 w-8">
                        {(interaction.interaction_strength * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
              Decision Path
            </h3>
            <div className="space-y-3">
              {decisionPath.map((step, index) => (
                <div key={index} className="flex items-center p-3 bg-white rounded-lg border">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{step.condition}</p>
                    <p className="text-xs text-gray-600">Risk probability: {(step.probability * 100).toFixed(0)}%</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    step.decision === 'High Risk' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {step.decision}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-green-500" />
              Model Interpretation Guide
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">SHAP Values</h4>
                <p className="text-gray-700">
                  Positive values (red) increase risk prediction, negative values (green) decrease risk. 
                  Larger absolute values indicate stronger influence.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Feature Importance</h4>
                <p className="text-gray-700">
                  Shows average contribution of each feature across all predictions. 
                  Higher values indicate more influential features.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Interactions</h4>
                <p className="text-gray-700">
                  Measures how features work together. Positive interactions amplify effects, 
                  negative interactions can counteract each other.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Explainable AI Implementation</h3>
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-green-400 text-sm">
{`# explainable_ai.py
import shap
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
import joblib

class ExplainableAI:
    def __init__(self, model, X_train, feature_names):
        self.model = model
        self.X_train = X_train
        self.feature_names = feature_names
        self.explainer = None
        self.shap_values = None
        
    def initialize_explainer(self, explainer_type='tree'):
        """Initialize SHAP explainer based on model type"""
        if explainer_type == 'tree':
            # For tree-based models (RandomForest, XGBoost)
            self.explainer = shap.TreeExplainer(self.model)
        elif explainer_type == 'linear':
            # For linear models (LogisticRegression, SVM)
            self.explainer = shap.LinearExplainer(self.model, self.X_train)
        elif explainer_type == 'kernel':
            # For any model (slower but universal)
            self.explainer = shap.KernelExplainer(self.model.predict_proba, self.X_train[:100])
        else:
            # Deep learning models
            self.explainer = shap.DeepExplainer(self.model, self.X_train)
    
    def compute_shap_values(self, X_test):
        """Compute SHAP values for test set"""
        if self.explainer is None:
            raise ValueError("Explainer not initialized. Call initialize_explainer() first.")
        
        self.shap_values = self.explainer.shap_values(X_test)
        return self.shap_values
    
    def plot_summary(self, plot_type='dot'):
        """Create SHAP summary plot"""
        if self.shap_values is None:
            raise ValueError("SHAP values not computed. Call compute_shap_values() first.")
        
        plt.figure(figsize=(10, 8))
        shap.summary_plot(
            self.shap_values, 
            self.X_train, 
            feature_names=self.feature_names,
            plot_type=plot_type
        )
        plt.title('SHAP Summary Plot - Feature Impact on Mental Health Risk')
        plt.tight_layout()
        plt.show()
    
    def plot_waterfall(self, instance_index=0):
        """Create waterfall plot for individual prediction"""
        if self.shap_values is None:
            raise ValueError("SHAP values not computed.")
        
        plt.figure(figsize=(10, 6))
        shap.waterfall_plot(
            shap.Explanation(
                values=self.shap_values[instance_index],
                base_values=self.explainer.expected_value,
                data=self.X_train[instance_index],
                feature_names=self.feature_names
            )
        )
        plt.title(f'SHAP Waterfall Plot - Instance {instance_index}')
        plt.tight_layout()
        plt.show()
    
    def plot_force(self, instance_index=0):
        """Create force plot for individual prediction"""
        if self.shap_values is None:
            raise ValueError("SHAP values not computed.")
        
        return shap.force_plot(
            self.explainer.expected_value,
            self.shap_values[instance_index],
            self.X_train[instance_index],
            feature_names=self.feature_names
        )
    
    def feature_importance_analysis(self):
        """Analyze global feature importance"""
        if self.shap_values is None:
            raise ValueError("SHAP values not computed.")
        
        # Calculate mean absolute SHAP values for each feature
        feature_importance = np.abs(self.shap_values).mean(axis=0)
        
        # Create DataFrame for easy analysis
        importance_df = pd.DataFrame({
            'feature': self.feature_names,
            'importance': feature_importance
        }).sort_values('importance', ascending=False)
        
        return importance_df
    
    def interaction_analysis(self, feature1_idx, feature2_idx):
        """Analyze feature interactions using SHAP interaction values"""
        if hasattr(self.explainer, 'shap_interaction_values'):
            interaction_values = self.explainer.shap_interaction_values(self.X_train)
            
            # Extract interaction between two specific features
            interaction_strength = np.abs(interaction_values[:, feature1_idx, feature2_idx]).mean()
            
            return {
                'feature1': self.feature_names[feature1_idx],
                'feature2': self.feature_names[feature2_idx],
                'interaction_strength': interaction_strength,
                'interaction_values': interaction_values[:, feature1_idx, feature2_idx]
            }
        else:
            print("Model doesn't support interaction analysis")
            return None
    
    def decision_path_analysis(self, instance_index=0):
        """Analyze decision path for tree-based models"""
        if hasattr(self.model, 'decision_path'):
            # Get decision path
            decision_path = self.model.decision_path([self.X_train[instance_index]])
            leaf_id = self.model.apply([self.X_train[instance_index]])
            
            feature_indices = decision_path.indices[decision_path.indptr[0]:decision_path.indptr[1]]
            threshold_values = self.model.tree_.threshold[feature_indices]
            feature_names_path = [self.feature_names[i] for i in self.model.tree_.feature[feature_indices]]
            
            path_info = []
            for i, (feature_idx, threshold) in enumerate(zip(feature_indices, threshold_values)):
                if threshold != -2:  # -2 indicates leaf node
                    feature_value = self.X_train[instance_index][self.model.tree_.feature[feature_idx]]
                    condition = f"{self.feature_names[self.model.tree_.feature[feature_idx]]} <= {threshold:.3f}"
                    path_info.append({
                        'step': i + 1,
                        'feature': self.feature_names[self.model.tree_.feature[feature_idx]],
                        'condition': condition,
                        'feature_value': feature_value,
                        'threshold': threshold
                    })
            
            return path_info
        else:
            print("Decision path analysis only available for tree-based models")
            return None
    
    def generate_explanation_report(self, instance_index=0):
        """Generate comprehensive explanation report"""
        if self.shap_values is None:
            self.compute_shap_values(self.X_train)
        
        # Get SHAP values for the instance
        instance_shap = self.shap_values[instance_index]
        instance_features = self.X_train[instance_index]
        
        # Sort features by absolute SHAP value
        feature_impact = list(zip(self.feature_names, instance_shap, instance_features))
        feature_impact.sort(key=lambda x: abs(x[1]), reverse=True)
        
        report = {
            'instance_index': instance_index,
            'prediction': self.model.predict([instance_features])[0],
            'prediction_probability': self.model.predict_proba([instance_features])[0].max(),
            'base_value': self.explainer.expected_value,
            'feature_contributions': [
                {
                    'feature': name,
                    'shap_value': float(shap_val),
                    'feature_value': float(feat_val),
                    'impact': 'increases_risk' if shap_val > 0 else 'decreases_risk'
                }
                for name, shap_val, feat_val in feature_impact
            ],
            'top_risk_factors': [
                name for name, shap_val, _ in feature_impact[:3] if shap_val > 0
            ],
            'top_protective_factors': [
                name for name, shap_val, _ in feature_impact[:3] if shap_val < 0
            ]
        }
        
        return report
    
    def model_fairness_analysis(self, sensitive_features):
        """Analyze model fairness across different groups"""
        fairness_metrics = {}
        
        for feature in sensitive_features:
            if feature in self.feature_names:
                feature_idx = self.feature_names.index(feature)
                
                # Split data by feature values (assuming binary for simplicity)
                feature_values = self.X_train[:, feature_idx]
                unique_values = np.unique(feature_values)
                
                group_metrics = {}
                for value in unique_values:
                    mask = feature_values == value
                    group_shap = self.shap_values[mask]
                    
                    group_metrics[f'group_{value}'] = {
                        'mean_shap_impact': np.abs(group_shap).mean(),
                        'prediction_variance': np.var(self.model.predict_proba(self.X_train[mask])[:, 1])
                    }
                
                fairness_metrics[feature] = group_metrics
        
        return fairness_metrics`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ExplainableAI;