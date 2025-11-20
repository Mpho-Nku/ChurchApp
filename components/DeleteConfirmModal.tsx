export default function DeleteConfirmModal({ onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl">
        <h3 className="font-semibold text-lg">Delete Comment?</h3>
        <p className="text-gray-600 mt-2 text-sm">
          Are you sure you want to delete this comment? This action cannot be
          undone.
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 rounded-md border"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-md bg-red-600 text-white"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
