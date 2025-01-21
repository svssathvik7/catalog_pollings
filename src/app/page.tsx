import ClosedPollContainer from "@/components/polls/ClosedPollContainer";
import LivePollContainer from "@/components/polls/LivePollContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <Tabs defaultValue="live-polls" className="w-full text-center flex items-center justify-center flex-col">
      <TabsList className="w-3/4 bg-[#ddaabc] text-white">
        <TabsTrigger className="w-1/2" value="live-polls">Top Live Polls</TabsTrigger>
        <TabsTrigger className="w-1/2" value="closed-polls">Top Closed Polls</TabsTrigger>
      </TabsList>
      <TabsContent value="live-polls" className="h-[80dvh]">
        <LivePollContainer/>
      </TabsContent>
      <TabsContent value="closed-polls" className="h-[80dvh]">
        <ClosedPollContainer/>
      </TabsContent>
    </Tabs>
  );
}
