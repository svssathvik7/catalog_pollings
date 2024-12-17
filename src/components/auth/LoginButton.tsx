import Link from "next/link";

export default function LogButton(){
    return (
        <Link href={"/auth/login"} className="px-2 py-1 rounded-lg font-bold bg-brand-3 text-black">login</Link>
    )
}