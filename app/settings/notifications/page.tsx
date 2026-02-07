"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import SettingsSection from "@/components/settings/SettingsSection";
import Switch from "@/components/settings/Switch";

export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    mentions: true,
    comment_replies: true,
    post_likes: true,
    comment_likes: true,
  });

  const load = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) setSettings(data);
  };

  const saveSetting = async (field: string, value: boolean) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    setSettings(prev => ({ ...prev, [field]: value }));

    await supabase
      .from("user_settings")
      .upsert({
        user_id: user.id,
        [field]: value,
      });
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-10">
      <h1 className="text-xl font-bold">Notification Preferences</h1>

      <SettingsSection title="Activity">
        <div className="flex items-center justify-between px-4 py-4 bg-white border-b">
          <span>Mentions</span>
          <Switch
            checked={settings.mentions}
            onChange={(v) => saveSetting("mentions", v)}
          />
        </div>

        <div className="flex items-center justify-between px-4 py-4 bg-white border-b">
          <span>Comment Replies</span>
          <Switch
            checked={settings.comment_replies}
            onChange={(v) => saveSetting("comment_replies", v)}
          />
        </div>

        <div className="flex items-center justify-between px-4 py-4 bg-white border-b">
          <span>Post Likes</span>
          <Switch
            checked={settings.post_likes}
            onChange={(v) => saveSetting("post_likes", v)}
          />
        </div>

        <div className="flex items-center justify-between px-4 py-4 bg-white">
          <span>Comment Likes</span>
          <Switch
            checked={settings.comment_likes}
            onChange={(v) => saveSetting("comment_likes", v)}
          />
        </div>
      </SettingsSection>
    </div>
  );
}
