import { useState } from "react";
import { State } from "country-state-city";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { WEB_URL } from "@/Config";
import { useNavigate } from "react-router-dom";
import { useFetchCompanies } from "@/hooks/FetchCompanies";
import { toast } from "@/hooks/use-toast";
import { getAuthHeaders } from "@/store/profileState";
import { CompanyDrawer } from "@/components/CreateCompany";

export default function JobPostingForm() {
  const { companies } = useFetchCompanies();
  const { Authorization } = getAuthHeaders();
  const navigate = useNavigate();
  const mdStr = `# Requirements`;
  const [requirement, setRequirement] = useState(mdStr);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    title: "",
    description: "",
    location: "",
    type: "",
    companyId: "",
    isOpen: true,
  });

  const data = { ...values, requirement };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (
      !values.title ||
      !values.description ||
      !values.location ||
      !values.type ||
      !values.companyId
    ) {
      toast({
        title: "Error",
        description: "Please fill out all fields.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const ress = await axios.post(`${WEB_URL}/api/v1/job/create`, data, {
        headers: {
          Authorization,
        },
      });
      console.log(ress);

      setValues({
        title: "",
        description: "",
        location: "",
        type: "",
        companyId: "",
        isOpen: false,
      });
      setRequirement(mdStr);
      toast({
        title: "Success",
        description: "Job posted successfully!",
      });
      navigate("/jobs");
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
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 mx-auto pt-28">
        <h1 className="text-center text-3xl font-bold mb-3 md:mb-6">
          Post Job
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
            <div>
              <Label htmlFor="job-title">Job Title</Label>
              <Input
                id="job-title"
                value={values.title}
                onChange={(e) =>
                  setValues({ ...values, title: e.target.value })
                }
                placeholder="Enter the title"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Select
                value={values.location}
                onValueChange={(value) =>
                  setValues({ ...values, location: value })
                }
              >
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {State.getStatesOfCountry("IN").map((item) => (
                    <SelectItem key={item.isoCode} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="job-description">Job Description</Label>
            <Textarea
              id="job-description"
              value={values.description}
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
              placeholder="Enter description"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="job-type">Job Type</Label>
              <Select
                value={values.type}
                onValueChange={(value) => setValues({ ...values, type: value })}
              >
                <SelectTrigger id="job-type">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onsite">On Site</SelectItem>
                  <SelectItem value="workfromhome">Work From Home</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="job-status">Job Status</Label>
              <Select
                value={String(values.isOpen)}
                onValueChange={(value) =>
                  setValues({ ...values, isOpen: value === "true" })
                }
              >
                <SelectTrigger id="job-status">
                  <SelectValue placeholder="Job Open" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Open</SelectItem>
                  <SelectItem value="false">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="company">Company</Label>
              <Select
                value={values.companyId}
                onValueChange={(value) =>
                  setValues({ ...values, companyId: value })
                }
              >
                <SelectTrigger id="company">
                  <SelectValue placeholder="Select Company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end w-full">
              <CompanyDrawer />
            </div>
          </div>

          <div>
            <Label htmlFor="requirements">Requirements</Label>
            <MarkdownEditor
              theme="dark"
              id="requirements"
              value={requirement}
              height="200px"
              onChange={(value) => setRequirement(value)}
            />
          </div>
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto"
            >
              {loading ? "Creating..." : "Create Job"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


