"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function NotificationBell() {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("read", false);

      setCount(count || 0);
    };

    load();
  }, []);

  return (
    <Link href="/notifications" className="relative">
      <span className="text-2xl">🔔</span>

      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-2">
          {count}
        </span>
      )}
    </Link>
  );
}
