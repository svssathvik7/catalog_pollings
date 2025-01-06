"use client";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import api from "@/utils/axios";
import toaster from "@/utils/toaster";
import { Button } from "../ui/button";

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
    <Button
      onClick={handleLogout}
      className="w-full"
    >
      Logout
    </Button>
  ) : (
    <Link
      href={"/login"}
    >
      <Button className="w-full">
        Login
      </Button>
    </Link>
  );
}
