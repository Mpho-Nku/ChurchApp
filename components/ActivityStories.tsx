"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function ActivityStories() {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState<any>(null);

  const load = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    setUser(user);

    const { data } = await supabase
      .from("notifications")
      .select(
        `
        id,
        type,
        message,
        created_at,
        read_at,
        sender_id,
        post_id,
        profiles:sender_id ( full_name, avatar_url )
      `
      )
      .eq("recipient_id", user.id)
      .order("created_at", { ascending: false });

    setItems(data || []);
  };

  useEffect(() => {
    load();

    const channel = supabase
      .channel("activity-stories")
      .on(
        "postgres_changes",
        { event: "*", table: "notifications" },
        () => load()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <div className="w-full overflow-x-auto border-b py-3 bg-white">
      <div className="flex gap-4 px-4">
        {items.slice(0, 20).map((n) => (
          <button
            key={n.id}
            onClick={() => (window.location.href = `/post/${n.post_id}`)}
            className="flex flex-col items-center"
          >
            <div className="relative">
              <Image
                src={n.profiles?.avatar_url || "/avatar.png"}
                width={60}
                height={60}
                className={`rounded-full border-2 ${
                  n.read_at ? "border-gray-300" : "border-blue-500"
                }`}
                alt="avatar"
              />
            </div>
            <p className="text-[11px] mt-1 text-gray-700 whitespace-nowrap">
              {n.profiles?.full_name?.split(" ")[0]}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
