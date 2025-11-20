"use client";

import { useState } from "react";

export default function Step5Image({ value, onUpdate, onNext, onBack }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(value.image_url || "");

  const handleNext = () => {
    // Pass file and preview to parent
    onUpdate({ file, image_url: preview });
    onNext();
  };

  const handleFile = (e: any) => {
    const uploaded = e.target.files[0];
    if (!uploaded) return;

    setFile(uploaded);
    setPreview(URL.createObjectURL(uploaded));
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Church Image</h2>

      {/* Preview */}
      <div className="mb-6">
        {preview ? (
          <img
            src={preview}
            className="w-full max-h-64 object-cover rounded-lg border"
          />
        ) : (
          <div className="w-full h-40 rounded-lg border flex items-center justify-center text-gray-400">
            No image selected
          </div>
        )}
      </div>

      {/* File Input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="mb-6"
      />

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-lg bg-gray-200"
        >
          Back
        </button>

        <button
          onClick={handleNext}
          className="flex-1 py-3 rounded-lg bg-blue-600 text-white"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
