"use client";

export default function Step5Image({ formData, setFormData, next, back }) {
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { file, preview }],
    }));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Step 5: Images</h2>

      <input type="file" accept="image/*" onChange={handleFile} />

      <div className="flex gap-3 mt-4">
        {formData.images.map((img, i) => (
          <img key={i} src={img.preview} className="w-28 h-28 rounded border" />
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <button type="button" onClick={back} className="border px-4 py-2 rounded-lg">
          Back
        </button>

        <button
          type="button"
          onClick={next}
          disabled={!formData.images.length}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
}
