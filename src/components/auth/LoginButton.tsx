"use client";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import api from "@/utils/axios";
import toaster from "@/utils/toaster";
import { Button } from "../ui/button";
import { useState } from "react";

export default function LogButton() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const [loading,setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await api.get("/auth/logout");
      logout();
      toaster("success","user logged out!");
      setLoading(false);
      return;
    } catch (error) {
      console.error("Logout failed:", error);
    }
    finally{
      setLoading(false);
    }
  };

  return isAuthenticated ? (
    <Button
      onClick={handleLogout}
      className="w-full"
    >
      {loading ? "Logging out..." : "Log out"}
    </Button>
  ) : (
    <Link
      href={"/login"}
    >
      <Button className="w-full">
        {loading ? "Loggin in..." : "Log In"}
      </Button>
    </Link>
  );
}
