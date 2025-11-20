"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";

export default function NotificationsPage() {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);

  const load = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
    if (!user) return;

    const { data } = await supabase
      .from("notifications")
      .select(
        `
        id,
        type,
        read,
        created_at,
        from,
        post_id,
        comment_id,
        extra,
        profiles:from (full_name, avatar_url)
      `
      )
      .eq("to", user.id)
      .order("created_at", { ascending: false });

    setItems(data || []);

    // auto mark all as read
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("to", user.id)
      .eq("read", false);
  };

  useEffect(() => {
    load();
  }, []);

  const messageFor = (n) => {
    switch (n.type) {
      case "mention":
        return "mentioned you in a comment";
      case "comment_reply":
        return "replied to your comment";
      case "post_like":
        return "liked your post";
      case "comment_like":
        return "liked your comment";
      default:
        return "sent you a notification";
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-6">Notifications</h1>

      {items.map((n) => (
        <div
          key={n.id}
          className="flex items-center gap-3 py-3 border-b last:border-0"
        >
          {/* Avatar */}
          {n.profiles?.avatar_url ? (
            <Image
              src={n.profiles.avatar_url}
              width={40}
              height={40}
              className="rounded-full object-cover"
              alt="avatar"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300" />
          )}

          {/* Text */}
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-semibold">
                {n.profiles?.full_name || "Someone"}
              </span>{" "}
              {messageFor(n)}
            </p>

            <p className="text-xs text-gray-500">
              {new Date(n.created_at).toLocaleString()}
            </p>
          </div>

          {/* Thumbnail (post image) */}
          {n.post_id && (
            <Link href={`/post/${n.post_id}`}>
              <div className="w-12 h-12 bg-gray-200" />
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
