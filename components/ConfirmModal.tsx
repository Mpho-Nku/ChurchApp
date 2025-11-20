"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function ConfirmModal({
  isOpen,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 w-80 shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="text-lg font-semibold text-gray-800 text-center mb-2">
              {title}
            </h2>

            <p className="text-sm text-gray-600 text-center mb-6">
              {description}
            </p>

            <div className="flex gap-3">
              <button
                className="flex-1 py-2 rounded-lg border text-gray-600"
                onClick={onCancel}
              >
                {cancelText}
              </button>

              <button
                className="flex-1 py-2 rounded-lg bg-red-600 text-white font-semibold shadow"
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
