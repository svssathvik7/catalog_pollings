"use client";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import getPoll from "@/utils/getPoll";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { PollData, PollOption } from "@/types/poll";
import { useRouter } from "next/navigation";
import toaster from "@/utils/toaster";
import api from "@/utils/axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";
import { VoteIcon, ChevronRight, Users } from "lucide-react";
import { Badge } from "./badge";
import Link from "next/link";

export default function Poll({ pollId }: { pollId: string }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [pollData, setPollData] = useState<PollData | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const logout = useAuthStore((state) => state.logout);
  const [hasVoted, setHasVoted] = useState(true);
  const username = useAuthStore((state) => state.username);
  const router = useRouter();

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const data = await getPoll(pollId, logout, username ? username : "");
        if (data === "noauth") {
          router.push("/login");
          return;
        }
        setPollData(data.poll);
        setHasVoted(data.has_voted);
      } catch (error) {
        console.error("Error fetching poll data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [pollId, logout, username, router]);

  const handleVote = async () => {
    if (!selectedOption || !username) {
      toaster("error", "Please select an option to vote.");
      return;
    }

    try {
      await api.post(`/polls/${pollId}/vote`, {
        optionId: selectedOption,
        pollId,
        username,
      });
      setHasVoted(true);
      toaster("success", "Vote cast successfully!");
    } catch (error: any) {
      console.error("Error casting vote:", error);
      toaster("error", "Failed to cast vote. Please try again later.");
      if (error?.response?.data?.isAuthenticated === false) {
        logout();
        toaster("error", "Please login to view poll!");
      }
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="pb-4">
          <Skeleton className="h-8 w-3/4 mx-auto" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!pollData) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-red-500">Error Loading Poll</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">
            Failed to load poll. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-[90dvw] md:w-[60dvw] lg:w-[30dvw] mx-auto shadow-lg relative">
      <Badge 
        variant="outline" 
        className="absolute -top-3 -right-3 bg-blue-100 border-blue-200 shadow-sm flex items-center gap-1 px-3 py-1"
      >
        <span className="text-lg font-semibold text-blue-700">
          {pollData?.voters?.length ?? 0}
        </span>
        <Users size={20} className="text-blue-600" />
      </Badge>
      
      <CardHeader className="pb-4 border-b">
        <CardTitle className="text-xl font-bold text-center">
          {pollData.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6">
        <ScrollArea className="max-h-[40dvh] pr-4 -mr-4 overflow-y-scroll">
          {(hasVoted || !isAuthenticated || !pollData.is_open) ? (
            <div className="space-y-3">
              {pollData.options.map((option: PollOption, i) => (
                <div
                  key={i}
                  className="flex items-center p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold">
                    {i + 1}
                  </span>
                  <span className="flex-1 ml-4 font-medium">{option.text}</span>
                  <span className="text-sm text-gray-500 font-medium">
                    {option.votes_count} votes
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <RadioGroup
              onValueChange={setSelectedOption}
              value={selectedOption ?? undefined}
              className="space-y-3"
            >
              {pollData.options.map((option: PollOption, i) => (
                <div
                  key={i}
                  className="flex items-center rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-all"
                >
                  <RadioGroupItem
                    value={option._id.$oid}
                    id={option._id.$oid}
                    className="ml-4"
                  />
                  <Label
                    htmlFor={option._id.$oid}
                    className="flex-1 p-4 cursor-pointer"
                  >
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </ScrollArea>

        <div className="mt-6 pt-6 border-t">
          {!hasVoted && pollData.is_open && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  className="w-full py-6 text-lg font-semibold"
                  disabled={!selectedOption}
                  variant={selectedOption ? "default" : "secondary"}
                >
                  Cast Your Vote
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl">
                    Confirm Your Vote
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-600">
                    Please note that your vote cannot be changed once cast.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2">
                  <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleVote}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Confirm Vote
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          
          {hasVoted && (
            <Link href={`/polls/results/${pollData.id}`} className="block">
              <Button className="w-full py-6 text-lg font-semibold">
                View Results
                <ChevronRight className="ml-2" size={20} />
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}