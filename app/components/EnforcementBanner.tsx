"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function EnforcementBanner() {
  const [needsChurch, setNeedsChurch] = useState(false);
  const [needsEvent, setNeedsEvent] = useState(false);

  useEffect(() => {
    async function check() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: church } = await supabase
        .from("churches")
        .select("id")
        .eq("created_by", user.id)
        .single();

      if (!church) {
        setNeedsChurch(true);
        return;
      }

      const { data: events } = await supabase
        .from("events")
        .select("id")
        .eq("church_id", church.id);

      if (!events || events.length === 0) {
        setNeedsEvent(true);
      }
    }
    check();
  }, []);

  if (!needsChurch && !needsEvent) return null;

  return (
    <div className="w-full bg-yellow-100 border-b border-yellow-300 px-4 py-3 text-center text-yellow-900 font-medium">
      {needsChurch && (
        <a href="/onboarding/church" className="underline">
          ⚠️ Please register your church to continue.
        </a>
      )}

      {needsEvent && (
        <a href="/onboarding/events" className="underline">
          ⚠️ Please add at least 1 event for your church.
        </a>
      )}
    </div>
  );
}
