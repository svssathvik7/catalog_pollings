import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { PollData, PollOption } from "@/types/poll";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  ChevronRight,
  AlertTriangle,
  Lock,
  RefreshCcw,
  Trash
} from "lucide-react";
import { Button } from "../ui/button";
import { useAuthStore } from "@/store/authStore";
import api from "@/utils/axios";
import toaster from "@/utils/toaster";
import { ScrollArea } from "../ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ROPoll(pollData: PollData) {
  const username = useAuthStore((state) => state.username);
  const [isOwner, setIsOwner] = useState(false);

  const handlePollClose = async () => {
    try {
      await api.post(`/polls/${pollData.id}/close`, { username });
      toaster("success", "Poll closed successfully!");
    } catch (error: any) {
      toaster("error", error?.response?.data || "Failed to close poll");
    }
  };

  const handlePollReset = async () => {
    try {
      await api.post(`/polls/${pollData.id}/reset`, { username });
      toaster("success", "Poll reset successfully!");
    } catch (error: any) {
      toaster("error", error?.response?.data || "Failed to reset poll");
    }
  };

  const handlePollDelete = async () => {
    try {
      await api.post(`/polls/${pollData.id}/delete`, { username });
      toaster("success", "Poll deleted successfully!");
    } catch (error: any) {
      toaster("error", error?.response?.data || "Failed to delete poll");
    }
  };

  useEffect(() => {
    setIsOwner(pollData.owner_id === username);
  }, [username, pollData.owner_id]);

  return (
    <TooltipProvider>
      <Card className="w-64 bg-white shadow-md hover:shadow-lg transition-all duration-300 relative">
        <Link href={`/polls/${pollData.id}`} className="block">
          <Badge
            variant="outline"
            className="absolute -top-2 -right-2 bg-blue-100 border-blue-200 shadow-sm flex items-center gap-1.5 px-2 py-0.5 z-10"
          >
            <Users size={14} className="text-blue-600" />
            <span className="font-semibold text-blue-600">
              {pollData?.voters?.length ?? 0}
            </span>
          </Badge>

          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg font-bold text-gray-800 text-center line-clamp-2">
              {pollData.title}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <ScrollArea className="max-h-40">
              {pollData.options?.length ? (
                <div className="space-y-2">
                  {pollData.options.slice(-2).map((option: PollOption, i: number) => (
                    <div
                      key={option._id.$oid + i}
                      className="p-2.5 rounded-lg bg-gray-50 border border-gray-100 hover:border-blue-100 hover:bg-blue-50 transition-colors"
                    >
                      <span className="text-gray-700 text-sm font-medium">
                        {option.text}
                      </span>
                    </div>
                  ))}
                  <div className="pt-1 flex items-center text-blue-600 hover:text-blue-700 transition-colors gap-0.5 text-xs font-medium">
                    View full poll 
                    <ChevronRight size={14} />
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-3 text-sm">
                  No options available
                </p>
              )}
            </ScrollArea>
          </CardContent>
        </Link>

        <CardFooter className="pt-3 pb-3 border-t">
          {isOwner ? (
            <div className="w-full flex items-center justify-center gap-3">
              {pollData.is_open && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handlePollClose}
                      size="sm"
                      className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700"
                    >
                      <Lock/>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Close Poll</p>
                  </TooltipContent>
                </Tooltip>
              )}

              <AlertDialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <RefreshCcw/>
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reset Poll</p>
                  </TooltipContent>
                </Tooltip>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset Poll?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will clear all votes. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handlePollReset}>
                      Reset Poll
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <AlertDialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Trash/>
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete Poll</p>
                  </TooltipContent>
                </Tooltip>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="text-red-500" size={20} />
                      Delete Poll?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the poll and all its data. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handlePollDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete Poll
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : (
            <p className="w-full text-center text-gray-500 text-xs">
              by {pollData.owner_id}
            </p>
          )}
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}