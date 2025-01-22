import UserPollsContainer from "@/components/polls/UserPolls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PollDashBoard() {
  return (
    <div className="flex items-center flex-col justify-center h-4/5">
      <Tabs defaultValue="my-polls">
        <TabsList className="w-[75dvw] md:w-[30dvw]">
          <TabsTrigger className="w-full" value="my-polls">
            My Polls
          </TabsTrigger>
        </TabsList>
        <TabsContent value="my-polls">
          <UserPollsContainer/>
        </TabsContent>
      </Tabs>
    </div>
  );
}
