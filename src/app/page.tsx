"use client";

import ROPoll, { ROPollType } from "@/components/ui/ROPoll";
import Pagination from "@/types/pagination";
import { getROLivePolls, getROClosedPolls } from "@/utils/getROPolls"; // Assuming you have getROClosedPolls
import { useEffect, useState } from "react";

export default function Home() {
  const [roLivePolls, setROLivePolls] = useState<ROPollType[]>([]);
  const [livePollPagination, setLivePollPagination] = useState<Pagination>({page:1,per_page:3});
  const [livePollTotalPages,setLivePollTotalPages] = useState(1);
  const [closedPollTotalPages,setClosedPollTotalPages] = useState(1);

  const [readOnlyClosedPolls, setReadOnlyClosedPolls] = useState<ROPollType[]>([]);
  const [closedPollPagination, setClosedPollPagination] = useState<Pagination>({page:1,per_page:3});

  // Fetch Live Polls
  useEffect(() => {
    const fetchLivePolls = async () => {
      const {polls, total_pages} = await getROLivePolls(livePollPagination);
      setROLivePolls(polls || []);
      setLivePollTotalPages(total_pages);
    };
    fetchLivePolls();
  }, [livePollPagination]);

  // Fetch Closed Polls
  useEffect(() => {
    const fetchClosedPolls = async () => {
      const { polls,total_pages } = await getROClosedPolls(closedPollPagination);
      setReadOnlyClosedPolls(polls || []);
      setLivePollTotalPages(total_pages);
    };
    fetchClosedPolls();
  }, [closedPollPagination]);

  return (
    <div className="flex items-center justify-around absolute left-0 right-0 top-0 bottom-0 m-auto h-fit w-screen">
      {/* Live Polls Section */}
      <div className="flex flex-col items-center justify-start gap-2 w-4/5">
        <h2 className="text-lg font-semibold mb-2">Live Polls</h2>
        <div className="flex items-center justify-center flex-wrap w-full gap-1">
          {roLivePolls.length > 0 ? (
            roLivePolls.map((pollData: ROPollType, i: number) => (
              <ROPoll key={i} {...pollData} />
            ))
          ) : (
            <p>No live polls available.</p>
          )}
        </div>
        <div className="w-full flex items-center justify-around">
          <button
            className="bg-brand-3 text-black w-20 rounded-lg disabled:opacity-40"
            onClick={()=>{setLivePollPagination({page:livePollPagination.page-1,per_page:livePollPagination.per_page})}}
            disabled={livePollPagination.page===1}
          >
            Prev
          </button>
          <button
            className="bg-brand-3 text-black w-20 rounded-lg disabled:opacity-40"
            onClick={()=>{setLivePollPagination({page:livePollPagination.page+1,per_page:livePollPagination.per_page})}}
            disabled={livePollPagination.page===livePollTotalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Closed Polls Section */}
      <div className="flex flex-col items-center justify-start gap-2 w-4/5">
        <h2 className="text-lg font-semibold mb-2">Closed Polls</h2>
        <div className="flex items-center justify-center flex-wrap w-full gap-1">
          {readOnlyClosedPolls.length > 0 ? (
            readOnlyClosedPolls.map((pollData: ROPollType, i: number) => (
              <ROPoll key={i} {...pollData} />
            ))
          ) : (
            <p>No closed polls available.</p>
          )}
        </div>
        <div className="w-full flex items-center justify-around">
          <button
            className="bg-brand-3 text-black w-20 rounded-lg disabled:opacity-40"
            onClick={()=>{setClosedPollPagination({page:closedPollPagination.page-1,per_page:closedPollPagination.per_page})}}
            disabled={closedPollPagination.page===1}
          >
            Prev
          </button>
          <button
            className="bg-brand-3 text-black w-20 rounded-lg disabled:opacity-40"
            onClick={()=>{setClosedPollPagination({page:closedPollPagination.page+1,per_page:closedPollPagination.per_page})}}
            disabled={closedPollPagination.page===closedPollTotalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
