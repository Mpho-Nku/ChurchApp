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

  useEffect(() => {
    if (!id) return;

    // Get logged-in user
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    // Fetch church details
    const fetchChurch = async () => {
      const { data, error } = await supabase
        .from('churches')
        .select('*')
        .eq('id', id)
        .single();

      if (!error) setChurch(data);
    };

    // Fetch events for this church
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('id, title, start_time, description')
        .eq('church_id', id)
        .order('start_time', { ascending: true });

      if (!error) setEvents(data || []);
    };

    Promise.all([fetchChurch(), fetchEvents()]).finally(() => setLoading(false));
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
        <h1 className="text-3xl font-bold text-blue-900 mt-4">{church.name}</h1>
        <p className="text-lg text-gray-600">Pastor: {church.pastor_name || 'N/A'}</p>
        <p className="text-sm text-gray-500">{church.township}, {church.suburb}</p>
      </div>

      {/* ✅ Church Events */}
      <section>
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Upcoming Events</h2>
        {events.length === 0 ? (
          <p className="text-gray-500">No events scheduled for this church.</p>
        ) : (
          <div className="space-y-4">
            {events.map((ev) => (
              <div key={ev.id} className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-semibold text-blue-800">
                  <Link href={`/events/${ev.id}`}>{ev.title}</Link>
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(ev.start_time).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-2">{ev.description || 'No description available'}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ✅ Comments + Reactions */}
    </div>
  );
}
