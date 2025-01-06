"use client";
import { PollData } from "@/types/poll";
import { getROClosedPolls } from "@/utils/getROPolls";
import { useCallback, useEffect, useState } from "react";
import ROPoll from "./ROPoll";
import { Button } from "../ui/button";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export default function ClosedPollContainer() {
    const [pagination, setPagination] = useState({ page: 1, per_page: 3 });
    const [polls, setPolls] = useState<PollData[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async ({ page, per_page }: { page: number; per_page: number }) => {
        try {
            setLoading(true); // Start loading
            const response = await getROClosedPolls({ page, per_page });
            const totalPages = response.total_pages;
            const newPolls = response.polls;
            if (!newPolls) return;

            setPolls((prevPolls) => [...prevPolls, ...newPolls]);
            setTotalPages(totalPages);
        } catch (error) {
            console.error('Error fetching polls:', error);
        } finally {
            setLoading(false); // End loading
        }
    }, []);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    useEffect(() => {
        if (isMounted) {
            fetchData(pagination);
        }
    }, [pagination, isMounted]);

    return (
        <div className="w-full flex items-center justify-around flex-col h-full">
            {loading ? (
                <div className="w-full flex items-center justify-around p-2 flex-wrap">
                    {/* Skeleton loader for each poll */}
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="w-fit min-w-64 h-64 max-h-96 overflow-y-scroll relative justify-around p-1 gap-1 flex flex-col">
                            <Skeleton className="h-20 rounded-md" />
                            <Skeleton className="h-10 rounded-md" />
                            <Skeleton className="h-10 rounded-md" />
                            <Skeleton className="h-10 rounded-md" />
                        </div>
                    ))}
                </div>
            ) : polls.length === 0 ? (
                <p>No closed polls available.</p>
            ) : (
                <div className="w-full flex items-center justify-around p-2 gap-1 flex-wrap overflow-y-scroll h-full">
                    {polls.slice(-3).map((poll, index) => (
                        <ROPoll key={poll.id || index} {...poll} />
                    ))}
                </div>
            )}
            <div className="w-full items-center flex justify-around m-2">
                <Button
                    disabled={pagination.page <= 1}
                    onClick={() => setPagination((curr) => ({ ...curr, page: curr.page - 1 }))}
                    className={`${
                        pagination.page <= 1 ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-[#facc15] text-black hover:bg-[#f9a826]"
                    } transition duration-200 p-2 rounded-lg flex items-center`}
                >
                    <ArrowBigLeft className="mr-2" />
                    Prev
                </Button>
                <Button
                    disabled={pagination.page === totalPages}
                    onClick={() => setPagination((curr) => ({ ...curr, page: curr.page + 1 }))}
                    className={`${
                        pagination.page === totalPages ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-[#facc15] text-black hover:bg-[#f9a826]"
                    } transition duration-200 p-2 rounded-lg flex items-center`}
                >
                    Next
                    <ArrowBigRight className="ml-2" />
                </Button>
            </div>
        </div>
    );
}
