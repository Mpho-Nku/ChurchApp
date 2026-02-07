"use client";

import { ChevronRight } from "lucide-react";

export default function SettingsRow({
  label,
  description,
  href,
  danger,
}: {
  label: string;
  description?: string;
  href: string;
  danger?: boolean;
}) {
  return (
    <a
      href={href}
      className={`flex items-center justify-between px-4 py-4 bg-white 
      hover:bg-gray-50 transition border-b text-[15px] 
      ${danger ? "text-red-600 font-semibold" : "text-gray-800"}`}
    >
      <div>
        <p className="font-medium">{label}</p>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
      </div>

      <ChevronRight className="w-5 h-5 text-gray-400" />
    </a>
  );
}
