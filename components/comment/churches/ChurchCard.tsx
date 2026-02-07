"use client";

import Link from "next/link";
import Image from "next/image";

type Props = {
  church: any;
  isOwner: boolean;
  onDelete: (id: string) => void;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
};

export default function ChurchCard({
  church,
  isOwner,
  onDelete,
  openMenuId,
  setOpenMenuId,
}: Props) {
  const img = church.image_url || "/default_church.jpg";

  return (
    <div className="relative border rounded-xl bg-white shadow hover:shadow-lg transition">
      {/* IMAGE + LINK */}
      <Link href={`/churches/${church.id}`}>
        <div className="w-full h-40 bg-gray-100 rounded-t-xl overflow-hidden relative">
          <Image
            src={img}
            alt={church.name}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      {/* 3 DOT MENU (OWNER ONLY) */}
      {isOwner && (
        <div className="absolute top-2 right-2 z-50">
          <button
            onClick={() =>
              setOpenMenuId(openMenuId === church.id ? null : church.id)
            }
            className="bg-white rounded-full px-2 py-1 shadow"
          >
            ⋮
          </button>

          {openMenuId === church.id && (
            <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg">
              <Link
                href={`/churches/${church.id}/edit`}
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                Edit
              </Link>

              <button
                onClick={() => onDelete(church.id)}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}

      {/* TEXT */}
      <div className="p-4 space-y-1">
        <h2 className="font-semibold text-lg">{church.name}</h2>

        <p className="text-sm text-gray-600">
          Pastor: {church.pastor_name || "N/A"}
        </p>

        <p className="text-xs text-gray-500">
          {[church.street, church.suburb, church.township]
            .filter(Boolean)
            .join(", ")}
        </p>
      </div>
    </div>
  );
}
