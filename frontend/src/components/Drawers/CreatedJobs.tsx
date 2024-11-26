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
import { useCreatedJobsStore } from "@/store/userJobsStore";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function CreatedJobs() {
  const { createdJobs, fetchCreatedJobs, loading } = useCreatedJobsStore();
  
  useEffect(() => {
    fetchCreatedJobs();
  }, []);

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
              {loading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <Loader2 className="animate-spin" />
                </div>
              ) : (
                createdJobs.map((job) => (
                  <CreatedJobCard key={job.id} {...job} />
                ))
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
