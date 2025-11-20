'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const MapPicker = dynamic(() => import('@/components/MapPicker'), { ssr: false });

export default function CreatePost({ user }: { user: any }) {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [uploading, setUploading] = useState(false);

  // ✅ Handle single image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImage(e.target.files[0]);
  };

  // ✅ Handle video selection
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setVideo(e.target.files[0]);
  };

  // ✅ Upload and submit post
  const submitPost = async () => {
    if (!caption && !image && !video) {
      alert('Please add text, image, or video before posting.');
      return;
    }

    try {
      setUploading(true);
      let uploadedImageUrl: string | null = null;
      let uploadedVideoUrl: string | null = null;

      // ✅ Upload single image
      if (image) {
        const fileName = `${user.id}-${Date.now()}-${image.name}`;
        const { error: imageError } = await supabase.storage
          .from('post-images')
          .upload(fileName, image);

        if (imageError) throw imageError;

        const { data } = supabase.storage
          .from('post-images')
          .getPublicUrl(fileName);

        uploadedImageUrl = data?.publicUrl || null;
        console.log('✅ Uploaded image:', uploadedImageUrl);
      }

      // ✅ Upload video (optional)
      if (video) {
        const videoFileName = `${user.id}-${Date.now()}-${video.name}`;
        const { error: videoError } = await supabase.storage
          .from('post-videos')
          .upload(videoFileName, video);

        if (videoError) throw videoError;

        const { data } = supabase.storage
          .from('post-videos')
          .getPublicUrl(videoFileName);

        uploadedVideoUrl = data?.publicUrl || null;
        console.log('✅ Uploaded video:', uploadedVideoUrl);
      }

      // ✅ Insert post into Supabase
      const { error: insertError } = await supabase.from('posts').insert([
        {
          user_id: user.id,
          caption: caption.trim(),
          images: uploadedImageUrl ? [uploadedImageUrl] : [],
          video: uploadedVideoUrl,
          location: location ? JSON.stringify(location) : null,
          created_at: new Date(),
        },
      ]);

      if (insertError) throw insertError;

      alert('✅ Post created successfully!');
      setCaption('');
      setImage(null);
      setVideo(null);
      setLocation(null);
    } catch (err: any) {
      console.error('❌ Error creating post:', err);
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

      {/* Caption */}
      <textarea
        placeholder="What's on your mind?"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        rows={3}
      />

      {/* Single Image Upload */}
      <div>
        <label className="font-medium block text-sm mb-1">Upload Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {image && (
          <p className="text-xs text-gray-500 mt-1">📸 {image.name}</p>
        )}
      </div>

      {/* Video Upload */}
      <div>
        <label className="font-medium block text-sm mb-1">Upload Video (optional)</label>
        <input type="file" accept="video/mp4,video/*" onChange={handleVideoChange} />
        {video && (
          <p className="text-xs text-gray-500 mt-1">🎥 {video.name}</p>
        )}
      </div>

      {/* Map Location */}
      <div className="mt-3">
        <p className="font-medium text-sm mb-1">Add Location (optional)</p>
        <MapPicker onLocationSelect={setLocation} />
      </div>

      {/* Submit Button */}
      <button
        onClick={submitPost}
        disabled={uploading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        {uploading ? 'Uploading...' : 'Post'}
      </button>
    </motion.div>
  );
}