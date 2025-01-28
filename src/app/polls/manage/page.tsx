import UserPollsContainer from "@/components/polls/UserPolls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PollDashBoard() {
  return (
    <div className="flex items-center flex-col justify-center h-4/5 w-full">
      <Tabs
        defaultValue="my-polls"
        className="w-full flex flex-col items-center justify-center"
      >
        <TabsList className="w-full md:w-1/3 mx-auto bg-[#ffffff76]">
          <TabsTrigger className="w-full" value="my-polls">
            Manage Polls
          </TabsTrigger>
        </TabsList>
        <TabsContent value="my-polls">
          <UserPollsContainer />
        </TabsContent>
      </Tabs>
    </div>
  );
}
