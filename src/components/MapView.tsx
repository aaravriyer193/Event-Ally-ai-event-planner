import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import anime from 'animejs/lib/anime.es.js';

// Fix for default markers in react-leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.divIcon({
  html: `<div class="bg-orange-500 w-6 h-6 rounded-full border-2 border-white shadow-lg"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
  className: 'custom-marker'
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  center: LatLngTuple;
  zoom?: number;
  markers?: Array<{
    id: string;
    position: LatLngTuple;
    name: string;
    address: string;
    rating: number;
    price: number;
  }>;
  className?: string;
}

export default function MapView({ center, zoom = 13, markers = [], className = '' }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate map container on mount
    if (mapRef.current) {
      anime({
        targets: mapRef.current,
        opacity: [0, 1],
        scale: [0.95, 1],
        duration: 800,
        easing: 'easeOutCubic'
      });
    }
  }, []);

  return (
    <div ref={mapRef} className={`rounded-xl overflow-hidden border border-gray-700 ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '400px', width: '100%' }}
        className="z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {markers.map((marker) => (
          <Marker key={marker.id} position={marker.position}>
            <Popup className="custom-popup">
              <div className="p-2">
                <h3 className="font-semibold text-gray-900 mb-1">{marker.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{marker.address}</p>
                <div className="flex items-center justify-between">
                  <span className="text-yellow-600 text-sm">★ {marker.rating}</span>
                  <span className="text-green-600 font-semibold">${marker.price.toLocaleString()}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}