"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ChurchCreatedModal({ open, onClose, churchId }) {
  const router = useRouter();

  // AUTO REDIRECT after 2 seconds
  useEffect(() => {
    if (open && churchId) {
      const timer = setTimeout(() => {
        router.push(`/churches/${churchId}`);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [open, churchId, router]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-sm text-center"
          >
            {/* Icon */}
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-4xl">⛪</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Church Registered!
            </h2>

            <p className="text-gray-600 mb-5">
              Redirecting you to the church page…
            </p>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              {churchId && (
                <Link
                  href={`/churches/${churchId}`}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
                >
                  View Church Now
                </Link>
              )}

              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
