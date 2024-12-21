import ROPoll from "@/components/ui/ROPoll";
import getReadOnlyPolls from "@/utils/getROPolls";

export default async function Home() {
  const readOnlyPolls = await getReadOnlyPolls();
  const readOnlyLivePolls = readOnlyPolls?.liveReadOnlyPolls.polls || [];
  const readOnlyCloedPolls = readOnlyPolls?.closedReadOnlyPolls.polls || [];

  return (
    <div className="flex items-center justify-around absolute left-0 right-0 top-0 bottom-0 m-auto h-fit">
      {/* Live Polls Section */}
      <div className="flex flex-col items-center justify-start gap-2">
        <h2 className="text-lg font-semibold mb-2">Live Polls</h2>
        {readOnlyLivePolls.length > 0 ? (
          readOnlyLivePolls.map((pollData: any, i: number) => (
            <ROPoll key={i} {...pollData} />
          ))
        ) : (
          <p>No live polls available.</p>
        )}
      </div>

      {/* Closed Polls Section */}
      <div className="flex flex-col items-center justify-start">
        <h2 className="text-lg font-semibold mb-2">Closed Polls</h2>
        {readOnlyCloedPolls.length > 0 ? (
          readOnlyCloedPolls.map((pollData: any, i: number) => (
            <ROPoll key={i} {...pollData} />
          ))
        ) : (
          <p>No closed polls available.</p>
        )}
      </div>
    </div>
  );
}
