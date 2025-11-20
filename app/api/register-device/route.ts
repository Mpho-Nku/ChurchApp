import { supabase } from "@/lib/supabaseServer";

export async function POST(req) {
  const sub = await req.json();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return new Response("Unauthorized", { status: 401 });

  await supabase.from("push_devices").upsert({
    user_id: userData.user.id,
    subscription: sub,
  });

  return Response.json({ ok: true });
}
