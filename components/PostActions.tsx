"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
} from "lucide-react";

export default function PostReactions({ postId, user, onComment }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showBigHeart, setShowBigHeart] = useState(false);

  /* -------------------------------------------
     LOAD LIKE STATE
  -------------------------------------------- */
  const loadReactions = async () => {
    if (!user) return;

    const { data: likeRow } = await supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .maybeSingle();

    setIsLiked(!!likeRow);

    const { count } = await supabase
      .from("post_likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId);

    setLikesCount(count || 0);

    const { data: saveRow } = await supabase
      .from("post_saves")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .maybeSingle();

    setIsSaved(!!saveRow);
  };

  useEffect(() => {
    loadReactions();
  }, [postId, user]);

  /* -------------------------------------------
     LIKE / UNLIKE
  -------------------------------------------- */
  const toggleLike = async () => {
    if (!user) return;

    if (isLiked) {
      // Unlike
      await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);

      setIsLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      // Like
      await supabase.from("post_likes").insert({
        post_id: postId,
        user_id: user.id,
      });

      setIsLiked(true);
      setLikesCount((prev) => prev + 1);

      triggerBigHeart();
    }

    if (navigator?.vibrate) navigator.vibrate(10);
  };

  /* -------------------------------------------
     DOUBLE TAP LIKE ANIMATION
  -------------------------------------------- */
  const triggerBigHeart = () => {
    setShowBigHeart(true);
    setTimeout(() => setShowBigHeart(false), 600);
  };

  /* -------------------------------------------
     SAVE / UNSAVE
  -------------------------------------------- */
  const toggleSave = async () => {
    if (!user) return;

    if (isSaved) {
      await supabase
        .from("post_saves")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);

      setIsSaved(false);
    } else {
      await supabase.from("post_saves").insert({
        post_id: postId,
        user_id: user.id,
      });

      setIsSaved(true);
    }

    if (navigator?.vibrate) navigator.vibrate(10);
  };

  return (
    <div className="relative">

      {/* -------------------------------------------
          DOUBLE TAP BIG HEART
      -------------------------------------------- */}
      <AnimatePresence>
        {showBigHeart && (
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
          >
            <Heart className="w-24 h-24 text-red-500 fill-red-500 drop-shadow-xl" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------
          MAIN INSTAGRAM ACTION BAR
      -------------------------------------------- */}
      <div className="flex items-center justify-between w-full select-none">

        {/* LEFT SECTION: LIKE – COMMENT – SHARE */}
        <div className="flex items-center gap-5">

          {/* LIKE BUTTON */}
          <motion.button
            whileTap={{ scale: 0.75 }}
            onClick={toggleLike}
          >
            <Heart
              size={28}
              strokeWidth={1.6}
              className={
                isLiked
                  ? "fill-red-500 stroke-red-500 transition-all"
                  : "stroke-gray-900"
              }
            />
          </motion.button>

          {/* COMMENT BUTTON */}
          <motion.button
            whileTap={{ scale: 0.75 }}
            onClick={onComment}
          >
            <MessageCircle
              size={28}
              strokeWidth={1.6}
              className="stroke-gray-900"
            />
          </motion.button>

          {/* SHARE BUTTON */}
          <motion.button whileTap={{ scale: 0.75 }}>
            <Send
              size={28}
              strokeWidth={1.6}
              className="stroke-gray-900"
            />
          </motion.button>
        </div>

        {/* RIGHT SECTION: SAVE */}
        <motion.button whileTap={{ scale: 0.75 }} onClick={toggleSave}>
          <Bookmark
            size={28}
            strokeWidth={1.6}
            className={
              isSaved
                ? "fill-gray-900 stroke-gray-900"
                : "stroke-gray-900"
            }
          />
        </motion.button>
      </div>

      {/* -------------------------------------------
          LIKES COUNTER
      -------------------------------------------- */}
      <p className="mt-2 text-[14px] font-semibold text-gray-900">
        {likesCount} like{likesCount !== 1 && "s"}
      </p>
    </div>
  );
}
