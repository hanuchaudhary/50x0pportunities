import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/FormatDate";
import { JobApplication, ApplicationStatus } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { useJobApplicationsStore } from "@/store/useJobApplicationsStore";

export default function JobApplicationCard({
  applications,
  applicationsCount,
  handleApplicationFetch,
  companyName,
  jobPosition,
}: {
  handleApplicationFetch: () => void;
  applications: JobApplication[];
  applicationsCount: number;
  companyName: string;
  jobPosition: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button onClick={handleApplicationFetch} size="sm" variant="default">
          View Applications ({applicationsCount})
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-full ">
        <DrawerHeader>
          <DrawerTitle className="text-2xl font-[instrumental-regular] tracking-tighter font-thin">
            <span className="text-green-500">Application Details </span>
            for {jobPosition}
            <span className="text-neutral-500"> at {companyName}.</span>
          </DrawerTitle>
          <DrawerDescription>
            Review the details of job applications.
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-[calc(100vh-200px)] px-4 sm:h-[500px]">
          {applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-neutral-500">
              <h1 className="text-3xl font-[instrumnetal-regular] tracking-tighter leading-none text-center">
                No applications yet
              </h1>
              <p className="text-sm text-center leading-none">
                Check back later for applications
              </p>
            </div>
          ) : (
            applications.map((app, index) => (
              <div key={app.id} className="mb-3 dark:bg-neutral-900 bg-neutral-50 shadow-sm p-3 rounded-lg">
                <h1 className="font-semibold py-2">
                  Application{" "}
                  <span className="text-green-500">{index + 1}.</span>
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage
                        className="object-cover"
                        src={app.applicant.avatar}
                        alt={app.applicant.fullName}
                      />
                      <AvatarFallback>
                        {app.applicant.fullName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {app.applicant.fullName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {app.applicant.email}
                      </p>
                    </div>
                  </div>
                  <Select
                    defaultValue={app.status}
                    onValueChange={(value) => {
                      useJobApplicationsStore
                        .getState()
                        .updateApplicationStatus(app.id, value);
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-black/80 rounded-xl">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {Object.values(ApplicationStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <div className="flex justify-between gap-2">
                    <span className="font-medium">Experience:</span>
                    <span className="col-span-2">
                      {app.applicant.experience}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="font-medium">Education:</span>
                    <span className="col-span-2">
                      {app.applicant.education}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="font-medium">Applied on:</span>
                    <span className="col-span-2">
                      {formatDate(app.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="font-medium">Resume:</span>
                    <a
                      href={app.applicant.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="col-span-2 text-blue-600 hover:underline"
                    >
                      View Resume
                    </a>
                  </div>
                  <div className="flex justify-between gap-10 md:gap-10">
                    <span className="font-medium">Skills:</span>
                    <span className="col-span-2 flex flex-wrap gap-1">
                      {app.applicant.skills.split(",").map((skill) => (
                        <Badge
                          className="text-xs"
                          variant={"secondary"}
                          key={skill}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </span>
                  </div>
                  <div className="flex justify-between gap-10 md:gap-24 mt-2">
                    <span className="font-medium">Bio:</span>
                    <p className="text-sm line-clamp-3 sm:line-clamp-2">
                      {app.applicant.bio}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
        <DrawerFooter>
          <DrawerClose>
            <Button variant="secondary">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
