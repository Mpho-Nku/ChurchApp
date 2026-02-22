'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import PostActions from '@/components/PostActions';
import PostMediaViewer from '@/components/PostMediaViewer';

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles(full_name, avatar_url)')
        .eq('id', id)
        .single();

      if (!error) setPost(data);
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading post...</p>;
  if (!post) return <p className="text-center mt-10 text-red-500">Post not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <div className="flex items-center gap-3">
        {post.profiles?.avatar_url ? (
          <Image
            src={post.profiles.avatar_url}
            alt="Avatar"
            width={45}
            height={45}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
            {post.profiles?.full_name?.[0] || 'U'}
          </div>
        )}
        <div>
          <p className="font-semibold">{post.profiles?.full_name}</p>
          <p className="text-xs text-gray-500">
            {new Date(post.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Caption */}
      {post.caption && (
        <p className="text-gray-800">{post.caption}</p>
      )}

      {/* Media Viewer */}
      {post.images && (
        <PostMediaViewer
          postId={post.id}
          media={
            Array.isArray(post.images)
              ? post.images.map((url: string) => ({ url, type: 'image' }))
              : [{ url: post.images, type: 'image' }]
          }
          caption={post.caption}
          user={{
            name: post.profiles?.full_name,
            avatar: post.profiles?.avatar_url,
          }}
        />
      )}

      {/* Comments */}
     <PostActions
  postId={post.id}
  user={post.profiles}
  onComment={() => {}}
/>
    </div>
  );
}
