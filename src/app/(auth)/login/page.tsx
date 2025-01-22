"use client"

import { useAuthStore } from "@/store/authStore"
import authenticator from "@/utils/authenticator"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {motion} from "framer-motion"

export default function Login() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const authStore = useAuthStore()
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const hasLoggedIn = await authenticator(username)
    if (hasLoggedIn) {
      router.back()
      authStore.login(username)
      setUsername("")
    }
    setLoading(false)
  }

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="min-h-screen flex items-center justify-cente py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign in to your account</CardTitle>
          <CardDescription className="text-center text-sm">
            Login to access, vote, manage your polls...
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
            <div className="text-sm text-center">
              Don't have an account?{" "}
              <Link href="/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
                Sign Up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}

