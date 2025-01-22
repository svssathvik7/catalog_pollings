"use client"

import type { PollData } from "@/types/poll"
import { useCallback, useEffect, useState } from "react"
import ROPoll from "./ROPoll"
import { Button } from "../ui/button"
import { ArrowBigLeft, ArrowBigRight } from "lucide-react"
import { Skeleton } from "../ui/skeleton"
import { getUserPolls } from "@/utils/getUserPolls"
import { useAuthStore } from "@/store/authStore"

export default function UserPollsContainer() {
  const [pagination, setPagination] = useState({ page: 1, per_page: 4 })
  const [polls, setPolls] = useState<PollData[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const username = useAuthStore((state) => state.username)
  const logout = useAuthStore((state) => state.logout)

  const fetchData = useCallback(async () => {
    if (!username) return
    try {
      setLoading(true)
      const response = await getUserPolls(pagination, username, logout)
      console.log(response)
      const totalPages = response.total_pages
      const newPolls = response.polls
      if (!newPolls) {
        setLoading(false)
        return
      }

      setPolls((prevPolls) => [...prevPolls, ...newPolls])
      setTotalPages(totalPages)
    } catch (error) {
      console.error("Error fetching polls:", error)
    } finally {
      setLoading(false)
    }
  }, [username, pagination, logout])

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  useEffect(() => {
    if (!username) return
    if (isMounted) {
      fetchData()
    }
  }, [pagination, isMounted, username, fetchData])

  return (
    <div className="flex flex-col items-center justify-between w-full h-[calc(100vh-4rem)] p-4 space-y-4">
      <div className="w-full h-full overflow-y-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-24" />
                <div className="space-y-2">
                  <Skeleton className="h-6" />
                  <Skeleton className="h-6" />
                  <Skeleton className="h-6" />
                </div>
              </div>
            ))}
          </div>
        ) : polls.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No polls created yet!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {polls.slice(-1 * pagination.per_page).map((poll, index) => (
              <ROPoll key={poll.id || index} {...poll} />
            ))}
          </div>
        )}
      </div>
      {polls.length > 0 && <div className="flex justify-between items-center w-full max-w-md mt-4">
        <Button
          disabled={pagination.page <= 1}
          onClick={() => setPagination((curr) => ({ ...curr, page: curr.page - 1 }))}
          className={`${
            pagination.page <= 1
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-[#80b1d3] text-black hover:bg-[#8ac8f5]"
          } transition duration-200 px-4 py-2 rounded-lg flex items-center`}
        >
          <ArrowBigLeft className="mr-2" />
          Prev
        </Button>
        <span className="text-sm text-gray-500">
          Page {pagination.page} of {totalPages}
        </span>
        <Button
          disabled={pagination.page >= totalPages}
          onClick={() => setPagination((curr) => ({ ...curr, page: curr.page + 1 }))}
          className={`${
            pagination.page === totalPages
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-[#80b1d3] text-black hover:bg-[#8ac8f5]"
          } transition duration-200 px-4 py-2 rounded-lg flex items-center`}
        >
          Next
          <ArrowBigRight className="ml-2" />
        </Button>
      </div>}
    </div>
  )
}

