"use client";
import { useAuthStore } from "@/store/authStore";
import createPoll from "@/utils/createPoll";
import toaster from "@/utils/toaster";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function NewPoll() {
    const [title, setTitle] = useState("");
    const [options, setOptions] = useState([{ text: "" }]);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const username = useAuthStore((state) => state.username);
    const logout = useAuthStore((state) => state.logout);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toaster("error", "Must log in to create poll!");
            return;
        }
        if (options.length < 2) {
            toaster("error", "Require at least 2 options!");
            return;
        }
        if (options.some((option) => option.text.trim() === "")) {
            toaster("error", "Options cannot be empty!");
            return;
        }
        const pollData = {
            title,
            options: options.map((option) => ({ text: option.text.trim() })),
            ownername: username,
        };
        console.log("Poll Data:", pollData);
        const isPollCreated = await createPoll(pollData, logout);
        if (isPollCreated) {
            setTitle("");
            setOptions([{ text: "" }]);
        }
        return;
    };

    return (
        <div className="flex-grow h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit} className="w-96">
                <Input
                    type="text"
                    placeholder="Poll Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full mb-4"
                    required
                />
                {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2 mb-3">
                        <Input
                            type="text"
                            placeholder={`Option ${index + 1}`}
                            value={option.text}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            className="flex-1"
                        />
                        {options.length > 1 && (
                            <Button
                                type="button"
                                onClick={() => removeOption(index)}
                                variant="destructive"
                                size="sm"
                            >
                                Remove
                            </Button>
                        )}
                    </div>
                ))}
                <Button
                    type="button"
                    onClick={addOption}
                    className="w-full mb-4"
                >
                    Add Option
                </Button>
                <Button
                    type="submit"
                    className="w-full"
                >
                    Create Poll
                </Button>
            </form>
        </div>
    );
}
