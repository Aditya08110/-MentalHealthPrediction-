import React, { useState } from 'react';

interface ManualDataEntryProps {
  onSubmit: (data: ManualData) => void;
}

export interface ManualData {
  instagramScreenTime: number;
  steps: number;
  sleepHours: number;
  mood: string;
}

const ManualDataEntry: React.FC<ManualDataEntryProps> = ({ onSubmit }) => {
  const [instagramScreenTime, setInstagramScreenTime] = useState('');
  const [steps, setSteps] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [mood, setMood] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      instagramScreenTime: Number(instagramScreenTime),
      steps: Number(steps),
      sleepHours: Number(sleepHours),
      mood,
    });
    setInstagramScreenTime('');
    setSteps('');
    setSleepHours('');
    setMood('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto mt-6 p-4 bg-white rounded shadow">
      <label>
        Instagram Screen Time (minutes):
        <input
          type="number"
          value={instagramScreenTime}
          onChange={e => setInstagramScreenTime(e.target.value)}
          className="input input-bordered w-full mt-1"
          required
        />
      </label>
      <label>
        Steps:
        <input
          type="number"
          value={steps}
          onChange={e => setSteps(e.target.value)}
          className="input input-bordered w-full mt-1"
          required
        />
      </label>
      <label>
        Sleep Hours:
        <input
          type="number"
          step="0.1"
          value={sleepHours}
          onChange={e => setSleepHours(e.target.value)}
          className="input input-bordered w-full mt-1"
          required
        />
      </label>
      <label>
        Mood (e.g., Happy, Sad, Neutral):
        <input
          type="text"
          value={mood}
          onChange={e => setMood(e.target.value)}
          className="input input-bordered w-full mt-1"
          required
        />
      </label>
      <button type="submit" className="btn btn-primary mt-2">Submit Data</button>
    </form>
  );
};

export default ManualDataEntry;
