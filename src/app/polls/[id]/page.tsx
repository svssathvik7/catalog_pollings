import Poll from "@/components/ui/Poll";

export default async function VotePoll({ params }: { params: Promise<{
    id: string,
}> }) {
    const pollId = (await params).id;

    return (
        <div className="flex items-center justify-center">
            <Poll pollId={pollId} />
        </div>
    );
}
