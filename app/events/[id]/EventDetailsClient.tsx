"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  event: any;
  isOwner: boolean;
  isSaved: boolean;
  reminderDays: number | null;
  user: any;
};

/* ✅ SAFE DATE FORMATTER (client only, consistent) */
const formatDate = (date?: string) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function EventDetailsClient({
  event,
  isOwner,
  isSaved,
  reminderDays,
  user,
}: Props) {
  const router = useRouter();

  if (!event) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading event…
      </div>
    );
  }

  const [saved, setSaved] = useState(isSaved);
  const [daysBefore, setDaysBefore] = useState(reminderDays ?? 1);
  const [saving, setSaving] = useState(false);

  const church = event.churches;
  const image = church?.image_url || "/default_church.jpg";

  const location = [
    church?.street,
    church?.suburb,
    church?.township,
  ]
    .filter(Boolean)
    .join(", ");

  const mapsUrl = location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        location
      )}`
    : null;

  /* ⭐ SAVE / UNSAVE EVENT */
  const toggleSave = async () => {
    if (!user) {
      alert("Please sign in to save events");
      return;
    }

    setSaving(true);

    if (saved) {
      await supabase
        .from("saved_events")
        .delete()
        .eq("user_id", user.id)
        .eq("event_id", event.id);

      await supabase
        .from("event_reminders")
        .delete()
        .eq("user_id", user.id)
        .eq("event_id", event.id);

      setSaved(false);
    } else {
      await supabase.from("saved_events").insert({
        user_id: user.id,
        event_id: event.id,
      });

      await supabase.from("event_reminders").upsert({
        user_id: user.id,
        event_id: event.id,
        days_before: daysBefore,
      });

      setSaved(true);
    }

    setSaving(false);
  };

  /* 🔔 UPDATE REMINDER */
  const updateReminder = async (value: number) => {
    setDaysBefore(value);

    if (!user) return;

    await supabase.from("event_reminders").upsert({
      user_id: user.id,
      event_id: event.id,
      days_before: value,
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* ← BACK */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
      >
        ← Back
      </button>

      {/* IMAGE */}
      <div className="relative w-full h-64 rounded-xl overflow-hidden bg-gray-200">
        <Image
          src={image}
          alt={event.title}
          fill
          className="object-cover"
        />
      </div>

      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          {event.title}
        </h1>

        {event.description && (
          <p className="text-gray-700">
            {event.description}
          </p>
        )}
      </div>

      {/* 📅 DATE SECTION */}
      <section className="rounded-xl border bg-blue-50 p-4 space-y-1">
        <p>
          <strong>Start:</strong> {formatDate(event.start_time)}
        </p>
        <p>
          <strong>End:</strong> {formatDate(event.end_time)}
        </p>
      </section>

      {/* 📍 LOCATION + NAVIGATE */}
      {church && (
        <section className="rounded-xl border p-4 space-y-3">
          <div>
            <p className="text-sm text-gray-500 uppercase">
              Hosted by
            </p>
            <p className="font-semibold text-lg">
              {church.name}
            </p>
            {location && (
              <p className="text-gray-600 text-sm">
                {location}
              </p>
            )}
          </div>

          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
            >
              📍 Navigate
            </a>
          )}
        </section>
      )}

      {/* ⭐ SAVE + REMINDER */}
      <section className="flex items-center gap-4 pt-4 border-t">
        <button
          disabled={saving}
          onClick={toggleSave}
          className={`px-4 py-2 rounded-xl border transition ${
            saved
              ? "bg-yellow-400 text-white border-yellow-400"
              : "bg-white border-gray-300"
          }`}
        >
          {saved ? "★ Saved" : "☆ Save Event"}
        </button>

        {saved && (
          <select
            value={daysBefore}
            onChange={(e) =>
              updateReminder(Number(e.target.value))
            }
            className="border rounded-lg p-2 text-sm"
          >
            <option value={1}>Remind 1 day before</option>
            <option value={2}>Remind 2 days before</option>
            <option value={7}>Remind 1 week before</option>
          </select>
        )}
      </section>
    </div>
  );
}
