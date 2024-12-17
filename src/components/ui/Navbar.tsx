"use client"

import Link from "next/link";
import LogButton from "../auth/LoginButton";

export default function Navbar(){
    const navItems = [
        {
            href: "/", label:"Home"
        },
        { 
            href: '/polls', label: 'Polls' 
        },
        { 
            href: '/about', label: 'About' 
        },
        { 
            href: '/contact', label: 'Contact' 
        },
    ];
    return (
        <div className="w-full p-4 flex items-center justify-around absolute">
            <Link href={"/"}>Catalog Pollings</Link>
            {navItems.map((navItem,i)=>(
                <Link className="hover:bg-brand-1 hover:text-brand-2 px-2 py-1 rounded-lg" href={navItem.href}>{navItem.label}</Link>
            ))}
            <LogButton/>
        </div>
    )
}