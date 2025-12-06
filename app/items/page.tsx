"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { API_URL } from "@/config/api";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

interface FoundItem {
  id: string;
  item_name: string;
  item_color: string | null;
  item_brand: string | null;
  found_location: string | null;
  found_date: string | null;
  found_time: string | null;
  circumstances: string | null;
  found_by_firstname: string | null;
  found_by_lastname: string | null;
  found_by_phonenumber: string | null;
  created_at: string;
}

export default function ItemsPage() {
  useAuthCheck();
  const router = useRouter();
  const [items, setItems] = useState<FoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await fetchWithAuth("/found-item-forms/my", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Nie udało się pobrać przedmiotów");
        }

        const data = await response.json();
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Wystąpił błąd");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("pl-PL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await fetchWithAuth("/found-item-forms/export?format=csv", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Nie udało się pobrać pliku CSV");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "found_items.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił błąd podczas pobierania pliku");
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black mb-2">Moje znalezione przedmioty</h1>
          <button
            onClick={() => router.push("/")}
            className="text-[#0052a5] hover:text-[#003d7a] text-sm font-medium"
          >
            ← Wróć do formularza
          </button>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Ładowanie...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
            <p className="text-gray-600 text-lg">Nie masz jeszcze żadnych dodanych przedmiotów</p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 px-4 py-2 bg-[#0052a5] text-white rounded-md hover:bg-[#003d7a] transition-colors"
            >
              Dodaj pierwszy przedmiot
            </button>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="bg-[#f4f6fb] rounded-lg shadow-lg p-6">
            <div className="mb-4 flex justify-end">
              <button
                onClick={handleDownloadCSV}
                className="px-4 py-2 bg-white border-2 border-green-500 text-green-600 font-medium rounded-md hover:bg-green-50 transition-colors flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Pobierz plik CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-3 px-4 font-semibold text-black">Przedmiot</th>
                    <th className="text-left py-3 px-4 font-semibold text-black">Kolor</th>
                    <th className="text-left py-3 px-4 font-semibold text-black">Marka</th>
                    <th className="text-left py-3 px-4 font-semibold text-black">Lokalizacja</th>
                    <th className="text-left py-3 px-4 font-semibold text-black">Data znalezienia</th>
                    <th className="text-left py-3 px-4 font-semibold text-black">Znalazca</th>
                    <th className="text-left py-3 px-4 font-semibold text-black">Data dodania</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800 font-medium">{item.item_name}</td>
                      <td className="py-3 px-4 text-gray-600">{item.item_color || "-"}</td>
                      <td className="py-3 px-4 text-gray-600">{item.item_brand || "-"}</td>
                      <td className="py-3 px-4 text-gray-600">{item.found_location || "-"}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {item.found_date 
                          ? `${formatDate(item.found_date)}${item.found_time ? ` ${item.found_time}` : ""}`
                          : "-"}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {item.found_by_firstname || item.found_by_lastname
                          ? `${item.found_by_firstname || ""} ${item.found_by_lastname || ""}`.trim()
                          : "-"}
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {formatDateTime(item.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Łącznie: {items.length} {items.length === 1 ? "przedmiot" : "przedmiotów"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

