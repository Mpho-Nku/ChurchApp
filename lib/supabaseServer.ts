import { supabaseServer } from "@/lib/supabaseServer";

export async function getPosts() {
  const supabase = supabaseServer();   // ✔ NOW it is a function
  const { data } = await supabase.from("posts").select("*");
  return data;
}
