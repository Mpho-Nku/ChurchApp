'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import PostSidebar from './PostSidebar';

export default function PostModal({ post, user, onClose }: any) {
  return (
    <AnimatePresence>
      {post && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Close overlay click */}
          <div
            className="absolute inset-0"
            onClick={onClose}
          />

          <div className="relative z-10 flex bg-white rounded-lg overflow-hidden max-w-5xl w-full h-[80vh]">
            {/* 📸 Left: Media */}
            <div className="flex-1 bg-black flex items-center justify-center relative">
              {Array.isArray(post.images) && post.images.length > 0 ? (
                <Image
                  src={post.images[0]}
                  alt="post"
                  fill
                  className="object-contain"
                />
              ) : (
                <p className="text-white">No image available</p>
              )}
            </div>

            {/* 💬 Right: Sidebar */}
            <div className="w-[360px] flex flex-col bg-white border-l">
              <PostSidebar postId={post.id} user={user} />
            </div>

            {/* ❌ Close */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-white bg-black bg-opacity-60 rounded-full p-2 hover:bg-opacity-80"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
