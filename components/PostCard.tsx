import Image from "next/image";

export default function PostCard({ post }: any) {
  return (
    <div className="w-full max-w-xl rounded-2xl border bg-white shadow-sm mb-6">
      
      {/* --- Location (Instagram style) --- */}
      {post.location_name && (
        <div className="px-4 pt-3 text-sm font-semibold text-gray-800">
          {post.location_name}
        </div>
      )}

      {/* Image */}
      {post.image_url && (
        <div className="w-full mt-2">
          <Image
            src={post.image_url}
            alt="Post image"
            width={600}
            height={600}
            className="w-full object-cover max-h-[500px] rounded-none"
          />
        </div>
      )}

      {/* Caption */}
      <div className="px-4 py-3 text-sm text-gray-900">
        {post.caption}
      </div>

      {/* Created at */}
      <div className="px-4 pb-3 text-xs text-gray-500">
        {new Date(post.created_at).toLocaleString()}
      </div>
    </div>
  );
}
