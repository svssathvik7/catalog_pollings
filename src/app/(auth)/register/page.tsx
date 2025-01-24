"use client"

import registrar from "@/utils/registrar"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"

export default function Register() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const hasRegistered = await registrar(username)
    if (hasRegistered) {
      router.push("/login")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-cente py-12 px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Sign up to Catalog polls</CardTitle>
            <CardDescription>Register to create, vote, manage your polls...
            </CardDescription>
          </CardHeader>
            <form onSubmit={handleRegistration}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full"
                  autoComplete="off"
                />
              </div>
              </CardContent>
          <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing up..." : "Sign up"}
            </Button>
            <div className="text-sm text-center">
              Don&apos;t have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
                Sign in
              </Link>
            </div>
          </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

