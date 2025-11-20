"use client";

import { useState } from "react";

export default function Step4Details({ value, onUpdate, onNext, onBack }) {
  const [pastor, setPastor] = useState(value.pastor || "");
  const [description, setDescription] = useState(value.description || "");

  const handleFinish = () => {
    onUpdate({ pastor, description });
    onNext();
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-3">Final Details</h2>

      <input
        type="text"
        placeholder="Pastor's Name"
        className="w-full border rounded-lg px-4 py-3 mb-4"
        value={pastor}
        onChange={(e) => setPastor(e.target.value)}
      />

      <textarea
        placeholder="Short description"
        className="w-full border rounded-lg px-4 py-3 mb-6 h-28"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-200 py-3 rounded-lg">
          Back
        </button>

        <button
          onClick={handleFinish}
          className="flex-1 bg-green-600 text-white py-3 rounded-lg">
          Finish
        </button>
      </div>
    </div>
  );
}
