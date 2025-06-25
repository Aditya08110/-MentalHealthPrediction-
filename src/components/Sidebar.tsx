import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Database,
  BarChart2,
  Cpu,
  Activity,
  LineChart,
  Shield,
  Brain,
  Gamepad2,
  User,
  Music,
  Camera,
  LogOut,
  ClipboardCheck,
  FileText,
  HeartHandshake,
  BookOpen
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const menuItems = [
    { id: 'manual', label: 'Manual Data Entry', path: '/dashboard/manual', icon: FileText },
    { id: 'selfcare', label: 'Self-Care & Support', path: '/dashboard/selfcare', icon: HeartHandshake },
    { id: 'data', label: 'Data Collection', path: '/dashboard/data', icon: Database },
    { id: 'analysis', label: 'Exploratory Analysis', path: '/dashboard/analysis', icon: BarChart2 },
    { id: 'features', label: 'Feature Engineering', path: '/dashboard/features', icon: Cpu },
    { id: 'training', label: 'Model Training', path: '/dashboard/training', icon: Activity },
    { id: 'evaluation', label: 'Model Evaluation', path: '/dashboard/evaluation', icon: LineChart },
    { id: 'risk', label: 'Risk Assessment', path: '/dashboard/risk', icon: Shield },
    { id: 'explain', label: 'Explainable AI', path: '/dashboard/explain', icon: Brain },
    { id: 'games', label: 'Mood-Boosting Games', path: '/dashboard/games', icon: Gamepad2 },
    { id: 'avatar', label: 'Emotional Avatar', path: '/dashboard/avatar', icon: User },
    { id: 'relax', label: 'Relax & Heal', path: '/dashboard/relax', icon: Music },
    { id: 'multimodal', label: 'Multimodal Prediction', path: '/dashboard/multimodal', icon: Camera },
    { id: 'assessment', label: 'Mental Health Assessment', path: '/dashboard/assessment', icon: ClipboardCheck },
    { id: 'feedback', label: 'Feedback & Journal', path: '/dashboard/feedback', icon: BookOpen },
    { id: 'research', label: 'Research & Reports', path: '/dashboard/research', icon: FileText },
  ];

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
                  className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${isActive
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