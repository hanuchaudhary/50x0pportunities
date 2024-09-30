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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import axios from "axios";
import { WEB_URL } from "@/Config";
import { useParams } from "react-router-dom";

const ApplyForJob = ({
  companyName,
  jobTitle,
}: {
  companyName: string;
  jobTitle: string;
}) => {
  const [values, setValues] = useState({
    education: "",
    experience: "",
    skills: "",
    resume: "",
  });
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token")?.split(" ")[1];

  const handleSubmitApplication = async () => {
    try {
      setLoading(true);
      await axios.post(
        `${WEB_URL}/api/v1/user/application/${id}`,
        values,
        { headers: { Authorization: token } }
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(true);
    }
  };

  return (
    <div>
      <Drawer>
        <DrawerTrigger asChild>
          <div className="flex justify-center py-4">
            <Button className="w-full">Apply For This Job</Button>
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              Apply at {companyName} for {jobTitle}
            </DrawerTitle>
            <DrawerDescription>Please fill the form below</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 flex flex-col gap-4">
            <Input
              value={values.experience}
              onChange={(e) =>
                setValues({ ...values, experience: e.target.value })
              }
              placeholder="Years of experience"
            />
            <Input
              value={values.skills}
              onChange={(e) => setValues({ ...values, skills: e.target.value })}
              placeholder="Skill (Comma seperated)"
            />
            <div>
              <RadioGroup
                defaultValue="intermediate"
                value={values.education}
                onValueChange={(value) =>
                  setValues({ ...values, education: value })
                }
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
            <div>
              <Label>Resume</Label>
              <Input
                value={values.resume}
                onChange={(e) =>
                  setValues({ ...values, resume: e.target.value })
                }
              />
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={handleSubmitApplication}>
              {loading ? "Applying..." : "Apply"}
            </Button>
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default ApplyForJob;
