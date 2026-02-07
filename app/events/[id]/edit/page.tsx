"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import SuccessModal from "@/components/ui/SuccessModal";

export default function EditEventPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const eventId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");

  // Load event
  useEffect(() => {
    const loadEvent = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("title, description, start_time, end_time, location")
        .eq("id", eventId)
        .single();

      if (error || !data) {
        router.push("/events");
        return;
      }

      setTitle(data.title ?? "");
      setDescription(data.description ?? "");
      setLocation(data.location ?? "");

      if (data.start_time) {
        const start = new Date(data.start_time);
        setStartDate(start.toISOString().split("T")[0]);
      }

      if (data.end_time) {
        const end = new Date(data.end_time);
        setEndDate(end.toISOString().split("T")[0]);
      }

      setLoading(false);
    };

    loadEvent();
  }, [eventId, router]);

  // Auto-set end date to next day when start date changes
  useEffect(() => {
    if (!startDate) return;

    const nextDay = new Date(startDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setEndDate(nextDay.toISOString().split("T")[0]);
  }, [startDate]);

  const handleSave = async () => {
    if (!title || !startDate) return;

    setSaving(true);

    const { error } = await supabase
      .from("events")
      .update({
        title,
        description,
        start_time: startDate,
        end_time: endDate,
        location: location || null,
      })
      .eq("id", eventId);

    setSaving(false);

    if (error) {
      alert("Failed to save changes");
      return;
    }

    // ✅ Show success popup
    setSaved(true);

    // ✅ Redirect after short delay
    setTimeout(() => {
      router.push(`/events/${eventId}`);
    }, 1500);
  };

  if (loading) {
    return (
      <p className="p-10 text-center text-gray-500">
        Loading event…
      </p>
    );
  }

  return (
    <>
      <div className="max-w-lg mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow p-6 space-y-5">
          <h1 className="text-2xl font-bold">Edit Event</h1>

          {/* Title */}
          <input
            className="w-full p-3 border rounded-xl"
            placeholder="Event title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Description */}
          <textarea
            className="w-full p-3 border rounded-xl"
            placeholder="Event description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Start date */}
          <input
            type="date"
            className="w-full p-3 border rounded-xl"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          {/* End date (auto) */}
          <input
            type="date"
            className="w-full p-3 border rounded-xl bg-gray-100"
            value={endDate}
            disabled
          />

          {/* Location */}
          <div>
            <label className="text-sm text-gray-600">
              Event location (optional)
            </label>
            <input
              className="w-full p-3 border rounded-xl mt-1"
              placeholder="Leave empty to use church address"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>

            <button
              onClick={() => router.back()}
              className="border px-6 py-2 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Success Popup */}
      <SuccessModal
        open={saved}
        message="Changes saved"
      />
    </>
  );
}
