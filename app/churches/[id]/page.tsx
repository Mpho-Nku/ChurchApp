'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import Link from 'next/link';

export default function ChurchDetailsPage() {
  const { id } = useParams(); // ✅ church id from the URL
  const [church, setChurch] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    // ✅ Get logged-in user
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    // ✅ Fetch church details
    const fetchChurch = async () => {
      const { data, error } = await supabase
        .from('churches')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setChurch(data);

        // ✅ Fetch weather using lat/lon if available
        if (data.latitude && data.longitude) {
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${data.latitude}&lon=${data.longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=metric`
          )
            .then((res) => res.json())
            .then((weatherData) => {
              if (weatherData && weatherData.main) {
                setWeather(weatherData);
              }
            })
            .catch((err) => console.error('Weather fetch error:', err));
        }
      }
    };

    // ✅ Fetch events for this church
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('id, title, start_time, description')
        .eq('church_id', id)
        .order('start_time', { ascending: true });

      if (!error) setEvents(data || []);
    };

    Promise.all([fetchChurch(), fetchEvents()]).finally(() =>
      setLoading(false)
    );
  }, [id]);

  if (loading) return <p>Loading church details...</p>;
  if (!church) return <p>Church not found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* ✅ Church Info */}
      <div className="rounded-xl border p-6 bg-white shadow">
        {church.images && church.images.length > 0 ? (
          <Image
            src={church.images[0]}
            alt={church.name}
            width={800}
            height={400}
            className="w-full h-64 object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
            No Image
          </div>
        )}

        <h1 className="text-3xl font-bold text-blue-900 mt-4">
          {church.name}
        </h1>
        <p className="text-lg text-gray-600">
          Pastor: {church.pastor_name || 'N/A'}
        </p>

        {/* ✅ Full Address */}
        <p className="text-sm text-gray-500 mt-2">
          {church.unit_number ? `Unit ${church.unit_number}, ` : ''}
          {church.street ? `${church.street}, ` : ''}
          {church.suburb ? `${church.suburb}, ` : ''}
          {church.township ? `${church.township}, ` : ''}
          {church.area_code || ''}
        </p>

        {/* ✅ Weather Section */}
        {weather && (
          <div className="mt-3 flex items-center gap-3 text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
            <Image
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
              alt={weather.weather[0].description}
              width={40}
              height={40}
            />
            <div>
              <p className="font-medium">
                {weather.main.temp}°C – {weather.weather[0].description}
              </p>
              <p className="text-xs text-gray-500">
                Feels like {weather.main.feels_like}°C | Humidity{' '}
                {weather.main.humidity}%
              </p>
            </div>
          </div>
        )}

        {/* ✅ Get Directions button */}
        {user && (
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
              `${church.street || ''}, ${church.suburb || ''}, ${
                church.township || ''
              }, ${church.area_code || ''}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block btn btn-primary"
          >
            Get Directions
          </a>
        )}
      </div>

      {/* ✅ Church Events */}
      <section>
        <h2 className="text-2xl font-bold text-blue-900 mb-4">
          Upcoming Events
        </h2>
        {events.length === 0 ? (
          <p className="text-gray-500">No events scheduled for this church.</p>
        ) : (
          <div className="space-y-4">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-blue-800">
                  <Link href={`/events/${ev.id}`}>{ev.title}</Link>
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(ev.start_time).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {ev.description || 'No description available'}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
