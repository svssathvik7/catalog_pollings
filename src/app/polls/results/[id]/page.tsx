"use client";

import { useParams, useRouter } from "next/navigation";



export default function PollResults(){
    const {id} = useParams();
    return (
        <div>
            <h1>Results of {id}</h1>
        </div>
    )
}