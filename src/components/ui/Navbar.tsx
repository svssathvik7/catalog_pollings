"use client";

import Link from "next/link";
import LogButton from "../auth/LoginButton";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div className="w-full p-4 flex items-center justify-around absolute text-white">
      <Link className="text-xl font-bold" href={"/"}>
        Catalog Pollings
      </Link>
      {navItems.map((navItem, i) => (
        <Link
          key={i}
          className="hover:bg-brand-1 hover:text-brand-2 px-3 py-1 rounded-lg transition-all"
          href={navItem.href}
        >
          {navItem.label}
        </Link>
      ))}
      {isAuthenticated && (
        <Link
          className="hover:bg-brand-1 hover:text-brand-2 px-3 py-1 rounded-lg transition-all"
          href="/polls"
        >
          Polls
        </Link>
      )}
      <LogButton />
    </div>
  );
}
