import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { X } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { WEB_URL } from "@/Config"
import { toast } from "@/hooks/use-toast"

interface SigninTypes {
  email: string
  password: string
}

export default function SigninPage() {
  const [values, setValues] = useState<SigninTypes>({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit() {
    if (!values.email || !values.password) {
      toast({
        title: "Oops!",
        description: "All fields are required. Please fill them out.",
        variant: "destructive"
      })
      return
    }
    if (values.password.length < 6) {
      toast({
        title: "Hold on!",
        description: "Your password must have at least 6 characters.",
        variant: "destructive"
      })
      return
    }
    try {
      setLoading(true)
      const response = await axios.post(`${WEB_URL}/api/v1/user/signin`, values)
      localStorage.setItem("token", `Bearer ${response.data.token}`)
      localStorage.setItem("role", response.data.user.role)
      toast({
        title: "Success!",
        description: "You have signed in successfully! Redirecting...",
        variant: "success"
      })
      if (response.data.user.role === "Candidate") {
        navigate("/jobs")
      } else {
        navigate("/dashboard")
      }
    } catch (err: any) {
      setLoading(false)
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
        <Link to={"/"} className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-gray-100"
            onClick={() => navigate("/")}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </Link>
        <CardHeader className="space-y-1 pt-6">
          <h1 className="text-2xl font-bold tracking-tight text-center">Sign In</h1>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={values.password}
              onChange={(e) => setValues({ ...values, password: e.target.value })}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            className="w-full"
            onClick={handleSubmit}
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
      </Card>
    </div>
  )
}
