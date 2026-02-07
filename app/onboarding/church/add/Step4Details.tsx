"use client";

export default function Step4Details({ formData, setFormData, next, back }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Step 4: Details</h2>

      <input
        type="text"
        placeholder="Pastor Name"
        className="w-full border px-3 py-2 rounded-lg mb-4"
        value={formData.pastorName}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, pastorName: e.target.value }))
        }
      />

      <textarea
        placeholder="Description"
        rows={4}
        className="w-full border p-3 rounded-lg"
        value={formData.description}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, description: e.target.value }))
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
