import ManagePolls from "@/components/polls/ManagePolls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

export default function PollDashBoard() {
  return (
    <Tabs defaultValue="live-polls" className="w-full text-center">
      <TabsList className="w-3/4">
        <TabsTrigger className="w-1/2" value="live-polls">
          Top Live Polls
        </TabsTrigger>
        <TabsTrigger className="w-1/2" value="closed-polls">
          Top Closed Polls
        </TabsTrigger>
      </TabsList>
      <TabsContent value="live-polls" className="h-96"></TabsContent>
      <TabsContent value="closed-polls" className="h-96"></TabsContent>
    </Tabs>
  );
}
