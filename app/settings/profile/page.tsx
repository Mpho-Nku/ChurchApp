"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Load profile
  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(data);
    };

    load();
  }, []);

  const updateProfile = async () => {
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        username: profile.username,
        phone: profile.phone,
        bio: profile.bio,
      })
      .eq("id", profile.id);

    setSaving(false);

    if (error) return alert("Something went wrong");
    alert("Profile updated!");
  };

  const uploadAvatar = async (e: any) => {
    let file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const fileName = `${profile.id}-${Date.now()}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file);

    if (uploadError) {
      alert("Failed to upload image");
      setUploading(false);
      return;
    }

    const { data: url } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    await supabase
      .from("profiles")
      .update({ avatar_url: url.publicUrl })
      .eq("id", profile.id);

    setProfile({ ...profile, avatar_url: url.publicUrl });
    setUploading(false);
  };

  if (!profile) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">

      <h1 className="text-xl font-bold">Profile Settings</h1>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        {profile.avatar_url ? (
          <Image
            src={profile.avatar_url}
            width={80}
            height={80}
            className="rounded-full object-cover"
            alt="avatar"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-300" />
        )}

        <div>
          <label className="btn btn-primary cursor-pointer">
            {uploading ? "Uploading..." : "Change Photo"}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={uploadAvatar}
            />
          </label>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-4">

        <div>
          <label className="block text-sm mb-1">Full Name</label>
          <input
            className="input w-full"
            value={profile.full_name || ""}
            onChange={(e) =>
              setProfile({ ...profile, full_name: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Username</label>
          <input
            className="input w-full"
            value={profile.username || ""}
            onChange={(e) =>
              setProfile({ ...profile, username: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Phone Number</label>
          <input
            className="input w-full"
            value={profile.phone || ""}
            onChange={(e) =>
              setProfile({ ...profile, phone: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Bio</label>
          <textarea
            className="input w-full"
            rows={3}
            value={profile.bio || ""}
            onChange={(e) =>
              setProfile({ ...profile, bio: e.target.value })
            }
          />
        </div>

      </div>

      {/* Save Button */}
      <button
        onClick={updateProfile}
        className="btn btn-primary w-full"
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>

    </div>
  );
}
