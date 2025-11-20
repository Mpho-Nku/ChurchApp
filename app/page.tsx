'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import Link from 'next/link';

import FeaturesGrid from '@/components/FeaturesGrid';
import TrendingSection from '@/components/TrendsingSection';
import FAQAccordion from '@/components/FAQAccordion';
import OnboardingModal from '@/components/OnboardingModal';


export default function Home() {
  const [churches, setChurches] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get logged-in user
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    // Fetch all churches
    const fetchChurches = async () => {
      const { data, error } = await supabase
        .from('churches')
        .select('*')
        .order('created_at', { ascending: false }); // newest first
      if (!error && data) setChurches(data);
    };

    fetchChurches();

    // Realtime updates: new churches auto-appear
    const channel = supabase
      .channel('churches-feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'churches' },
        (payload) => setChurches((prev) => [payload.new, ...prev])
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      
      {/* ✅ Welcome card */}
      <section className="card p-6 space-y-4">
     
        <h1 className="text-3xl font-bold text-blue-900">
          Welcome to St John Apostolic Faith Mission
        </h1>
        <p className="text-blue-900">
          Discover circuits, churches, and upcoming events. Sign in with Google
          to add or edit content.
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

      {/* ✅ Grid of user-posted churches */}
      <section>
        <h2 className="text-xl font-bold mb-4">Churches</h2>
        {churches.length === 0 ? (
          <p className="text-gray-500">No churches added yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {churches.map((church) => (
              <Link
                href={`/churches/${church.id}`}
                key={church.id}
                className="block rounded-xl border border-gray-200 shadow hover:shadow-lg transition bg-white"
              >
                {church.images && church.images.length > 0 ? (
                  <Image
                    src={church.images[0]}
                    alt={church.name}
                    width={400}
                    height={200}
                    className="w-full h-40 object-cover rounded-t-xl"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-200 rounded-t-xl flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

                <div className="p-3 space-y-1">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {church.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Pastor: {church.pastor_name || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {church.township}, {church.suburb}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
       <OnboardingModal user={user} hasChurch={churches.length > 0} />
       <FeaturesGrid />
         {/*   <TrendingSection /> */}
  
     <FAQAccordion />
      </section>

      {/* ✅ Features grid (like Uber example you shared) */}
    
    </div>
  );
}
