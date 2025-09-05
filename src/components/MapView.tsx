import React, { useEffect, useRef } from 'react';
import { MapPin, Star, DollarSign } from 'lucide-react';

interface MapViewProps {
  center: [number, number];
  zoom?: number;
  markers?: Array<{
    id: string;
    position: [number, number];
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
      const element = mapRef.current;
      element.style.opacity = '0';
      element.style.transform = 'scale(0.95)';
      element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'scale(1)';
      }, 100);
    }
  }, []);

  // Create OpenStreetMap embed URL
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${center[1] - 0.01},${center[0] - 0.01},${center[1] + 0.01},${center[0] + 0.01}&layer=mapnik&marker=${center[0]},${center[1]}`;

  return (
    <div ref={mapRef} className={`rounded-xl overflow-hidden border border-gray-700 ${className}`}>
      <div className="relative">
        {/* Embedded OpenStreetMap */}
        <iframe
          src={mapUrl}
          width="100%"
          height="400"
          style={{ border: 'none' }}
          title="Event Location Map"
          className="w-full h-96"
        />
        
        {/* Overlay with marker information */}
        {markers.length > 0 && (
          <div className="absolute top-4 left-4 right-4 max-h-32 overflow-y-auto">
            <div className="space-y-2">
              {markers.slice(0, 3).map((marker) => (
                <div key={marker.id} className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{marker.name}</h4>
                      <p className="text-gray-600 text-xs mb-1">{marker.address}</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                          <span className="text-gray-700 text-xs">{marker.rating}</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-3 w-3 text-green-600 mr-1" />
                          <span className="text-gray-700 text-xs">${marker.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
                  </div>
                </div>
              ))}
              {markers.length > 3 && (
                <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-2 text-center">
                  <span className="text-white text-xs">+{markers.length - 3} more locations</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}