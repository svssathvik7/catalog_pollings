"use client";

import { useEffect, useState } from "react";
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
import { VoteIcon } from "lucide-react";
import { Badge } from "./badge";
import Link from "next/link";

export default function Poll({ pollId }: { pollId: string }) {
  const [pollData, setPollData] = useState<PollData | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const logout = useAuthStore((state) => state.logout);
  const [hasVoted, setHasVoted] = useState(true);
  const username = useAuthStore((state) => state.username);
  const router = useRouter();

  useEffect(() => {
    const fetchPoll = async () => {
      // Wait until username is available before making the API call
      if (!username) return;

      try {
        const data = await getPoll(pollId, logout, username);
        if (data === "noauth") {
          router.push("/login");
          return;
        }
        setPollData(data.poll);
        setHasVoted(data.has_voted);
      } catch (error) {
        console.error("Error fetching poll data:", error);
      } finally {
        setLoading(false); // Update loading state
      }
    };

    fetchPoll();
  }, [pollId, logout, username, router]);

  if (loading) {
    return (
      <Card className="w-80">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!pollData) {
    return (
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Failed to load poll. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  const handleVote = async () => {
    if (!selectedOption || !username) {
      toaster("error", "Please select an option to vote.");
      return;
    }

    const voteData = {
      optionId: selectedOption,
      pollId,
      username,
    };
    console.log("Voting for option:", voteData);

    try {
      // Add your vote handling logic here
      const response = (await api.post(`/polls/${pollId}/vote`, voteData)).data;
      setHasVoted(true);
      toaster("success", "Vote cast successfully!");
      return;
    } catch (error:any) {
      console.error("Error casting vote:", error);
      toaster("error", "Failed to cast vote. Please try again later.");
      if (error?.response?.data?.isAuthenticated === false) {
        logout();
        toaster("error", "login to view poll!");
      }
      return;
    }
  };

  return (
    <Card className="w-80 h-fit relative">
      <Badge variant={"outline"} className="absolute -top-2 -right-2 z-20 bg-brand-3">
        <p className="text-lg">{pollData?.voters?.length??0}</p>
        <VoteIcon size={24} />
      </Badge>
      <CardHeader>
        <CardTitle className="text-center">{pollData.title}</CardTitle>
      </CardHeader>
      <CardContent className="gap-2 flex flex-wrap flex-col">
        <ScrollArea className="h-fit max-h-72">
          {hasVoted ? (
            <div className="space-y-2">
              {pollData.options.map((option: PollOption, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-md border bg-muted/50"
                >
                  <span className="font-bold">{i + 1}.</span>
                  <span className="flex-1 ml-2">{option.text}</span>
                  <span className="text-sm text-muted-foreground">
                    ({option.votes_count} votes)
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <RadioGroup
              onValueChange={(value) => setSelectedOption(value)}
              value={selectedOption ?? undefined}
              className="space-y-2"
            >
              {pollData.options.map((option: PollOption, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-2 rounded-md border hover:bg-accent"
                >
                  <RadioGroupItem
                    value={option._id.$oid}
                    id={option._id.$oid}
                    className="ml-2"
                  />
                  <Label
                    htmlFor={option._id.$oid}
                    className="flex flex-1 justify-between cursor-pointer p-3"
                  >
                    <span>{option.text}</span>
                    <span className="text-sm text-muted-foreground">
                      ({option.votes_count} votes)
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </ScrollArea>
        {!hasVoted && pollData.is_open && (
          <Button
            className="w-full mt-4"
            disabled={!selectedOption}
            variant={selectedOption ? "default" : "secondary"}
          >
            <AlertDialog>
              <AlertDialogTrigger>Vote</AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure to vote?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Once the vote is cast, it cannot be changed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleVote}>Cast</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Button>
        )}
        {hasVoted && <Link className="w-full" href={`/polls/results/${pollData.id}`}><Button className="px-2 w-full">Result</Button></Link>}
      </CardContent>
    </Card>
  );
}
