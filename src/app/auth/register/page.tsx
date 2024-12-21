"use client";
import registrar from "@/utils/registrar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  const handleRegistration = async (e: any) => {
    e.preventDefault();
    const hasRegistered = await registrar(username);
    if (hasRegistered) {
      router.push("/auth/login");
    }
  };

  return (
    <form
      className="w-80 h-fit m-auto flex flex-col items-center justify-center bg-slate-300 rounded-lg p-6 shadow-lg absolute top-0 bottom-0 left-0 right-0 text-black space-y-6"
      onSubmit={handleRegistration}
    >
      <h6 className="text-3xl font-bold text-gray-800">Sign Up</h6>
      <input
        type="text"
        placeholder="Enter your username"
        required
        className="w-full font-semibold text-gray-700 placeholder-gray-500 outline-none bg-transparent border-b-2 border-gray-400 transition-all p-2"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <div className="flex items-center justify-between w-full text-sm text-gray-600">
        <p>Already have an account?</p>
        <Link
          href={"/auth/login"}
          className="font-semibold text-brand-2 transition-all"
        >
          Sign In
        </Link>
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 rounded-lg font-bold text-white bg-brand-3 hover:bg-brand-2 transition-all"
      >
        Sign Up
      </button>
    </form>
  );
}
