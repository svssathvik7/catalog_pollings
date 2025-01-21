"use client"
import React, { useState } from 'react';
import { useAuthStore } from "@/store/authStore";
import createPoll from "@/utils/createPoll";
import toaster from "@/utils/toaster";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { PlusCircle, MinusCircle, Loader2 } from "lucide-react";

export default function NewPoll() {
    const [title, setTitle] = useState("");
    const [options, setOptions] = useState([{ text: "" }, { text: "" }]); // Start with 2 options
    const [loading, setLoading] = useState(false);
    
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
            toaster("error", "Please fill in the last option before adding a new one");
            return;
        }
        setOptions([...options, { text: "" }]);
    };

    const removeOption = (index: number) => {
        if (options.length <= 2) {
            toaster("error", "A poll must have at least 2 options");
            return;
        }
        setOptions(options.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!isAuthenticated) {
                toaster("error", "Please log in to create a poll");
                return;
            }

            if (title.trim() === "") {
                toaster("error", "Please enter a poll title");
                return;
            }

            if (options.some((option) => option.text.trim() === "")) {
                toaster("error", "All options must be filled out");
                return;
            }

            const trimmedOptions = options.map((option) => option.text.trim());
            if (new Set(trimmedOptions.map((o) => o.toLowerCase())).size !== trimmedOptions.length) {
                toaster("error", "Each option must be unique");
                return;
            }

            const pollData = {
                title: title.trim(),
                options: options.map((option) => ({ text: option.text.trim() })),
                ownername: username,
            };

            const isPollCreated = await createPoll(pollData, logout);
            if (isPollCreated) {
                setTitle("");
                setOptions([{ text: "" }, { text: "" }]);
                toaster("success", "Poll created successfully!");
            }
        } catch (error) {
            toaster("error", "Failed to create poll");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Create a New Poll</CardTitle>
                <CardDescription className="text-center">
                    Create an engaging poll with multiple options for your audience
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Poll Title</label>
                        <Input
                            type="text"
                            placeholder="What would you like to ask?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full"
                            required
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-medium">Options</label>
                        {options.map((option, index) => (
                            <div key={index} className="flex items-center gap-2 group">
                                <div className="w-8 h-8 flex items-center justify-center bg-muted rounded-l">
                                    {index + 1}
                                </div>
                                <Input
                                    type="text"
                                    placeholder={`Option ${index + 1}`}
                                    value={option.text}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeOption(index)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <MinusCircle className="h-5 w-5 text-destructive" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </form>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={addOption}
                    className="w-full"
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Another Option
                </Button>

                <Button
                    onClick={handleSubmit}
                    className="w-full"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Poll...
                        </>
                    ) : (
                        'Create Poll'
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}