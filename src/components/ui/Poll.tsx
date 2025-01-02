

// Interactive Poll Component
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

export default function Poll({ pollId }: { pollId: string }) {
  const [pollData, setPollData] = useState<PollData | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const logout = useAuthStore((state) => state.logout);
  const username = useAuthStore((state) => state.username);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const data = await getPoll(pollId, logout, username ?? "No Auth");
        setPollData(data);
      } catch (error) {
        console.error("Error fetching poll data:", error);
      }
    };
    fetchPoll();
  }, [pollId, logout, username]);

  const handleVote = async () => {
    if (!selectedOption) {
      alert("Please select an option to vote.");
      return;
    }

    try {
      // Add your vote handling logic here
      alert("Vote cast successfully!");
    } catch (error) {
      console.error("Error casting vote:", error);
      alert("Failed to cast vote. Please try again.");
    }
  };

  if (!pollData) {
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

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="text-center">{pollData.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72 pr-4">
          <RadioGroup
            onValueChange={(value) => setSelectedOption(value)}
            value={selectedOption ?? undefined}
            className="space-y-2"
          >
            {pollData.options.map((option) => (
              <div
                key={option._id}
                className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent"
              >
                <RadioGroupItem value={option._id} id={option._id} />
                <Label
                  htmlFor={option._id}
                  className="flex flex-1 justify-between cursor-pointer"
                >
                  <span>{option.text}</span>
                  <span className="text-sm text-muted-foreground">
                    ({option.votes_count} votes)
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </ScrollArea>
        <Button
          className="w-full mt-4"
          onClick={handleVote}
          disabled={!selectedOption}
          variant={selectedOption ? "default" : "secondary"}
        >
          Cast Vote
        </Button>
      </CardContent>
    </Card>
  );
}