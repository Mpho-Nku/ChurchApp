"use client";

import { useState } from "react";

export default function Step3Type({ value, onUpdate, onNext, onBack }) {
  const [type, setType] = useState(value || "");

  const handleNext = () => {
    if (!type.trim()) {
      alert("Select church type");
      return;
    }
    onUpdate({ church_type: type });
    onNext();
  };

  const types = ["Local Assembly", "Branch", "Circuit HQ", "Regional HQ"];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-3">Church Type</h2>

      <div className="grid grid-cols-1 gap-3 mb-6">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`border px-4 py-3 rounded-lg text-left ${
              type === t ? "border-blue-600 bg-blue-50" : "border-gray-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

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
