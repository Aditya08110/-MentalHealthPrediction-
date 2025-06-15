import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Database,
  BarChart3,
  Brain,
  Shield,
  Activity,
  TrendingUp,
  AlertTriangle,
  LogOut,
  Heart,
  Music,
  Bot
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'data', path: '/dashboard/data', icon: Database, label: 'Data Collection' },
    { id: 'analysis', path: '/dashboard/analysis', icon: BarChart3, label: 'Data Analysis' },
    { id: 'features', path: '/dashboard/features', icon: Activity, label: 'Feature Engineering' },
    { id: 'model', path: '/dashboard/model', icon: Brain, label: 'Model Training' },
    { id: 'evaluation', path: '/dashboard/evaluation', icon: TrendingUp, label: 'Model Evaluation' },
    { id: 'prediction', path: '/dashboard/prediction', icon: AlertTriangle, label: 'Risk Assessment' },
    { id: 'explainable', path: '/dashboard/explainable', icon: Shield, label: 'Explainable AI' },
    { id: 'games', path: '/dashboard/games', icon: Heart, label: 'Mood Boosting Games' },
    { id: 'avatar', path: '/dashboard/avatar', icon: Bot, label: 'Emotional Avatar' },
    { id: 'relax', path: '/dashboard/relax', icon: Music, label: 'Relax & Heal' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">MindWatch AI</h1>
        <p className="text-sm text-gray-600">Mental Health Analytics</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.id}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;