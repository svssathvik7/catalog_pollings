type ROPollType = {
    _id: any,
    id: string,
    title: string,
    options: ROOptionType[],
    is_open: boolean,
    total_votes: number,
    owner_username: string
}

type ROOptionType = {
    _id: any,
    text: string,
    votes_count: number,
    voters: any
}

export default function ROPoll(pollData: ROPollType) {
    console.log("data:", pollData);

    return pollData && (
        <div className="bg-white flex flex-col items-center justify-start text-black p-4 shadow-md rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">{pollData.title}</h2>
            {pollData.options?.length ? (
                <ul className="w-full">
                    {pollData.options.map((option) => (
                        <li key={option._id} className="flex justify-between border-b py-2">
                            <span>{option.text}</span>
                            <strong>{option.votes_count} votes</strong>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No options available for this poll.</p>
            )}
            <p className="mt-4 text-gray-600">Total Votes: {pollData.total_votes}</p>
        </div>
    );
}
