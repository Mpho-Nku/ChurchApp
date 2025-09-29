import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // use service role key
);

const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY!;

async function geocode(address: string) {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
    address
  )}&key=${OPENCAGE_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.results.length > 0) {
    const { lat, lng } = data.results[0].geometry;
    return { lat, lng };
  }
  return null;
}

async function run() {
  const { data: churches } = await supabase.from('churches').select('*');

  for (const church of churches || []) {
    if (!church.address) continue;
    if (church.latitude && church.longitude) continue; // skip already done

    const coords = await geocode(church.address + ' ' + (church.township || '') + ' ' + (church.suburb || ''));
    if (coords) {
      console.log(`📍 Updating ${church.name} → ${coords.lat}, ${coords.lng}`);
      await supabase
        .from('churches')
        .update({
          latitude: coords.lat,
          longitude: coords.lng,
        })
        .eq('id', church.id);
    } else {
      console.log(`❌ Could not geocode: ${church.name}`);
    }
    await new Promise((r) => setTimeout(r, 1000)); // avoid rate limits
  }
}

run();
