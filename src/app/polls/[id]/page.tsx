import Poll from "@/components/ui/Poll";

export default async function VotePoll({params}:any){
    const pollId = (await params).id;
    return (
        <div className="flex items-center justify-center">
            <Poll pollId={pollId} />
        </div>
    )
}