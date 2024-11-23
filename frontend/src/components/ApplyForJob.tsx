import { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

import { WEB_URL } from "@/Config";
import { useParams } from "react-router-dom";
import { getAuthHeaders } from "@/store/profileState";

interface ApplyForJobProps {
  companyName: string;
  jobTitle: string;
}

interface ApplicationValues {
  education: string;
  experience: string;
  skills: string;
  resume: string;
}

const ApplyForJob: React.FC<ApplyForJobProps> = ({ companyName, jobTitle }) => {
  const [values, setValues] = useState<ApplicationValues>({
    education: "intermediate",
    experience: "",
    skills: "",
    resume: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const { toast } = useToast();
  const { Authorization } = getAuthHeaders();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmitApplication = async () => {
    if (!values.experience || !values.skills || !values.resume) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${WEB_URL}/api/v1/user/application/${id}`,
        values,
        {
          headers: { Authorization },
        }
      );

      if (response.status === 201) {
        setSuccess(true);
        toast({
          title: "Application Submitted",
          description: "Your application has been successfully submitted.",
          variant: "success",
        });
        setOpen(false);
      }
    } catch (error) {
      toast({
        title: "Application Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="w-full">Apply For This Job</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>
            Apply at {companyName} for {jobTitle}
          </DrawerTitle>
          <DrawerDescription>
            Please fill in the form below to submit your application
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 py-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="experience">Years of Experience</Label>
            <Input
              id="experience"
              name="experience"
              value={values.experience}
              onChange={handleInputChange}
              placeholder="e.g., 3"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="skills">Skills</Label>
            <Input
              id="skills"
              name="skills"
              value={values.skills}
              onChange={handleInputChange}
              placeholder="e.g., JavaScript, React, Node.js"
            />
          </div>
          <div className="space-y-2">
            <Label>Education Level</Label>
            <RadioGroup
              value={values.education}
              onValueChange={(value) =>
                setValues({ ...values, education: value })
              }
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="intermediate" id="intermediate" />
                <Label htmlFor="intermediate">Intermediate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="graduate" id="graduate" />
                <Label htmlFor="graduate">Graduate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="post-graduate" id="post-graduate" />
                <Label htmlFor="post-graduate">Post-Graduate</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="resume">Resume Link</Label>
            <Input
              id="resume"
              name="resume"
              value={values.resume}
              onChange={handleInputChange}
              placeholder="https://example.com/your-resume.pdf"
            />
          </div>
        </div>
        <DrawerFooter>
          <Button
            onClick={handleSubmitApplication}
            disabled={loading || success}
          >
            {loading
              ? "Applying..."
              : success
              ? "Applied"
              : "Submit Application"}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ApplyForJob;
