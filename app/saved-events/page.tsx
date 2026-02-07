"use client";

import { useState } from "react";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function SavedEventsPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-10">
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-red-600 text-white rounded-xl"
      >
        Remove saved event
      </button>

      <ConfirmModal
        open={open}
        title="Remove saved event"
        message="Are you sure you want to remove this saved event?"
        confirmText="Remove"
        danger
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          alert("Confirmed!");
          setOpen(false);
        }}
      />
    </div>
  );
}
