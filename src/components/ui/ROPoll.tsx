import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { PollData, PollOption } from "@/types/poll";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { VoteIcon } from "lucide-react";
import { Button } from "./button";

export type ROPollType = {
    _id: any,
    id: string,
    title: string,
    options: ROOptionType[],
    is_open: boolean,
    total_votes: number,
    owner_username: string,
}

type ROOptionType = {
    _id: any,
    text: string,
    votes_count: number,
    voters: any
}



export default function ROPoll(pollData: PollData) {
  return (
    <Link href={`/polls/${pollData.id}`} className="relative">
    <Card className="w-60 h-60 overflow-y-scroll">
      <Badge variant={"outline"} className="absolute -top-2 -right-2 z-20 bg-brand-3">
        <p>{pollData.total_votes}</p>
        <VoteIcon size={24} />
      </Badge>
      <CardHeader>
        <CardTitle className="text-center text-xl">{pollData.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-fit overflow-y-scroll">
          {pollData.options?.length ? (
            <div className="space-y-2">
              {pollData.options.map((option: PollOption, i:number) => (
                <div
                  key={option._id.$oid + i}
                  className="flex justify-between items-center py-2 border-b last:border-0"
                >
                  <span className="text-sm">{option.text}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              No options available for this poll.
            </p>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <Link href={`/polls/results/${pollData.id}`}>
          <Button>Results</Button>
        </Link>
      </CardFooter>
    </Card>
    </Link>
  );
}