'use client';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Search, MapPin, X } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface LocationPickerProps {
  onSelect: (location: { name: string; lat: number; lon: number }) => void;
}

function MapClickMarker({ onSelect }: { onSelect: (lat: number, lon: number) => void }) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onSelect(lat, lng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function LocationPicker({ onSelect }: LocationPickerProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  // 🔍 Fetch typed locations
  useEffect(() => {
    const fetchLocations = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            query
          )}&format=json&addressdetails=1&limit=5&countrycodes=za`
        );
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error('Error fetching locations:', err);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchLocations, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  // 🗺️ Handle map click selection
  const handleMapClick = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await res.json();
      const name =
        data.display_name?.split(',').slice(0, 2).join(', ') ||
        `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;

      setSelected(name);
      setShowMap(false);
      onSelect({ name, lat, lon });
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    }
  };

  const handleSelect = (loc: any) => {
    const name =
      loc.display_name.split(',').slice(0, 2).join(', ') || loc.display_name;
    setSelected(name);
    setResults([]);
    setQuery('');
    onSelect({ name, lat: parseFloat(loc.lat), lon: parseFloat(loc.lon) });
  };

  const clearSelection = () => {
    setSelected(null);
    onSelect({ name: '', lat: 0, lon: 0 });
  };

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="flex items-center border border-gray-300 rounded-full px-3 py-2 bg-white">
        <Search size={18} className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder={selected ? selected : 'Add location...'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 outline-none bg-transparent text-sm text-gray-800 placeholder-gray-400"
        />
        {selected && (
          <button onClick={clearSelection}>
            <X size={16} className="text-gray-500 hover:text-red-500" />
          </button>
        )}
        <button
          onClick={() => setShowMap(!showMap)}
          className="ml-2 p-1 hover:bg-gray-100 rounded-full"
          title="Pick from map"
        >
          <MapPin size={18} className="text-gray-600" />
        </button>
      </div>

      {/* Dropdown results */}
      {loading && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg p-3 text-center text-gray-500 text-sm">
          Searching...
        </div>
      )}

      {!loading && results.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-56 overflow-y-auto z-50">
          {results.map((loc, i) => (
            <li
              key={i}
              onClick={() => handleSelect(loc)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              <span className="font-medium">
                {loc.display_name.split(',')[0]}
              </span>
              <br />
              <span className="text-gray-500 text-xs">
                {loc.display_name.split(',').slice(1, 3).join(', ')}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Map Picker */}
      {showMap && (
        <div className="absolute z-50 top-12 left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
          <MapContainer
            center={[-26.2041, 28.0473]}
            zoom={13}
            style={{ height: '300px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <MapClickMarker onSelect={handleMapClick} />
          </MapContainer>
        </div>
      )}
    </div>
  );
}
