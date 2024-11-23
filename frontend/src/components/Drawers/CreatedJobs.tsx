import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer";
import CreatedJobCard from "../CreatedJobCard";
import { Button } from "../ui/button";
import { Job } from "@/store/profileState";

interface createdJobs{
  data : Job[]
}

export default function CreatedJobs({data}:createdJobs ) {
  return (
    <div>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" className="w-full">
            Created Jobs
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full ">
            <DrawerHeader>
              <DrawerTitle>Created Jobs</DrawerTitle>
              <DrawerDescription>
                Here are the jobs you've created.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-4 max-h-[60vh] my-2 overflow-y-auto custom-scrollbar">
              {data.map((job) => (
                <CreatedJobCard key={job.id} job={job} />
              ))}
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
