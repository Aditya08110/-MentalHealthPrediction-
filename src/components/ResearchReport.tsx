import React from 'react';
import jsPDF from 'jspdf';
import { useData } from '../context/DataContext';

const references = [
  {
    title: 'NIMHANS: National Institute of Mental Health and Neurosciences',
    url: 'https://nimhans.ac.in/'
  },
  {
    title: 'WHO: World Health Organization - Mental Health',
    url: 'https://www.who.int/health-topics/mental-health'
  },
  {
    title: 'Journal of Mental Health',
    url: 'https://www.tandfonline.com/journals/ijmh20'
  }
];

const ResearchReport: React.FC = () => {
  const { sensorData, modelMetrics } = useData();

  // Use current data for the report
  const processedData = {
    datasetSize: sensorData.length,
    features: sensorData.length > 0 ? Object.keys(sensorData[0]) : [],
    model: modelMetrics ? 'Random Forest' : 'Not trained',
    accuracy: modelMetrics?.accuracy ?? 0,
    precision: modelMetrics?.precision ?? 0,
    recall: modelMetrics?.recall ?? 0,
    f1: modelMetrics?.f1_score ?? 0,
    date: new Date().toLocaleString(),
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Mental Health Project Report', 10, 15);
    doc.setFontSize(12);
    doc.text(`Generated: ${processedData.date}`, 10, 25);
    doc.text('---', 10, 30);
    doc.text('Dataset Details:', 10, 40);
    doc.text(`- Records: ${processedData.datasetSize}`, 12, 48);
    doc.text(`- Features: ${processedData.features.join(', ')}`, 12, 56);
    doc.text('Model Architecture:', 10, 68);
    doc.text(`- Model: ${processedData.model}`, 12, 76);
    doc.text('Evaluation Metrics:', 10, 88);
    doc.text(`- Accuracy: ${processedData.accuracy}`, 12, 96);
    doc.text(`- Precision: ${processedData.precision}`, 12, 104);
    doc.text(`- Recall: ${processedData.recall}`, 12, 112);
    doc.text(`- F1 Score: ${processedData.f1}`, 12, 120);
    doc.text('Ethical Considerations:', 10, 132);
    doc.text('- All data is anonymized and securely stored.', 12, 140);
    doc.text('- Predictions are for educational/supportive purposes.', 12, 148);
    doc.text('- Consult professionals for any concerns.', 12, 156);
    doc.text('- Model limitations and biases are acknowledged.', 12, 164);
    doc.text('References:', 10, 176);
    doc.text('- NIMHANS: https://nimhans.ac.in/', 12, 184);
    doc.text('- WHO: https://www.who.int/health-topics/mental-health', 12, 192);
    doc.text('- Journal of Mental Health: https://www.tandfonline.com/journals/ijmh20', 12, 200);
    doc.save('MentalHealthProjectReport.pdf');
  };

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Research & Reports</h2>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Academic & Clinical References</h3>
        <ul className="list-disc list-inside text-blue-700">
          {references.map(ref => (
            <li key={ref.url}>
              <a href={ref.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500">{ref.title}</a>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Project Report (PDF)</h3>
        <button
          onClick={handleDownloadPDF}
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Generate & Download Project Report
        </button>
        <p className="text-gray-500 mt-2 text-sm">The report includes: dataset details, model architecture, evaluation metrics, and ethical considerations in mental health AI.</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Ethical Considerations</h3>
        <ul className="list-disc list-inside text-gray-700">
          <li>All data is anonymized and securely stored.</li>
          <li>Predictions are for educational and supportive purposes, not a substitute for professional care.</li>
          <li>Users are encouraged to consult mental health professionals for any concerns.</li>
          <li>Model limitations and biases are acknowledged and monitored.</li>
        </ul>
      </div>
    </div>
  );
};

export default ResearchReport;
