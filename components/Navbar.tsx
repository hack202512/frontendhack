"use client";

import { usePathname, useRouter } from "next/navigation";
import { API_URL } from "@/config/api";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { clearTokens } from "@/utils/auth";
import { useState, useEffect } from "react";
import Image from "next/image";

interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  
  useEffect(() => {
    if (pathname === "/login" || pathname === "/register") {
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetchWithAuth("/auth/me", {
          method: "GET",
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [pathname]);

  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetchWithAuth("/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearTokens();
      router.push("/login");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full bg-gray-800 h-1"></div>
      
      <nav className="w-full bg-white border-b border-gray-200">
        <div className="container mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-1.5 sm:p-2 text-gray-700 hover:text-gray-900"
                aria-label="Menu"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>

              <div className="flex-shrink-0">
                <Image
                  src="/godlo-12.svg"
                  alt="Godło Polski"
                  width={48}
                  height={48}
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
                  priority
                />
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                  <span className="hidden lg:inline text-base xl:text-lg font-bold text-gray-800 whitespace-nowrap">
                    Rejestr Rzeczy Znalezionych
                  </span>
                  <div className="h-6 w-px bg-red-600 hidden lg:block"></div>
                  <span className="text-[10px] sm:text-xs md:text-[10px] text-gray-700 hidden md:inline lg:hidden whitespace-nowrap">
                    Serwis do zgłaszania rzeczy znalezionych
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 flex-shrink-0">
              <span className="hidden lg:inline text-sm xl:text-base font-medium text-gray-700 whitespace-nowrap">
                Starostwo Bydgoskie
              </span>
              {user && (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="hidden md:flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 border border-blue-600 rounded-md">
                    <svg
                      className="w-3.5 h-3.5 sm:w-4 md:w-3.5 lg:w-4 text-blue-600"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span className="text-xs sm:text-sm md:text-xs lg:text-sm font-medium text-blue-600 whitespace-nowrap">
                      {user.first_name} {user.last_name}
                    </span>
                  </div>
                  <div className="md:hidden text-xs sm:text-sm font-medium text-blue-600 truncate max-w-[80px] sm:max-w-none">
                    {user.first_name} {user.last_name}
                  </div>
                </div>
              )}

              <button
                onClick={() => router.push("/items")}
                className="px-2 sm:px-3 md:px-2 lg:px-3 py-1.5 sm:py-2 text-xs sm:text-sm md:text-xs lg:text-sm font-medium text-[#0052a5] hover:text-[#003d7a] border border-[#0052a5] rounded-md hover:bg-blue-50 transition-colors whitespace-nowrap"
              >
                <span className="hidden sm:inline">Zgubione przedmioty</span>
                <span className="sm:hidden">Przedmioty</span>
              </button>

              <div className="flex items-center">
                <Image
                  src="/eu-center-pl.svg"
                  alt="Flaga Unii Europejskiej"
                  width={80}
                  height={70}
                  className="w-8 h-6 sm:w-10 sm:h-7 md:w-12 md:h-9"
                  priority
                />
              </div>

              <button
                onClick={handleLogout}
                disabled={loading}
                className="px-2 sm:px-3 md:px-2 lg:px-3 py-1.5 sm:py-2 text-xs sm:text-sm md:text-xs lg:text-sm font-medium text-red-600 hover:text-red-700 border border-red-600 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {loading ? "..." : "Wyloguj"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200">
          <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
            <div className="flex flex-col gap-2">
              {user && (
                <div className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700">
                  {user.first_name} {user.last_name}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
