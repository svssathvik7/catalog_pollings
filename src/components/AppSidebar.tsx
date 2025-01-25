"use client";
import { Home, Vote, Menu, Search, X, PlusIcon, File } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "./ui/input";
import { useAuthStore } from "@/store/authStore";
import LogButton from "./auth/LoginButton";

export default function AppSidebar() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [pollId, setPollId] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);  // Track sidebar state
  const router = useRouter();
  const location = usePathname();
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    if (
      !isLoading &&
      !isAuthenticated &&
      location !== "/" &&
      location !== "/login" &&
      location !== "/register" &&
      location !== "/docs"
    ) {
      router.push("/login");
    }
  }, [isLoading, location, isAuthenticated]);

  const items = [
    { title: "Home", url: "/", icon: Home },
    { title: "Polls", url: "/polls/manage", icon: Vote },
    { title: "Create Poll", url: "/polls/new", icon: PlusIcon },
    { title: "API Docs", url: "/docs", icon: File}
  ];

  const handlePollSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/polls/${pollId}`);
    setPollId("");
  };

  // Function to close the sidebar
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden absolute"
          onClick={() => setIsSidebarOpen(true)} // Open sidebar on trigger
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-[#fff]">
        <SheetHeader>
          <SheetTitle><Link href={"/docs"}>Catalog Pollings</Link></SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-2 mt-4">
          {items.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-accent transition-colors duration-200"
              onClick={closeSidebar} // Close sidebar when any link is clicked
            >
              <item.icon className="h-4 w-4 mr-2" />
              {item.title}
            </Link>
          ))}
        </nav>
        {showSearch ? (
          <form
            className="flex items-center justify-center gap-2 rounded-lg my-2"
            onSubmit={handlePollSearch}
          >
            <Input
              type="text"
              placeholder="Type Poll ID"
              className="w-64"
              value={pollId}
              onChange={(event) => setPollId(event.target.value)}
            />
            {pollId.length === 0 ? (
              <Button
                onClick={() => setShowSearch(false)}
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
          <Link
            href="#"
            onClick={() => {
              setShowSearch(true);
              closeSidebar(); // Close sidebar when search is triggered
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-accent transition-colors duration-200 my-2"
          >
            <Search className="h-4 w-4" />
            Search
          </Link>
        )}
        <LogButton />
      </SheetContent>
    </Sheet>
  );
}
