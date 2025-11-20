'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  HandThumbUpIcon,
  HeartIcon,
  FaceSmileIcon,
  FaceFrownIcon,
  FireIcon,
} from '@heroicons/react/24/solid';

const REACTIONS = [
  { type: 'like', icon: HandThumbUpIcon, color: 'text-blue-600' },
  { type: 'love', icon: HeartIcon, color: 'text-red-500' },
  { type: 'haha', icon: FaceSmileIcon, color: 'text-yellow-500' },
  { type: 'sad', icon: FaceFrownIcon, color: 'text-blue-400' },
  { type: 'angry', icon: FireIcon, color: 'text-orange-600' },
];

export default function ReactionBar({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) {
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchReactions = async () => {
      const { data } = await supabase
        .from('post_reactions')
        .select('*')
        .eq('post_id', postId);
      if (data) {
        const tally: Record<string, number> = {};
        data.forEach((r) => {
          tally[r.emoji] = (tally[r.emoji] || 0) + 1;
        });
        setCounts(tally);
        const mine = data.find((r) => r.user_id === userId);
        setUserReaction(mine?.emoji || null);
      }
    };
    fetchReactions();

    const channel = supabase
      .channel(`post-reactions-${postId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'post_reactions', filter: `post_id=eq.${postId}` },
        () => fetchReactions()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [postId, userId]);

  const handleReaction = async (type: string) => {
    if (userReaction === type) {
      // remove reaction
      await supabase
        .from('post_reactions')
        .delete()
        .match({ post_id: postId, user_id: userId });
      setUserReaction(null);
    } else {
      await supabase
        .from('post_reactions')
        .upsert([{ post_id: postId, user_id: userId, emoji: type }]);
      setUserReaction(type);
    }
  };

  return (
    <div className="flex gap-3 mt-3">
      {REACTIONS.map((r) => {
        const Icon = r.icon;
        const active = userReaction === r.type;
        return (
          <button
            key={r.type}
            onClick={() => handleReaction(r.type)}
            className={`relative flex items-center gap-1 hover:scale-110 transition-transform ${
              active ? r.color : 'text-gray-400'
            }`}
          >
            <Icon className="h-5 w-5" />
            {counts[r.type] && counts[r.type] > 0 && (
              <span className="text-xs">{counts[r.type]}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
