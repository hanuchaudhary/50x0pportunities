import { useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import axios from "axios";
import { WEB_URL } from "@/Config";
import { toast } from "@/hooks/use-toast";
import LoadingButton from "@/components/LoadingButton";

const formSchema = z
  .object({
    newPassword: z.string().min(6, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function SetNewPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const userEmail = location.pathname.split("/")[2];
  const navigate = useNavigate();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await axios.put(`${WEB_URL}/api/v1/user/set-password`, {
        password: values.newPassword,
        email: userEmail,
      });
      if (response.status === 201) {
        toast({
          title: "Success",
          description: "Password has been reset successfully.",
        });
        navigate("/signin", { replace: true });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data.message,
      });
    }finally{
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl tracking-tighter text-green-500 font-[instrumental-regular]">
                Set new password
              </h1>
              <p className="text-gray-500 leading-none text-xs">
                Enter new password to reset your password and confirm it.
              </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <FormControl>
                          <Input
                            id="new-password"
                            placeholder="At least 6 characters"
                            type={showNewPassword ? "text" : "password"}
                            required
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          aria-label={
                            showNewPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <Label htmlFor="confirm-password">
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <FormControl>
                          <Input
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          aria-label={
                            showConfirmPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-center">
                  <div className="inline-block">
                    <LoadingButton
                      isLoading={isLoading}
                      loadingTitle="Setting..."
                      title="Set new password"
                      type="submit"
                      icon={<ArrowRight className="h-4 w-4" />}
                    />
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
      <div className="text-center pt-5 font-semibold text-sm">
        <span className="text-gray-500">Entered wrong email? </span>
        <Link
          to="/forgot-password"
          replace
          className="text-primary hover:underline text-green-500 transition-colors"
        >
          Go back
        </Link>
      </div>
    </div>
  );
}
