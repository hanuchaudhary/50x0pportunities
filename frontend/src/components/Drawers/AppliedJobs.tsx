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
import {  JobApplication } from "@/store/profileState";

interface appliedJobs {
  data: JobApplication[];
}

export default function AppliedJobs({ data }: appliedJobs) {
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
              {data.length > 0 ? (
                data.map((e) => {
                  console.log();
                  
                  return (
                    <ApplicationCard
                      key={e.id}
                      jobId={e.id}
                      title={e.title}
                      createdAt={e.createdAt}
                      description={e.job.description}
                      isOpen={e.job.isOpen}
                      location={e.job.location}
                      jobType={e.job.type}
                      status={e.status}
                      companyName={e.job.company.name}
                      companyLogo={e.job.company.logo}
                    />
                  );
                })
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
