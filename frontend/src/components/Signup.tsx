import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { WEB_URL } from "@/Config";

interface signupTypes {
  fullName: string;
  password: string;
  email: string;
}

export default function SignupPage({
  onClick,
  handleClose,
}: {
  onClick: () => void;
  handleClose: () => void;
}) {
  const [signupValues, setSignupValues] = useState<signupTypes>({
    fullName: "",
    password: "",
    email: "",
  });
  const [role, setRole] = useState("Candidate");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); 

  async function handleSubmit() {
    if (!signupValues.fullName || !signupValues.email || !signupValues.password) {
      setError("All fields are required.");
      return;
    }

    if (signupValues.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true); 
      setError(""); 

      const data = { ...signupValues, role };
      const response = await axios.post(`${WEB_URL}/api/v1/user/signup`, data);
      localStorage.setItem("token", `Bearer ${response.data.token}`);

    } catch (error: any) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false); 
    }
  }

  return (
    <div
      className={`min-h-screen px-3 md:p-0 flex items-center justify-center bg-black bg-opacity-80`}
    >
      <Card className="w-full max-w-md">
        <div onClick={handleClose} className="x p-2 fixed cursor-pointer">
          <X />
        </div>
        <h1 className="text-center py-6 text-2xl font-semibold">Sign Up</h1>
        <CardHeader className="space-y-1">
          <CardDescription className="text-center">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-red-500 text-center">{error}</p>}

          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                value={signupValues.fullName}
                onChange={(e) =>
                  setSignupValues({ ...signupValues, fullName: e.target.value })
                }
                id="name"
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Select Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="w-40">
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
              value={signupValues.email}
              onChange={(e) =>
                setSignupValues({ ...signupValues, email: e.target.value })
              }
              id="email"
              type="email"
              placeholder="john@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              value={signupValues.password}
              onChange={(e) =>
                setSignupValues({ ...signupValues, password: e.target.value })
              }
              id="password"
              type="password"
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </CardFooter>
        <CardFooter>
          <div onClick={onClick} className="text-sm text-center w-full">
            Already have an Account?{" "}
            <span className="text-blue-500 underline font-semibold cursor-pointer">
              Sign In
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
