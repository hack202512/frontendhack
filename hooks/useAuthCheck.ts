"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/config/api";

async function refreshTokenIfNeeded(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

export function useAuthCheck() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      try {
        let response = await fetch(`${API_URL}/protected`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (response.status === 401) {
          const refreshed = await refreshTokenIfNeeded();
          if (refreshed) {
            await new Promise(resolve => setTimeout(resolve, 100));
            response = await fetch(`${API_URL}/protected`, {
              method: "GET",
              credentials: "include",
              cache: "no-store",
            });
          }
        }

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


