import { useRouter } from "next/navigation";
export const handlePollSearch = (e: any,pollId:string) => {
    const router = useRouter();
    e.preventDefault();
    router.push(`/polls/${pollId}`);
    return;
};