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
import { VoteIcon, ChevronRight, Users, Lock, Unlock, BarChart2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { AxiosError } from "axios"
import { motion } from "framer-motion"

export default function Poll({ pollId }: { pollId: string }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [pollData, setPollData] = useState<PollData | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const logout = useAuthStore((state) => state.logout)
  const [hasVoted, setHasVoted] = useState(false)
  const username = useAuthStore((state) => state.username)
  const router = useRouter()
  const [castingVote, setCastingVote] = useState(false)

  useEffect(() => {
    const fetchPoll = async () => {
      setLoading(true)
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
        toaster("error", "Failed to fetch poll!")
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
    setCastingVote(true)
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
      setCastingVote(false)
    } catch (error: unknown) {
      console.error("Error casting vote:", error)
      if (error instanceof AxiosError) {
        if (error?.response?.data?.isAuthenticated === false) {
          logout()
          toaster("error", "Please login to view poll!")
        }
      } else {
        toaster("error", "Failed to cast vote. Please try again later.")
      }
      setCastingVote(false)
    }
  }

  // Ensure that skeleton loader is shown while loading
  if (loading) {
    return (
      <Card className="w-[90vw] md:w-[60vw] lg:w-[40vw] mx-auto shadow-2xl relative bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
        <CardHeader className="pb-4">
          <Skeleton className="h-8 w-3/4 mx-auto bg-blue-200" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-14 w-full bg-blue-100" />
          <Skeleton className="h-14 w-full bg-blue-100" />
          <Skeleton className="h-14 w-full bg-blue-100" />
          <Skeleton className="h-10 w-1/2 mx-auto bg-blue-200" />
        </CardContent>
      </Card>
    )
  }

  if (!pollData) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-lg bg-red-50">
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-[90vw] md:w-[60vw] lg:w-[40vw] mx-auto shadow-2xl relative bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-indigo-500" />

        <Badge
          variant="secondary"
          className="absolute -top-0 -right-0 bg-blue-500 text-white shadow-lg flex items-center gap-1 px-3 py-1 rounded-full hover:text-blue-500"
        >
          <span className="text-lg font-semibold">{pollData.voters.length}</span>
          <Users size={20} />
        </Badge>

        <CardHeader className="pb-4 border-b border-blue-100">
          <CardTitle className="text-3xl font-bold text-center text-blue-800">{pollData.title}</CardTitle>
          <CardDescription className="text-center flex items-center justify-center mt-2">
            {pollData.is_open ? (
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 flex items-center gap-1">
                <Unlock size={16} />
                <span>Open for voting</span>
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300 flex items-center gap-1">
                <Lock size={16} />
                <span>Closed</span>
              </Badge>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <ScrollArea className="h-[40vh] pr-4 -mr-4">
            {hasVoted || !isAuthenticated || !pollData.is_open ? (
              <div className="space-y-4">
                {pollData.options.map((option: PollOption, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="p-4 rounded-lg border border-blue-200 bg-white hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-blue-800">{option.text}</span>
                      <span className="text-sm text-blue-600 font-medium">{option.votes_count} votes</span>
                    </div>
                    <Progress value={(option.votes_count / totalVotes) * 100} className="h-2 bg-blue-100">
                      <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full" />
                    </Progress>
                  </motion.div>
                ))}
              </div>
            ) : (
              <RadioGroup onValueChange={setSelectedOption} value={selectedOption ?? undefined} className="space-y-3">
                {pollData.options.map((option: PollOption, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="flex items-center rounded-lg border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
                  >
                    <RadioGroupItem value={option._id.$oid} id={option._id.$oid} className="ml-4" />
                    <Label htmlFor={option._id.$oid} className="flex-1 p-4 cursor-pointer text-blue-800">
                      {option.text}
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
            )}
          </ScrollArea>

          <div className="mt-6 pt-6 border-t border-blue-100">
            {!hasVoted && pollData.is_open && isAuthenticated && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className={`${castingVote ? " disabled opacity-50 pointer-events-none " : " cursor-pointer opacity-100 "} w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white transition-all duration-300 ease-in-out transform hover:scale-105`}
                    disabled={!selectedOption}
                  >
                    <VoteIcon className="mr-2" size={20} />
                    {castingVote ? "Casting your vote..." : "Cast your vote"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-md bg-gradient-to-br from-blue-50 to-indigo-50">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl text-blue-800">Confirm Your Vote</AlertDialogTitle>
                    <AlertDialogDescription className="text-blue-600">
                      Please note that your vote cannot be changed once cast.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel className="flex-1 bg-white text-blue-800 border-blue-300 hover:bg-blue-100">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleVote} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                      Confirm Vote
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {(hasVoted || !pollData.is_open || !isAuthenticated) && (
              <Link href={`/polls/results/${pollData.id}`} className="block">
                <Button className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white transition-all duration-300 ease-in-out transform hover:scale-105">
                  <BarChart2 className="mr-2" size={20} />
                  View realtime results
                  <ChevronRight className="ml-2" size={20} />
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}