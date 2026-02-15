"use client";

import { motion, AnimatePresence } from "framer-motion";

type Props = {
  open: boolean;
  title: string;
  message: string;
  primaryText: string;
  onPrimary: () => void;
  onClose?: () => void;
};

export default function SuccessModal({
  open,
  title,
  message,
  primaryText,
  onPrimary,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center space-y-4"
        >
          <h2 className="text-xl font-semibold text-gray-900">
            {title}
          </h2>

          <p className="text-gray-600 text-sm">
            {message}
          </p>

          <div className="flex gap-3 pt-3">
            {onClose && (
              <button
                onClick={onClose}
                className="flex-1 border rounded-lg py-2 text-sm"
              >
                Cancel
              </button>
            )}

            <button
              onClick={onPrimary}
              className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm"
            >
              {primaryText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
