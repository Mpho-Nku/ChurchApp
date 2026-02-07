"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SavedEventRow = {
  id: string; // saved_events.id
  event: {
    id: string;
    title: string;
    start_time: string;
    churches?: {
      image_url?: string | null;
    };
  };
};

export default function SavedEventsPage() {
  const router = useRouter();
  const [items, setItems] = useState<SavedEventRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("saved_events")
        .select(
          `
          id,
          event:events (
            id,
            title,
            start_time,
            churches (
              image_url
            )
          )
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setItems(data || []);
      setLoading(false);
    };

    load();
  }, []);

  const removeSaved = async (savedId: string) => {
    const ok = confirm("Remove this saved event?");
    if (!ok) return;

    await supabase.from("saved_events").delete().eq("id", savedId);

    setItems((prev) => prev.filter((i) => i.id !== savedId));
  };

  if (loading) {
    return (
      <p className="p-6 text-center text-gray-500">
        Loading saved events…
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-10 text-center space-y-4">
        <p className="text-gray-500">
          You haven’t saved any events yet.
        </p>
        <button
          onClick={() => router.push("/events")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Browse Events
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* ← BACK */}
      <button
        onClick={() => router.push("/events")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        ← Back to Events
      </button>

      <h1 className="text-2xl font-bold">⭐ Saved Events</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((row) => {
          const ev = row.event;
          const img =
            ev.churches?.image_url || "/default_church.jpg";

          return (
            <div
              key={row.id}
              className="relative rounded-xl border bg-white shadow hover:shadow-lg transition"
            >
              {/* REMOVE */}
              <button
                onClick={() => removeSaved(row.id)}
                className="absolute top-2 right-2 z-10 bg-white border rounded-full p-2 text-red-600 hover:bg-red-50"
                title="Remove saved event"
              >
                🗑
              </button>

              <Link href={`/events/${ev.id}`}>
                <div className="relative h-48 rounded-t-xl overflow-hidden">
                  <Image
                    src={img}
                    alt={ev.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg">
                    {ev.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(ev.start_time).toLocaleDateString(
                      "en-ZA",
                      {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
