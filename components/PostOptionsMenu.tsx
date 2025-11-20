"use client";

import { motion } from "framer-motion";

export default function PostOptionsMenu({ 
  onClose, 
  onDelete, 
  onEdit, 
  onShare, 
  onCopyLink,
  canEdit 
}: any) {

  return (
    <div 
      className="fixed inset-0 z-[999] bg-black/20" 
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute right-4 top-16 w-48 rounded-xl bg-white shadow-lg border p-2 z-[1000]"
        onClick={(e) => e.stopPropagation()} // prevent closing
      >
        {canEdit && (
          <>
            <button
              onClick={onEdit}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
            >
              ✏️ Edit Post
            </button>
            <button
              onClick={onDelete}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm text-red-600"
            >
              🗑 Delete Post
            </button>
            <hr className="my-2" />
          </>
        )}

        <button
          onClick={onCopyLink}
          className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
        >
          🔗 Copy Link
        </button>

        <button
          onClick={onShare}
          className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
        >
          ↗️ Share...
        </button>

        <button
          onClick={onClose}
          className="w-full text-center px-3 py-2 mt-1 bg-gray-100 rounded-xl text-sm"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
}
