import UserPollsContainer from "@/components/polls/UserPolls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PollDashBoard() {
  return (
    <Tabs defaultValue="my-polls" className="w-full text-center h-screen p-2 overflow-y-scroll">
      <TabsList className="w-full lg:w-3/4">
        <TabsTrigger className="w-1/2" value="my-polls">
          My Polls
        </TabsTrigger>
        <TabsTrigger className="w-1/2" value="voted-polls">
          Voted Polls
        </TabsTrigger>
      </TabsList>
      <TabsContent value="my-polls" className="h-96">
        <UserPollsContainer/>
      </TabsContent>
      <TabsContent value="voted-polls" className="h-96"></TabsContent>
    </Tabs>
  );
}
