"use client";

import { useState } from "react";

export default function Step2Location({ value, onUpdate, onNext, onBack }) {
  const [city, setCity] = useState(value.city || "");
  const [province, setProvince] = useState(value.province || "");

  const handleNext = () => {
    if (!city.trim() || !province.trim()) {
      alert("Please fill in all location fields");
      return;
    }

    onUpdate({ city, province });
    onNext();
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-3">Church Location</h2>

      <input
        type="text"
        placeholder="City"
        className="w-full border rounded-lg px-4 py-3 mb-4"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <input
        type="text"
        placeholder="Province"
        className="w-full border rounded-lg px-4 py-3 mb-6"
        value={province}
        onChange={(e) => setProvince(e.target.value)}
      />

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-200 py-3 rounded-lg">
          Back
        </button>

        <button
          onClick={handleNext}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg">
          Continue
        </button>
      </div>
    </div>
  );
}
