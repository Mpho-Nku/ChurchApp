"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function SuccessModal({ message, isOpen }: { message: string; isOpen: boolean }) {
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
            className="bg-white rounded-xl p-6 w-72 shadow-lg text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="text-green-600 text-4xl mb-2">✔</div>
            <p className="font-semibold text-gray-800">{message}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
