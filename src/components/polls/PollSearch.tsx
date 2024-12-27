"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PollSearch() {
    const router = useRouter();
    const [pollId,setPollId] = useState("");
    const handlePollSearch = (e:any)=>{
        e.preventDefault();
        router.push(`/polls/${pollId}`);
        setPollId("");
        return;
    }
    return (
      <form className="flex items-center justify-center gap-2 rounded-lg" onSubmit={handlePollSearch}>
        <input
          type="text"
          placeholder="Type Poll ID"
          className="border-b-2 rounded-lg px-4 py-2 w-64 outline-none border-b-white text-white font-semibold bg-transparent"
          value={pollId}
          onChange={event => setPollId(event.target.value)}
        />
        <button type="submit" className="w-10 h-10 flex items-center justify-center text-white rounded-lg transition-all">
          🔍
        </button>
      </form>
    );
  }
  