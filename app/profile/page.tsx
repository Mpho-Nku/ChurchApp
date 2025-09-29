'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Profile fetch error:', error.message);
      }

      if (data) {
        setProfile(data);
        setFullName(data.full_name || '');
        setPhone(data.phone || '');
        setBio(data.bio || '');
        setAvatarUrl(data.avatar_url || null);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  // ✅ Avatar Upload with better logging
  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) {
        alert('No file selected');
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert('You must be logged in to upload an avatar');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log('Uploading file:', filePath);

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true, // overwrite if exists
        });

      if (uploadError) {
        console.error('Upload error:', uploadError.message);
        alert(`❌ Upload failed: ${uploadError.message}`);
        return;
      }

      // ✅ Get public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;
      console.log('Uploaded avatar URL:', publicUrl);

      // ✅ Save avatar URL to profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        console.error('Profile update error:', updateError.message);
        alert(`❌ Failed to update profile: ${updateError.message}`);
        return;
      }

      setAvatarUrl(publicUrl);
      alert('✅ Avatar updated successfully!');
    } catch (err) {
      console.error('Unexpected error uploading avatar:', err);
      alert('❌ Something went wrong while uploading avatar');
    } finally {
      setUploading(false);
    }
  };

  // ✅ Update profile
  const updateProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const updates = {
      id: user.id,
      full_name: fullName,
      phone,
      bio,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    };

    const { error } = await supabase.from('profiles').upsert(updates);
    if (error) {
      console.error('Profile update error:', error.message);
      alert('❌ Error updating profile: ' + error.message);
    } else {
      alert('✅ Profile updated!');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded-lg space-y-6">
      <h1 className="text-2xl font-bold text-blue-900">My Profile</h1>

      {/* ✅ Avatar */}
      <div className="flex flex-col items-center space-y-3">
       {avatarUrl ? (
  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-600 shadow-lg">
    <Image
      src={avatarUrl}
      alt="Avatar"
      width={128}
      height={128}
      className="object-cover w-full h-full"
    />
  </div>
) : (
  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-blue-600 shadow-lg">
    <span className="text-gray-600 text-sm">No Avatar</span>
  </div>
)}


        <label className="btn btn-outline cursor-pointer">
          {uploading ? 'Uploading...' : 'Change Picture'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={uploadAvatar}
            disabled={uploading}
          />
        </label>
      </div>

      {/* ✅ Form Fields */}
      <div>
        <label className="block text-sm font-medium">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Phone</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="textarea textarea-bordered w-full"
        />
      </div>

      <button onClick={updateProfile} className="btn btn-primary w-full">
        Save Profile
      </button>
    </div>
  );
}
