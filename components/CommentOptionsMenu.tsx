"use client";

export default function CommentOptionsMenu({ onClose, onEdit, onDelete }: any) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-end">
      <div className="bg-white w-full rounded-t-2xl p-4 space-y-4">

        <button
          className="w-full text-red-600 font-semibold py-3"
          onClick={onDelete}
        >
          Delete Comment
        </button>

        <button
          className="w-full text-blue-600 font-semibold py-3"
          onClick={onEdit}
        >
          Edit Comment
        </button>

        <button
          className="w-full py-3 text-gray-700"
          onClick={onClose}
        >
          Cancel
        </button>

      </div>
    </div>
  );
}
