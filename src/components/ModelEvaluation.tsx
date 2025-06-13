import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
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
    { actual: 'High Risk', predicted: 'Medium Risk', count: 6, color: '#f59e0b' },
    { actual: 'High Risk', predicted: 'High Risk', count: 42, color: '#10b981' },
  ];

  const rocCurveData = [
    { fpr: 0.0, tpr: 0.0 },
    { fpr: 0.1, tpr: 0.3 },
    { fpr: 0.2, tpr: 0.6 },
    { fpr: 0.3, tpr: 0.8 },
    { fpr: 0.4, tpr: 0.9 },
    { fpr: 0.5, tpr: 0.95 },
    { fpr: 1.0, tpr: 1.0 },
  ];

  const classificationResults = [
    { risk_level: 'Low Risk', precision: 0.88, recall: 0.87, f1_score: 0.87, support: 52 },
    { risk_level: 'Medium Risk', precision: 0.79, recall: 0.84, f1_score: 0.82, support: 45 },
    { risk_level: 'High Risk', precision: 0.88, recall: 0.86, f1_score: 0.87, support: 49 },
  ];

  const validationHistory = [
    { fold: 1, accuracy: 0.85, precision: 0.82, recall: 0.87, f1_score: 0.84 },
    { fold: 2, accuracy: 0.89, precision: 0.86, recall: 0.91, f1_score: 0.88 },
    { fold: 3, accuracy: 0.87, precision: 0.84, recall: 0.89, f1_score: 0.86 },
    { fold: 4, accuracy: 0.91, precision: 0.88, recall: 0.93, f1_score: 0.90 },
    { fold: 5, accuracy: 0.86, precision: 0.83, recall: 0.88, f1_score: 0.85 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Model Evaluation</h2>
            <p className="text-gray-600 mt-1">Comprehensive performance analysis and validation metrics</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              AUC-ROC: {mockModelMetrics.auc_roc.toFixed(3)}
            </div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {performanceMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.name}
                className={`${metric.bgColor} rounded-lg p-4 border border-gray-100 cursor-pointer transition-all duration-200 hover:shadow-md`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-6 h-6 ${metric.color}`} />
                  <span className={`text-2xl font-bold ${metric.color}`}>
                    {(metric.value * 100).toFixed(1)}%
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{metric.name}</h3>
                <p className="text-sm text-gray-600">{metric.description}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">ROC Curve</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rocCurveData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="fpr" stroke="#6b7280" label={{ value: 'False Positive Rate', position: 'insideBottomRight', offset: -10 }} />
                  <YAxis dataKey="tpr" stroke="#6b7280" label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="tpr" stroke="#3b82f6" strokeWidth={3} name="ROC Curve" />
                  <Line type="monotone" data={[{fpr: 0, tpr: 0}, {fpr: 1, tpr: 1}]} dataKey="tpr" stroke="#ef4444" strokeDasharray="5 5" strokeWidth={1} name="Random Classifier" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cross-Validation Results</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={validationHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="fold" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="accuracy" fill="#3b82f6" name="Accuracy" />
                  <Bar dataKey="f1_score" fill="#10b981" name="F1-Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Classification Report</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precision
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recall
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    F1-Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Support
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classificationResults.map((result, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        result.risk_level === 'Low Risk' ? 'bg-green-100 text-green-800' :
                        result.risk_level === 'Medium Risk' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {result.risk_level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.precision.toFixed(3)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.recall.toFixed(3)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.f1_score.toFixed(3)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.support}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Evaluation Code</h3>
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-green-400 text-sm">
{`# model_evaluation.py
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, classification_report, roc_curve, auc,
    cross_val_score, learning_curve
)
from sklearn.model_selection import cross_validate
import joblib

class ModelEvaluator:
    def __init__(self, model, X_test, y_test):
        self.model = model
        self.X_test = X_test
        self.y_test = y_test
        self.y_pred = model.predict(X_test)
        self.y_pred_proba = model.predict_proba(X_test) if hasattr(model, 'predict_proba') else None
        
    def compute_basic_metrics(self) -> dict:
        """Compute basic classification metrics"""
        metrics = {
            'accuracy': accuracy_score(self.y_test, self.y_pred),
            'precision': precision_score(self.y_test, self.y_pred, average='weighted'),
            'recall': recall_score(self.y_test, self.y_pred, average='weighted'),
            'f1_score': f1_score(self.y_test, self.y_pred, average='weighted')
        }
        
        return metrics
    
    def confusion_matrix_analysis(self):
        """Generate and analyze confusion matrix"""
        cm = confusion_matrix(self.y_test, self.y_pred)
        
        # Normalize confusion matrix
        cm_normalized = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]
        
        plt.figure(figsize=(10, 8))
        sns.heatmap(cm_normalized, annot=True, fmt='.2f', 
                   cmap='Blues', square=True,
                   xticklabels=['Low Risk', 'Medium Risk', 'High Risk'],
                   yticklabels=['Low Risk', 'Medium Risk', 'High Risk'])
        plt.title('Normalized Confusion Matrix')
        plt.ylabel('True Label')
        plt.xlabel('Predicted Label')
        plt.show()
        
        return cm, cm_normalized
    
    def roc_analysis(self):
        """ROC curve analysis for multi-class classification"""
        if self.y_pred_proba is None:
            print("Model doesn't support probability predictions")
            return None
        
        # Convert to binary classification for each class
        n_classes = len(np.unique(self.y_test))
        fpr = dict()
        tpr = dict()
        roc_auc = dict()
        
        for i in range(n_classes):
            y_test_binary = (self.y_test == i).astype(int)
            y_score = self.y_pred_proba[:, i]
            
            fpr[i], tpr[i], _ = roc_curve(y_test_binary, y_score)
            roc_auc[i] = auc(fpr[i], tpr[i])
        
        # Plot ROC curves
        plt.figure(figsize=(10, 8))
        colors = ['blue', 'red', 'green']
        risk_levels = ['Low Risk', 'Medium Risk', 'High Risk']
        
        for i, color, label in zip(range(n_classes), colors, risk_levels):
            plt.plot(fpr[i], tpr[i], color=color, lw=2,
                    label=f'{label} (AUC = {roc_auc[i]:.2f})')
        
        plt.plot([0, 1], [0, 1], 'k--', lw=2, label='Random Classifier')
        plt.xlim([0.0, 1.0])
        plt.ylim([0.0, 1.05])
        plt.xlabel('False Positive Rate')
        plt.ylabel('True Positive Rate')
        plt.title('ROC Curves for Mental Health Risk Prediction')
        plt.legend(loc="lower right")
        plt.show()
        
        return fpr, tpr, roc_auc
    
    def cross_validation_analysis(self, cv=5):
        """Perform comprehensive cross-validation analysis"""
        scoring = ['accuracy', 'precision_weighted', 'recall_weighted', 'f1_weighted']
        
        cv_results = cross_validate(
            self.model, self.X_test, self.y_test,
            cv=cv, scoring=scoring, return_train_score=True
        )
        
        # Summary statistics
        results_summary = {}
        for metric in scoring:
            test_scores = cv_results[f'test_{metric}']
            train_scores = cv_results[f'train_{metric}']
            
            results_summary[metric] = {
                'test_mean': test_scores.mean(),
                'test_std': test_scores.std(),
                'train_mean': train_scores.mean(),
                'train_std': train_scores.std(),
                'overfitting': train_scores.mean() - test_scores.mean()
            }
        
        return results_summary, cv_results
    
    def learning_curve_analysis(self, train_sizes=np.linspace(0.1, 1.0, 10)):
        """Analyze learning curves to detect overfitting/underfitting"""
        train_sizes, train_scores, val_scores = learning_curve(
            self.model, self.X_test, self.y_test,
            train_sizes=train_sizes, cv=5, scoring='f1_weighted'
        )
        
        train_mean = train_scores.mean(axis=1)
        train_std = train_scores.std(axis=1)
        val_mean = val_scores.mean(axis=1)
        val_std = val_scores.std(axis=1)
        
        plt.figure(figsize=(10, 6))
        plt.plot(train_sizes, train_mean, 'o-', color='blue', label='Training Score')
        plt.fill_between(train_sizes, train_mean - train_std, train_mean + train_std, alpha=0.1, color='blue')
        
        plt.plot(train_sizes, val_mean, 'o-', color='red', label='Validation Score')
        plt.fill_between(train_sizes, val_mean - val_std, val_mean + val_std, alpha=0.1, color='red')
        
        plt.xlabel('Training Set Size')
        plt.ylabel('F1 Score')
        plt.title('Learning Curves')
        plt.legend(loc='best')
        plt.grid(True)
        plt.show()
        
        return train_sizes, train_scores, val_scores
    
    def clinical_validation_metrics(self):
        """Compute clinical validation metrics specific to mental health"""
        # Sensitivity for high-risk cases (critical for mental health)
        high_risk_mask = (self.y_test == 2)  # Assuming 2 is high risk
        high_risk_sensitivity = recall_score(
            self.y_test[high_risk_mask], 
            self.y_pred[high_risk_mask], 
            pos_label=2, 
            average='binary'
        )
        
        # False positive rate for low-risk cases
        low_risk_mask = (self.y_test == 0)  # Assuming 0 is low risk
        low_risk_specificity = 1 - recall_score(
            (self.y_test == 0).astype(int),
            (self.y_pred == 0).astype(int),
            pos_label=0
        )
        
        clinical_metrics = {
            'high_risk_sensitivity': high_risk_sensitivity,
            'low_risk_specificity': low_risk_specificity,
            'overall_accuracy': accuracy_score(self.y_test, self.y_pred)
        }
        
        return clinical_metrics`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ModelEvaluation;