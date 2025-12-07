"use client";

interface ItemInfoSectionProps {
  formData: {
    itemName: string;
    itemColor: string;
    itemBrand: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ItemInfoSection({ formData, onChange }: ItemInfoSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-black border-b border-gray-300 pb-2">
        1. Informacje o przedmiocie
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="itemName" className="block text-sm font-medium text-black mb-1">
            Przedmiot *
          </label>
          <input
            type="text"
            id="itemName"
            name="itemName"
            value={formData.itemName}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Np. portfel, telefon"
          />
        </div>
        <div>
          <label htmlFor="itemColor" className="block text-sm font-medium text-black mb-1">
            Kolor
          </label>
          <input
            type="text"
            id="itemColor"
            name="itemColor"
            value={formData.itemColor}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Np. czarny, czerwony"
          />
        </div>
        <div>
          <label htmlFor="itemBrand" className="block text-sm font-medium text-black mb-1">
            Marka
          </label>
          <input
            type="text"
            id="itemBrand"
            name="itemBrand"
            value={formData.itemBrand}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Np. Apple, Samsung"
          />
        </div>
      </div>
    </div>
  );
}



