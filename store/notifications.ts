import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

export const useNotificationStore = create((set, get) => ({
  items: [],
  unread: 0,

  fetch: async (userId) => {
    if (!userId) return;

    const { data } = await supabase
      .from("notifications")
      .select(
        `id, message, type, created_at, is_read,
         sender:profiles!notifications_sender_id_fkey(full_name, avatar_url),
         post_id`
      )
      .eq("recipient_id", userId)
      .order("created_at", { ascending: false });

    const unread = data.filter((n) => !n.is_read).length;

    set({ items: data, unread });
  },

  refresh: () => {
    const userId = get().userId;
    if (userId) get().fetch(userId);
  },

  markRead: async (ids) => {
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .in("id", ids);

    get().refresh();
  },

  setUser: (userId) => set({ userId }),
}));
