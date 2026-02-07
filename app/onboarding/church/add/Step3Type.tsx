"use client";

const churchTypes = ["Circuit", "Headquarter"];

export default function Step3Type({ formData, setFormData, next, back }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Step 3: Church Type</h2>

      <div className="grid gap-3">
        {churchTypes.map((type) => (
          <button
            key={type}
            type="button"
            className={`p-3 border rounded-lg ${
              formData.churchType === type
                ? "bg-blue-600 text-white"
                : ""
            }`}
            onClick={() =>
              setFormData((prev) => ({ ...prev, churchType: type }))
            }
          >
            {type}
          </button>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <button type="button" onClick={back} className="border px-4 py-2 rounded-lg">
          Back
        </button>

        <button
          type="button"
          onClick={next}
          disabled={!formData.churchType}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
}
