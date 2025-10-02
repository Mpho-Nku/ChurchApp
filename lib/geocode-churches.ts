// /lib/geocode-churches.ts

export interface GeocodeResult {
  lat: number;
  lng: number;
}

// ✅ Define the expected API response type
interface GoogleGeocodeResponse {
  results: {
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }[];
  status: string;
}

export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );

    if (!res.ok) {
      console.error("❌ Failed to fetch geocode:", res.statusText);
      return null;
    }

    // ✅ Cast the JSON to our defined type
    const data: GoogleGeocodeResponse = await res.json();

    if (data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng };
    }

    console.warn("⚠️ No geocode results for address:", address);
    return null;
  } catch (err) {
    console.error("❌ Geocoding error:", err);
    return null;
  }
}
