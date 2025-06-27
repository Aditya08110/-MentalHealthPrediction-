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
import MentalHealthAssessment from './components/MentalHealthAssessment';
import ManualDataEntry from './components/ManualDataEntry';
import SelfCareSupport from './components/SelfCareSupport';
import FeedbackJournal from './components/FeedbackJournal';
import ResearchReport from './components/ResearchReport';

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
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard>
                    <Outlet />
                  </Dashboard>
                </ProtectedRoute>
              }
            >
              <Route path="manual" element={<ManualDataEntry />} />
              <Route path="data" element={<DataCollection />} />
              <Route path="analysis" element={<ExploratoryAnalysis />} />
              <Route path="features" element={<FeatureEngineering />} />
              <Route path="training" element={<ModelTraining />} />
              <Route path="evaluation" element={<ModelEvaluation />} />
              <Route path="risk" element={<RiskAssessment />} />
              <Route path="explain" element={<ExplainableAI />} />
              <Route path="games" element={<MoodBoostingGames />} />
              <Route path="avatar" element={<EmotionalAvatar />} />
              <Route path="relax" element={<RelaxAndHeal />} />
              <Route path="multimodal" element={<MultimodalPredictionEngine />} />
              <Route path="assessment" element={<MentalHealthAssessment />} />
              <Route path="feedback" element={<FeedbackJournal />} />
              <Route path="research" element={<ResearchReport />} />
              <Route path="selfcare" element={<SelfCareSupport />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </ErrorBoundary>
  );
}

export default App;