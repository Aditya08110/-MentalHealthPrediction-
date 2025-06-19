import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Moon, Sun } from '@phosphor-icons/react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any existing authentication when the login page loads
    localStorage.removeItem('isAuthenticated');
    // Apply dark mode class
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate network delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));

      if (username === 'Aditya.k' && password === 'Aditya2004$') {
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/dashboard/data');
      } else {
        setError('Invalid credentials. Please check your username and password.');
      }
    } catch (err) {
      setError('An error occurred while logging in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', (!darkMode).toString());
  };

  const inspirationalQuote = {
    text: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
    author: "MindWatch AI"
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Left side - Background gradient and content */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500 opacity-90 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.4)_100%)] z-20" />
        <div className="relative z-30 flex flex-col items-center justify-center w-full p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <p className="text-xl italic mb-4 font-light">"{inspirationalQuote.text}"</p>
            <p className="text-sm">— {inspirationalQuote.author}</p>
          </motion.div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className={`flex-1 flex items-center justify-center p-8 
        ${darkMode ? 'dark:bg-gray-900' : 'bg-gray-50'}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`w-full max-w-md p-8 rounded-2xl shadow-xl 
            ${darkMode ? 'dark:bg-gray-800 dark:border-gray-700' : 'bg-white'}
            border border-gray-200`}
        >
          <div className="absolute top-4 right-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full 
                ${darkMode ? 'text-yellow-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>

          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-4"
            >
              <Brain size={48} className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} weight="duotone" />
            </motion.div>
            <h1 className={`text-3xl font-bold mb-2 
              ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              MindWatch AI
            </h1>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Mental Health Prediction System
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded bg-red-50 border border-red-200 dark:bg-red-900/50 dark:border-red-800"
            >
              <p className="text-sm text-red-600 dark:text-red-200">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className={`block text-sm font-medium mb-2 
                ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  ${darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                placeholder="Enter your username"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className={`block text-sm font-medium mb-2 
                ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  ${darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-colors
                ${loading
                  ? 'bg-blue-400 dark:bg-blue-600 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'} 
                focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </motion.button>

            <div className={`mt-4 text-center text-sm 
              ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <p>Contact administrator for login credentials</p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
