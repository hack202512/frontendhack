"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import ConfirmedAddressDisplay from "./ConfirmedAddressDisplay";

const DynamicMapPicker = dynamic(() => import("./MapPicker"), {
  ssr: false,
});

interface MapLocationPickerProps {
  mapCoordinates: { lng: number; lat: number } | null;
  address: string;
  loadingAddress: boolean;
  onLocationSelect: (lng: number, lat: number) => void;
  onAddressChange: (address: string) => void;
}

export default function MapLocationPicker({
  mapCoordinates,
  address,
  loadingAddress,
  onLocationSelect,
  onAddressChange,
}: MapLocationPickerProps) {
  const [addressConfirmed, setAddressConfirmed] = useState(false);

  const handleLocationSelect = (lng: number, lat: number) => {
    onLocationSelect(lng, lat);
    setAddressConfirmed(false);
  };

  const handleConfirmAddress = () => {
    setAddressConfirmed(true);
    if (address) {
      onAddressChange(address);
    }
  };

  if (addressConfirmed) {
    return (
      <ConfirmedAddressDisplay
        address={address || (mapCoordinates ? `${mapCoordinates.lat.toFixed(6)}, ${mapCoordinates.lng.toFixed(6)}` : '')}
        onBackToMap={() => setAddressConfirmed(false)}
      />
    );
  }

  return (
    <div className="space-y-2">
      <DynamicMapPicker
        onLocationSelect={handleLocationSelect}
        initialLocation={mapCoordinates || undefined}
        address={address}
      />
      {mapCoordinates && (
        <div className="flex items-center gap-2">
          <div className="flex-1 text-sm text-gray-600">
            {loadingAddress ? (
              <p>Pobieranie adresu...</p>
            ) : (
              <p>
                <span className="font-medium">Adres:</span> {address || `${mapCoordinates.lat.toFixed(6)}, ${mapCoordinates.lng.toFixed(6)}`}
              </p>
            )}
          </div>
          {!loadingAddress && address && (
            <button
              type="button"
              onClick={handleConfirmAddress}
              className="flex-shrink-0 p-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
              title="Potwierdź adres"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      )}
      <p className="text-xs text-gray-500">
        Kliknij na mapie, aby wybrać lokalizację
      </p>
    </div>
  );
}

