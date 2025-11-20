"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import NotificationsDropdown from "./NotificationsDropdown";
import { supabase } from "@/lib/supabaseClient";

export default function NotificationsBell({ user }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  async function loadUnread() {
    if (!user) return;

    const { count } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("recipient_id", user.id)
      .is("read_at", null);

    setUnreadCount(count || 0);
  }

  useEffect(() => {
    if (!user) return;

    loadUnread();

    // Real-time notifications
    const channel = supabase
      .channel("notifications-listener")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        loadUnread
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition"
      >
        <Bell size={22} className="text-gray-700" />

        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <NotificationsDropdown
          user={user}
          closeDropdown={() => setOpen(false)}
        />
      )}
    </div>
  );
}
