import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { SensorData } from '../types';

interface ModelMetrics {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
}

interface PerformanceHistoryEntry {
    epoch: number;
    loss: number;
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
}

interface DataContextType {
    sensorData: SensorData[];
    addSensorData: (data: SensorData) => void;
    clearData: () => void;
    modelMetrics: ModelMetrics | null;
    updateModelMetrics: (metrics: ModelMetrics) => void;
    performanceHistory: PerformanceHistoryEntry[];
    updatePerformanceHistory: (history: PerformanceHistoryEntry[]) => void;
}

// Create context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Generate mock data for the last 7 days
const generateInitialMockData = (): SensorData[] => {
    const mockData: SensorData[] = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        mockData.push({
            timestamp: date.toISOString(),
            heart_rate: Math.floor(60 + Math.random() * 30),
            steps: Math.floor(3000 + Math.random() * 8000),
            sleep_hours: 5 + Math.random() * 4,
            screen_time_minutes: 240 + Math.random() * 480,
            calls_count: Math.floor(1 + Math.random() * 5),
            sms_count: Math.floor(2 + Math.random() * 10),
            location_changes: Math.floor(2 + Math.random() * 6),
            app_usage_social: Math.floor(30 + Math.random() * 90),
            app_usage_productivity: Math.floor(60 + Math.random() * 120),
            app_usage_entertainment: Math.floor(45 + Math.random() * 90),
            mood_score: Math.floor(1 + Math.random() * 5)
        });
    }
    
    return mockData;
};

type DataProviderProps = {
    children: ReactNode;
};

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
    const [sensorData, setSensorData] = useState<SensorData[]>([]);
    const [modelMetrics, setModelMetrics] = useState<ModelMetrics | null>(null);
    const [performanceHistory, setPerformanceHistory] = useState<PerformanceHistoryEntry[]>([]);

    // Load data from localStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem('sensorData');
        if (savedData) {
            try {
                setSensorData(JSON.parse(savedData));
            } catch (error) {
                console.error('Error loading saved data:', error);
                const initialData = generateInitialMockData();
                setSensorData(initialData);
                localStorage.setItem('sensorData', JSON.stringify(initialData));
            }
        } else {
            const initialData = generateInitialMockData();
            setSensorData(initialData);
            localStorage.setItem('sensorData', JSON.stringify(initialData));
        }
    }, []);

    const value = {
        sensorData,
        addSensorData: (data: SensorData) => {
            setSensorData(prev => {
                const newData = [...prev, data];
                localStorage.setItem('sensorData', JSON.stringify(newData));
                return newData;
            });
        },
        clearData: () => {
            setSensorData([]);
            localStorage.removeItem('sensorData');
            setModelMetrics(null);
            setPerformanceHistory([]);
        },
        modelMetrics,
        updateModelMetrics: (metrics: ModelMetrics) => {
            console.log('Updating model metrics:', metrics);
            setModelMetrics(metrics);
        },
        performanceHistory,
        updatePerformanceHistory: (history: PerformanceHistoryEntry[]) => {
            console.log('Updating performance history:', history);
            setPerformanceHistory(history);
        }
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
