import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ModelEvaluationChartProps {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
}

const ModelEvaluationChart: React.FC<ModelEvaluationChartProps> = ({ accuracy, precision, recall, f1 }) => {
    const data = [
        { name: 'Accuracy', value: accuracy },
        { name: 'Precision', value: precision },
        { name: 'Recall', value: recall },
        { name: 'F1 Score', value: f1 },
    ];

    return (
        <div style={{ width: 400, height: 300, background: '#fff', padding: 16 }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 1]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#1e40af" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ModelEvaluationChart;
