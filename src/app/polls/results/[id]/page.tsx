"use client";

import { PollChart } from "@/components/ui/pie-chart";
import { useAuthStore } from "@/store/authStore";
import { PollData } from "@/types/poll";
import getPoll from "@/utils/getPoll";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PollResults() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [pollData, setPollData] = useState<PollData>({
    _id: "",
    id: "",
    title: "",
    options: [],
    is_open: false,
    total_votes: 0,
    voters: [],
    owner_username: "",
  });
  const logout = useAuthStore((state) => state.logout);
  const username = useAuthStore((state) => state.username);

  useEffect(() => {
    if (!id || !username) return; // Ensure `id` and `username` are valid
    const fetchPollData = async () => {
      const data = await getPoll(id, logout, username);
      setPollData(data.poll);
    };
    fetchPollData();
  }, [id, logout, username]);

  return (
    <div>
      <h1 className="text-3xl">
        Poll title: <strong>{pollData.title}</strong>
      </h1>
      <PollChart {...pollData} />
    </div>
  );
}
