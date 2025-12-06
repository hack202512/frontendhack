"use client";

import LocationTypeButtons from "./LocationTypeButtons";
import MapLocationPicker from "./MapLocationPicker";

interface LocationSectionProps {
  locationType: "exact" | "map" | "vague" | null;
  formData: {
    location: string;
    circumstances: string;
  };
  mapCoordinates: { lng: number; lat: number } | null;
  address: string;
  loadingAddress: boolean;
  onLocationTypeChange: (type: "exact" | "map" | "vague") => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onLocationSelect: (lng: number, lat: number) => void;
  onAddressChange: (address: string) => void;
}

export default function LocationSection({
  locationType,
  formData,
  mapCoordinates,
  address,
  loadingAddress,
  onLocationTypeChange,
  onChange,
  onLocationSelect,
  onAddressChange,
}: LocationSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-black border-b border-gray-300 pb-2">
        2. Miejsce znalezienia
      </h2>
      <LocationTypeButtons
        locationType={locationType}
        onLocationTypeChange={onLocationTypeChange}
      />

      {locationType === "exact" && (
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-black mb-1">
            Miejsce dokładne *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={onChange}
            required={locationType === "exact"}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Np. ul. Marszałkowska 1, Warszawa"
          />
        </div>
      )}

      {locationType === "map" && (
        <MapLocationPicker
          mapCoordinates={mapCoordinates}
          address={address}
          loadingAddress={loadingAddress}
          onLocationSelect={onLocationSelect}
          onAddressChange={onAddressChange}
        />
      )}

      {locationType === "vague" && (
        <div>
          <label htmlFor="circumstances" className="block text-sm font-medium text-black mb-1">
            Opis okoliczności *
          </label>
          <textarea
            id="circumstances"
            name="circumstances"
            value={formData.circumstances}
            onChange={onChange}
            required={locationType === "vague"}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Np. pociąg, autobus, tramwaj..."
          />
        </div>
      )}
    </div>
  );
}

