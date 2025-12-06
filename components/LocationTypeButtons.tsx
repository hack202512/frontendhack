"use client";

interface LocationTypeButtonsProps {
  locationType: "exact" | "map" | "vague" | null;
  onLocationTypeChange: (type: "exact" | "map" | "vague") => void;
}

export default function LocationTypeButtons({ locationType, onLocationTypeChange }: LocationTypeButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        type="button"
        onClick={() => onLocationTypeChange("exact")}
        className={`px-4 py-2 rounded-md font-medium transition-colors ${
          locationType === "exact"
            ? "bg-[#0052a5] text-white"
            : "bg-white border border-gray-300 text-black hover:bg-gray-50"
        }`}
      >
        Znam lokalizację
      </button>
      <button
        type="button"
        onClick={() => onLocationTypeChange("map")}
        className={`px-4 py-2 rounded-md font-medium transition-colors ${
          locationType === "map"
            ? "bg-[#0052a5] text-white"
            : "bg-white border border-gray-300 text-black hover:bg-gray-50"
        }`}
      >
        Lokalizacja poglądowa
      </button>
      <button
        type="button"
        onClick={() => onLocationTypeChange("vague")}
        className={`px-4 py-2 rounded-md font-medium transition-colors ${
          locationType === "vague"
            ? "bg-[#0052a5] text-white"
            : "bg-white border border-gray-300 text-black hover:bg-gray-50"
        }`}
      >
        Lokalizacja niedokreślona (np. pociąg)
      </button>
    </div>
  );
}

