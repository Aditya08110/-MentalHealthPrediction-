import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DataAnalysis: React.FC = () => {
    const { sensorData, getProcessedMetrics } = useData();
    const [metrics, setMetrics] = useState(getProcessedMetrics());

    useEffect(() => {
        setMetrics(getProcessedMetrics());
    }, [sensorData]);

    return (
        <div className="data-analysis p-6">
            <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Screen Time</h3>
                    <p className="text-2xl">{metrics.screenTime} min</p>
                    <p className={`text-sm ${metrics.screenTime > 300 ? 'text-red-500' : 'text-green-500'}`}>
                        {metrics.screenTime > 300 ? '+32%' : '-12%'} from average
                    </p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Social Interaction</h3>
                    <p className="text-2xl">{metrics.socialInteraction}</p>
                    <p className="text-sm text-red-500">-45% from last month</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Sleep Hours</h3>
                    <p className="text-2xl">{metrics.sleepHours} hrs</p>
                    <p className="text-sm text-yellow-500">73% consistency</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Physical Activity</h3>
                    <p className="text-2xl">{metrics.physicalActivity} steps</p>
                    <p className="text-sm text-green-500">+15% this week</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Data Visualization</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={sensorData.slice(-30)} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="screen_time_minutes"
                            stroke="#2563eb"
                            name="Screen Time"
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="steps"
                            stroke="#16a34a"
                            name="Steps"
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="heart_rate"
                            stroke="#dc2626"
                            name="Heart Rate"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DataAnalysis;
