"use client";

import { PollChart } from "@/components/ui/pie-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/authStore";
import { PollData } from "@/types/poll";
import getPoll from "@/utils/getPoll";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PollResults() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isLoading, setIsLoading] = useState(true); // New state to track loading status
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
  const [authLoaded, setAuthLoaded] = useState(false); // State to track if auth has been checked
  const logout = useAuthStore((state) => state.logout);
  const username = useAuthStore((state) => state.username);
  const router = useRouter();

  // Wait for authentication status to load
  useEffect(() => {
    if (isAuthenticated !== undefined) {
      setAuthLoaded(true); // Authentication status is loaded
      setIsLoading(false); // Set loading to false once auth status is determined
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (authLoaded && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [authLoaded, isAuthenticated, router]);

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
  }, [pollData.id]);

  useEffect(() => {
    if (!id || !username) return; // Ensure `id` and `username` are valid
    const fetchPollData = async () => {
      const data = await getPoll(id, logout, username);
      setPollData(data.poll);
    };
    fetchPollData();
  }, [id, logout, username]);

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-8 w-1/2" /> {/* Skeleton for title */}
        <Skeleton className="h-96 w-full mt-4" /> {/* Skeleton for chart */}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl">
        Poll title: <strong>{pollData.title}</strong>
      </h1>
      <PollChart key={pollData.total_votes} {...pollData} />
    </div>
  );
}
