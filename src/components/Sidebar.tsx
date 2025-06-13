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
  LogOut
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop() || 'data';

  const menuItems = [
    { id: 'data', icon: Database, label: 'Data Collection' },
    { id: 'eda', icon: BarChart3, label: 'Data Analysis' },
    { id: 'features', icon: Activity, label: 'Feature Engineering' },
    { id: 'model', icon: Brain, label: 'Model Training' },
    { id: 'evaluation', icon: TrendingUp, label: 'Model Evaluation' },
    { id: 'prediction', icon: AlertTriangle, label: 'Risk Assessment' },
    { id: 'explainable', icon: Shield, label: 'Explainable AI' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
          MindWatch AI
        </h1>
        <p className="text-sm text-gray-400 mt-1">Mental Health Prediction</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => navigate(`/dashboard/${item.id}`)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    currentPath === item.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">System Status</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <p className="text-xs text-gray-300">Model Active • Realtime Monitoring</p>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full mt-4 flex items-center px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;