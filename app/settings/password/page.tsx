"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ChangePassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const sendReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/update-password`,
    });

    if (error) return alert("Could not send reset link");

    setSent(true);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Change Password</h1>

      <input
        className="input"
        placeholder="Enter your account email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button className="btn-primary w-full py-3" onClick={sendReset}>
        Send Reset Link
      </button>

      {sent && (
        <p className="text-green-600 text-sm mt-2">
          Reset link sent! Check your email.
        </p>
      )}
    </div>
  );
}
