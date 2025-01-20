import UserPollsContainer from "@/components/polls/UserPolls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PollDashBoard() {
  return (
    <Tabs defaultValue="my-polls" className="w-full text-center">
      <TabsList className="w-full lg:w-3/4">
        <TabsTrigger className="w-full" value="my-polls">
          My Polls
        </TabsTrigger>
      </TabsList>
      <TabsContent value="my-polls" className="h-[80dvh] overflow-y-scroll">
        <UserPollsContainer/>
      </TabsContent>
    </Tabs>
  );
}
