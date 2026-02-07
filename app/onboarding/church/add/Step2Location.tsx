"use client";

export default function Step2Location({ formData, setFormData, next, back }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Step 2: Location</h2>

      <input
        type="text"
        placeholder="Township / Location"
        className="w-full border px-3 py-2 rounded-lg"
        value={formData.location}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, location: e.target.value }))
        }
      />

      <div className="flex justify-between mt-6">
        <button type="button" onClick={back} className="border px-4 py-2 rounded-lg">
          Back
        </button>

        <button
          type="button"
          onClick={next}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
}
