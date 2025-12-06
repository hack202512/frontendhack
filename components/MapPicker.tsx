"use client";

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { LatLngExpression } from "leaflet";
import type { Marker as LeafletMarker } from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const createCustomIcon = () => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 24px;
      height: 24px;
      background-color: #ef4444;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      cursor: pointer;
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });
};

interface MapClickHandlerProps {
  onLocationSelect: (lng: number, lat: number) => void;
}

function MapClickHandler({ onLocationSelect }: MapClickHandlerProps) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lng, lat);
    },
  });
  return null;
}

interface MapPickerProps {
  onLocationSelect: (lng: number, lat: number, address?: string) => void;
  initialLocation?: { lng: number; lat: number };
  address?: string;
}

export default function MapPicker({ onLocationSelect, initialLocation, address }: MapPickerProps) {
  const [position, setPosition] = useState<LatLngExpression | null>(
    initialLocation ? [initialLocation.lat, initialLocation.lng] : null
  );
  const markerRef = useRef<LeafletMarker | null>(null);

  const defaultCenter: LatLngExpression = initialLocation
    ? [initialLocation.lat, initialLocation.lng]
    : [53.1235, 18.0084];

  const handleLocationSelect = (lng: number, lat: number) => {
    setPosition([lat, lng]);
    onLocationSelect(lng, lat);
  };

  useEffect(() => {
    if (initialLocation) {
      setPosition([initialLocation.lat, initialLocation.lng]);
    }
  }, [initialLocation]);

  useEffect(() => {
    if (address && markerRef.current) {
      setTimeout(() => {
        markerRef.current?.openPopup();
      }, 100);
    }
  }, [address, position]);

  return (
    <div className="w-full h-96 rounded-md overflow-hidden border border-gray-300 shadow-md relative">
      <MapContainer
        center={defaultCenter}
        zoom={initialLocation ? 15 : 13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onLocationSelect={handleLocationSelect} />
        {position && (
          <Marker 
            position={position} 
            icon={createCustomIcon()}
            ref={markerRef}
          >
            {address && (
              <Popup>
                <div className="text-sm font-medium text-gray-800">
                  {address}
                </div>
              </Popup>
            )}
          </Marker>
        )}
      </MapContainer>
      <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-md shadow-lg text-xs text-gray-700 z-10">
        Kliknij na mapie, aby wybrać lokalizację
      </div>
    </div>
  );
}
