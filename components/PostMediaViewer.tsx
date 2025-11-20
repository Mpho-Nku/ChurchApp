"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

export default function PostMediaViewer({ postId, media, user, onOpenModal }: any) {
  const [showHeart, setShowHeart] = useState(false);
  const lastTapRef = useRef<number>(0);

  // LIKE HANDLER (same as PostReactions but simplified)
  const likePost = async () => {
    if (!user) return;

    // Insert like (ignore duplicates)
    await supabase
      .from("likes")
      .upsert({ post_id: postId, user_id: user.id }, { onConflict: "post_id,user_id" });

    // Trigger feed refresh
    window.dispatchEvent(new Event("post:created"));
  };

  // DOUBLE TAP DETECTION
  const handleDoubleTap = () => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;

    if (timeSinceLastTap < 300) {
      // DOUBLE TAP detected
      setShowHeart(true);
      likePost();

      // Hide heart after animation
      setTimeout(() => setShowHeart(false), 800);
    }

    lastTapRef.current = now;
  };

  return (
    <div className="relative w-full" onClick={handleDoubleTap}>
      {/* Render image(s) */}
      {media.length === 1 ? (
        <div className="relative w-full aspect-square bg-black">
          <Image
            src={media[0].url}
            alt="Post media"
            fill
            className="object-cover"
            onDoubleClick={handleDoubleTap}
          />
        </div>
      ) : (
        <div className="w-full overflow-x-scroll flex snap-x">
          {media.map((m: any, index: number) => (
            <div
              key={index}
              className="relative min-w-full aspect-square snap-center bg-black"
            >
              <Image
                src={m.url}
                alt={`Post media ${index + 1}`}
                fill
                className="object-cover"
                onDoubleClick={handleDoubleTap}
              />
            </div>
          ))}
        </div>
      )}

      {/* ❤️ HEART ANIMATION OVERLAY */}
      <AnimatePresence>
        {showHeart && (
          <motion.div
            key="heart"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.6, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="text-white/90 drop-shadow-xl text-[120px] select-none">❤️</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click to open modal (view post) */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onOpenModal?.();
        }}
      />
    </div>
  );
}
