import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

import { WEB_URL } from "@/Config";
import { signupValidation } from "@hanuchaudhary/job";
import LoadingButton from "@/components/LoadingButton";

type SignupValues = z.infer<typeof signupValidation>;

export default function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  async function onSubmit(values: SignupValues) {
    try {
      setLoading(true);
      const response = await axios.post(
        `${WEB_URL}/api/v1/user/signup`,
        values
      );
      localStorage.setItem("token", `Bearer ${response.data.token}`);
      localStorage.setItem("role", response.data.user.role);
      toast({
        title: "Success!",
        description: "You have signed up successfully! Redirecting...",
        variant: "success",
      });
      if (response.data.user.role === "Candidate") {
        navigate("/profile");
      } else {
        navigate("/profile");
      }
    } catch (error: any) {
      toast({
        title: "Error!",
        description:
          error.response?.data?.message ||
          "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center flex-col bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center text-4xl py-4">
        <span className="font-[instrument-regular] tracking-tighter leading-none">
          Sign up & create your <span className="text-green-500">profile.</span>
        </span>
      </div>
      <Card className="w-full max-w-sm shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="kushchaudharyog@example.com"
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
                      <div className="relative">
                        <Input
                          className="h-full w-full"
                          type={showPassword ? "text" : "password"}
                          placeholder="At Least 6 Characters"
                          {...field}
                        ></Input>
                        <div
                          className="absolute text-neutral-500 cursor-pointer top-2 right-2"
                          onClick={togglePassword}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Candidate">Candidate</SelectItem>
                        <SelectItem value="Recruiter">Recruiter</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
            <div className="flex justify-center">
                  <div className="inline-block">
                    <LoadingButton
                      isLoading={loading}
                      loadingTitle="Creating..."
                      title="Create Profile"
                      type="submit"
                      icon={<ArrowRight className="h-4 w-4"/>}
                    />
                  </div>
                </div>
              <p className="text-center w-72 text-xs dark:text-neutral-300 text-neutral-700">
                By clicking{" "}
                <span className="font-semibold">"Create Profile"</span> you
                agree to our Code of Conduct, Terms of Service and Privacy
                Policy.
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <div className="py-2">
        <p className="text-sm font-semibold text-center">
          Already have a profile?{" "}
          <Link
            replace
            to="/signin"
            className="text-primary hover:underline text-green-500 transition-colors font-semibold"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
