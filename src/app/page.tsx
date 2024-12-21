import ROPoll from "@/components/ui/ROPoll";
import getReadOnlyPolls from "@/utils/getROPolls";

export default async function Home() {
  const readOnlyPolls = await getReadOnlyPolls();
  const readOnlyLivePolls = readOnlyPolls?.liveReadOnlyPolls.polls || [];
  const readOnlyCloedPolls = readOnlyPolls?.closedReadOnlyPolls.polls || [];

  return (
    <div className="flex items-center justify-around absolute left-0 right-0 top-0 bottom-0 m-auto h-fit w-screen">
      {/* Live Polls Section */}
      <div className="flex flex-col items-center justify-start gap-2 w-4/5">
        <h2 className="text-lg font-semibold mb-2">Live Polls</h2>
        <div className="flex items-center justify-center flex-wrap w-full gap-1">
          {readOnlyLivePolls.length > 0 ? (
            readOnlyLivePolls.map((pollData: any, i: number) => (
              <ROPoll key={i} {...pollData} />
            ))
          ) : (
            <p>No live polls available.</p>
          )}
        </div>
        <div className="w-full flex items-center justify-around">
          <button className="bg-brand-3 text-black w-20 rounded-lg">Prev</button>
          <button className="bg-brand-3 text-black w-20 rounded-lg">Next</button>
        </div>
      </div>

      {/* Closed Polls Section */}
      <div className="flex flex-col items-center justify-start gap-2 w-4/5">
        <h2 className="text-lg font-semibold mb-2">Closed Polls</h2>
        <div className="flex items-center justify-center flex-wrap w-full gap-1">
          {readOnlyCloedPolls.length > 0 ? (
            readOnlyCloedPolls.map((pollData: any, i: number) => (
              <ROPoll key={i} {...pollData} />
            ))
          ) : (
            <p>No closed polls available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
