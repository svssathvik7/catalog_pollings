import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { PollData, PollOption } from "@/types/poll";

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
    <Card className="w-60 h-60 overflow-y-scroll">
      <CardHeader>
        <CardTitle className="text-center text-xl">{pollData.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48 overflow-y-scroll">
          {pollData.options?.length ? (
            <div className="space-y-2">
              {pollData.options.map((option: PollOption, i:number) => (
                <div
                  key={option._id + i}
                  className="flex justify-between items-center py-2 border-b last:border-0"
                >
                  <span className="text-sm">{option.text}</span>
                  <span className="text-sm font-medium">
                    {option.votes_count} votes
                  </span>
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
        <p className="text-sm text-muted-foreground w-full text-center">
          Total Votes: {pollData.total_votes}
        </p>
      </CardFooter>
    </Card>
  );
}