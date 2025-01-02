import Link from "next/link";
import { Button } from "../ui/button";

export default function ManagePolls(){
    return (
        <div>
            <Link href="/polls/new"><Button>Create Poll</Button></Link>
        </div>
    )
}