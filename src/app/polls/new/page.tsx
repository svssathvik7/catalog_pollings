"use client";
import { useAuthStore } from "@/store/authStore";
import createPoll from "@/utils/createPoll";
import toaster from "@/utils/toaster";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewPoll() {
    const [title, setTitle] = useState("");
    const [options, setOptions] = useState([{ text: "" }]);
    const isAuthenticated = useAuthStore((state)=>state.isAuthenticated);
    const username = useAuthStore((state)=>state.username);
    const logout = useAuthStore((state)=>state.logout);
    const handleOptionChange = (index: number, value: string) => {
        const updatedOptions = [...options];
        updatedOptions[index].text = value;
        setOptions(updatedOptions);
    };

    const addOption = () => {
        if (options[options.length - 1].text.trim() === "") {
            toaster("error", "Option can't be empty!");
            return;
        }
        setOptions([...options, { text: "" }]);
    };

    const removeOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        if(!isAuthenticated){
            toaster("error","must login to create poll!");
            return;
        }
        if (options.length < 2) {
            toaster("error", "Require at least 2 options!");
            return;
        }
        if (options.some(option => option.text.trim() === "")) {
            toaster("error", "Options cannot be empty!");
            return;
        }
        const pollData = {
            title,
            options: options.map(option => ({ text: option.text.trim() })),
            ownername: username
        };
        console.log("Poll Data:", pollData);
        const isPollCreated = await createPoll(pollData,logout);
        if(isPollCreated){
            setTitle("");
            setOptions([{ text: "" }]);
        }
        return;
    };

    return (
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg w-96 absolute top-0 left-0 bottom-0 right-0 m-auto h-fit">
            <form onSubmit={handleSubmit} className="w-full">
                <input
                    type="text"
                    placeholder="Poll Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 mb-4 border rounded-md outline-none text-black font-bold"
                    required
                />
                {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2 mb-3">
                        <input
                            type="text"
                            placeholder={`Option ${index + 1}`}
                            value={option.text}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            className="flex-1 px-3 py-2 border rounded-md outline-none text-black"
                        />
                        {options.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeOption(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addOption}
                    className="w-full px-3 py-2 mb-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                    Add Option
                </button>
                <button
                    type="submit"
                    className="w-full px-3 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
                >
                    Create Poll
                </button>
            </form>
        </div>
    );
}
