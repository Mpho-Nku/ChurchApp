import { supabase } from "@/lib/supabaseClient";

export async function sendNotification({
  recipient_id,
  sender_id,
  post_id = null,
  comment_id = null,
  type,
  message,
}) {
  if (!recipient_id || !sender_id || recipient_id === sender_id) return;

  await supabase.from("notifications").insert({
    recipient_id,
    sender_id,
    post_id,
    comment_id,
    type,
    message,
  });

  // Broadcast for real-time UI
  supabase.channel("notifications").send({
    type: "broadcast",
    event: "new_notification",
    payload: { recipient_id },
  });
}
