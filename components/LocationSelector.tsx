"use client";

import { useEffect, useState } from "react";

type LocationValue = {
  city: string | null;
  province: string | null;
  latitude: number | null;
  longitude: number | null;
};

export default function LocationSelector({
  value,
  onChange,
}: {
  value: LocationValue | null;
  onChange: (loc: LocationValue | null) => void;
}) {
  const [query, setQuery] = useState(
    value?.city && value?.province
      ? `${value.city}, ${value.province}`
      : ""
  );
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // ------------------------------------------
  // Search Nominatim
  // ------------------------------------------
  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    const fetchLocations = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
            query
          )}`
        );

        let data = await res.json();

        // Only South Africa + Lesotho
        data = data.filter((loc: any) => {
          const code = loc.address?.country_code;
          return code === "za" || code === "ls";
        });

        setResults(data);
      } catch (e) {
        console.error("Location search failed:", e);
      }
      setLoading(false);
    };

    const timeout = setTimeout(fetchLocations, 500);
    return () => clearTimeout(timeout);
  }, [query]);

  // ------------------------------------------
  // Extract city + province
  // ------------------------------------------
  const extractParts = (loc: any) => {
    const a = loc.address || {};
    const city =
      a.city ||
      a.town ||
      a.village ||
      a.suburb ||
      a.hamlet ||
      null;

    const province = a.state || null;

    return { city, province };
  };

  // ------------------------------------------
  // Select from dropdown
  // ------------------------------------------
  const selectLocation = (loc: any) => {
    const parts = extractParts(loc);

    onChange({
      city: parts.city,
      province: parts.province,
      latitude: parseFloat(loc.lat),
      longitude: parseFloat(loc.lon),
    });

    setQuery(parts.city && parts.province 
      ? `${parts.city}, ${parts.province}` 
      : parts.city || "");

    setOpen(false);
  };

  // ------------------------------------------
  // Manual Input
  // ------------------------------------------
  const handleManualType = (text: string) => {
    setQuery(text);
    onChange({
      city: text,
      province: null,
      latitude: null,
      longitude: null,
    });
    setOpen(true);
  };

  const clearLocation = () => {
    setQuery("");
    onChange(null);
  };

  return (
    <div className="relative w-full">
      <label className="text-sm font-medium">Add Location</label>

      <input
        type="text"
        placeholder="Search or type location"
        value={query}
        onChange={(e) => handleManualType(e.target.value)}
        onFocus={() => setOpen(true)}
        className="w-full border rounded-xl p-2 text-sm mt-1"
      />

      {query && (
        <button
          onClick={clearLocation}
          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}

      {open && (results.length > 0 || loading) && (
        <div className="absolute z-20 w-full bg-white shadow-lg rounded-xl border max-h-60 overflow-y-auto mt-1">
          {loading && (
            <p className="p-3 text-gray-500 text-sm">Searching...</p>
          )}

          {!loading &&
            results.map((loc: any, idx: number) => {
              const parts = extractParts(loc);
              return (
                <button
                  key={idx}
                  onClick={() => selectLocation(loc)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                >
                  {parts.city && parts.province
                    ? `${parts.city}, ${parts.province}`
                    : parts.city ||
                      loc.display_name.split(",")[0]}
                </button>
              );
            })}
        </div>
      )}

      {!loading && results.length === 0 && query.length >= 3 && (
        <p className="text-xs text-gray-500 mt-1">
          No SA/Lesotho locations found — using your typed location.
        </p>
      )}
    </div>
  );
}
