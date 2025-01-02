"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react"; // Import the Search icon from Lucid

export default function PollSearch() {
  const router = useRouter();
  const [pollId, setPollId] = useState("");

  const handlePollSearch = (e: any) => {
    e.preventDefault();
    router.push(`/polls/${pollId}`);
    setPollId("");
  };

  return (
    <form className="flex items-center justify-center gap-2 rounded-lg" onSubmit={handlePollSearch}>
      <Input
        type="text"
        placeholder="Type Poll ID"
        className="w-64"
        value={pollId}
        onChange={(event) => setPollId(event.target.value)}
      />
      <Button
        type="submit"
        className="w-10 h-10 flex items-center justify-center text-white rounded-lg transition-all"
      >
        <Search size={18} /> {/* Lucid Search icon */}
      </Button>
    </form>
  );
}
