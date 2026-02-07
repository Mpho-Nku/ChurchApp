"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/events")}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
    >
      ← Back
    </button>
  );
}
