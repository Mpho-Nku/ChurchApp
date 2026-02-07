"use client";

export default function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: any;
}) {
  return (
    <div className="w-full mb-8">
      <p className="text-xs font-semibold text-gray-500 px-4 mb-2">
        {title.toUpperCase()}
      </p>

      <div className="bg-white rounded-xl shadow border overflow-hidden">
        {children}
      </div>
    </div>
  );
}
