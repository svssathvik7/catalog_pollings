"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { Calendar, CircleUser, Home, Search, Vote } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import api from "@/utils/axios";
import toaster from "@/utils/toaster";

export default function DesktopSidebar() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const items = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Polls",
      url: "/polls",
      icon: Vote,
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: Calendar,
    },
    {
      title: "Search",
      url: "/search",
      icon: Search,
    },
    {
      title: "About",
      url: "/about",
      icon: CircleUser,
    },
  ];

  const handleLogout = async () => {
    try {
      await api.get("/auth/logout");
      logout();
      toaster("success", "user logged out!");
      return;
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="hidden md:flex h-screen w-64 border-r bg-background">
      <nav className="flex flex-col gap-2 p-4 w-full">
        <div className="px-4 py-2">
          <h2 className="text-lg font-semibold">Catalog Pollings</h2>
        </div>
        {items.map((item) => (
          <Link
            key={item.title}
            href={item.url}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-accent",
              "transition-colors duration-200"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}

        {isAuthenticated ? (
          <Button onClick={handleLogout} className="w-full">logout</Button>
        ) : (
          <Link href="/auth/login">
            <Button className="w-full">login</Button>
          </Link>
        )}
      </nav>
    </div>
  );
}
