import React, { useState, useEffect } from 'react';
import { Smartphone, MapPin, Clock, Battery, Download, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { SensorData, DATA_RANGES, SensorDataValidation } from '../types';
import { useData } from '../context/DataContext';

const DataCollection: React.FC = () => {
  const [isCollecting, setIsCollecting] = useState(false);
  const [realtimeData, setRealtimeData] = useState<Partial<SensorData>>({});
  const [dataQuality, setDataQuality] = useState<number>(1);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { sensorData, addSensorData, clearData } = useData();

  // Generate realistic, correlated sensor data
  const generateRealisticData = (previousData?: SensorData): SensorData => {
    const now = new Date();
    const hour = now.getHours();

    // Base patterns
    const isNightTime = hour >= 22 || hour <= 6;
    const isWorkingHours = hour >= 9 && hour <= 17;
    const isEveningTime = hour >= 18 && hour <= 21;

    // Activity level based on time of day
    const activityMultiplier = isNightTime ? 0.2 : 
                              isWorkingHours ? 0.8 : 
                              isEveningTime ? 0.6 : 0.4;

    // Generate correlated metrics
    let steps = Math.floor(
      DATA_RANGES.STEPS.LOW_RISK * activityMultiplier * (0.8 + Math.random() * 0.4)
    );

    // Heart rate correlates with activity
    const baseHeartRate = 60;
    const activityImpact = (steps / DATA_RANGES.STEPS.LOW_RISK) * 20;
    let heartRate = Math.floor(
      baseHeartRate + activityImpact + (Math.random() - 0.5) * 10
    );

    // Sleep hours - more realistic pattern
    let sleepHours = isNightTime ? 
      7 + Math.random() * 2 : // Night time sleep
      (Math.random() < 0.1 ? 0.5 + Math.random() : 0); // Occasional naps

    // Screen time correlates negatively with activity
    let screenTime = Math.floor(
      DATA_RANGES.SCREEN_TIME.LOW_RISK * (2 - activityMultiplier) * (0.8 + Math.random() * 0.4)
    );

    // Social interactions correlate with time of day
    let socialActivity = Math.floor(
      DATA_RANGES.SOCIAL_INTERACTION.LOW_RISK * activityMultiplier * (0.8 + Math.random() * 0.4)
    );

    // Add some trend continuation from previous data
    if (previousData) {
      steps = Math.floor((steps + previousData.steps) / 2);
      heartRate = Math.floor((heartRate + previousData.heart_rate) / 2);
      screenTime = Math.floor((screenTime + previousData.screen_time_minutes) / 2);
      socialActivity = Math.floor((socialActivity + previousData.app_usage_social) / 2);
    }

    // Ensure values are within valid ranges
    steps = Math.max(DATA_RANGES.STEPS.MIN, Math.min(DATA_RANGES.STEPS.MAX, steps));
    heartRate = Math.max(DATA_RANGES.HEART_RATE.MIN, Math.min(DATA_RANGES.HEART_RATE.MAX, heartRate));
    sleepHours = Math.max(DATA_RANGES.SLEEP_HOURS.MIN, Math.min(DATA_RANGES.SLEEP_HOURS.MAX, sleepHours));
    screenTime = Math.max(DATA_RANGES.SCREEN_TIME.MIN, Math.min(DATA_RANGES.SCREEN_TIME.MAX, screenTime));
    socialActivity = Math.max(DATA_RANGES.SOCIAL_INTERACTION.MIN, Math.min(DATA_RANGES.SOCIAL_INTERACTION.MAX, socialActivity));

    const newData: SensorData = {
      timestamp: now.toISOString(),
      steps,
      heart_rate: heartRate,
      sleep_hours: sleepHours,
      screen_time_minutes: screenTime,
      battery_level: Math.floor(20 + Math.random() * 80),
      gps_latitude: 40.7128 + (Math.random() - 0.5) * 0.01,
      gps_longitude: -74.0060 + (Math.random() - 0.5) * 0.01,
      calls_count: Math.floor(socialActivity * 0.2),
      sms_count: Math.floor(socialActivity * 0.3),
      app_usage_social: socialActivity,
      app_usage_productivity: Math.floor(screenTime * (isWorkingHours ? 0.6 : 0.2))
    };

    // Validate data quality
    const validation = validateSensorData(newData);
    setValidationErrors(validation.errors);
    const quality = calculateDataQuality(newData, validation);
    setDataQuality(quality);

    return newData;
  };

  const validateSensorData = (data: SensorData): SensorDataValidation => {
    const errors: string[] = [];
    
    if (data.steps < DATA_RANGES.STEPS.MIN || data.steps > DATA_RANGES.STEPS.MAX)
      errors.push(`Invalid steps count: ${data.steps}`);
    
    if (data.heart_rate < DATA_RANGES.HEART_RATE.MIN || data.heart_rate > DATA_RANGES.HEART_RATE.MAX)
      errors.push(`Invalid heart rate: ${data.heart_rate}`);
    
    if (data.sleep_hours < DATA_RANGES.SLEEP_HOURS.MIN || data.sleep_hours > DATA_RANGES.SLEEP_HOURS.MAX)
      errors.push(`Invalid sleep hours: ${data.sleep_hours}`);
    
    if (data.screen_time_minutes < DATA_RANGES.SCREEN_TIME.MIN || data.screen_time_minutes > DATA_RANGES.SCREEN_TIME.MAX)
      errors.push(`Invalid screen time: ${data.screen_time_minutes}`);

    return { isValid: errors.length === 0, errors };
  };

  const calculateDataQuality = (data: SensorData, validation: SensorDataValidation): number => {
    if (!validation.isValid) return 0;

    // Check for realistic correlations
    const correlationScore = (
      (data.steps > 5000 && data.heart_rate > 70 ? 0.2 : 0) + // Activity correlation
      (data.screen_time_minutes < 300 && data.steps > 8000 ? 0.2 : 0) + // Screen time vs activity
      (data.sleep_hours >= 6 && data.sleep_hours <= 9 ? 0.2 : 0) + // Normal sleep range
      (data.app_usage_social > 30 && data.calls_count + data.sms_count > 5 ? 0.2 : 0) + // Social correlation
      0.2 // Base quality
    );

    return correlationScore;
  };

  useEffect(() => {
    if (isCollecting) {
      console.log('Starting data collection with realistic patterns');
      const interval = setInterval(() => {
        const newData = generateRealisticData(sensorData[sensorData.length - 1]);
        console.log('Generated realistic data:', newData);
        setRealtimeData(newData);
        if (newData) {
          addSensorData(newData);
        }
      }, 2000);

      return () => {
        console.log('Cleaning up data collection interval');
        clearInterval(interval);
      };
    }
  }, [isCollecting, addSensorData, sensorData]);

  const handleExportData = () => {
    const dataStr = JSON.stringify(sensorData, null, 2);
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
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${isCollecting
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
          >
            {isCollecting ? 'Stop Collection' : 'Start Collection'}
          </button>
        </div>

        {/* Data Quality Indicator */}
        <div className="mb-4 p-4 rounded-lg bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Data Quality</h3>
              <div className="mt-1 flex items-center">
                <div className="w-48 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      dataQuality > 0.8 ? 'bg-green-500' :
                      dataQuality > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${dataQuality * 100}%` }}
                  />
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {(dataQuality * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            {validationErrors.length > 0 && (
              <div className="text-red-500 text-sm">
                <AlertTriangle className="inline-block mr-1 h-4 w-4" />
                {validationErrors.length} validation issues
              </div>
            )}
          </div>
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
              disabled={sensorData.length === 0}
              className="px-4 py-2 rounded-lg font-medium bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 disabled:opacity-50"
            >
              <Download className="w-4 h-4 inline-block mr-2" />
              Export Data
            </button>
            <button
              onClick={clearData}
              disabled={sensorData.length === 0}
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
              {sensorData.map((data, index) => (
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
          {sensorData.length === 0 && (
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
