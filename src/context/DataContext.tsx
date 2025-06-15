import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { SensorData } from '../types';

type DataContextType = {
    sensorData: SensorData[];
    addSensorData: (data: SensorData) => void;
    clearData: () => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

type DataProviderProps = {
    children: ReactNode;
};

export const DataProvider = ({ children }: DataProviderProps) => {
    console.log('DataProvider rendering');
    const [sensorData, setSensorData] = useState<SensorData[]>([]);

    // Load data from localStorage on mount
    useEffect(() => {
        console.log('DataProvider useEffect running - loading data');
        const savedData = localStorage.getItem('collectedSensorData');
        console.log('Saved data from localStorage:', savedData);
        
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                console.log('Parsed data:', parsedData);
                setSensorData(parsedData);
            } catch (error) {
                console.error('Error loading saved data:', error);
                localStorage.removeItem('collectedSensorData');
            }
        }
    }, []);

    const addSensorData = (newData: SensorData) => {
        console.log('Adding new sensor data:', newData);
        setSensorData(prev => {
            const updatedData = [...prev, newData];
            console.log('Updated sensor data:', updatedData);
            localStorage.setItem('collectedSensorData', JSON.stringify(updatedData));
            return updatedData;
        });
    };

    const clearData = () => {
        console.log('Clearing all sensor data');
        setSensorData([]);
        localStorage.removeItem('collectedSensorData');
    };

    console.log('Current sensor data in context:', sensorData);

    return (
        <DataContext.Provider value={{ sensorData, addSensorData, clearData }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    console.log('useData hook called, returning context:', context);
    return context;
};
