'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { fmtDate } from '@/lib/utils';
import NoResults from '@/components/NoResults';

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // ✅ Get current user
        const { data: userData } = await supabase.auth.getUser();
        setUser(userData?.user);

        // ✅ Fetch all events with optional church info
        const { data, error } = await supabase
          .from('events')
          .select(`
            id,
            title,
            start_time,
            description,
            is_saved_by,
            church:church_id (
              id,
              name,
              suburb,
              township
            )
          `)
          .order('start_time', { ascending: true });

        if (error) {
          console.error('❌ Events fetch error:', error.message);
          setErrorMsg(error.message);
        } else {
          setEvents(data || []);
        }
      } catch (err: any) {
        console.error('❌ Unexpected error:', err);
        setErrorMsg('Something went wrong loading events.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ✅ Save / Unsave toggle
  const toggleSave = async (event: any) => {
    if (!user) {
      alert('Please login to save events');
      return;
    }

    const alreadySaved = event.is_saved_by?.includes(user.id);
    const updatedSavedBy = alreadySaved
      ? event.is_saved_by.filter((uid: string) => uid !== user.id)
      : [...(event.is_saved_by || []), user.id];

    const { error } = await supabase
      .from('events')
      .update({ is_saved_by: updatedSavedBy })
      .eq('id', event.id);

    if (error) {
      console.error('❌ Save/Unsave error:', error.message);
      alert('Something went wrong, please try again');
    } else {
      // ✅ update UI immediately
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === event.id ? { ...ev, is_saved_by: updatedSavedBy } : ev
        )
      );
    }
  };

  // ✅ Loading state
  if (loading) return <div className="text-gray-500">Loading events...</div>;

  // ✅ Error state
  if (errorMsg) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-red-600">
        Failed to load events: {errorMsg}
      </div>
    );
  }

  // ✅ Empty state
  if (events.length === 0) {
    return <div className="text-gray-500 p-6">
      <NoResults/>
    </div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
      <div className="grid gap-4">
        {events.map((event) => {
          const isSaved = user && event.is_saved_by?.includes(user.id);
          return (
            <div
              key={event.id}
              className="p-4 border border-gray-200 bg-white rounded-lg shadow-sm hover:shadow-md transition"
            >
              {/* Title */}
              <h2 className="text-lg font-semibold text-blue-900">
                <Link href={`/events/${event.id}`}>{event.title}</Link>
              </h2>

              {/* Date */}
              <div className="text-sm text-blue-600">
                {fmtDate(event.start_time)}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                {event.description || 'No description'}
              </p>

              {/* Church Info */}
              {event.church && (
                <p className="text-xs text-gray-500 mt-2">
                  {event.church.name} – {event.church.suburb},{' '}
                  {event.church.township}
                </p>
              )}

              {/* Buttons */}
              <div className="mt-3">
                {!user ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => alert('Please login to save events')}
                  >
                    Login to Save
                  </button>
                ) : (
                  <button
                    className={`btn ${isSaved ? 'bg-gray-300 text-black' : 'btn-primary'}`}
                    onClick={() => toggleSave(event)}
                  >
                    {isSaved ? 'Unsave' : 'Save'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
