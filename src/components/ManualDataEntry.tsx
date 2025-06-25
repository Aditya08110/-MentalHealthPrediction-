import React, { useState } from 'react';

const suggestions = {
  'Low Risk': [
    'Keep up your healthy habits!',
    'Maintain regular sleep and exercise.',
    'Stay connected with friends and family.'
  ],
  'Moderate Risk': [
    'Try relaxation techniques like deep breathing or meditation.',
    'Take short breaks during work or study.',
    'Talk to someone you trust about your feelings.'
  ],
  'High Risk': [
    'Consider reaching out to a mental health professional.',
    'Practice mindfulness or guided relaxation daily.',
    'Engage in light physical activity, like a walk outdoors.'
  ]
};

const relaxImages = {
  'Low Risk': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  'Moderate Risk': 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
  'High Risk': 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=400&q=80'
};

const ManualDataEntry: React.FC = () => {
  const [form, setForm] = useState({
    age: '',
    gender: '',
    anxiety: '',
    depression: '',
    stress: '',
  });
  const [prediction, setPrediction] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const anxiety = Number(form.anxiety);
    const depression = Number(form.depression);
    const stress = Number(form.stress);
    const score = anxiety + depression + stress;
    let result = 'Low Risk';
    if (score >= 21) result = 'High Risk';
    else if (score >= 12) result = 'Moderate Risk';
    setPrediction(result);
  };

  const typedPrediction = prediction as keyof typeof suggestions | null;

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Manual Data Entry</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Age</label>
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Anxiety (0-10)</label>
          <input
            type="number"
            name="anxiety"
            min="0"
            max="10"
            value={form.anxiety}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Depression (0-10)</label>
          <input
            type="number"
            name="depression"
            min="0"
            max="10"
            value={form.depression}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Stress (0-10)</label>
          <input
            type="number"
            name="stress"
            min="0"
            max="10"
            value={form.stress}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Predict
        </button>
      </form>
      {typedPrediction && (
        <div className="mt-6 p-4 rounded bg-gray-100 text-center">
          <span className="font-semibold">Prediction Result: </span>
          <span className="text-lg">{typedPrediction}</span>
          <div className="my-4 flex flex-col items-center">
            <img
              src={typedPrediction ? relaxImages[typedPrediction] : ''}
              alt="Relaxation"
              className="rounded-lg shadow w-48 h-32 object-cover mb-2"
            />
            <ul className="text-left list-disc list-inside text-gray-700">
              {typedPrediction && suggestions[typedPrediction].map((tip: string, idx: number) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
          <button
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => {
              setForm({ age: '', gender: '', anxiety: '', depression: '', stress: '' });
              setPrediction(null);
            }}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default ManualDataEntry;
