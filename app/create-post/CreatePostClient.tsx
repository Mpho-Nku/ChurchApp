'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const MapPicker = dynamic(() => import('@/components/MapPicker'), { ssr: false });

export default function CreatePostClient({ user }: { user: any }) {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [location, setLocation] =
    useState<{ lat: number; lng: number } | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImage(e.target.files[0]);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setVideo(e.target.files[0]);
  };

  const submitPost = async () => {
    if (!caption && !image && !video) {
      alert('Please add text, image, or video before posting.');
      return;
    }

    try {
      setUploading(true);

      let uploadedImageUrl: string | null = null;
      let uploadedVideoUrl: string | null = null;

      if (image) {
        const fileName = `${user.id}-${Date.now()}-${image.name}`;
        await supabase.storage.from('post-images').upload(fileName, image);
        uploadedImageUrl = supabase.storage
          .from('post-images')
          .getPublicUrl(fileName).data.publicUrl;
      }

      if (video) {
        const fileName = `${user.id}-${Date.now()}-${video.name}`;
        await supabase.storage.from('post-videos').upload(fileName, video);
        uploadedVideoUrl = supabase.storage
          .from('post-videos')
          .getPublicUrl(fileName).data.publicUrl;
      }

      await supabase.from('posts').insert({
        user_id: user.id,
        caption: caption.trim(),
        images: uploadedImageUrl ? [uploadedImageUrl] : [],
        video: uploadedVideoUrl,
        location: location ? JSON.stringify(location) : null,
      });

      alert('✅ Post created successfully!');
      setCaption('');
      setImage(null);
      setVideo(null);
      setLocation(null);
    } catch (err: any) {
      alert('❌ Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-xl space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-xl font-semibold text-blue-900">Create a New Post</h2>

      <textarea
        placeholder="What's on your mind?"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full p-3 border rounded-lg"
        rows={3}
      />

      <input type="file" accept="image/*" onChange={handleImageChange} />
      <input type="file" accept="video/*" onChange={handleVideoChange} />

      <MapPicker onLocationSelect={setLocation} />

      <button
        onClick={submitPost}
        disabled={uploading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg"
      >
        {uploading ? 'Uploading...' : 'Post'}
      </button>
    </motion.div>
  );
}
