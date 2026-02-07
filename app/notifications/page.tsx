"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function NotificationsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // 1️⃣ Load notifications
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setItems(data || []);

      // 2️⃣ Mark unread as read
      await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user.id)
        .eq("read", false);

      setLoading(false);
    };

    load();
  }, []);

  if (loading) {
    return (
      <p className="p-6 text-center text-gray-500">
        Loading notifications…
      </p>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-xl font-bold">Notifications</h1>

      {items.length === 0 ? (
        <p className="text-gray-500">No notifications</p>
      ) : (
        items.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-xl border ${
              n.read ? "bg-white" : "bg-blue-50"
            }`}
          >
            <p className="font-semibold">{n.title}</p>
            <p className="text-sm text-gray-600">{n.message}</p>
          </div>
        ))
      )}
    </div>
  );
}
