import React, { useState, useEffect } from 'react';
import { Brain, Zap, Target, TrendingUp, Play, Pause } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const ModelTraining: React.FC = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [selectedModel, setSelectedModel] = useState<'random_forest' | 'svm' | 'neural_network' | 'xgboost'>('random_forest');

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

  const trainingHistory = [
    { epoch: 1, loss: 0.8, accuracy: 0.65, val_loss: 0.85, val_accuracy: 0.62 },
    { epoch: 2, loss: 0.6, accuracy: 0.72, val_loss: 0.68, val_accuracy: 0.69 },
    { epoch: 3, loss: 0.45, accuracy: 0.78, val_loss: 0.52, val_accuracy: 0.75 },
    { epoch: 4, loss: 0.35, accuracy: 0.83, val_loss: 0.48, val_accuracy: 0.79 },
    { epoch: 5, loss: 0.28, accuracy: 0.87, val_loss: 0.44, val_accuracy: 0.82 },
    { epoch: 6, loss: 0.22, accuracy: 0.89, val_loss: 0.41, val_accuracy: 0.85 },
  ];

  const featureImportance = [
    { feature: 'Social Interaction', importance: 0.25 },
    { feature: 'Sleep Regularity', importance: 0.22 },
    { feature: 'Activity Level', importance: 0.20 },
    { feature: 'Digital Wellbeing', importance: 0.18 },
    { feature: 'Circadian Rhythm', importance: 0.15 },
  ];

  useEffect(() => {
    if (isTraining) {
      const interval = setInterval(() => {
        setTrainingProgress(prev => {
          if (prev >= 100) {
            setIsTraining(false);
            setCurrentEpoch(0);
            return 0;
          }
          setCurrentEpoch(Math.floor(prev / 16.67) + 1);
          return prev + 2;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isTraining]);

  const selectedModelData = models.find(m => m.id === selectedModel);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Model Training</h2>
            <p className="text-gray-600 mt-1">Train machine learning models for mental health prediction</p>
          </div>
          <button
            onClick={() => setIsTraining(!isTraining)}
            disabled={isTraining}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              isTraining
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isTraining ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
            {isTraining ? 'Training...' : 'Start Training'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {models.map((model) => {
            const Icon = model.icon;
            return (
              <div
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`${model.bgColor} rounded-lg p-4 border border-gray-100 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedModel === model.id ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-6 h-6 ${model.color}`} />
                  <span className={`text-lg font-bold ${model.color}`}>
                    {(model.accuracy * 100).toFixed(0)}%
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{model.name}</h3>
                <p className="text-sm text-gray-600">{model.description}</p>
              </div>
            );
          })}
        </div>

        {isTraining && (
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Training Progress</h3>
              <span className="text-sm text-gray-600">Epoch {currentEpoch}/6</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${trainingProgress}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Loss:</span>
                <span className="ml-2 font-medium">{(0.8 - (trainingProgress / 100) * 0.6).toFixed(3)}</span>
              </div>
              <div>
                <span className="text-gray-600">Accuracy:</span>
                <span className="ml-2 font-medium">{(0.65 + (trainingProgress / 100) * 0.25).toFixed(3)}</span>
              </div>
              <div>
                <span className="text-gray-600">Val Loss:</span>
                <span className="ml-2 font-medium">{(0.85 - (trainingProgress / 100) * 0.45).toFixed(3)}</span>
              </div>
              <div>
                <span className="text-gray-600">Val Acc:</span>
                <span className="ml-2 font-medium">{(0.62 + (trainingProgress / 100) * 0.25).toFixed(3)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Training History</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trainingHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="epoch" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} name="Training Acc" />
                  <Line type="monotone" dataKey="val_accuracy" stroke="#3b82f6" strokeWidth={2} name="Validation Acc" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Importance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={featureImportance} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" domain={[0, 0.3]} stroke="#6b7280" />
                  <YAxis dataKey="feature" type="category" width={100} stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="importance" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Training Pipeline</h3>
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-green-400 text-sm">
{`# model_training.py
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix
import xgboost as xgb
import joblib

class MentalHealthPredictor:
    def __init__(self):
        self.models = {
            'random_forest': RandomForestClassifier(
                n_estimators=100,
                max_depth=10,
                random_state=42
            ),
            'svm': SVC(
                kernel='rbf',
                probability=True,
                random_state=42
            ),
            'neural_network': MLPClassifier(
                hidden_layer_sizes=(128, 64, 32),
                activation='relu',
                solver='adam',
                max_iter=1000,
                random_state=42
            ),
            'xgboost': xgb.XGBClassifier(
                n_estimators=100,
                max_depth=6,
                learning_rate=0.1,
                random_state=42
            )
        }
        self.scaler = StandardScaler()
        self.trained_models = {}
        
    def prepare_data(self, features: pd.DataFrame, target: pd.Series):
        """Prepare data for training with proper preprocessing"""
        # Handle missing values
        features_clean = features.fillna(features.mean())
        
        # Create target labels based on risk thresholds
        # 0: Low Risk, 1: Medium Risk, 2: High Risk
        target_labels = pd.cut(target, 
                              bins=[0, 0.3, 0.7, 1.0], 
                              labels=[0, 1, 2],
                              include_lowest=True)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            features_clean, target_labels, 
            test_size=0.2, 
            random_state=42,
            stratify=target_labels
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        return X_train_scaled, X_test_scaled, y_train, y_test
    
    def train_model(self, model_name: str, X_train, y_train):
        """Train a specific model with hyperparameter optimization"""
        if model_name not in self.models:
            raise ValueError(f"Model {model_name} not supported")
        
        model = self.models[model_name]
        
        # Hyperparameter tuning for Random Forest
        if model_name == 'random_forest':
            param_grid = {
                'n_estimators': [50, 100, 200],
                'max_depth': [10, 15, 20],
                'min_samples_split': [2, 5, 10]
            }
            
            grid_search = GridSearchCV(
                model, param_grid, 
                cv=5, scoring='f1_weighted',
                n_jobs=-1
            )
            grid_search.fit(X_train, y_train)
            best_model = grid_search.best_estimator_
        else:
            best_model = model.fit(X_train, y_train)
        
        self.trained_models[model_name] = best_model
        return best_model
    
    def evaluate_model(self, model, X_test, y_test):
        """Comprehensive model evaluation"""
        predictions = model.predict(X_test)
        probabilities = model.predict_proba(X_test)
        
        # Cross-validation scores
        cv_scores = cross_val_score(model, X_test, y_test, cv=5)
        
        evaluation_metrics = {
            'accuracy': model.score(X_test, y_test),
            'cv_mean': cv_scores.mean(),
            'cv_std': cv_scores.std(),
            'classification_report': classification_report(y_test, predictions),
            'confusion_matrix': confusion_matrix(y_test, predictions)
        }
        
        return evaluation_metrics, predictions, probabilities
    
    def get_feature_importance(self, model_name: str, feature_names: list):
        """Extract feature importance from trained models"""
        if model_name not in self.trained_models:
            raise ValueError(f"Model {model_name} not trained yet")
        
        model = self.trained_models[model_name]
        
        if hasattr(model, 'feature_importances_'):
            importance = model.feature_importances_
        elif hasattr(model, 'coef_'):
            importance = np.abs(model.coef_[0])
        else:
            return None
        
        feature_importance = pd.DataFrame({
            'feature': feature_names,
            'importance': importance
        }).sort_values('importance', ascending=False)
        
        return feature_importance
    
    def save_model(self, model_name: str, filepath: str):
        """Save trained model to disk"""
        if model_name in self.trained_models:
            joblib.dump({
                'model': self.trained_models[model_name],
                'scaler': self.scaler
            }, filepath)
    
    def load_model(self, filepath: str):
        """Load trained model from disk"""
        loaded = joblib.load(filepath)
        return loaded['model'], loaded['scaler']`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ModelTraining;