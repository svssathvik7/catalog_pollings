import { Calendar, CircleUser, Home, Link, Menu, Search, Sheet, Vote } from "lucide-react";
import { SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Dialog } from "@radix-ui/react-dialog";

export default function AppSidebar() {
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
      <Dialog>
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
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-accent",
                  "transition-colors duration-200"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      </Dialog>
    );
  }