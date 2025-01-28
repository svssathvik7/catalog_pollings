"use client";

import type { PollData } from "@/types/pollType";
import { useCallback, useEffect, useState } from "react";
import ROPoll from "./ROPoll";
import { Button } from "../ui/button";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { getUserPolls } from "@/utils/getUserPolls";
import { useAuthStore } from "@/store/authStore";

export default function UserPollsContainer() {
  const [pagination, setPagination] = useState({ page: 1, per_page: 4 });
  const [polls, setPolls] = useState<PollData[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const username = useAuthStore((state) => state.username);
  const logout = useAuthStore((state) => state.logout);

  const fetchData = useCallback(async () => {
    if (!username) return;
    try {
      setLoading(true);
      const response = await getUserPolls(pagination, username, logout);
      const totalPages = response.total_pages;
      const newPolls = response.polls;
      if (!newPolls) {
        setLoading(false);
        return;
      }

      setPolls(newPolls); // Replace polls instead of spreading
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching polls:", error);
    } finally {
      setLoading(false);
    }
  }, [username, pagination, logout]);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!username) return;
    if (isMounted) {
      fetchData();
    }
  }, [pagination, isMounted, username, fetchData]);

  return (
    <div className="flex flex-col items-center w-full p-4 space-y-4 h-[75dvh] md:h-[85dvh]">
      <div className="w-full flex-grow overflow-y-auto mb-4">
        {loading ? (
          <div className="flex flex-wrap items-center justify-center h-4/5 gap-2 w-full">
            {[1, 2, 3, 4].map((_, index) => (
              <div
                key={index}
                className="w-full md:w-72 bg-[#ffffff76] shadow-lg hover:shadow-xl transition-all duration-300 relative rounded-xl overflow-hidden border border-gray-200 h-[35dvh] p-2 gap-2 flex flex-col"
              >
                <Skeleton className="h-8" />
                <Skeleton className="h-16" />
                <div className="space-y-2 gap-2">
                  <Skeleton className="h-6" />
                  <Skeleton className="h-6" />
                  <Skeleton className="h-6" />
                </div>
              </div>
            ))}
          </div>
        ) : polls.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No polls created yet!
          </p>
        ) : (
          <div className="flex flex-wrap items-center justify-around h-4/5 gap-4 w-full">
            {polls
              .slice(
                (pagination.page - 1) * pagination.per_page,
                pagination.page * pagination.per_page
              )
              .map((poll, index) => (
                <ROPoll key={poll.id || index} pollData={poll} />
              ))}
          </div>
        )}
      </div>
      {polls.length > 0 && (
        <div className="flex justify-between items-center w-full max-w-md mt-auto">
          <Button
            disabled={pagination.page <= 1}
            onClick={() =>
              setPagination((curr) => ({ ...curr, page: curr.page - 1 }))
            }
            className={`${
              pagination.page <= 1
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-[#80b1d3] text-black hover:bg-[#8ac8f5]"
            } transition duration-200 px-4 py-2 rounded-lg flex items-center`}
          >
            <ArrowBigLeft className="mr-2" />
            Prev
          </Button>
          <span className="text-sm text-gray-500 mx-2">
            Page {pagination.page} of {totalPages}
          </span>
          <Button
            disabled={pagination.page >= totalPages}
            onClick={() =>
              setPagination((curr) => ({ ...curr, page: curr.page + 1 }))
            }
            className={`${
              pagination.page === totalPages
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-[#80b1d3] text-black hover:bg-[#8ac8f5]"
            } transition duration-200 px-4 py-2 rounded-lg flex items-center`}
          >
            Next
            <ArrowBigRight className="ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
