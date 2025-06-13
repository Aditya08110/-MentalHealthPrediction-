import React, { useState, useEffect } from 'react';
import { Smartphone, Wifi, MapPin, Clock, Battery } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateMockSensorData } from '../utils/mockData';
import { SensorData } from '../types';

const DataCollection: React.FC = () => {
  const [isCollecting, setIsCollecting] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [realtimeData, setRealtimeData] = useState<Partial<SensorData>>({});

  useEffect(() => {
    const data = generateMockSensorData(7);
    setSensorData(data);
  }, []);

  useEffect(() => {
    if (isCollecting) {
      const interval = setInterval(() => {
        setRealtimeData({
          screen_time_minutes: Math.floor(Math.random() * 600),
          steps: Math.floor(Math.random() * 12000),
          heart_rate: Math.floor(70 + Math.random() * 20),
          battery_level: Math.floor(Math.random() * 100),
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isCollecting]);

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

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Sensor Data Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="screenTime" stroke="#3b82f6" strokeWidth={3} name="Screen Time (min)" />
                <Line type="monotone" dataKey="steps" stroke="#10b981" strokeWidth={3} name="Steps (x100)" />
                <Line type="monotone" dataKey="sleepHours" stroke="#f59e0b" strokeWidth={3} name="Sleep Hours" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Collection Architecture</h3>
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-green-400 text-sm">
{`# data_collection.py
import json
import datetime
from typing import Dict, List
import sqlite3

class SmartphoneDataCollector:
    def __init__(self, db_path: str = "sensor_data.db"):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize SQLite database for sensor data storage"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS sensor_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            gps_latitude REAL,
            gps_longitude REAL,
            screen_time_minutes INTEGER,
            calls_count INTEGER,
            sms_count INTEGER,
            steps INTEGER,
            sleep_hours REAL,
            heart_rate INTEGER,
            app_usage_social INTEGER,
            app_usage_productivity INTEGER,
            battery_level INTEGER
        )
        ''')
        
        conn.commit()
        conn.close()
    
    def collect_sensor_data(self) -> Dict:
        """Collect real-time sensor data from smartphone APIs"""
        # In production, this would interface with actual sensors
        return {
            "timestamp": datetime.datetime.now().isoformat(),
            "gps_latitude": self.get_gps_data()["latitude"],
            "gps_longitude": self.get_gps_data()["longitude"],
            "screen_time_minutes": self.get_screen_time(),
            "calls_count": self.get_call_log_count(),
            "sms_count": self.get_sms_count(),
            "steps": self.get_step_count(),
            "sleep_hours": self.get_sleep_data(),
            "heart_rate": self.get_heart_rate(),
            "app_usage_social": self.get_app_usage("social"),
            "app_usage_productivity": self.get_app_usage("productivity"),
            "battery_level": self.get_battery_level()
        }`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default DataCollection;