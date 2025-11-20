"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  const load = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);

    if (!user) return;

    const { data } = await supabase
      .from("notification_settings")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!data) {
      // Auto-create
      const { data: newRow } = await supabase
        .from("notification_settings")
        .insert({ user_id: user.id })
        .select()
        .single();

      setSettings(newRow);
      return;
    }

    setSettings(data);
  };

  const toggle = async (field: string) => {
    const newValue = !settings[field];

    setSettings((prev: any) => ({
      ...prev,
      [field]: newValue,
    }));

    await supabase
      .from("notification_settings")
      .update({
        [field]: newValue,
        updated_at: new Date(),
      })
      .eq("user_id", user.id);
  };

  useEffect(() => {
    load();
  }, []);

  if (!settings) return <p className="p-4">Loading…</p>;

  const toggleItem = (field: string, label: string) => (
    <div
      className="flex items-center justify-between py-4 border-b cursor-pointer"
      onClick={() => toggle(field)}
    >
      <p className="text-sm font-medium">{label}</p>
      <div
        className={`w-10 h-5 rounded-full flex items-center transition ${
          settings[field] ? "bg-blue-500" : "bg-gray-300"
        }`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full ml-1 transform transition ${
            settings[field] ? "translate-x-5" : ""
          }`}
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Notifications</h1>

      {toggleItem("notify_comments", "Comments")}
      {toggleItem("notify_replies", "Replies to my comments")}
      {toggleItem("notify_mentions", "Mentions (@username)")}
      {toggleItem("notify_likes", "Likes on my posts")}
      {toggleItem("notify_follows", "New followers")}
    </div>
  );
}
