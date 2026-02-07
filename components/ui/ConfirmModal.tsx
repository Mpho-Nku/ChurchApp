"use client";

type ConfirmModalProps = {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title = "Confirm",
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl overflow-hidden">
        {/* Content */}
        <div className="px-6 py-5 text-center space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
          <p className="text-sm text-gray-600">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="border-t flex">
          <button
            onClick={onCancel}
            className="flex-1 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className={`flex-1 py-3 text-sm font-semibold transition ${
              danger
                ? "text-red-600 hover:bg-red-50"
                : "text-blue-600 hover:bg-blue-50"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
