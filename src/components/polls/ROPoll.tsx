"use client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { PollData, PollOption } from "@/types/poll";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { VoteIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import api from "@/utils/axios";
import toaster from "@/utils/toaster";
import { ScrollArea } from "../ui/scroll-area";

export type ROPollType = {
    _id: any,
    id: string,
    title: string,
    options: ROOptionType[],
    is_open: boolean,
    owner_username: string,
    voters: string[]
}

type ROOptionType = {
    _id: any,
    text: string,
    votes_count: number,
}



export default function ROPoll(pollData: PollData) {
  const username = useAuthStore((state)=>state.username);
  const [isOwner,setIsOwner] = useState(false);
  const handlePollClose = async()=>{
    try {
      const response = (await api.post(`/polls/${pollData.id}/close`,{
        username
      })).data;
      console.log(response);
      toaster("success","poll closed successfully!");
      return;
    } catch (error:any) {
      console.log(error);
      const errorText = error.response.data;
      toaster("error",errorText);
      return;
    }
  }
  const handlePollReset = async()=>{
    try {
      const response = (await api.post(`/polls/${pollData.id}/reset`,{
        username
      })).data;
      console.log(response);
      toaster("success","poll reset successfully!");
      return;
    } catch (error:any) {
      console.log(error);
      const errorText = error?.response?.data;
      toaster("error",errorText);
      return;
    }
  }
  const handlePollDelete = async()=>{
    try {
      const response = (await api.post(`/polls/${pollData.id}/delete`,{
        username
      })).data;
      console.log(response);
      toaster("success","poll deleted successfully!");
      return;
    } catch (error:any) {
      console.log(error);
      const errorText = error?.response?.data;
      toaster("error",errorText);
      return;
    }
  }
  useEffect(
    ()=>{
      const isOwner = pollData.owner_id === username;
      setIsOwner(isOwner);
    }
  ,[username,pollData.owner_id]);
  return (
    <Card className="w-fit min-w-64 h-fit max-h-96 overflow-y-scroll relative">
      <Link href={`/polls/${pollData.id}`} className="relative">
      <Badge variant={"outline"} className="absolute top-0 right-0 z-20 bg-brand-3">
        <p>{pollData?.voters?.length??0}</p>
        <VoteIcon size={24} />
      </Badge>
      <CardHeader>
        <CardTitle className="text-center text-xl">{pollData.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-fit overflow-y-scroll">
          {pollData.options?.length ? (
            <div className="space-y-2">
              {pollData.options.map((option: PollOption, i:number) => (
                <div
                  key={option._id.$oid + i}
                  className="flex justify-between items-center py-2 border-b last:border-0"
                >
                  <span className="text-sm">{option.text}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              No options available for this poll.
            </p>
          )}
        </ScrollArea>
      </CardContent>
      </Link>
      <CardFooter className="w-full flex items-center justify-around gap-1">
        {
          (pollData.owner_id === username) && <>
            {pollData.is_open && <Button onClick={handlePollClose}>Close</Button>}
            <Button onClick={handlePollReset}>Reset</Button>
            <Button onClick={handlePollDelete} variant={"destructive"}>Delete</Button>
          </>
        }
      </CardFooter>
    </Card>
  );
}