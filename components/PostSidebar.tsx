'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

export default function PostSidebar({ postId, user }: { postId: string; user: any }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const commentsEndRef = useRef<HTMLDivElement | null>(null);
  const [animating, setAnimating] = useState(false);

  /** 🌀 Scroll to bottom whenever comments update */
  const scrollToBottom = () =>
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  /** ❤️ Fetch likes + user like */
  useEffect(() => {
    if (!postId) return;

    const fetchReactions = async () => {
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);
      setLikeCount(count || 0);

      if (user) {
        const { data: existing } = await supabase
          .from('likes')
          .select('id')
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .maybeSingle();
        setLiked(!!existing);
      }
    };

    fetchReactions();

    // 🔄 Real-time sync for likes
    const likeChannel = supabase
      .channel(`likes-${postId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'likes', filter: `post_id=eq.${postId}` },
        fetchReactions
      )
      .subscribe();

    return () => {
      supabase.removeChannel(likeChannel);
    };
  }, [postId, user]);

  /** 💬 Fetch comments + subscribe */
  useEffect(() => {
    if (!postId) return;

    const fetchComments = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`id, content, created_at, user_id, profiles(full_name, avatar_url)`)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setComments(data);
        setTimeout(scrollToBottom, 300);
      }
    };

    fetchComments();

    // 🔄 Real-time insert updates for comments
    const commentChannel = supabase
      .channel(`comments-${postId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` },
        async (payload) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', payload.new.user_id)
            .single();

          const newComment = { ...payload.new, profiles: profile };
          setComments((prev) => [...prev, newComment]);
          setTimeout(scrollToBottom, 150);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(commentChannel);
    };
  }, [postId]);

  /** ✏️ Add new comment */
  const addComment = async () => {
    if (!newComment.trim() || !user) return;

    const temp = {
      id: crypto.randomUUID(),
      content: newComment.trim(),
      created_at: new Date().toISOString(),
      user_id: user.id,
      profiles: {
        full_name: user.user_metadata?.full_name || 'You',
        avatar_url: user.user_metadata?.avatar_url,
      },
    };

    // Optimistic UI update
    setComments((prev) => [...prev, temp]);
    setNewComment('');
    setTimeout(scrollToBottom, 100);

    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      user_id: user.id,
      content: temp.content,
    });

    if (error) {
      console.error('❌ Failed to post comment:', error.message);
      alert(`Error: ${error.message}`);
    }
  };

  /** ❤️ Toggle like */
  const toggleLike = async () => {
    if (!user) return alert('Please log in to react.');
    setAnimating(true);

    if (liked) {
      await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);
      setLiked(false);
      setLikeCount((prev) => Math.max(prev - 1, 0));
    } else {
      await supabase.from('likes').insert({ post_id: postId, user_id: user.id });
      setLiked(true);
      setLikeCount((prev) => prev + 1);
    }

    setTimeout(() => setAnimating(false), 500);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden">
      {/* ❤️ Like + Comment Header */}
      <div className="flex justify-start items-center gap-4 px-4 pt-3 pb-2 border-b bg-gray-50">
        <motion.button
          onClick={toggleLike}
          animate={animating ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 select-none"
        >
          {liked ? (
            <HeartSolid className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5 text-gray-600 hover:text-red-500" />
          )}
          <span className="text-sm text-gray-700 font-medium">
            {liked
              ? likeCount > 1
                ? `You and ${likeCount - 1} other${likeCount - 1 > 1 ? 's' : ''}`
                : 'You'
              : likeCount > 0
              ? likeCount
              : 0}
          </span>
        </motion.button>

        <p className="text-sm text-gray-600 flex items-center gap-1">
          💬 {comments.length || 0}
        </p>
      </div>

      {/* 💬 Comments list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {comments.length > 0 ? (
          comments.map((c) => {
            const isMine = c.user_id === user?.id;
            const avatarUrl =
              c.profiles?.avatar_url ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                c.profiles?.full_name || 'U'
              )}`;

            return (
              <div
                key={c.id}
                className={`flex items-end gap-2 ${
                  isMine ? 'justify-end' : 'justify-start'
                }`}
              >
                {!isMine && (
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}

                <div
                  className={`max-w-[75%] px-3 py-2 rounded-2xl ${
                    isMine
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm leading-snug break-words">{c.content}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      isMine ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {new Date(c.created_at).toLocaleString()}
                  </p>
                </div>

                {isMine && (
                  <img
                    src={
                      user?.user_metadata?.avatar_url ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user?.user_metadata?.full_name || 'You'
                      )}`
                    }
                    alt="you"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 italic text-sm">No comments yet</p>
        )}
        <div ref={commentsEndRef} />
      </div>

      {/* ✏️ Input */}
      <div className="border-t p-3 flex items-center gap-2 bg-white sticky bottom-0">
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addComment()}
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          onClick={addComment}
          className="bg-blue-600 text-white px-4 py-2 text-sm rounded-full hover:bg-blue-700 active:scale-95"
        >
          Post
        </button>
      </div>
    </div>
  );
}
