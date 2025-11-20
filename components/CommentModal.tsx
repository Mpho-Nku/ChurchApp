"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

import { Picker } from "@emoji-mart/react";
import data from "@emoji-mart/data";

import CommentItem from "@/components/comment/CommentItem";

import { X, Smile } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function CommentModal({ isOpen, onClose, post, user }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedReply, setSelectedReply] = useState(null);

  // -----------------------------------------------------
  // LOAD COMMENTS (SAFE + THREADED)
  // -----------------------------------------------------
  const loadComments = async () => {
    const { data: rows, error } = await supabase
      .from("post_comments")
      .select(
        `
        id,
        content,
        parent_id,
        created_at,
        user_id,
        profiles (full_name, avatar_url)
      `
      )
      .eq("post_id", post.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("loadComments error:", error);
      setComments([]);
      return;
    }

    if (!rows || rows.length === 0) {
      setComments([]);
      return;
    }

    const safeRows = rows.map((c) => ({
      id: c.id,
      content: c.content || "",
      parent_id: c.parent_id || null,
      created_at: c.created_at,
      user_id: c.user_id,
      profiles: c.profiles || { full_name: "User", avatar_url: null },
      replies: [],
    }));

    const map = {};
    const roots = [];

    safeRows.forEach((c) => (map[c.id] = c));

    safeRows.forEach((c) => {
      if (c.parent_id && map[c.parent_id]) {
        map[c.parent_id].replies.push(c);
      } else {
        roots.push(c);
      }
    });

    setComments(roots);
  };

  // -----------------------------------------------------
  // EFFECT — LOAD + REALTIME SYNC
  // -----------------------------------------------------
  useEffect(() => {
    if (!isOpen) return;

    loadComments();

    const channel = supabase
      .channel("comments-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "post_comments" },
        loadComments
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [isOpen]);

  // -----------------------------------------------------
  // SEND COMMENT / REPLY
  // -----------------------------------------------------
  const sendComment = async () => {
    if (!text.trim() || !user) return;

    setIsSending(true);

    await supabase.from("post_comments").insert({
      post_id: post.id,
      user_id: user.id,
      content: text.trim(),
      parent_id: selectedReply?.id || null,
    });

    setText("");
    setSelectedReply(null);
    setShowEmoji(false);
    setIsSending(false);
  };

  // -----------------------------------------------------
  // ADD EMOJI
  // -----------------------------------------------------
  const addEmoji = (emoji) => {
    setText((prev) => prev + emoji.native);
  };

  // -----------------------------------------------------
  // UI
  // -----------------------------------------------------
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-[999] flex justify-center items-end md:items-center">
      {/* SLIDE UP MODAL */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-xl bg-white rounded-t-2xl md:rounded-2xl shadow-xl flex flex-col max-h-[85vh]"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b">
          <p className="font-semibold text-lg">Comments</p>
          <button onClick={onClose}>
            <X size={22} className="text-gray-600" />
          </button>
        </div>

        {/* COMMENTS LIST */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.length === 0 && (
            <p className="text-sm text-gray-500 text-center">
              No comments yet — be the first 🎉
            </p>
          )}

          {comments.map((c) => (
            <CommentItem
              key={c.id}
              c={c}
              user={user}
              onReply={(comment) => setSelectedReply(comment)}
              onRefresh={loadComments}
              level={0}
            />
          ))}
        </div>

        {/* REPLY BANNER */}
        {selectedReply && (
          <div className="px-4 py-2 bg-gray-50 border-t flex justify-between items-center">
            <p className="text-[13px] text-gray-600">
              Replying to{" "}
              <span className="font-semibold">
                {selectedReply?.profiles?.full_name}
              </span>
            </p>
            <button
              onClick={() => setSelectedReply(null)}
              className="text-xs text-gray-500"
            >
              Cancel
            </button>
          </div>
        )}

        {/* INPUT BAR */}
        <div className="relative border-t px-4 py-3 bg-white">
          <div className="flex items-center gap-3">
            {/* EMOJI BUTTON */}
            <button onClick={() => setShowEmoji((v) => !v)}>
              <Smile size={24} className="text-gray-500" />
            </button>

            {/* TEXT FIELD */}
            <input
              placeholder="Add a comment…"
              className="flex-1 bg-gray-100 rounded-full px-3 py-2 text-sm outline-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            {/* POST BUTTON */}
            <button
              onClick={sendComment}
              disabled={!text.trim() || isSending}
              className={`text-blue-600 font-semibold text-sm ${
                !text.trim() ? "opacity-40" : ""
              }`}
            >
              Post
            </button>
          </div>

          {/* EMOJI PICKER */}
          <AnimatePresence>
            {showEmoji && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-14 left-0 right-0 flex justify-center"
              >
                <div className="shadow-lg border rounded-xl overflow-hidden bg-white">
                  <Picker data={data} onEmojiSelect={addEmoji} theme="light" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
