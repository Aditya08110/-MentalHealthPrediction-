import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import ErrorBoundary from './components/ErrorBoundary';
import Sidebar from './components/Sidebar';
import DataCollection from './components/DataCollection';
import ExploratoryAnalysis from './components/ExploratoryAnalysis';
import FeatureEngineering from './components/FeatureEngineering';
import ModelTraining from './components/ModelTraining';
import ModelEvaluation from './components/ModelEvaluation';
import RiskAssessment from './components/RiskAssessment';
import ExplainableAI from './components/ExplainableAI';
import MoodBoostingGames from './components/MoodBoostingGames';
import EmotionalAvatar from './components/EmotionalAvatar';
import RelaxAndHeal from './components/RelaxAndHeal';
import MultimodalPredictionEngine from './components/MultimodalPredictionEngine';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';

const Dashboard = ({ children }: { children: React.ReactNode }) => {
  console.log('Dashboard rendering with children:', children);
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard/data" replace />} />
            <Route path="/dashboard" element={<Dashboard><Outlet /></Dashboard>}>
              <Route path="data" element={
                <ProtectedRoute>
                  <DataCollection />
                </ProtectedRoute>
              } />
              <Route path="analysis" element={
                <ProtectedRoute>
                  <ExploratoryAnalysis />
                </ProtectedRoute>
              } />
              <Route path="features" element={
                <ProtectedRoute>
                  <FeatureEngineering />
                </ProtectedRoute>
              } />
              <Route path="model" element={
                <ProtectedRoute>
                  <ModelTraining />
                </ProtectedRoute>
              } />
              <Route path="evaluation" element={
                <ProtectedRoute>
                  <ModelEvaluation />
                </ProtectedRoute>
              } />
              <Route path="prediction" element={
                <ProtectedRoute>
                  <RiskAssessment />
                </ProtectedRoute>
              } />
              <Route path="explainable" element={
                <ProtectedRoute>
                  <ExplainableAI />
                </ProtectedRoute>
              } />
              <Route path="games" element={
                <ProtectedRoute>
                  <MoodBoostingGames />
                </ProtectedRoute>
              } />
              <Route path="avatar" element={
                <ProtectedRoute>
                  <EmotionalAvatar />
                </ProtectedRoute>
              } />
              <Route path="relax" element={
                <ProtectedRoute>
                  <RelaxAndHeal />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </ErrorBoundary>
  );
}

export default App;