import React, { useState, useEffect } from 'react';
import { Smartphone, MapPin, Clock, Battery, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { generateMockSensorData } from '../utils/mockData';
import { SensorData } from '../types';

const DataCollection: React.FC = () => {
  const [isCollecting, setIsCollecting] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [realtimeData, setRealtimeData] = useState<Partial<SensorData>>({});
  const [storedData, setStoredData] = useState<SensorData[]>([]);

  useEffect(() => {
    const data = generateMockSensorData(7);
    setSensorData(data);
    // Load stored data from localStorage on component mount
    const savedData = localStorage.getItem('collectedSensorData');
    if (savedData) {
      setStoredData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    if (isCollecting) {
      const interval = setInterval(() => {
        const newData = {
          timestamp: new Date().toISOString(),
          screen_time_minutes: Math.floor(Math.random() * 600),
          steps: Math.floor(Math.random() * 12000),
          heart_rate: Math.floor(70 + Math.random() * 20),
          battery_level: Math.floor(Math.random() * 100),
          gps_latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
          gps_longitude: -74.0060 + (Math.random() - 0.5) * 0.1,
          calls_count: Math.floor(Math.random() * 10),
          sms_count: Math.floor(Math.random() * 20),
          app_usage_social: Math.floor(60 + Math.random() * 120),
          app_usage_productivity: Math.floor(30 + Math.random() * 60),
          sleep_hours: 6 + Math.random() * 3,
        };
        setRealtimeData(newData);

        // Automatically save the data point
        const updatedStoredData = [...storedData, newData as SensorData];
        setStoredData(updatedStoredData);
        localStorage.setItem('collectedSensorData', JSON.stringify(updatedStoredData));
      }, 2000); // Collecting data every 2 seconds

      return () => clearInterval(interval);
    }
  }, [isCollecting, storedData]);

  const handleExportData = () => {
    const dataStr = JSON.stringify(storedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sensor_data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClearStoredData = () => {
    setStoredData([]);
    localStorage.removeItem('collectedSensorData');
  };

  const sensorMetrics = [
    {
      icon: Smartphone,
      label: 'Screen Time',
      value: `${realtimeData.screen_time_minutes || 0}min`,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      icon: MapPin,
      label: 'Daily Steps',
      value: `${realtimeData.steps || 0}`,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    {
      icon: Clock,
      label: 'Heart Rate',
      value: `${realtimeData.heart_rate || 0} BPM`,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10'
    },
    {
      icon: Battery,
      label: 'Battery Level',
      value: `${realtimeData.battery_level || 0}%`,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10'
    },
  ];

  const chartData = sensorData.map((data, index) => ({
    day: `Day ${index + 1}`,
    screenTime: data.screen_time_minutes,
    steps: data.steps / 100,
    sleepHours: data.sleep_hours,
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Title section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Data Collection</h2>
            <p className="text-gray-600 mt-1">Real-time smartphone sensor data acquisition</p>
          </div>
          <button
            onClick={() => setIsCollecting(!isCollecting)}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              isCollecting
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isCollecting ? 'Stop Collection' : 'Start Collection'}
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {sensorMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className={`${metric.bgColor} rounded-lg p-4 border border-gray-100`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                    <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${metric.color}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Graph Section */}
        <div className="space-y-4">
          <div className="border-t pt-4">
            <h3 className="text-xl font-semibold mb-2">Weekly Activity Trends</h3>
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="flex items-center">
                <div className="w-4 h-0.5 bg-blue-500 mr-2"></div>
                <span className="text-sm">Screen Time (minutes)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-0.5 bg-green-500 mr-2"></div>
                <span className="text-sm">Physical Activity (steps/100)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-0.5 bg-red-500 mr-2"></div>
                <span className="text-sm">Sleep Duration (hours)</span>
              </div>
            </div>
          </div>

          {/* Chart Container */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 80, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="day"
                  tick={{ fontSize: 12 }}
                >
                  <Label 
                    value="Day in Month" 
                    position="bottom" 
                    offset={20}
                    style={{ fontSize: 14 }}
                  />
                </XAxis>
                <YAxis
                  tick={{ fontSize: 12 }}
                >
                  <Label 
                    value="Activity Metrics" 
                    angle={-90} 
                    position="insideLeft"
                    offset={-60}  // Adjusted offset
                    style={{ 
                      fontSize: 14,
                      textAnchor: 'middle'
                    }}
                  />
                </YAxis>
                <Tooltip 
                  contentStyle={{ fontSize: 12 }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="screenTime" 
                  stroke="#3B82F6" 
                  name="Screen Time (min)"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="steps" 
                  stroke="#22C55E" 
                  name="Steps (x100)"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="sleepHours" 
                  stroke="#EF4444" 
                  name="Sleep (hours)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Stored Data section remains the same */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Stored Data</h2>
            <p className="text-gray-600 mt-1">View and manage collected data points</p>
            {isCollecting && (
              <p className="text-green-500 mt-1">
                Automatically saving data points every 2 seconds...
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportData}
              disabled={storedData.length === 0}
              className="px-4 py-2 rounded-lg font-medium bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 disabled:opacity-50"
            >
              <Download className="w-4 h-4 inline-block mr-2" />
              Export Data
            </button>
            <button
              onClick={handleClearStoredData}
              disabled={storedData.length === 0}
              className="px-4 py-2 rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white transition-all duration-200 disabled:opacity-50"
            >
              Clear Data
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Screen Time
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Steps
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Heart Rate
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Battery Level
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {storedData.map((data, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(data.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {data.screen_time_minutes} min
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {data.steps}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {data.heart_rate} BPM
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {data.battery_level}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {storedData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No data points stored yet. Click "Start Collection" to begin collecting and storing data automatically.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataCollection;
