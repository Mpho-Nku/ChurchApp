"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Done() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => router.push("/feed"), 800);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen text-xl font-semibold">
      🎉 Setup Complete!
    </div>
  );
}
