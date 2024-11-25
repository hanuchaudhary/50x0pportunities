import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { WEB_URL } from "@/Config";
import { getAuthHeaders } from "@/store/profileState";
import { editProfileSchema } from "@/lib/validations";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ACCEPTED_RESUME_TYPES = ["application/pdf"];

export default function EditUserDetails() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [resumeName, setResumeName] = useState<string | null>(null);
  const { Authorization } = getAuthHeaders();
  const form = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: "",
      skills: "",
      bio: "",
      experience: "",
    },
  });

  async function onSubmit(values: z.infer<typeof editProfileSchema>) {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("fullName", values.fullName);
      formData.append("skills", values.skills);
      formData.append("bio", values.bio);
      formData.append("education", values.education);
      formData.append("experience", values.experience);

      if (values.avatar) {
        const avatarUrl = await uploadToCloudinary(
          values.avatar,
          "avatar_preset"
        );
        formData.append("avatarURL", avatarUrl);
      }

      if (values.resume) {
        const resumeUrl = await uploadToCloudinary(
          values.resume,
          "resume_preset"
        );
        formData.append("resumeURL", resumeUrl);
      }

      const response = await axios.put(
        `${WEB_URL}/api/v1/user/update-profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization,
          },
        }
      );
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
        variant: "success",
      });
      navigate("/profile");
      console.log("Response:", response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating your profile.",
        variant: "destructive",
      });
      console.error("Error submitting form:", error);
    }finally {
      setIsLoading(false);
    } 
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("avatar", file);
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeName(file.name);
      form.setValue("resume", file);
    }
  };

  return (
    <div className="mt-24 w-full max-w-4xl mx-auto">
      <Link to="/profile" replace={true}>
        <Button size="sm" variant="outline" className="my-2">
          Back
        </Button>
      </Link>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Update Profile Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormDescription>
                          Your full name as you'd like it to appear.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skills</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="JavaScript, React, Node.js"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          List your key skills, separated by commas.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us a little about yourself..."
                            className="resize-none h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A brief description about yourself and your
                          experience.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience</FormLabel>
                        <FormControl>
                          <Input placeholder="2 years" {...field} />
                        </FormControl>
                        <FormDescription>
                          How many years of experience do you have?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="avatar"
                    render={() => (
                      <FormItem>
                        <FormLabel>Profile Photo</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-4">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                              {photoPreview ? (
                                <img
                                  src={photoPreview}
                                  alt="Profile preview"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-4xl text-gray-400">
                                  👤
                                </span>
                              )}
                            </div>
                            <Input
                              type="file"
                              accept={ACCEPTED_IMAGE_TYPES.join(",")}
                              onChange={handlePhotoChange}
                              className="flex-1"
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Upload a profile picture (JPEG, JPG, PNG, or WebP, max
                          5MB).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Education</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your education level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="High School">High School</SelectItem>
                            <SelectItem value="Bachelors">Bachelors</SelectItem>
                            <SelectItem value="Masters">Masters</SelectItem>
                            <SelectItem value="Doctorate">Doctorate</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          What is your highest level of education?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="resume"
                    render={() => (
                      <FormItem>
                        <FormLabel>Resume</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-4">
                            <Input
                              type="file"
                              accept={ACCEPTED_RESUME_TYPES.join(",")}
                              onChange={handleResumeChange}
                              className="flex-1"
                            />
                            {resumeName && (
                              <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                                {resumeName}
                              </span>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Upload your resume (PDF only, max 5MB).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator />
              <Button disabled={isLoading} type="submit" className="w-full">
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

