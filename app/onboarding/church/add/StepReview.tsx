"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function StepReview({ formData, back }) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      let imageUrl = null;

      if (formData.images.length) {
        const file = formData.images[0].file;
        const path = `church_${Date.now()}.${file.name.split(".").pop()}`;

        await supabase.storage.from("church-images").upload(path, file);

        imageUrl = supabase.storage
          .from("church-images")
          .getPublicUrl(path).data.publicUrl;
      }

      await supabase.from("churches").insert({
        name: formData.name.trim(),
        pastor_name: formData.pastorName || null,
        township: formData.location || null,
        description: formData.description || null,
        church_type: formData.churchType || null,
        image_url: imageUrl,
        created_by: user.id,
      });

      router.push("/profile");
    } catch (e) {
      console.error(e);
      setError("Failed to save church");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Review & Submit</h2>
      {error && <p className="text-red-600">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}
