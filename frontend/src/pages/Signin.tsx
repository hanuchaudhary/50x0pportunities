import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { WEB_URL } from "@/Config";
import { toast } from "@/hooks/use-toast";
import { signinValidation } from "@hanuchaudhary/job";
import LoadingButton from "@/components/LoadingButton";

type SigninValues = z.infer<typeof signinValidation>;

export default function SigninPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<SigninValues>({
    resolver: zodResolver(signinValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  async function onSubmit(values: SigninValues) {
    try {
      setLoading(true);
      const response = await axios.post(
        `${WEB_URL}/api/v1/user/signin`,
        values
      );
      localStorage.setItem("token", `${response.data.token}`);
      localStorage.setItem("role", response.data.user.role);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      toast({
        title: "Success!",
        description: "You have signed in successfully! Redirecting...",
        variant: "success",
      });
      if (response.data.user.role === "Candidate") {
        navigate("/jobs");
      } else {
        navigate("/jobs");
      }
    } catch (err: any) {
      toast({
        title: "Error!",
        description:
          err.response?.data?.message ||
          "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-background flex items-center flex-col justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center text-4xl py-4">
        <span className="font-[instrument-regular] text-neutral-500 tracking-tighter leading-none">
          Welcome back!
        </span>
        <br />
        <span className="font-[instrument-regular] tracking-tighter leading-none">
          Login to your <span className="text-green-500">account.</span>
        </span>
      </div>
      <Card className="w-full relative max-w-sm">
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
                        placeholder="kushchaudhary@example.com"
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
                          placeholder="••••••••"
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
              <Link to={"/forgot-password"}>
                <h1 className="font-semibold text-right text-sm text-neutral-500 hover:underline">Forgot Password?</h1>
              </Link>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
            <div className="flex justify-center">
                  <div className="inline-block">
                    <LoadingButton
                      isLoading={loading}
                      loadingTitle="Logging in..."
                      title="Login"
                      type="submit"
                      icon={<ArrowRight className="h-4 w-4"/>}
                    />
                  </div>
                </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <div className="text-sm font-semibold py-2 text-center">
        Don't have an account?{" "}
        <Button
          type="button"
          variant="link"
          className="p-0 h-auto hover:underline text-green-500 transition-colors"
          onClick={() => navigate("/signup",{replace:true})}
        >
          Create One!
        </Button>
      </div>
    </div>
  );
}
