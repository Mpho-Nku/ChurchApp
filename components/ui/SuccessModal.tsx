"use client";

type Props = {
  open: boolean;
  message: string;
};

export default function SuccessModal({ open, message }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl px-8 py-6 shadow-xl text-center animate-scale-in">
        <div className="text-green-600 text-3xl mb-2">✓</div>
        <p className="text-lg font-medium text-gray-900">
          {message}
        </p>
      </div>
    </div>
  );
}
