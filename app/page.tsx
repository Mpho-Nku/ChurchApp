"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [churches, setChurches] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const fetchChurches = async () => {
      const { data, error } = await supabase
        .from("churches")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) setChurches(data);
    };

    fetchChurches();

    const channel = supabase
      .channel("churches-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "churches" },
        payload => setChurches(prev => [payload.new, ...prev])
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* HERO SECTION */}
      <section className="card p-6 space-y-4">
        <h1 className="text-3xl font-bold text-blue-900">
          Welcome to St John Apostolic Faith Mission
        </h1>
        <p className="text-blue-900">
          Discover circuits, churches, and upcoming events. Sign in to contribute.
        </p>

        <div className="flex gap-3">
          <Link className="btn btn-primary" href="/events">
            Browse Events
          </Link>

          <Link className="btn" href="/churches">
            Find Churches
          </Link>
        </div>
      </section>

      {/* CHURCH LIST */}
      <section>
        <h2 className="text-xl font-bold mb-4">Churches</h2>

        {churches.length === 0 ? (
          <p className="text-gray-500">No churches added yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {churches.map(ch => {
              const img = ch.image_url || "/default_church.jpg";

              return (
                <Link
                  key={ch.id}
                  href={`/churches/${ch.id}`}
                  className="block rounded-xl border bg-white shadow hover:shadow-lg transition"
                >
                  <div className="w-full h-40 relative rounded-t-xl overflow-hidden bg-gray-100">
                    <Image
                      src={img}
                      alt={ch.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-3 space-y-1">
                    <h3 className="font-semibold text-lg text-gray-800">{ch.name}</h3>
                    <p className="text-sm text-gray-600">
                      Pastor: {ch.pastor_name || "N/A"}
                    </p>

                    <p className="text-xs text-gray-500">
                      {[ch.street, ch.suburb, ch.township].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
