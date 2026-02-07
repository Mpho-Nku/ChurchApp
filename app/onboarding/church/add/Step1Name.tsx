"use client";

export default function Step1Name({ formData, setFormData, next }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Step 1: Church Name</h2>

      <input
        type="text"
        placeholder="Church Name"
        className="w-full border px-3 py-2 rounded-lg"
        value={formData.name}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, name: e.target.value }))
        }
      />

      <button
        type="button"
        onClick={() => {
          if (!formData.name.trim()) return alert("Church name is required");
          next();
        }}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Next
      </button>
    </div>
  );
}
