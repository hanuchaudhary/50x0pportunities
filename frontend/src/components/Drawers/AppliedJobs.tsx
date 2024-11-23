import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import ApplicationCard from "../ApplicationCard";
import { Job } from "@/store/profileState";

export default function AppliedJobs({appliedJobs}) {
  console.log(appliedJobs);
  
  return (
    <div>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" className="w-full">
            Applied Jobs
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full">
            <DrawerHeader>
              <DrawerTitle>Applied Jobs</DrawerTitle>
              <DrawerDescription>
                Here are the job applications that you applied for.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-4 max-h-[60vh] my-2 overflow-y-auto custom-scrollbar">
              {appliedJobs.length > 0 ? (
                appliedJobs.map((e) => (
                  <ApplicationCard
                    key={e.id}
                    title={e.title}
                    description={e.description}
                    createdAt={e.createdAt}
                    isOpen={e.isOpen}
                    status={"Rejected"}
                    companyName={e.company.name}
                    companyLogo={e.company.logo}
                    location={e.location}
                    jobId={e.id}
                    jobType={e.type}
                  />
                ))
              ) : (
                <div>NoT applied Yet</div>
              )}
            </div>
            <div className="w-full flex items-center justify-center">
              <DrawerClose>
                <Button variant="outline" className="w-full mb-2">
                  Close
                </Button>
              </DrawerClose>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
