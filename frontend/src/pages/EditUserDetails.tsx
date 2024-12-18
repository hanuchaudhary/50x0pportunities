import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Card, CardContent} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {  useNavigate } from "react-router-dom";
import axios from "axios";
import { WEB_URL } from "@/Config";
import useProfileStore, { getAuthHeaders } from "@/store/profileState";
import { editProfileValidation } from "@hanuchaudhary/job";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import LoadingButton from "@/components/LoadingButton";
import BackButton from "@/components/BackButton";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ACCEPTED_RESUME_TYPES = ["application/pdf"];

export default function EditUserDetails() {
  const { profile } = useProfileStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [resumeName, setResumeName] = useState<string | null>(null);
  const { Authorization } = getAuthHeaders();
  const form = useForm<z.infer<typeof editProfileValidation>>({
    resolver: zodResolver(editProfileValidation),
    defaultValues: {
      fullName: profile.fullName,
      skills: profile.skills,
      bio: profile.bio,
      experience: profile.experience,
      // education: profile.education || "",
    },
  });

  async function onSubmit(values: z.infer<typeof editProfileValidation>) {
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
    } finally {
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
    <div className="w-full pb-3 max-w-4xl px-2 mx-auto">
      <div className=" flex items-center justify-between">
        <BackButton href="/jobs" title="" replace={true} />
        <h1 className="text-3xl py-5 font-[instrumental-regular] tracking-tighter text-start">
          Update <span className="text-green-500">profile</span> details.
        </h1>
      </div>
      <Card className="shadow-none">
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
                          <Textarea
                            className="resize-none h-32"
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

                  <FormField
                    control={form.control}
                    name="education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Education</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your education level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="High School">
                              High School
                            </SelectItem>
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
              <div className="flex items-center justify-end">
                <LoadingButton
                  isLoading={isLoading}
                  loadingTitle="Saving..."
                  title="Save"
                  type="submit"
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
