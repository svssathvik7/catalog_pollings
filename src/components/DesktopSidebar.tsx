"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, Search, X } from "lucide-react";
import { Home, Vote } from "lucide-react"; // Import the necessary icons
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import LogButton from "./auth/LoginButton";

export default function DesktopSidebar() {
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state)=>state.isAuthenticated);
  const [pollId, setPollId] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const router = useRouter();
  const location = usePathname();
  useEffect(() => {
      if (!isLoading && !isAuthenticated && location !== "/" && location !== "/login" && location !== "/register") {
        router.push("/login");
      }
  }, [isLoading, location]);

  const items = [
    { title: "Home", url: "/", icon: Home },
    { title: "Polls", url: "/polls/manage", icon: Vote },
    { title: "Create Poll", url: "/polls/new", icon: PlusIcon },
  ];

  const handlePollSearch = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/polls/${pollId}`);
    setPollId("");
    return;
  }

  return (
    <div className="hidden md:flex my-auto h-[98dvh] w-64 border-r bg-[#ffffff41] m-2 rounded-xl">
      <nav className="flex flex-col gap-2 p-4 w-full">
        <div className="px-4 py-2">
          <h2 className="text-lg font-semibold">Catalog Pollings</h2>
        </div>

        {/* Render Sidebar Items */}
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

        {showSearch ? (
          <form className="flex items-center justify-center gap-2 rounded-lg" onSubmit={handlePollSearch}>
            <Input
              type="text"
              placeholder="Type Poll ID"
              className="w-64"
              value={pollId}
              onChange={(event) => setPollId(event.target.value)}
            />
            {pollId.length === 0 ? (
              <Button onClick={() => setShowSearch(false)} className="w-10 h-10 flex items-center justify-center text-white rounded-lg transition-all">
                <X size={18} />
              </Button>
            ) : (
              <Button type="submit" className="w-10 h-10 flex items-center justify-center text-white rounded-lg transition-all">
                <Search size={18} />
              </Button>
            )}
          </form>
        ) : (
          <Link
            href="#"
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-accent transition-colors duration-200"
          >
            <Search className="h-4 w-4" />
            Search
          </Link>
        )}

        <LogButton/>
      </nav>
    </div>
  );
}