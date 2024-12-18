import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { State } from "country-state-city";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAuthHeaders } from "@/store/profileState";
import { WEB_URL } from "@/Config";
import { CompanyDrawer } from "@/components/CreateCompany";
import { useNavigate } from "react-router-dom";
import { useCompaniesStore } from "@/store/companiesState";

import LoadingButton from "@/components/LoadingButton";
import { Separator } from "@/components/ui/separator";
import BackButton from "@/components/BackButton";
import { jobValidation } from "@hanuchaudhary/job";

import ReactQuill from "react-quill";

import "@/lib/quill-custom.css";

enum JobType {
  FullTime = "FullTime",
  PartTime = "Part Time",
  Contract = "Contract",
  Internship = "Internship",
  Temporary = "Temporary",
  Volunteer = "Volunteer",
  Remote = "Remote",
  Freelance = "Freelance",
  Apprenticeship = "Apprenticeship",
  Seasonal = "Seasonal",
  Other = "Other",
}

export default function Dashboard() {
  const modules = {
    toolbar: {
      container: [
        [{ header: [2, 3, 4, false] }],
        ["bold", "italic", "underline", "blockquote"],
        [{ color: [] }],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "image"],
        ["clean"],
      ],
    },
    clipboard: {
      matchVisual: true,
    },
  };
  const formats = [
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "header",
    "blockquote",
    "code-block",
    "indent",
    "list",
    "direction",
    "align",
    "link",
    "image",
    "video",
    "formula",
  ];

  const { companies, fetchCompanies } = useCompaniesStore();

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof jobValidation>>({
    resolver: zodResolver(jobValidation),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      position: "",
      companyId: "",
      isOpen: true,
      requirement: "# Requirements",
      salaryFrom: "",
      salaryTo: "",
      skills: "",
      experience: "5",
    },
  });

  async function onSubmit(values: z.infer<typeof jobValidation>) {
    setLoading(true);
    try {
      await axios.post(`${WEB_URL}/api/v1/job/create`, values, {
        headers: { Authorization: getAuthHeaders().Authorization },
      });
      toast({
        title: "Success",
        description: "Congratulations! Job created successfully.",
      });
      console.log(values);
      navigate("/jobs", { replace: true });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to create job.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const theme = localStorage.getItem("theme");

  return (
    <div className="container max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-4">
        <BackButton href="/jobs" title="Jobs" replace={true} />
      </div>

      <h1 className="text-3xl font-[instrumental-regular] tracking-tighter text-center mb-8">
        Create a New <span className="text-green-500">Job Posting.</span>
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2">
                  <FormLabel className="text-left sm:col-span-1">
                    Job Title
                  </FormLabel>
                  <FormControl className="sm:col-span-3">
                    <Input placeholder="Enter the job title" {...field} />
                  </FormControl>
                  <FormDescription className="sm:col-start-2 sm:col-span-3">
                    Be specific and include the job role in the title.
                  </FormDescription>
                  <FormMessage className="sm:col-start-2 sm:col-span-3" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2">
                  <FormLabel className="text-left sm:col-span-1">
                    Location
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="sm:col-span-3">
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {State.getStatesOfCountry("IN").map((item) => (
                        <SelectItem key={item.isoCode} value={item.name}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="sm:col-start-2 sm:col-span-3">
                    Select the state where the job is located.
                  </FormDescription>
                  <FormMessage className="sm:col-start-2 sm:col-span-3" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2">
                  <FormLabel className="text-left sm:col-span-1 pt-2">
                    Job Description
                  </FormLabel>
                  <FormControl className="sm:col-span-3">
                    <Textarea
                      placeholder="Enter job description"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="sm:col-start-2 sm:col-span-3">
                    Describe the job role and responsibilities in brief.
                  </FormDescription>
                  <FormMessage className="sm:col-start-2 sm:col-span-3" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobType"
              render={({ field }) => (
                <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2">
                  <FormLabel className="text-left sm:col-span-1">
                    Job Type
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="sm:col-span-3">
                        <SelectValue placeholder="Select Job Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(JobType).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="sm:col-start-2 sm:col-span-3">
                    Select the type of job you are posting.
                  </FormDescription>
                  <FormMessage className="sm:col-start-2 sm:col-span-3" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2">
                  <FormLabel className="text-left sm:col-span-1">
                    Job Position
                  </FormLabel>
                  <FormControl className="sm:col-span-3">
                    <Input placeholder="Data Scientist" {...field} />
                  </FormControl>
                  <FormDescription className="sm:col-start-2 sm:col-span-3">
                    Specify the position or job role.
                  </FormDescription>
                  <FormMessage className="sm:col-start-2 sm:col-span-3" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isOpen"
              render={({ field }) => (
                <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2">
                  <FormLabel className="text-left sm:col-span-1">
                    Job Status
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === "true")}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger className="sm:col-span-3">
                        <SelectValue placeholder="Select Job Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Open</SelectItem>
                      <SelectItem value="false">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="sm:col-start-2 sm:col-span-3">
                    Select the status of the job posting.
                  </FormDescription>
                  <FormMessage className="sm:col-start-2 sm:col-span-3" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyId"
              render={({ field }) => (
                <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2">
                  <FormLabel className="text-left sm:col-span-1">
                    Company
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="sm:col-span-3">
                        <SelectValue placeholder="Select Company" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companies.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="sm:col-start-2 sm:col-span-3">
                    Select the company where the job is posted.
                  </FormDescription>
                  <FormMessage className="sm:col-start-2 sm:col-span-3" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2">
              <div className="sm:col-span-3">
                <CompanyDrawer />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2">
              <FormLabel className="text-left sm:col-span-1">
                Salary Range
              </FormLabel>
              <div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="salaryFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Minimum salary"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the minimum salary for the job.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="salaryTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Maximum salary"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the maximum salary for the job.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2">
                  <FormLabel className="text-left sm:col-span-1">
                    Skills Needed
                  </FormLabel>
                  <FormControl className="sm:col-span-3">
                    <Input
                      placeholder="Enter required skills (comma-separated)"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="sm:col-start-2 sm:col-span-3">
                    Enter the skills required for the job.
                  </FormDescription>
                  <FormMessage className="sm:col-start-2 sm:col-span-3" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2">
                  <FormLabel className="text-left sm:col-span-1">
                    Experience (years)
                  </FormLabel>
                  <FormControl className="sm:col-span-3">
                    <Input
                      placeholder="Required years of experience"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="sm:col-start-2 sm:col-span-3">
                    Enter the minimum years of experience required.
                  </FormDescription>
                  <FormMessage className="sm:col-start-2 sm:col-span-3" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requirement"
              render={({ field }) => (
                <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2">
                  <FormLabel className="text-left sm:col-span-1 pt-2">
                    Requirements
                  </FormLabel>
                  <div className="col-span-1 sm:col-span-3">
                    <FormControl>
                      <ReactQuill
                        style={{
                          backgroundColor:
                            theme === "dark" ? "#262626" : "white",
                          color: "white",
                          borderRadius: "20px",
                          paddingBottom: "40px",
                        }}
                        placeholder="Enter job requirements"
                        className="h-96"
                        {...field}
                        theme="snow"
                        modules={modules}
                        formats={formats}
                      />
                    </FormControl>
                    <FormDescription className="sm:col-start-2 sm:col-span-3">
                      Describe the requirements for the job.
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <div className="flex justify-end mt-8">
            <LoadingButton
              isLoading={loading}
              loadingTitle="Creating..."
              title="Create Job"
              type="submit"
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
