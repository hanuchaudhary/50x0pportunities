'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { X } from 'lucide-react'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { WEB_URL } from "@/Config"
import { toast } from "@/hooks/use-toast"
import { signinValidation } from "@/lib/validations"

type SigninValues = z.infer<typeof signinValidation>

export default function SigninPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const form = useForm<SigninValues>({
    resolver: zodResolver(signinValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: SigninValues) {
    try {
      setLoading(true)
      const response = await axios.post(`${WEB_URL}/api/v1/user/signin`, values)
      localStorage.setItem("token", `${response.data.token}`)
      localStorage.setItem("role", response.data.user.role)
      toast({
        title: "Success!",
        description: "You have signed in successfully! Redirecting...",
        variant: "success"
      })
      if (response.data.user.role === "Candidate") {
        navigate("/profile")
      } else {
        navigate("/profile")
      }
    } catch (err: any) {
      toast({
        title: "Error!",
        description: err.response?.data?.message || "An unexpected error occurred. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="w-full relative max-w-md">
        <Link to="/" className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-gray-100"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </Link>
        <CardHeader className="space-y-1 pt-6">
          <CardTitle className="text-2xl font-bold tracking-tight ">Sign In</CardTitle>
          <CardDescription className="">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 pt-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
              <div className="text-sm text-center">
                Don't have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold"
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}

