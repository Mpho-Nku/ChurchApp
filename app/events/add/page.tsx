"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import SuccessModal from "@/components/ui/SuccessModal";

export default function AddEventPage() {
  const router = useRouter();

  const [churchQuery, setChurchQuery] = useState("");
  const [churchResults, setChurchResults] = useState<any[]>([]);
  const [selectedChurch, setSelectedChurch] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(""); // YYYY-MM-DD
  const [description, setDescription] = useState("");

  const [creating, setCreating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  /* 🔍 SEARCH CHURCH */
  useEffect(() => {
    if (!churchQuery.trim()) {
      setChurchResults([]);
      return;
    }

    const search = async () => {
      const { data } = await supabase
        .from("churches")
        .select("id, name, township")
        .ilike("name", `%${churchQuery}%`)
        .limit(8);

      setChurchResults(data || []);
    };

    search();
  }, [churchQuery]);

  /* 🧠 DATE LOGIC */
  const getEndDate = (start: string) => {
    const d = new Date(start);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  /* ⏩ AUTO REDIRECT AFTER SUCCESS */
  useEffect(() => {
    if (!showSuccess) return;

    const timer = setTimeout(() => {
      router.replace("/events");
    }, 1800);

    return () => clearTimeout(timer);
  }, [showSuccess, router]);

  /* ➕ CREATE EVENT */
  const handleCreateEvent = async () => {
    if (!selectedChurch) {
      alert("Select a church first.");
      return;
    }

    if (!title || !startDate) {
      alert("Title and start date are required.");
      return;
    }

    setCreating(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setCreating(false);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(getEndDate(startDate));

    const { error } = await supabase.from("events").insert({
      church_id: selectedChurch.id,
      title,
      description,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      created_by: user.id,
    });

    setCreating(false);

    if (error) {
      console.error(error);
      alert("Failed to create event");
      return;
    }

    setShowSuccess(true);
  };

  return (
    <>
      <div className="max-w-xl mx-auto px-4 py-6 space-y-6">

        {/* ← BACK */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold">Add Event</h1>

        {/* SELECT CHURCH */}
        <div className="space-y-2">
          <label className="font-medium">Select Church *</label>

          <input
            type="text"
            placeholder="Search church..."
            className="w-full p-3 border rounded-xl"
            value={churchQuery}
            onChange={(e) => setChurchQuery(e.target.value)}
          />

          {churchResults.length > 0 && (
            <div className="border rounded-xl bg-white shadow">
              {churchResults.map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => {
                    setSelectedChurch(ch);
                    setChurchQuery(ch.name);
                    setChurchResults([]);
                  }}
                  className="block w-full text-left px-4 py-3 hover:bg-gray-100"
                >
                  <div className="font-medium">{ch.name}</div>
                  <div className="text-xs text-gray-500">
                    {ch.township ?? "No location"}
                  </div>
                </button>
              ))}
            </div>
          )}

          {selectedChurch && (
            <div className="p-3 bg-green-50 border rounded-xl">
              Selected church:{" "}
              <strong>{selectedChurch.name}</strong>
            </div>
          )}
        </div>

        {/* EVENT DETAILS */}
        <fieldset disabled={!selectedChurch} className="space-y-4">
          <input
            type="text"
            placeholder="Event title"
            className="w-full p-3 border rounded-xl"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="date"
            className="w-full p-3 border rounded-xl"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          {startDate && (
            <p className="text-sm text-gray-600">
              End date will be:{" "}
              <strong>{getEndDate(startDate)}</strong>
            </p>
          )}

          <textarea
            placeholder="Event description"
            className="w-full p-3 border rounded-xl"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </fieldset>

        <button
          disabled={!selectedChurch || creating}
          onClick={handleCreateEvent}
          className="w-full bg-blue-600 text-white p-3 rounded-xl disabled:opacity-50"
        >
          {creating ? "Creating..." : "Create Event"}
        </button>
      </div>

      {/* ✅ SUCCESS MODAL */}
      <SuccessModal
        open={showSuccess}
        title="Event Created 🎉"
        message="Your event has been successfully created."
        primaryText="Go to Events"
        onPrimary={() => {
          setShowSuccess(false);
          router.replace("/events");
        }}
      />
    </>
  );
}
