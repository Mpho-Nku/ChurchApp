"use client";

export default function ActionSheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 space-y-2 animate-slideUp">
        {children}
      </div>

      <style jsx>{`
        .animate-slideUp {
          animation: slideUp 0.25s ease-out;
        }
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
