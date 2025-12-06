"use client";

interface ConfirmedAddressDisplayProps {
  address: string;
  onBackToMap: () => void;
}

export default function ConfirmedAddressDisplay({ address, onBackToMap }: ConfirmedAddressDisplayProps) {
  return (
    <div className="space-y-2">
      <div className="p-4 bg-gray-50 border border-gray-300 rounded-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm font-medium text-gray-800">
              {address}
            </p>
          </div>
          <button
            type="button"
            onClick={onBackToMap}
            className="px-3 py-1 text-sm bg-[#0052a5] hover:bg-[#003d7a] text-white rounded-md transition-colors"
          >
            Wróć do mapy
          </button>
        </div>
      </div>
    </div>
  );
}

