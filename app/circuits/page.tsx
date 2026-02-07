'use client';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CircuitsPage() {
  const [circuits, setCircuits] = useState<any[]>([]);
  useEffect(() => {
    supabase.from('circuits').select('*').order('created_at', { ascending: false }).then(({ data }) => setCircuits(data || []));
  }, []);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Circuits</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {circuits.map(c => (
          <Link key={c.id} href={`/circuits/${c.id}`} className="card p-4 space-y-2">
            <h3 className="text-lg font-semibold">{c.pastor_name}</h3>
            <p className="text-neutral-400">{c.township || c.suburb}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
