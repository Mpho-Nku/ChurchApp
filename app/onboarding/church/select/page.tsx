"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function SelectChurchPage() {
  const [churches, setChurches] = useState<any[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchChurches = async () => {
      const { data } = await supabase
        .from("churches")
        .select(
          "id, name, pastor_name, street, suburb, township, province"
        )
        .order("name", { ascending: true });

      if (data) setChurches(data);
    };

    fetchChurches();
  }, []);

  // --- SEARCH ---
  const filtered = churches.filter((c) => {
    const q = query.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.pastor_name?.toLowerCase().includes(q) ||
      c.street?.toLowerCase().includes(q) ||
      c.suburb?.toLowerCase().includes(q) ||
      c.township?.toLowerCase().includes(q) ||
      c.province?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center py-20 px-4">
      
      {/* TITLE */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Which church do you attend?
      </h1>

      {/* SEARCH BOX */}
      <div className="w-full max-w-2xl">
        <input
          type="text"
          placeholder="Search by name, pastor, or address..."
          className="w-full rounded-xl border px-5 py-3 text-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* LIST */}
      <div className="w-full max-w-2xl mt-6 bg-white rounded-xl shadow border overflow-hidden">
        <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-200">

          {filtered.length === 0 ? (
            <p className="text-center py-6 text-gray-500">No churches found.</p>
          ) : (
            filtered.map((church) => (
              <Link
                key={church.id}
                href={`/churches/${church.id}`}
                className="block px-6 py-4 hover:bg-gray-50 transition"
              >
                <div className="flex flex-col">

                  {/* NAME */}
                  <p className="text-lg font-semibold">{church.name}</p>

                  {/* PASTOR */}
                  <p className="text-sm text-gray-600">
                    Pastor: {church.pastor_name || "N/A"}
                  </p>

                  {/* FULL ADDRESS */}
                  <p className="text-sm text-gray-500">
                    {[
                      church.street,
                      church.suburb,
                      church.township,
                      church.province,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>

                </div>
              </Link>
            ))
          )}

        </div>

        <Link
          href="/onboarding/church/add"
          className="block w-full text-center py-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold"
        >
          My Church is not listed
        </Link>
      </div>

    </div>
  );
}
