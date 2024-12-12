import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { WEB_URL } from "@/Config";
import { toast } from "@/hooks/use-toast";
import LoadingButton from "@/components/LoadingButton";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${WEB_URL}/api/v1/user/forgot-password`,
        {
          email: values.email,
        }
      );
      if (response.status === 201) {
        navigate(`/set-password/${values.email}`, { replace: true });
      }
    } catch (error: AxiosError | any) {
      toast({
        title: "Error",
        description: error.response?.data.message,
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-[instrumental-regular] tracking-tighter text-green-500">
                Forgot Password
              </h1>
              <p className="text-neutral-500 leading-tight text-sm">
                Enter your email to reset your password, we first need to verify
                your email.
              </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder="you@youremail.com"
                          type="email"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center">
                  <div className="inline-block">
                    <LoadingButton
                      isLoading={isLoading}
                      loadingTitle="Checking..."
                      title="Next"
                      type="submit"
                      icon={<ArrowRight className="h-4 w-4"/>}
                    />
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
      <div className="text-center pt-5 font-semibold text-sm">
        <span className="text-neutral-500">Remember password? </span>
        <Link replace to={"/signin"} className="text-green-500 hover:underline">
          Log In
        </Link>
      </div>
    </div>
  );
}
