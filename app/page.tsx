"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { useAddressGeocoding } from "@/hooks/useAddressGeocoding";
import { API_URL } from "@/config/api";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import ItemInfoSection from "@/components/ItemInfoSection";
import LocationSection from "@/components/LocationSection";
import FinderInfoSection from "@/components/FinderInfoSection";
import DateTimeSection from "@/components/DateTimeSection";

interface FormData {
  itemName: string;
  itemColor: string;
  itemBrand: string;
  location: string;
  circumstances: string;
  finderFirstName: string;
  finderLastName: string;
  finderPhone: string;
  foundDate: string;
  foundTime: string;
}

export default function Home() {
  useAuthCheck();
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    itemName: "",
    itemColor: "",
    itemBrand: "",
    location: "",
    circumstances: "",
    finderFirstName: "",
    finderLastName: "",
    finderPhone: "",
    foundDate: "",
    foundTime: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [locationType, setLocationType] = useState<"exact" | "map" | "vague" | null>(null);
  const [timeError, setTimeError] = useState("");
  const [mapCoordinates, setMapCoordinates] = useState<{ lng: number; lat: number } | null>(null);
  
  const { address, loadingAddress, setAddress } = useAddressGeocoding(mapCoordinates);

  const validateTime = (time: string): boolean => {
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "foundTime") {
      if (value === "") {
        setTimeError("");
      } else if (!validateTime(value)) {
        setTimeError("Godzina musi być w formacie HH:MM (np. 14:30)");
      } else {
        setTimeError("");
      }
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.foundTime && !validateTime(formData.foundTime)) {
      setTimeError("Godzina musi być w formacie HH:MM (np. 14:30)");
      return;
    }
    
    setSubmitting(true);
    setTimeError("");
    
    try {
      const payload = {
        item_name: formData.itemName,
        item_color: formData.itemColor.trim() || null,
        item_brand: formData.itemBrand.trim() || null,
        found_location: formData.location,
        found_date: formData.foundDate,
        found_time: formData.foundTime.trim() || null,
        circumstances: formData.circumstances.trim() || null,
        found_by_firstname: formData.finderFirstName.trim() || null,
        found_by_lastname: formData.finderLastName.trim() || null,
        found_by_phonenumber: formData.finderPhone.trim() || null,
      };

      const response = await fetchWithAuth("/found-item-forms/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Błąd: ${response.status}`);
      }

      const result = await response.json();
      alert("Formularz został pomyślnie wysłany!");
      
      setFormData({
        itemName: "",
        itemColor: "",
        itemBrand: "",
        location: "",
        circumstances: "",
        finderFirstName: "",
        finderLastName: "",
        finderPhone: "",
        foundDate: "",
        foundTime: "",
      });
      setLocationType(null);
      setMapCoordinates(null);
      setAddress("");
    } catch (error) {
      console.error("Błąd podczas wysyłania formularza:", error);
      alert(error instanceof Error ? error.message : "Wystąpił błąd podczas wysyłania formularza");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLocationSelect = (lng: number, lat: number) => {
    setMapCoordinates({ lng, lat });
  };

  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress);
    setFormData((prev) => ({
      ...prev,
      location: newAddress,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-8 px-4">
      <div className="w-full max-w-4xl">
        <div className="bg-[#f4f6fb] rounded-lg shadow-lg p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-6 text-center">
            Zgłoszenie znalezionego przedmiotu
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <ItemInfoSection
              formData={{
                itemName: formData.itemName,
                itemColor: formData.itemColor,
                itemBrand: formData.itemBrand,
              }}
              onChange={handleChange}
            />

            <LocationSection
              locationType={locationType}
              formData={{
                location: formData.location,
                circumstances: formData.circumstances,
              }}
              mapCoordinates={mapCoordinates}
              address={address}
              loadingAddress={loadingAddress}
              onLocationTypeChange={setLocationType}
              onChange={handleChange}
              onLocationSelect={handleLocationSelect}
              onAddressChange={handleAddressChange}
            />

            <FinderInfoSection
              formData={{
                finderFirstName: formData.finderFirstName,
                finderLastName: formData.finderLastName,
                finderPhone: formData.finderPhone,
              }}
              onChange={handleChange}
            />

            <DateTimeSection
              formData={{
                foundDate: formData.foundDate,
                foundTime: formData.foundTime,
              }}
              timeError={timeError}
              onChange={handleChange}
            />

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-6 bg-[#0052a5] text-white font-medium rounded-md hover:bg-[#003d7a] focus:outline-none focus:ring-2 focus:ring-[#0052a5] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? "Wysyłanie..." : "Wyślij"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
