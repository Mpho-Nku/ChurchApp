"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function EditChurchPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    pastor_name: "",
    township: "",
    description: "",
  });

  // 1️⃣ Load church
  useEffect(() => {
    const loadChurch = async () => {
      const { data, error } = await supabase
        .from("churches")
        .select("name, pastor_name, township, description")
        .eq("id", id)
        .single();

      if (error) {
        setError("You are not allowed to edit this church");
        setLoading(false);
        return;
      }

      setForm({
        name: data.name ?? "",
        pastor_name: data.pastor_name ?? "",
        township: data.township ?? "",
        description: data.description ?? "",
      });

      setLoading(false);
    };

    loadChurch();
  }, [id, supabase]);

  // 2️⃣ Save updates
  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const { error } = await supabase
        .from("churches")
        .update({
          name: form.name.trim(),
          pastor_name: form.pastor_name || null,
          township: form.township || null,
          description: form.description || null,
        })
        .eq("id", id);

      if (error) throw error;

      router.push("/churches"); // back to list
    } catch (err) {
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Church</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <input
        className="w-full border p-2 rounded mb-3"
        placeholder="Church Name"
        value={form.name}
        onChange={(e) =>
          setForm((p) => ({ ...p, name: e.target.value }))
        }
      />

      <input
        className="w-full border p-2 rounded mb-3"
        placeholder="Pastor Name"
        value={form.pastor_name}
        onChange={(e) =>
          setForm((p) => ({ ...p, pastor_name: e.target.value }))
        }
      />

      <input
        className="w-full border p-2 rounded mb-3"
        placeholder="Township / Location"
        value={form.township}
        onChange={(e) =>
          setForm((p) => ({ ...p, township: e.target.value }))
        }
      />

      <textarea
        className="w-full border p-2 rounded mb-4"
        placeholder="Description"
        rows={4}
        value={form.description}
        onChange={(e) =>
          setForm((p) => ({ ...p, description: e.target.value }))
        }
      />

      <div className="flex gap-3">
        <button
          onClick={() => router.back()}
          className="border px-4 py-2 rounded"
        >
          Cancel
        </button>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
