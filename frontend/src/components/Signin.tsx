import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { WEB_URL } from "@/Config";
import { useNavigate } from "react-router-dom";

interface signinTypes {
  email: string;
  password: string;
}

export default function SigninPage({
  onClick,
  handleClose,
}: {
  onClick: () => void;
  handleClose: () => void;
}) {
  const [values, setValues] = useState<signinTypes>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  async function handleSubmit() {
    if (!values.email || !values.password) {
      setError("All fields are required.");
      return;
    }
    if (values.password.length < 6) {
      setError("Password Must have 6 Characters");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(`${WEB_URL}/api/v1/user/signin`, values);
      setLoading(false);
      localStorage.setItem("token", `Bearer ${response.data.token}`);
      localStorage.setItem("role", response.data.user.role);
      if (response.data.user.role === "Candidate") {
        navigate("/jobs");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-80 px-3 md:p-0">
      <Card className="w-full max-w-md">
        <div onClick={handleClose} className="fixed p-2 cursor-pointer">
          <X />
        </div>
        <h1 className="text-center py-2 md:py-6 text-2xl font-semibold">Sign In</h1>
        <CardHeader className="space-y-1">
          <CardDescription className="text-center">
            Enter your information to sign in
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
        <p className="text-red-900 bg-red-300 rounded-sm font-semibold text-center">
              {error}
            </p>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              placeholder="john@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={values.password}
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} className="w-full" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </CardFooter>
        <CardFooter>
          <div onClick={onClick} className="text-sm text-center w-full">
            Don't have an Account?{" "}
            <span className="text-blue-500 underline font-semibold cursor-pointer">
              Sign up
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
