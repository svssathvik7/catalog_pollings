"use client";
import { useAuthStore } from "@/store/authStore";
import authenticator from "@/utils/authenticator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const authStore = useAuthStore();
  const [loading,setLoading] = useState(false);
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const hasLoggedIn = await authenticator(username);
    if (hasLoggedIn) {
        router.back();
        authStore.login(username);
        setUsername("");
    }
    setLoading(false);
    return;
  };

  return (
    <form
      className="w-80 lg:w-[35dvw] h-fit lg:h-[40dvh] m-auto flex flex-col items-center justify-center rounded-lg p-6 shadow-lg space-y-6"
      onSubmit={handleLogin}
    >
      <h6 className="text-3xl font-bold">Sign In</h6>
      <Input
        type="text"
        placeholder="Enter your username"
        required
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full font-semibold outline-none bg-transparent border-b-2 transition-all p-2"
      />
      <div className="flex items-center justify-between w-full text-sm">
        <h4>Don &apos; t have an account?</h4>
        <Link
          href={"/register"}
          className="font-semibold transition-all"
        >
          Sign Up
        </Link>
      </div>
      <Button
        type="submit"
        className={`${loading ? " cursor-wait pointer-events-none " : " cursor-pointer "} w-full px-4 py-2 rounded-lg font-bold text-white transition-all`}
      >
        {loading ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  );
}
