"use client";

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
import { isValidFileType, isValidFileSize } from "@/utils/file-helpers";
import { Link } from "react-router-dom";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ACCEPTED_RESUME_TYPES = ["application/pdf"];

const formSchema = z.object({
  fullName: z
    .string()
    .min(2, {
      message: "Full name must be at least 2 characters.",
    })
    .max(50, {
      message: "Full name must not exceed 50 characters.",
    }),
  skills: z
    .string()
    .min(2, {
      message: "Skills must be at least 2 characters.",
    })
    .max(100, {
      message: "Skills must not exceed 100 characters.",
    }),
  photo: z
    .instanceof(File)
    .refine(
      (file) => isValidFileType(file, ACCEPTED_IMAGE_TYPES),
      "Invalid file type. Only JPEG, JPG, PNG, and WebP are allowed."
    )
    .refine(
      (file) => isValidFileSize(file, MAX_FILE_SIZE),
      "File size must be less than 5MB."
    ),
  resume: z
    .instanceof(File)
    .refine(
      (file) => isValidFileType(file, ACCEPTED_RESUME_TYPES),
      "Invalid file type. Only PDF is allowed."
    )
    .refine(
      (file) => isValidFileSize(file, MAX_FILE_SIZE),
      "File size must be less than 5MB."
    ),
  bio: z
    .string()
    .min(10, {
      message: "Bio must be at least 10 characters.",
    })
    .max(500, {
      message: "Bio must not exceed 500 characters.",
    }),
});

export default function EditUserDetails() {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [resumeName, setResumeName] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      skills: "",
      bio: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form values:", values);

    if (values.photo) {
      const photoUrl = await uploadToCloudinary(values.photo);
      console.log("Uploaded photo URL:", photoUrl);
    }

    if (values.resume) {
      console.log("Resume file to be uploaded:", values.resume.name);
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
      form.setValue("photo", file);
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
      <Link to={"/jobs"} replace={true}>
        <Button size={"sm"} variant={"outline"} className="my-2">
          Back
        </Button>
      </Link>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Edit User Details
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
                </div>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="photo"
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
              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

async function uploadToCloudinary(file: File): Promise<string> {
  // Implement Cloudinary upload logic here
  // This should be done securely, typically via your backend
  return "https://res.cloudinary.com/your-cloud-name/image/upload/your-image-public-id";
}
