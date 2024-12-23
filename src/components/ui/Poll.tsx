"use client";

import { useAuthStore } from "@/store/authStore";
import getPoll from "@/utils/getPoll";
import { useEffect, useState } from "react";

export default function Poll({ pollId }: { pollId: string }) {
  const [pollData, setPollData] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const data = await getPoll(pollId, logout);
        console.log(data)
        setPollData(data);
      } catch (error) {
        console.error("Error fetching poll data:", error);
      }
    };
    fetchPoll();
  }, [pollId, logout]);

  const handleVote = async () => {
    if (!selectedOption) {
      alert("Please select an option to vote.");
      return;
    }

    try {
      alert("Vote cast successfully!");
    } catch (error) {
      console.error("Error casting vote:", error);
      alert("Failed to cast vote. Please try again.");
    }
  };

  if (!pollData) return <div>Loading...</div>;

  return (
    <div className="poll-container flex flex-col items-center justify-start gap-4 w-80 h-fit overflow-y-scroll bg-white rounded-xl p-4 shadow-lg text-black">
      <h1 className="font-bold text-2xl text-center text-gray-800">
        {pollData.title}
      </h1>
      <form className="w-full flex-col max-h-72 overflow-y-scroll flex gap-2">
        {pollData.options.map((option: any) => (
          <div
            key={option._id}
            className="option flex items-center gap-2 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            <label className="flex items-center gap-2 w-full cursor-pointer">
              <input
                type="radio"
                name="poll-option"
                value={option._id}
                onChange={() => setSelectedOption(option._id)}
                checked={selectedOption === option._id}
                className="accent-blue-500"
              />
              <span className="text-gray-700 flex-1">{option.text}</span>
              <span className="text-gray-500 text-sm">
                ({option.votes_count} votes)
              </span>
            </label>
          </div>
        ))}
      </form>
      <button
        onClick={handleVote}
        disabled={!selectedOption}
        className={`px-4 py-2 rounded-md text-black font-medium ${
          selectedOption
            ? "bg-brand-3 hover:bg-[#e4b600]"
            : "bg-gray-300 cursor-not-allowed"
        } transition-all w-full`}
      >
        Cast Vote
      </button>
    </div>
  );
}
