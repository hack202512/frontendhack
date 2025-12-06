import { useState, useEffect, useCallback } from "react";

export function useAddressGeocoding(coordinates: { lat: number; lng: number } | null) {
  const [address, setAddress] = useState<string>("");
  const [loadingAddress, setLoadingAddress] = useState(false);

  const fetchAddress = useCallback(async (lat: number, lng: number) => {
    setLoadingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'LostAndFoundApp/1.0'
          }
        }
      );
      const data = await response.json();
      
      if (data && data.address) {
        const addressParts: string[] = [];
        
        const road = data.address.road || data.address.street || data.address.pedestrian;
        if (road) {
          addressParts.push(road);
        }
        
        const city = data.address.city || 
                     data.address.town || 
                     data.address.village || 
                     data.address.municipality ||
                     data.address.county;
        if (city) {
          addressParts.push(city);
        }
        
        let finalAddress = '';
        if (addressParts.length > 0) {
          finalAddress = addressParts.join(', ');
        } else if (data.display_name) {
          finalAddress = data.display_name;
        } else {
          finalAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        }
        
        setAddress(finalAddress);
        return finalAddress;
      } else {
        const fallback = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        setAddress(fallback);
        return fallback;
      }
    } catch (error) {
      console.error("Błąd podczas pobierania adresu:", error);
      const fallback = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      setAddress(fallback);
      return fallback;
    } finally {
      setLoadingAddress(false);
    }
  }, []);

  useEffect(() => {
    if (coordinates) {
      fetchAddress(coordinates.lat, coordinates.lng);
    }
  }, [coordinates?.lat, coordinates?.lng, fetchAddress]);

  return { address, loadingAddress, setAddress };
}

