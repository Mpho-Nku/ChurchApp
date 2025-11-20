"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function ChurchOnboarding() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/auth");
      setUser(user);
    };
    load();
  }, []);

  useEffect(() => {
    const searchChurches = async () => {
      if (search.length < 2) {
        setResults([]);
        return;
      }

      const { data } = await supabase
        .from("churches")
        .select("*")
        .ilike("name", `%${search}%`)
        .limit(10);

      setResults(data || []);
    };

    searchChurches();
  }, [search]);

  const selectChurch = async (church) => {
    await supabase
      .from("profiles")
      .update({ church_id: church.id })
      .eq("id", user.id);

    router.push("/onboarding/events");
  };

  return (
    <div className="p-5 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Which church do you attend?</h1>

      {/* Search Input */}
      <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
        <Search className="text-gray-400" size={20} />
        <input
          className="flex-1 outline-none"
          placeholder="Search for your church…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mt-5 space-y-3">
        {results.map((c) => (
          <button
            key={c.id}
            className="w-full text-left p-3 border rounded-lg hover:bg-gray-50"
            onClick={() => selectChurch(c)}
          >
            <p className="font-semibold">{c.name}</p>
            {c.city && <p className="text-sm text-gray-500">{c.city}</p>}
          </button>
        ))}

        {/* Not listed */}
        <button
          onClick={() => router.push("/onboarding/church/add")}
          className="mt-5 w-full py-3 border rounded-lg text-blue-600 font-semibold"
        >
          My Church is not listed
        </button>
      </div>
    </div>
  );
}
