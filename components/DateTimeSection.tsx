"use client";

interface DateTimeSectionProps {
  formData: {
    foundDate: string;
    foundTime: string;
  };
  timeError: string;
  dateError: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function DateTimeSection({ formData, timeError, dateError, onChange }: DateTimeSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-black border-b border-gray-300 pb-2">
        4. Data i godzina znalezienia
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="foundDate" className="block text-sm font-medium text-black mb-1">
            Data *
          </label>
          <input
            type="date"
            id="foundDate"
            name="foundDate"
            value={formData.foundDate}
            onChange={onChange}
            required
            max={new Date().toISOString().split('T')[0]}
            className={`w-full px-3 py-2 border rounded-md text-black bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              dateError ? "border-red-500" : "border-gray-300"
            }`}
          />
          {dateError && (
            <p className="mt-1 text-sm text-red-600">{dateError}</p>
          )}
        </div>
        <div>
          <label htmlFor="foundTime" className="block text-sm font-medium text-black mb-1">
            Godzina *
          </label>
          <input
            type="text"
            id="foundTime"
            name="foundTime"
            value={formData.foundTime}
            onChange={onChange}
            required
            className={`w-full px-3 py-2 border rounded-md text-black bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              timeError ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="HH:MM (np. 14:30)"
            pattern="^([0-1][0-9]|2[0-3]):[0-5][0-9]$"
          />
          {timeError && (
            <p className="mt-1 text-sm text-red-600">{timeError}</p>
          )}
        </div>
      </div>
    </div>
  );
}



