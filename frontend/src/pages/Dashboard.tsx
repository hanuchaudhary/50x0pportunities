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
import Navbar from "@/components/Navbar";
import axios from "axios";
import { WEB_URL } from "@/Config";
import { useNavigate } from "react-router-dom";
import { useFetchCompanies } from "@/hooks/FetchCompanies";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default function JobPostingForm() {
  const { companies } = useFetchCompanies();
  const navigate = useNavigate();
  const mdStr = `# This is a H1  \n## This is a H2  \n###### This is a H6`;
  const [requirement, setRequirement] = useState(mdStr);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
    setError("");

    if (
      !values.title ||
      !values.description ||
      !values.location ||
      !values.type ||
      !values.companyId
    ) {
      setError("Please fill out all fields.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token")?.split(" ")[1];
      await axios.post(`${WEB_URL}/api/v1/job/create`, data, {
        headers: {
          Authorization: token,
        },
      });

      setValues({
        title: "",
        description: "",
        location: "",
        type: "",
        companyId: "",
        isOpen: false,
      });
      setRequirement(mdStr);
      navigate("/jobs");
    } catch (error) {
      console.error(error);
      setError("Failed to create job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container px-4 mx-auto pt-28">
        <h1 className="text-center text-3xl font-bold mb-6">Post Job</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

function CompanyDrawer() {
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleCreateCompany = async () => {
    try {
      if (!name || !logo) {
        setError("Please fill out all fields.");
        return;
      }
      setLoading(true);
      const token = localStorage.getItem("token")?.split(" ")[1];
      const response = await axios.post(
        `${WEB_URL}/api/v1/company/create`,
        { name: name, logo: logo },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setLoading(false);

      setLogo("");
      setName("");
      setError("");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="w-full">Create a new Company</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add a New Company</DrawerTitle>
          <DrawerDescription>
            Please fill out all fields to create a new company.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 py-2 flex flex-col gap-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <Label htmlFor="company-name">Company Name</Label>
            <Input
              id="company-name"
              placeholder="Enter company name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="logo-url">Company Logo URL</Label>
            <Input
              id="logo-url"
              placeholder="Enter logo URL (PNG format preferred)"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
            />
          </div>
        </div>
        <DrawerFooter>
          <Button onClick={handleCreateCompany} disabled={loading} className="w-full">
            {loading ? "Create Company..." : "Create Company"}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
