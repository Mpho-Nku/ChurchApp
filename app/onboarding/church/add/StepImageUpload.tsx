"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function StepImageUpload({
  value,
  onUpdate,
  onNext,
  onBack,
}: any) {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const fileName = `church_${Date.now()}.${file.name.split(".").pop()}`;

    const { error } = await supabase.storage
      .from("church-images")
      .upload(fileName, file);

    if (error) {
      alert("Image upload failed");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("church-images")
      .getPublicUrl(fileName);

    onUpdate({ image_url: urlData.publicUrl });
    setUploading(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Upload Church Image</h2>

      <input type="file" onChange={uploadImage} />

      {value.image_url && (
        <img
          src={value.image_url}
          className="rounded-xl mt-3 object-cover h-40 w-full"
        />
      )}

      <div className="flex gap-3">
        <button className="btn w-full" onClick={onBack}>
          Back
        </button>
        <button className="btn-primary w-full" onClick={onNext} disabled={uploading}>
          {uploading ? "Uploading…" : "Finish"}
        </button>
      </div>
    </div>
  );
}
