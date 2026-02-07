"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

import SettingsSection from "@/components/settings/SettingsSection";
import SettingsRow from "@/components/settings/SettingsRow";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (user) {
        const { data: p } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(p);
      }
    };

    loadUser();
  }, []);

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-10">

      {/* PROFILE HEADER */}
      <div className="flex items-center gap-4 px-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
          <Image
            src={profile?.avatar_url || "/default_avatar.png"}
            alt="Profile"
            width={64}
            height={64}
            className="object-cover w-full h-full"
          />
        </div>

        <div>
          <p className="font-bold text-lg">{profile?.full_name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      {/* SECTIONS */}
      <SettingsSection title="Account">
        <SettingsRow
          label="Profile Settings"
          description="Name, phone, bio, avatar"
          href="/settings/profile"
        />
        <SettingsRow
          label="Change Password"
          description="Update your login"
          href="/settings/password"
        />
      </SettingsSection>

      <SettingsSection title="Notifications">
        <SettingsRow
          label="Notification Preferences"
          description="Mentions, replies, likes"
          href="/settings/notifications"
        />
      </SettingsSection>

      <SettingsSection title="Privacy">
        <SettingsRow
          label="Privacy Options"
          description="Email visibility, hide posts"
          href="/settings/privacy"
        />
      </SettingsSection>

      <SettingsSection title="Danger Zone">
        <SettingsRow
          label="Delete Account"
          href="/settings/delete"
          danger
        />
      </SettingsSection>
    </div>
  );
}
