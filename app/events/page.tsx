"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Event = {
  id: string;
  title: string;
  start_time: string;
  churches?: {
    image_url?: string | null;
  };
};

export default function EventsPage() {
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [filtered, setFiltered] = useState<Event[]>([]);
  const [filter, setFilter] = useState<"all" | "weekend" | "month">("all");
  const [loading, setLoading] = useState(true);

  /** ---------- DATE HELPERS ---------- */

  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const endOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

  const getWeekendRange = () => {
    const today = new Date();
    const day = today.getDay(); // 0 = Sun, 6 = Sat

    let saturday = new Date(today);
    let sunday = new Date(today);

    if (day === 6) {
      sunday.setDate(today.getDate() + 1);
    } else if (day === 0) {
      saturday = new Date(today);
    } else {
      saturday.setDate(today.getDate() + (6 - day));
      sunday.setDate(saturday.getDate() + 1);
    }

    return {
      start: startOfDay(saturday),
      end: endOfDay(sunday),
    };
  };

  const getMonthRange = () => {
    const now = new Date();
    return {
      start: startOfDay(now),
      end: endOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
    };
  };

  /** ---------- LOAD EVENTS ---------- */

  useEffect(() => {
    const loadEvents = async () => {
      const { data } = await supabase
        .from("events")
        .select(
          `
          id,
          title,
          start_time,
          churches (
            image_url
          )
        `
        )
        .order("start_time", { ascending: true });

      setEvents(data || []);
      setFiltered(data || []);
      setLoading(false);
    };

    loadEvents();
  }, []);

  /** ---------- APPLY FILTER ---------- */

  useEffect(() => {
    if (!events.length) return;

    if (filter === "all") {
      setFiltered(events);
      return;
    }

    if (filter === "weekend") {
      const { start, end } = getWeekendRange();
      setFiltered(
        events.filter((ev) => {
          const d = new Date(ev.start_time);
          return d >= start && d <= end;
        })
      );
      return;
    }

    if (filter === "month") {
      const { start, end } = getMonthRange();
      setFiltered(
        events.filter((ev) => {
          const d = new Date(ev.start_time);
          return d >= start && d <= end;
        })
      );
    }
  }, [filter, events]);

  if (loading) return <p className="p-6">Loading events…</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

      {/* ← BACK TO HOME */}
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
      >
        ← Back
      </button>

      <div className="flex items-center gap-3">
  <h1 className="text-2xl font-bold">Events</h1>

  <div className="ml-auto flex gap-2">
    <Link
      href="/events/saved"
      className="px-4 py-2 border rounded-lg"
    >
      ⭐ Saved
    </Link>

    <Link
      href="/events/add"
      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
    >
      Add Event
    </Link>
  </div>
</div>

      {/* FILTERS */}
      <div className="flex gap-3">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg border ${
            filter === "all"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white border-gray-300"
          }`}
        >
          All Events
        </button>

        <button
          onClick={() => setFilter("weekend")}
          className={`px-4 py-2 rounded-lg border ${
            filter === "weekend"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white border-gray-300"
          }`}
        >
          This Weekend
        </button>

        <button
          onClick={() => setFilter("month")}
          className={`px-4 py-2 rounded-lg border ${
            filter === "month"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white border-gray-300"
          }`}
        >
          This Month
        </button>
      </div>

      {/* EVENTS GRID */}
      {filtered.length === 0 ? (
        <p className="text-gray-500 mt-4">No events found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((ev) => {
            const img =
              ev.churches?.image_url || "/default_church.jpg";

            return (
              <Link
                key={ev.id}
                href={`/events/${ev.id}`}
                className="block rounded-xl border bg-white shadow hover:shadow-lg transition"
              >
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
                    {new Date(ev.start_time).toLocaleDateString("en-ZA", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
