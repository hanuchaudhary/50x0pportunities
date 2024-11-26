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
import { useAppliedJobsStore } from "@/store/userJobsStore";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AppliedJobs() {
  const { appliedJobs, fetchAppliedJobs, loading } = useAppliedJobsStore();
  useEffect(() => {
    fetchAppliedJobs();
  }, []);

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
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Loader2 className="animate-spin"/>
                </div>
              ) : appliedJobs.length > 0 ? (
                appliedJobs.map((e) => {
                  return <ApplicationCard key={e.id} {...e} />;
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
