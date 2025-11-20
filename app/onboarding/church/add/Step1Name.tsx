"use client";

import { useState } from "react";

export default function Step1Name({ value, onUpdate, onNext }) {
  const [name, setName] = useState(value.name || "");

  const handleNext = () => {
    if (!name.trim()) {
      alert("Please enter the church name");
      return;
    }
    onUpdate({ name });
    onNext();
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-3">Church Name</h2>

      <input
        type="text"
        placeholder="Enter church name"
        className="w-full border rounded-lg px-4 py-3 mb-6"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button
        onClick={handleNext}
        className="w-full bg-blue-600 text-white py-3 rounded-lg">
        Continue
      </button>
    </div>
  );
}
