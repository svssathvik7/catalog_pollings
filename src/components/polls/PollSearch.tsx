"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PollSearch() {
    const router = useRouter();
    const [pollId,setPollId] = useState("");
    const handlePollSearch = (e:any)=>{
        e.preventDefault();
        router.push(`/polls/${pollId}`);
        return;
    }
    return (
      <form className="flex items-center justify-center gap-2 p-4" onSubmit={handlePollSearch}>
        <input
          type="text"
          placeholder="Type Poll ID"
          className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:outline-brand-3 text-black font-semibold"
          value={pollId}
          onChange={event => setPollId(event.target.value)}
        />
        <button type="submit" className="w-10 h-10 flex items-center justify-center bg-brand-3 text-white rounded-lg hover:bg-[#e4b600] transition-all">
          🔍
        </button>
      </form>
    );
  }
  