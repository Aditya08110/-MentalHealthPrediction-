import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';

const Dashboard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard/data" replace />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard>
                <Navigate to="/dashboard/data" replace />
              </Dashboard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/data"
          element={
            <ProtectedRoute>
              <Dashboard>
                <DataCollection />
              </Dashboard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/eda"
          element={
            <ProtectedRoute>
              <Dashboard>
                <ExploratoryAnalysis />
              </Dashboard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/features"
          element={
            <ProtectedRoute>
              <Dashboard>
                <FeatureEngineering />
              </Dashboard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/model"
          element={
            <ProtectedRoute>
              <Dashboard>
                <ModelTraining />
              </Dashboard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/evaluation"
          element={
            <ProtectedRoute>
              <Dashboard>
                <ModelEvaluation />
              </Dashboard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/prediction"
          element={
            <ProtectedRoute>
              <Dashboard>
                <RiskAssessment />
              </Dashboard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/explainable"
          element={
            <ProtectedRoute>
              <Dashboard>
                <ExplainableAI />
              </Dashboard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/games"
          element={
            <ProtectedRoute>
              <Dashboard>
                <MoodBoostingGames />
              </Dashboard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/avatar"
          element={
            <ProtectedRoute>
              <Dashboard>
                <EmotionalAvatar />
              </Dashboard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/relax"
          element={
            <ProtectedRoute>
              <Dashboard>
                <RelaxAndHeal />
              </Dashboard>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;