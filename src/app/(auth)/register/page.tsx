"use client";
import registrar from "@/utils/registrar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading,setLoading] = useState(false);

  const handleRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const hasRegistered = await registrar(username);
    if (hasRegistered) {
      router.push("/login");
    }
    setLoading(false);
    return;
  };

  return (
    <form
      className="w-80 lg:w-[35dvw] h-fit lg:h-[40dvh] m-auto flex flex-col items-center justify-center rounded-lg p-6 shadow-lg space-y-6"
      onSubmit={handleRegistration}
    >
      <h6 className="text-3xl font-bold">Sign Up</h6>
      <Input
        type="text"
        placeholder="Enter your username"
        required
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full font-semibold outline-none bg-transparent border-b-2 transition-all p-2"
      />
      <div className="flex items-center justify-between w-full text-sm">
        <p>Already have an account?</p>
        <Link
          href={"/login"}
          className="font-semibold transition-all"
        >
          Sign In
        </Link>
      </div>
      <Button
        type="submit"
        className={`${loading ? " cursor-wait pointer-events-none " : " cursor-pointer "}w-full px-4 py-2 rounded-lg font-bold text-white transition-all`}
      >
        {loading ? "Signing Up..." : "Sign Up"}
      </Button>
    </form>
  );
}
