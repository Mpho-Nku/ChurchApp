"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MapPin } from "lucide-react";
import Link from "next/link";

export default function SelectChurchPage() {
  const [query, setQuery] = useState("");
  const [churches, setChurches] = useState<any[]>([]);

  // Fetch Churches
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("churches")
        .select(
          "id, name, street, suburb, township, province, area_code, pastor_name"
        )
        .order("name");

      if (data) setChurches(data);
    };
    load();
  }, []);

  // Filter by name or address
  const filtered = churches.filter((c) => {
    const t = query.toLowerCase();
    return (
      c.name?.toLowerCase().includes(t) ||
      c.street?.toLowerCase().includes(t) ||
      c.suburb?.toLowerCase().includes(t) ||
      c.township?.toLowerCase().includes(t) ||
      c.province?.toLowerCase().includes(t) ||
      c.area_code?.toLowerCase().includes(t)
    );
  });

  return (
    <div className="w-full h-screen flex items-start justify-center bg-white pt-20 px-4">

      {/* MODAL CONTAINER */}
      <div className="w-full max-w-3xl bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        {/* HEADER */}
        <div className="px-6 py-5 border-b">
          <h1 className="text-2xl font-bold text-gray-900">
            Which church do you attend?
          </h1>
        </div>

        {/* SEARCH */}
        <div className="px-6 py-3 border-b">
          <input
            className="w-full bg-gray-100 px-4 py-3 rounded-xl text-lg outline-none border border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="Search for your church..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* RESULTS LIST */}
        <div className="max-h-[420px] overflow-y-auto">

          {filtered.length === 0 ? (
            <div className="px-6 py-10 text-center text-gray-500">
              No churches found.
            </div>
          ) : (
            filtered.map((c) => {
              const address = [
                c.street,
                c.suburb,
                c.township,
                c.province,
                c.area_code,
              ]
                .filter(Boolean)
                .join(", ");

              return (
                <Link
                  key={c.id}
                  href={`/churches/${c.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 border-b cursor-pointer"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-50 text-blue-600 rounded-full">
                    <MapPin size={20} />
                  </div>

                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 text-lg">
                      {c.name}
                    </span>

                    <span className="text-gray-600 text-sm">{address}</span>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* ACTION BUTTON */}
        <Link
          href="/onboarding/church/add"
          className="block w-full text-center py-4 text-blue-700 font-semibold hover:bg-blue-50 border-t"
        >
          My Church is not listed
        </Link>
      </div>
    </div>
  );
}
