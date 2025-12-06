"use client";

import { usePathname, useRouter } from "next/navigation";
import { API_URL } from "@/config/api";
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
        const response = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
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
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`Logout failed: ${response.status}`);
      }
      
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full bg-gray-800 h-1"></div>
      
      <nav className="w-full bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-gray-900"
                aria-label="Menu"
              >
                <svg
                  className="w-6 h-6"
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
                  className="w-10 h-10 sm:w-12 sm:h-12"
                  priority
                />
              </div>

              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-base sm:text-lg font-bold text-gray-800 whitespace-nowrap">
                    Rejestr Rzeczy Znalezionych
                  </span>
                  <div className="h-6 w-px bg-red-600 hidden sm:block"></div>
                  <span className="text-xs sm:text-sm text-gray-700 hidden sm:inline whitespace-nowrap">
                    Serwis do zgłaszania rzeczy znalezionych
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
              {user && (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-2 border border-blue-600 rounded-md">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span className="text-sm font-medium text-blue-600 whitespace-nowrap">
                      {user.first_name} {user.last_name}
                    </span>
                  </div>
                  <div className="sm:hidden text-sm font-medium text-blue-600">
                    {user.first_name} {user.last_name}
                  </div>
                </div>
              )}

              <button
                onClick={() => router.push("/items")}
                className="px-3 py-2 text-sm font-medium text-[#0052a5] hover:text-[#003d7a] border border-[#0052a5] rounded-md hover:bg-blue-50 transition-colors whitespace-nowrap"
              >
                Zgubione przedmioty
              </button>

              <div className="flex items-center">
                <Image
                  src="/eu-center-pl.svg"
                  alt="Flaga Unii Europejskiej"
                  width={80}
                  height={70}
                  className="w-10 h-7 sm:w-12 sm:h-9"
                  priority
                />
              </div>

              <button
                onClick={handleLogout}
                disabled={loading}
                className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-600 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {loading ? "..." : "Wyloguj"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-2">
              {user && (
                <div className="px-3 py-2 text-sm text-gray-700">
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
