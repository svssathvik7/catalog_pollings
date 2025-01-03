"use client";
import { Home, Vote, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { useAuthStore } from "@/store/authStore";
import toaster from "@/utils/toaster";
import api from "@/utils/axios";

export default function AppSidebar() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const [pollId, setPollId] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const items = [
    { title: "Home", url: "/", icon: Home },
    { title: "Polls", url: "/polls", icon: Vote },
  ];
  const router = useRouter();
  const handlePollSearch = (e: any) => {
    e.preventDefault();
    router.push(`/polls/${pollId}`);
    setPollId("");
  };

  const handleLogout = async () => {
    try {
      await api.get("/auth/logout");
      logout();
      toaster("success", "User logged out!");
      return;
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <SheetHeader>
          <SheetTitle>Catalog Polling</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-2 mt-4">
          {items.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-accent transition-colors duration-200"
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
        {showSearch ? (
          <form
            className="flex items-center justify-center gap-2 rounded-lg"
            onSubmit={handlePollSearch}
          >
            <Input
              type="text"
              placeholder="Type Poll ID"
              className="w-64"
              value={pollId}
              onChange={(event) => setPollId(event.target.value)}
            />
            {pollId.length == 0 ? (
              <Button
                onClick={() => {
                  setShowSearch(false);
                }}
                className="w-10 h-10 flex items-center justify-center text-white rounded-lg transition-all"
              >
                <X size={18} />
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-10 h-10 flex items-center justify-center text-white rounded-lg transition-all"
              >
                <Search size={18} />
              </Button>
            )}
          </form>
        ) : (
          // Render the Search Link
          <Link
            href="#"
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-accent transition-colors duration-200"
          >
            <Search className="h-4 w-4" />
            Search
          </Link>
        )}
        {isAuthenticated ? (
          <Button onClick={handleLogout} className="w-full">Logout</Button>
        ) : (
          <Link href="/auth/login">
            <Button className="w-full">Login</Button>
          </Link>
        )}
      </SheetContent>
    </Sheet>
  );
}
