"use client"

import React, { useEffect, useState } from "react"
import { useAuthStore } from "@/store/authStore"
import getPoll from "@/utils/getPoll"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import type { PollData, PollOption } from "@/types/poll"
import { useRouter } from "next/navigation"
import toaster from "@/utils/toaster"
import api from "@/utils/axios"
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
} from "@/components/ui/alert-dialog"
import { VoteIcon, ChevronRight, Users, Lock, Unlock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { AxiosError } from "axios"

export default function Poll({ pollId }: {pollId: string}) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [pollData, setPollData] = useState<PollData | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const logout = useAuthStore((state) => state.logout)
  const [hasVoted, setHasVoted] = useState(false)
  const username = useAuthStore((state) => state.username)
  const router = useRouter()

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const data = await getPoll(pollId, logout, username ?? "")
        if (data === "noauth") {
          router.push("/login")
          return
        }
        setPollData(data.poll)
        setHasVoted(data.has_voted)
      } catch (error) {
        console.error("Error fetching poll data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPoll()
  }, [pollId, logout, username, router])

  const handleVote = async () => {
    if (!selectedOption || !username) {
      toaster("error", "Please select an option to vote.")
      return
    }

    try {
      await api.post(`/polls/${pollId}/vote`, {
        optionId: selectedOption,
        pollId,
        username,
      })
      setHasVoted(true)
      toaster("success", "Vote cast successfully!")
      // Refresh poll data after voting
      const updatedData = await getPoll(pollId, logout, username)
      if (updatedData !== "noauth") {
        setPollData(updatedData.poll)
      }
    } catch (error: unknown) {
      console.error("Error casting vote:", error)
      if(error instanceof AxiosError){
        if (error?.response?.data?.isAuthenticated === false) {
          logout()
          toaster("error", "Please login to view poll!")
        }
      }
      else{
        toaster("error", "Failed to cast vote. Please try again later.");
      }
      return false;
    }
  }

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader className="pb-4">
          <Skeleton className="h-8 w-3/4 mx-auto" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!pollData) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-red-500">Error Loading Poll</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">Failed to load poll. Please try again later.</p>
        </CardContent>
      </Card>
    )
  }

  const totalVotes = pollData.options.reduce((sum, option) => sum + option.votes_count, 0)

  return (
    <Card className="w-[90vw] md:w-[60vw] lg:w-[40vw] mx-auto shadow-lg relative">
      <Badge
        variant="secondary"
        className="absolute -top-3 -right-3 bg-blue-100 border-blue-200 shadow-sm flex items-center gap-1 px-3 py-1"
      >
        <span className="text-lg font-semibold text-blue-700">{pollData.voters.length}</span>
        <Users size={20} className="text-blue-600" />
      </Badge>

      <CardHeader className="pb-4 border-b">
        <CardTitle className="text-2xl font-bold text-center">{pollData.title}</CardTitle>
        <CardDescription className="text-center flex items-center justify-center mt-2">
          {pollData.is_open ? (
            <>
              <Unlock size={16} className="mr-1 text-green-500" />
              <span className="text-green-600">Open for voting</span>
            </>
          ) : (
            <>
              <Lock size={16} className="mr-1 text-red-500" />
              <span className="text-red-600">Closed</span>
            </>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <ScrollArea className="h-[40vh] pr-4 -mr-4">
          {hasVoted || !isAuthenticated || !pollData.is_open ? (
            <div className="space-y-4">
              {pollData.options.map((option: PollOption, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{option.text}</span>
                    <span className="text-sm text-gray-500 font-medium">{option.votes_count} votes</span>
                  </div>
                  <Progress value={(option.votes_count / totalVotes) * 100} className="h-2" />
                </div>
              ))}
            </div>
          ) : (
            <RadioGroup onValueChange={setSelectedOption} value={selectedOption ?? undefined} className="space-y-3">
              {pollData.options.map((option: PollOption, i) => (
                <div
                  key={i}
                  className="flex items-center rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-all"
                >
                  <RadioGroupItem value={option._id.$oid} id={option._id.$oid} className="ml-4" />
                  <Label htmlFor={option._id.$oid} className="flex-1 p-4 cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </ScrollArea>

        <div className="mt-6 pt-6 border-t">
          {!hasVoted && pollData.is_open && isAuthenticated && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="w-full py-6 text-lg font-semibold"
                  disabled={!selectedOption}
                  variant={selectedOption ? "default" : "secondary"}
                >
                  <VoteIcon className="mr-2" size={20} />
                  Cast Your Vote
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl">Confirm Your Vote</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-600">
                    Please note that your vote cannot be changed once cast.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2">
                  <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleVote} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Confirm Vote
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {(hasVoted || !pollData.is_open || !isAuthenticated) && (
            <Link href={`/polls/results/${pollData.id}`} className="block">
              <Button className="w-full py-6 text-lg font-semibold">
                View Detailed Results
                <ChevronRight className="ml-2" size={20} />
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

