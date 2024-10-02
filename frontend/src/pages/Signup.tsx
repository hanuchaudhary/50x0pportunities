import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { WEB_URL } from "@/Config";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface SignupValues {
  fullName: string;
  password: string;
  email: string;
}

export default function SignupPage() {
  const navigate = useNavigate();
  const [signupValues, setSignupValues] = useState<SignupValues>({
    fullName: "",
    password: "",
    email: "",
  });
  const [role, setRole] = useState("Candidate");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (
      !signupValues.fullName ||
      !signupValues.email ||
      !signupValues.password
    ) {
      toast({
        title: "Oops!",
        description: "Looks like you're missing some information. Please fill out all fields.",
        variant: "destructive" 
      });
      return;
    }

    if (signupValues.password.length < 6) {
      toast({
        title: "Hold on!",
        description: "Your password is a bit short. Make sure it's at least 6 characters long!",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const data = { ...signupValues, role };
      const response = await axios.post(`${WEB_URL}/api/v1/user/signup`, data);
      localStorage.setItem("token", `Bearer ${response.data.token}`);
      localStorage.setItem("role", response.data.user.role);
      toast({
        title: "Success!",
        description: "You have signed up successfully! Redirecting...",
        variant: "success"
      });
      if (response.data.user.role === "Candidate") {
        navigate("/jobs");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error!",
        description: error.response?.data?.message || "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-semibold">Sign Up</CardTitle>
            <Link to={"/"}>
              <Button variant="ghost" size="icon" className="rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={signupValues.fullName}
                onChange={(e) =>
                  setSignupValues({ ...signupValues, fullName: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Select Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Candidate">Candidate</SelectItem>
                  <SelectItem value="Recruiter">Recruiter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={signupValues.email}
              onChange={(e) =>
                setSignupValues({ ...signupValues, email: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={signupValues.password}
              onChange={(e) =>
                setSignupValues({ ...signupValues, password: e.target.value })
              }
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button onClick={handleSubmit} className="w-full" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link
              to={"/signin"}
              className="text-primary hover:underline font-semibold"
            >
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
