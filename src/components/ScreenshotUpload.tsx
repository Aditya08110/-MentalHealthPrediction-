import Tesseract from 'tesseract.js';
import React, { useState } from 'react';

interface ScreenshotUploadProps {
  onExtract: (data: { appUsages: { appName: string; timeSpent: number }[] }) => void;
}

const ScreenshotUpload: React.FC<ScreenshotUploadProps> = ({ onExtract }) => {
  const [file, setFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extracted, setExtracted] = useState<{ appUsages: { appName: string; timeSpent: number }[] } | null>(null);
  const [confirmedData, setConfirmedData] = useState<{ appUsages: { appName: string; timeSpent: number }[] } | null>(null);

  const parseText = (text: string) => {
    // More flexible extraction for various screenshot formats
    const appUsages: { appName: string; timeSpent: number }[] = [];
    // Try to match lines like: Instagram 2h 30m, WhatsApp 1h 10m, etc.
    const lines = text.split(/\n|\r/).map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
      // Match e.g. Instagram 2h 30m or Instagram 150m or Instagram 2h
      const match = line.match(/(Instagram|YouTube|WhatsApp|Facebook|Twitter|Snapchat|Telegram|Reddit|Gmail|Spotify)[^\d]*(?:(\d+)\s*h)?\s*(\d+)?\s*m?/i);
      if (match) {
        const appName = match[1];
        const hours = match[2] ? parseInt(match[2], 10) : 0;
        const mins = match[3] ? parseInt(match[3], 10) : 0;
        const timeSpent = hours * 60 + mins;
        if (timeSpent > 0) {
          appUsages.push({ appName, timeSpent });
        }
      }
    }
    // Fallback: try to match lines like Instagram 150 min
    if (appUsages.length === 0) {
      const fallbackRegex = /(Instagram|YouTube|WhatsApp|Facebook|Twitter|Snapchat|Telegram|Reddit|Gmail|Spotify)[^\d]*(\d{1,4}) ?(min|minutes|m)?/gi;
      let match;
      while ((match = fallbackRegex.exec(text)) !== null) {
        appUsages.push({
          appName: match[1],
          timeSpent: parseInt(match[2], 10)
        });
      }
    }
    return appUsages;
  };

  const handleExtract = async () => {
    if (!file) return;
    setExtracting(true);
    setError(null);
    try {
      const { data: { text } } = await Tesseract.recognize(file, 'eng');
      const appUsages = parseText(text);
      if (appUsages.length === 0) {
        setError('No app usage data found. Please upload a clear screenshot.');
        setExtracting(false);
        return;
      }
      setExtracted({ appUsages });
      onExtract({ appUsages });
    } catch (err) {
      setError('Failed to extract data.');
    } finally {
      setExtracting(false);
    }
  };

  const handleConfirm = () => {
    if (extracted) {
      setConfirmedData(extracted);
      onExtract(extracted);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 bg-white rounded shadow mt-4">
      <label className="font-medium">Upload Screen Time Screenshot:</label>
      <input
        type="file"
        accept="image/*"
        onChange={e => setFile(e.target.files?.[0] || null)}
        className="input input-bordered"
      />
      <button
        type="button"
        className="btn btn-secondary mt-2"
        onClick={handleExtract}
        disabled={!file || extracting}
      >
        {extracting ? 'Extracting...' : 'Extract Data'}
      </button>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {extracted && !confirmedData && (
        <div className="mt-2">
          <div className="font-semibold">Extracted App Usage (edit if needed):</div>
          <ul>
            {extracted.appUsages.map((app, idx) => (
              <li key={idx}>
                <input
                  type="text"
                  value={app.appName}
                  onChange={e => {
                    const updated = [...extracted.appUsages];
                    updated[idx].appName = e.target.value;
                    setExtracted({ appUsages: updated });
                  }}
                  className="input input-bordered w-32 mr-2"
                />
                <input
                  type="number"
                  value={app.timeSpent}
                  onChange={e => {
                    const updated = [...extracted.appUsages];
                    updated[idx].timeSpent = Number(e.target.value);
                    setExtracted({ appUsages: updated });
                  }}
                  className="input input-bordered w-20"
                /> min
              </li>
            ))}
          </ul>
          <button className="btn btn-primary mt-2" onClick={handleConfirm}>Confirm Data</button>
        </div>
      )}
      {confirmedData && (
        <div className="mt-2 text-green-600 font-semibold">Data confirmed and ready for prediction!</div>
      )}
    </div>
  );
};

export default ScreenshotUpload;
