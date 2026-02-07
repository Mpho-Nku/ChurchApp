"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function DeleteAccountPage() {
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  const deleteAccount = async () => {
    if (confirmText !== "DELETE") {
      return alert("You must type DELETE to confirm.");
    }

    setLoading(true);

    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) return;

    // Delete profile first
    await supabase.from("profiles").delete().eq("id", user.id);

    // Delete account
    const { error } = await supabase.auth.admin.deleteUser(user.id);

    if (error) alert("Could not delete account");
    else alert("Account deleted");

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold text-red-600">Delete Account</h1>

      <p className="text-gray-700 text-sm">
        This action is permanent. All your posts, comments, events, and profile
        information will be deleted.
      </p>

      <input
        className="input"
        placeholder='Type "DELETE" to confirm'
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
      />

      <button
        className="w-full py-3 bg-red-600 text-white rounded-lg"
        onClick={deleteAccount}
        disabled={loading}
      >
        {loading ? "Deleting…" : "Delete Account"}
      </button>
    </div>
  );
}
