import Link from "next/link";

export default function Register(){
    return (
        <form className="w-64 h-fit m-auto flex items-center justify-start flex-col bg-slate-300 rounded-lg p-2 absolute top-0 bottom-0 left-0 right-0 text-black">
            <h6 className="text-2xl">Sign up</h6>
            <input type="text" placeholder="enter username" required className="font-bold outline-none text-black bg-transparent border-b-2 border-white p-2"/>
            <div className="flex items-center justify-start">
                <p className="text-xs">Already have an account?</p>
                <Link href={"/auth/login"} className="px-1 py-[0.5] rounded-lg font-semibold bg-brand-3 text-black m-2 text-base">sign in</Link>
            </div>
            <button className="px-2 py-1 rounded-lg font-bold bg-brand-3 text-black m-2">sign up</button>
        </form>
    )
}