'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import LocationSelector from '@/components/LocationSelector';

export default function CreatePostModal() {
  const [content, setContent] = useState('');
  const [location, setLocation] = useState<{ name: string; lat?: number; lon?: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) return alert('Please enter some text.');
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    const { error } = await supabase.from('posts').insert([
      {
        user_id: user?.id,
        content,
        location_name: location?.name || null,
        latitude: location?.lat || null,
        longitude: location?.lon || null,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error(error);
      alert('Error posting.');
    } else {
      setContent('');
      setLocation(null);
      alert('✅ Post created!');
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg w-full max-w-md mx-auto space-y-4">
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2 resize-none"
        rows={3}
      />

      <LocationSelector selected={location?.name || null} onSelect={(loc) => setLocation(loc)} />

      <button
        onClick={handlePost}
        disabled={loading}
        className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Posting...' : 'Post'}
      </button>
    </div>
  );
}
