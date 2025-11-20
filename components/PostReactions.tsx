"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  postId: string;
  user: any;
  onComment?: () => void;
};

export default function PostReactions({ postId, user, onComment }: Props) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [bigHeart, setBigHeart] = useState(false);

  // ───────────────────────────────────────────────
  // LOAD INITIAL LIKES + SAVES
  // ───────────────────────────────────────────────
  const loadState = async () => {
    setLoading(true);

    // Check like
    const { data: likeRow } = await supabase
      .from("post_likes")
      .select("*")
      .eq("post_id", postId)
      .eq("user_id", user?.id)
      .maybeSingle();

    setLiked(!!likeRow);

    // Count likes
    const { count: totalLikes } = await supabase
      .from("post_likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId);

    setCount(totalLikes || 0);

    // Check save
    const { data: saveRow } = await supabase
      .from("post_saves")
      .select("*")
      .eq("post_id", postId)
      .eq("user_id", user?.id)
      .maybeSingle();

    setSaved(!!saveRow);

    setLoading(false);
  };

  useEffect(() => {
    if (!postId || !user) return;
    loadState();

    // Realtime update
    const channel = supabase
      .channel(`post-likes-${postId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "post_likes" },
        loadState
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [postId, user]);

  // ───────────────────────────────────────────────
  // LIKE / UNLIKE
  // ───────────────────────────────────────────────
  const toggleLike = async () => {
    if (!user) return;

    if (liked) {
      await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);

      setLiked(false);
      setCount((c) => c - 1);
    } else {
      await supabase.from("post_likes").insert({
        post_id: postId,
        user_id: user.id,
      });

      setLiked(true);
      setCount((c) => c + 1);

      // Big heart animation
      setBigHeart(true);
      setTimeout(() => setBigHeart(false), 600);
    }
  };

  // ───────────────────────────────────────────────
  // SAVE / UNSAVE
  // ───────────────────────────────────────────────
  const toggleSave = async () => {
    if (!user) return;

    if (saved) {
      await supabase
        .from("post_saves")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);

      setSaved(false);
    } else {
      await supabase.from("post_saves").insert({
        post_id: postId,
        user_id: user.id,
      });

      setSaved(true);
    }
  };

  // ───────────────────────────────────────────────
  // UI
  // ───────────────────────────────────────────────
  return (
    <div className="relative select-none px-1 py-2">
      {/* BIG HEART ANIMATION */}
      <AnimatePresence>
        {bigHeart && (
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1.4, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex items-center justify-center z-20"
          >
            <Heart className="w-24 h-24 fill-red-500 text-red-500" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* BUTTON ROW */}
      <div className="flex justify-between items-center">
        {/* LEFT ICONS */}
        <div className="flex items-center gap-4">

          {/* LIKE */}
          <motion.button whileTap={{ scale: 0.75 }} onClick={toggleLike}>
            <Heart
              size={30}
              className={
                liked
                  ? "fill-red-500 stroke-red-500"
                  : "stroke-gray-800"
              }
            />
          </motion.button>

          {/* COMMENT */}
          <motion.button whileTap={{ scale: 0.75 }} onClick={onComment}>
            <MessageCircle size={30} className="stroke-gray-800" />
          </motion.button>

          {/* SHARE */}
          <motion.button whileTap={{ scale: 0.75 }}>
            <Send size={28} className="stroke-gray-800" />
          </motion.button>
        </div>

        {/* SAVE */}
        <motion.button whileTap={{ scale: 0.75 }} onClick={toggleSave}>
          <Bookmark
            size={30}
            className={
              saved
                ? "fill-black stroke-black"
                : "stroke-gray-800"
            }
          />
        </motion.button>
      </div>

      {/* LIKE COUNT */}
      <p className="px-1 pt-1 text-sm font-semibold text-gray-900">
        {count} like{count !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
