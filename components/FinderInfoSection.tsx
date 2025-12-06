"use client";

interface FinderInfoSectionProps {
  formData: {
    finderFirstName: string;
    finderLastName: string;
    finderPhone: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FinderInfoSection({ formData, onChange }: FinderInfoSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-black border-b border-gray-300 pb-2">
        3. Dane osoby która znalazła przedmiot
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="finderFirstName" className="block text-sm font-medium text-black mb-1">
            Imię *
          </label>
          <input
            type="text"
            id="finderFirstName"
            name="finderFirstName"
            value={formData.finderFirstName}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Jan"
          />
        </div>
        <div>
          <label htmlFor="finderLastName" className="block text-sm font-medium text-black mb-1">
            Nazwisko *
          </label>
          <input
            type="text"
            id="finderLastName"
            name="finderLastName"
            value={formData.finderLastName}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Kowalski"
          />
        </div>
        <div>
          <label htmlFor="finderPhone" className="block text-sm font-medium text-black mb-1">
            Telefon *
          </label>
          <input
            type="tel"
            id="finderPhone"
            name="finderPhone"
            value={formData.finderPhone}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="+48 123 456 789"
          />
        </div>
      </div>
    </div>
  );
}

