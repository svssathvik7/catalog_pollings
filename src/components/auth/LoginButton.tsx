"use client";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import api from "@/utils/axios";
import toaster from "@/utils/toaster";

export default function LogButton() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await api.get("/auth/logout");
      logout();
      toaster("success","user logged out!");
      return;
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return isAuthenticated ? (
    <button
      onClick={handleLogout}
      className="px-2 py-1 rounded-lg font-bold bg-brand-3 text-black"
    >
      Logout
    </button>
  ) : (
    <Link
      href={"/auth/login"}
      className="px-2 py-1 rounded-lg font-bold bg-brand-3 text-black"
    >
      Login
    </Link>
  );
}
