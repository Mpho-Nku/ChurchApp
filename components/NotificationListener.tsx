"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNotificationStore } from "@/store/notifications";

export default function NotificationListener({ user }) {
  const { refresh } = useNotificationStore();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("notifications-channel")
      .on("broadcast", { event: "new_notification" }, (payload) => {
        if (payload.payload.recipient_id === user.id) {
          refresh();
          if (window.navigator.vibrate) window.navigator.vibrate(20);
        }
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  return null;
}
