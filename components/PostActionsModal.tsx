'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PostActions from '@/components/PostActions';

export default function PostActionsModal({
  postId,
  isOpen,
  onClose,
}: {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  // ✅ Close when clicking outside modal
  const handleClickOutside = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // ✅ Handle swipe down on mobile
  const handleTouchStart = (e: TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: TouchEvent) => {
    currentY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const diff = currentY.current - startY.current;
    if (diff > 100) onClose(); // swipe down gesture threshold
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 🔹 Background blur overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* 🔹 Slide-up modal */}
          <motion.div
            ref={modalRef}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-lg p-4 max-h-[80vh] overflow-y-auto"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Drag handle */}
            <div className="w-10 h-1.5 bg-gray-300 rounded-full mx-auto mb-3" />

            {/* Comments section */}
            <PostActions postId={postId} user={{ id: 'current_user' }} />

            {/* Close button (optional) */}
            <button
              onClick={onClose}
              className="w-full py-2 mt-4 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700 text-sm"
            >
              Close
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
