"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function EditCommentModal({ comment, onClose, onUpdated }: any) {
  const [text, setText] = useState(comment.text);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!text.trim()) return;
    setSaving(true);

    try {
      await supabase.from("comments").update({ text }).eq("id", comment.id);
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Failed to update comment", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999]">
      <div className="bg-white rounded-xl p-5 w-80 shadow-xl">
        <h2 className="text-lg font-semibold mb-3">Edit Comment</h2>

        <textarea
          className="w-full border rounded-lg p-2 text-sm"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex justify-end mt-3 gap-3">
          <button className="text-gray-600" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
