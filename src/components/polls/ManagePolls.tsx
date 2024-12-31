import Link from "next/link";
import { Button } from "../ui/button";

export default function ManagePolls(){
    return (
        <div>
            <Button><Link href="/polls/new">Create Poll</Link></Button>
        </div>
    )
}