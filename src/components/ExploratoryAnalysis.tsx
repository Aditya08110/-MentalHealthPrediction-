import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';

const ExploratoryAnalysis: React.FC = () => {
  console.log('Starting ExploratoryAnalysis render');
  
  try {
    const { sensorData } = useData();
    console.log('Sensor data received:', sensorData);

    return (
      <div className="min-h-screen p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Analysis</h2>
          
          {!sensorData || sensorData.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Data Available</h3>
              <p className="text-gray-600">
                Please collect some data using the Data Collection page first.
              </p>
            </div>
          ) : (
            <div>
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <h3 className="font-semibold mb-2">Debug Information</h3>
                <p>Number of data points: {sensorData.length}</p>
                <p>Latest data timestamp: {sensorData[sensorData.length - 1]?.timestamp}</p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Raw Data Preview</h3>
                <div className="overflow-auto max-h-96">
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm">
                    {JSON.stringify(sensorData.slice(-5), null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in ExploratoryAnalysis:', error);
    return (
      <div className="min-h-screen p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Error</h3>
            <p className="text-gray-600">
              {error instanceof Error ? error.message : 'An error occurred while loading the analysis.'}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default ExploratoryAnalysis;