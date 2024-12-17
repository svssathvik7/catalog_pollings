"use client"
import authenticator from "@/utils/authenticator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login(){
    const router = useRouter();
        const [username,setUsername] = useState("");
        const handleLogin = async(e:any)=>{
            e.preventDefault();
            const hasLoggedIn = await authenticator(username);
            if(hasLoggedIn){
                router.push("/");
            }
        }
    return (
        <form className="w-64 h-fit m-auto flex items-center justify-start flex-col bg-slate-300 rounded-lg p-2 absolute top-0 bottom-0 left-0 right-0 text-black" onSubmit={handleLogin}>
            <h6 className="text-2xl">Sign in</h6>
            <input type="text" placeholder="enter username" required className="font-bold outline-none text-black bg-transparent border-b-2 border-white p-2" value={username} onChange={e => setUsername(e.target.value)}/>
            <div className="flex items-center justify-start">
                <p className="text-xs">Don't have an account?</p>
                <Link href={"/auth/register"} className="px-1 py-[0.5] rounded-lg font-semibold bg-brand-3 text-black m-2 text-base">sign up</Link>
            </div>
            <button type="submit" className="px-2 py-1 rounded-lg font-bold bg-brand-3 text-black m-2">sign in</button>
        </form>
    )
}