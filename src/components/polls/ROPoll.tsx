import { useState, useEffect, Dispatch, SetStateAction } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import type { PollData, PollOption } from "@/types/pollType";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  ChevronRight,
  AlertTriangle,
  Lock,
  RefreshCcw,
  Trash,
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
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AxiosError } from "axios";
import { formatNumber, formatText } from "@/utils/formatUtils";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function ROPoll({
  pollData,
  setRefresher,
}: {
  pollData: PollData;
  setRefresher?: Dispatch<SetStateAction<boolean>>;
}) {
  const logout = useAuthStore((state) => state.logout);
  const username = useAuthStore((state) => state.username);
  const [isOwner, setIsOwner] = useState(false);
  const handlePollClose = async () => {
    try {
      await api.post(`/polls/${pollData.id}/close`, { username });
      if (setRefresher) {
        setRefresher((prev: boolean) => !prev);
      }
      toaster("success", "Poll closed successfully!");
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorText = error?.response?.data?.error;
        if (error?.response?.data?.isAuthenticated === false) {
          logout();
          toaster("error", "Please login to close the poll!");
        } else {
          toaster("error", errorText);
        }
      } else {
        toaster("error", "Failed to close poll");
      }
      return false;
    }
  };

  const handlePollReset = async () => {
    try {
      await api.post(`/polls/${pollData.id}/reset`, { username });
      if (setRefresher) {
        setRefresher((prev: boolean) => !prev);
      }
      toaster("success", "Poll reset successfully!");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        const errorText = error?.response?.data?.error;
        if (error?.response?.data?.isAuthenticated === false) {
          logout();
          toaster("error", "Please login to reset the poll!");
        } else {
          toaster("error", errorText);
        }
      } else {
        toaster("error", "Failed to reset poll");
      }
      return false;
    }
  };

  const handlePollDelete = async () => {
    try {
      await api.post(`/polls/${pollData.id}/delete`, { username });
      toaster("success", "Poll deleted successfully!");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        const errorText = error?.response?.data?.error;
        if (error?.response?.data?.isAuthenticated === false) {
          logout();
          toaster("error", "Please login to delete the poll!");
        } else {
          toaster("error", errorText);
        }
      } else {
        toaster("error", "Failed to delete poll");
      }
    }
  };

  useEffect(() => {
    setIsOwner(pollData.owner_id === username);
  }, [username, pollData.owner_id]);

  return (
    <TooltipProvider>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Card className="w-full md:w-72 bg-[#ffffff76] shadow-lg hover:shadow-xl transition-all duration-300 relative rounded-xl overflow-hidden border border-gray-200 h-[35dvh]">
          <Link href={`/polls/${pollData.id}`} className="block">
            <Badge
              variant="outline"
              className="absolute top-3 right-3 bg-blue-500 text-white shadow-md flex items-center gap-1.5 px-2 py-1 z-10 rounded-full"
            >
              <Users size={14} className="text-white" />
              <span className="font-semibold text-white">
                {formatNumber(pollData?.total_votes ?? 0)}
              </span>
            </Badge>

            <CardHeader className="pb-2 pt-6">
              <CardTitle className="text-xl font-bold text-gray-800 text-center line-clamp-2 px-4">
                {formatText(pollData.title)}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <ScrollArea className="max-h-36 px-4 overflow-y-scroll">
                {pollData.options?.length ? (
                  <div className="space-y-2">
                    {pollData.options
                      .slice(-2)
                      .map((option: PollOption, i: number) => (
                        <div
                          key={option._id.$oid + i}
                          className="p-1 text-left rounded-lg bg-gray-50 border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-colors"
                        >
                          <span className="text-gray-700 text-sm font-medium pl-2">
                            {option.text}
                          </span>
                        </div>
                      ))}
                    <div className="mx-1 flex items-center justify-start text-blue-600 hover:text-blue-700 transition-colors gap-1 text-sm font-medium">
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

          <CardFooter className="h-fit absolute bottom-0 w-full flex items-center justify-center">
            {isOwner ? (
              <div className="w-full flex items-center justify-center gap-4 m-auto">
                {pollData.is_open && (
                  <AlertDialog>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            className="h-9 w-9 bg-blue-500 hover:bg-blue-700 rounded-full shadow-md"
                          >
                            <Lock />
                          </Button>
                        </AlertDialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Close Poll</p>
                      </TooltipContent>
                    </Tooltip>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Close Poll?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will close the poll, preventing any further
                          votes. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handlePollClose}>
                          Close Poll
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}

                <AlertDialog>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 w-9 p-0 border-blue-300 bg-[#fff] text-blue-700 hover:bg-blue-50 rounded-full shadow-md"
                        >
                          <RefreshCcw />
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
                          className="h-9 w-9 rounded-full shadow-md"
                        >
                          <Trash />
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
                        This will permanently delete the poll and all its data.
                        This action cannot be undone.
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
              <p className="w-full h-full text-center text-gray-600 text-sm font-medium m-auto">
                Created by {pollData.owner_id}
              </p>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
}
