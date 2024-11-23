import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer";
import JobCard from "../JobCard";
import { Button } from "../ui/button";

export default function SavedJobs({data}) {
  return (
    <div>
        <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" className="w-full">
                  Saved Jobs
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full">
                  <DrawerHeader>
                    <DrawerTitle>Saved Jobs</DrawerTitle>
                    <DrawerDescription>
                      Here are the jobs you've saved for later.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 space-y-4 max-h-[60vh] my-2 overflow-y-auto custom-scrollbar">
                    {data?.savedJobs.map((job) => (
                      <JobCard key={job.id} job={job} type="saved" />
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
  )
}
