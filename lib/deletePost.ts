import { supabase } from "@/lib/supabaseClient";

export async function deletePostWithMedia(post: any) {
  try {
    // 1️⃣ Delete images from storage
    if (post.images && Array.isArray(post.images)) {
      const paths = post.images.map((url: string) => {
        const path = url.split("/storage/v1/object/public/")[1];
        return path.replace("images/", "images/");
      });

      const { error: storageError } = await supabase.storage
        .from("images")
        .remove(paths);

      if (storageError) console.error("Storage delete error:", storageError);
    }

    // 2️⃣ Delete single image if exists
    if (post.image_url) {
      const path = post.image_url.split("/storage/v1/object/public/")[1];
      const clean = path.replace("images/", "images/");

      await supabase.storage.from("images").remove([clean]);
    }

    // 3️⃣ Delete comments
    await supabase.from("comments").delete().eq("post_id", post.id);

    // 4️⃣ Delete post
    const { error } = await supabase.from("posts").delete().eq("id", post.id);

    if (error) throw error;

    return { success: true };
  } catch (err) {
    console.error("❌ deletePostWithMedia failed:", err);
    return { success: false, error: err };
  }
}
