import Poll from "@/components/ui/Poll";

interface PollParams {
    id: string;
}

export default function VotePoll({ params }: { params: PollParams }) {
    const pollId = params.id;
    return (
        <div className="flex items-center justify-center">
            <Poll pollId={pollId} />
        </div>
    );
}
