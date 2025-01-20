"use client";

import PollVisualization from "@/components/PollVisualization";
import { PollChart } from "@/components/ui/pie-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/authStore";
import { PollData } from "@/types/pollResult";
import getPoll from "@/utils/getPoll";
import getPollResults from "@/utils/getPollResults";
import { useParams } from "next/navigation";
import { Key, useEffect, useState } from "react";

export default function PollResults() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  const [pollData,setPollData] = useState<PollData>({
    id: "",
    options: [],
    title: "",
    total_votes: 0
  });
  useEffect(() => {
    const es = new EventSource(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/sse/create-client`);

    es.onopen = () => {
      console.log("Connection opened");
    };

    es.addEventListener("poll_results", (event) => {
      console.log("Poll results event received", event.data);
      const response = JSON.parse(event.data);
      const jsonResponse = JSON.parse(response);
      const poll = jsonResponse.poll;
      console.log("emit poll : ", poll);
      if (poll.id === pollData.id) {
        setPollData(poll);
      }
    });

    return () => {
      es.close();
    };
  }, [pollData?.id]);

  const logout = useAuthStore((state) => state.logout);
  const username = useAuthStore((state) => state.username);

  useEffect(() => {
    if (!id) return;
    if(!username){
      return;
    }
    const fetchPollResults = async () => {
      const data = await getPollResults(id,logout,username);
      console.log(data);
      setPollData(data);
      setIsLoading(false);
    };
    fetchPollResults();
  }, [id,username,logout]);

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-8 w-1/2" /> {/* Skeleton for title */}
        <Skeleton className="h-96 w-full mt-4" /> {/* Skeleton for chart */}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center flex-wrap">
      <h1 className="text-xl">
        Poll title: <strong>{pollData?.title}</strong>
      </h1>
      <PollVisualization key={pollData?.total_votes as Key} {...pollData}/>
    </div>
  );
}
