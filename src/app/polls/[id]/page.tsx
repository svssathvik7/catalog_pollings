import Poll from "@/components/ui/Poll";

export default async function VotePoll({params}:any){
    const pollId = (await params).id;
    return (
        <div className="absolute top-0 left-0 right-0 bottom-0 m-auto w-fit h-fit">
            <Poll pollId={pollId}/>
        </div>
    )
}