import ManagePolls from "@/components/polls/ManagePolls";
import PollSearch from "@/components/polls/PollSearch";
import UserStats from "@/components/ui/UserStats";

export default function PollDashBoard(){
    return (
        <div className="absolute top-0 left-0 right-0 bottom-0 m-auto w-3/4 h-3/4 grid grid-cols-2 gap-2 p-2">
            <div className="col-start-2 row-span-2">
                <ManagePolls/>
            </div>
        </div>
    )
}