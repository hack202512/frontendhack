"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

export function useAuthCheck() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetchWithAuth("/protected", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          router.push("/login");
        }
      } catch (error) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);
}


