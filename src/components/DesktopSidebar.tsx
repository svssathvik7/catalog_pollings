import Link from "next/link";
import { Button } from "./ui/button";
import { Calendar, CircleUser, Home, Search, Vote } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DesktopSidebar() {
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
          <Button><Link href={"/auth/login"}>login</Link></Button>
        </nav>
      </div>
    );
  }