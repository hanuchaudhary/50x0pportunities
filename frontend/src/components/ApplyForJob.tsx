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

const ApplyForJob = ({
  companyName,
  jobTitle,
}: {
  companyName: string;
  jobTitle: string;
}) => {
  return (
    <div>
      <Drawer>
        <DrawerTrigger>
          <div className="flex justify-center">
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
            <Input placeholder="Years of experience" />
            <Input placeholder="Skill (Comma seperated)" />
            <div>
              <RadioGroup defaultValue="intermediate">
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
              <Input type="file"  />
            </div>
          </div>
          <DrawerFooter>
            <Button>Apply</Button>
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
