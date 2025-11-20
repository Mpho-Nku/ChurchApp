'use client';

import { MapContainer, TileLayer, Marker } from 'react-leaflet';

export default function PostMap({ location }: { location: { lat: number; lng: number } }) {
  return (
    <MapContainer
      center={[location.lat, location.lng]}
      zoom={14}
      className="h-40 w-full rounded"
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[location.lat, location.lng]} />
    </MapContainer>
  );
}
