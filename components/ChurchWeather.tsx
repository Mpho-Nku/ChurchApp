'use client';
import { useEffect, useState } from 'react';

export default function ChurchWeather({ lat, lon }: { lat: number; lon: number }) {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    if (!lat || !lon) return;

    const fetchWeather = async () => {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
      const data = await res.json();
      setWeather(data.current_weather);
    };

    fetchWeather();
  }, [lat, lon]);

  if (!weather) return <p className="text-gray-500">Loading weather...</p>;

  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg shadow-sm">
      <h3 className="font-semibold text-blue-900">🌤 Current Weather</h3>
      <p className="text-gray-700">
        {weather.temperature}°C – {weather.weathercode}
      </p>
    </div>
  );
}
