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
import { Separator } from "@/components/ui/separator";
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
import axios from "axios";
import { getAuthHeaders } from "@/store/profileState";
import { WEB_URL } from "@/Config";
import { toast } from "@/hooks/use-toast";
import { Badge } from "../ui/badge";
import { Loader2 } from "lucide-react";

export default function JobApplicationCard({
  applications,
  applicationsCount,
  handleApplicationFetch,
  companyName,
  jobPosition,
  isLoading,
}: {
  isLoading: boolean;
  companyName: string;
  jobPosition: string;
  handleApplicationFetch: () => void;
  applications: JobApplication[];
  applicationsCount: number;
}) {
  const [open, setOpen] = useState(false);
  const handleStatusChange = async (
    applicationId: string,
    newStatus: ApplicationStatus
  ) => {
    try {
      await axios.put(
        `${WEB_URL}/api/v1/user/status`,
        {
          applicationId,
          status: newStatus,
        },
        {
          headers: {
            Authorization: getAuthHeaders().Authorization,
          },
        }
      );
    } catch (error) {
      toast({
        title: "Failed to update status",
        description: "Please try again later.",
      });
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button onClick={handleApplicationFetch} size="sm" variant="default">
          View Applications ({applicationsCount})
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-2xl font-[instrumental-regular] tracking-tighter font-thin">
            <span className="text-green-500">Application Details</span> for{" "}
            {jobPosition}
            <span className="text-neutral-500"> at {companyName}.</span>
          </DrawerTitle>
          <DrawerDescription>
            Review the details of job applications.
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-[calc(100vh-200px)] px-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <Loader2 className="animate-spin text-green-500 h-14 w-14" />
            </div>
          ) : applications.length === 0 ? (
            <div className="flex items-center justify-center h-96">
              <p className="text-lg text-muted-foreground">
                No applications found.
              </p>
            </div>
          ) : (
            applications.map((app, index) => (
              <div
                key={app.id}
                className="mb-6 dark:bg-neutral-900 rounded-xl p-3"
              >
                <h2 className="text-lg font-semibold mb-2">
                  Application #{index + 1}
                </h2>
                <div className="flex items-center justify-between mb-4">
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
                    onValueChange={async (value: ApplicationStatus) => {
                      handleStatusChange(app.id, value);
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ApplicationStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-2">
                    <span className="font-medium">Experience:</span>
                    <span className="col-span-2">
                      {app.applicant.experience}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-2">
                    <span className="font-medium">Education:</span>
                    <span className="col-span-2">
                      {app.applicant.education}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-2">
                    <span className="font-medium">Skills:</span>
                    <span className="col-span-2 space-x-1">
                      {app.applicant.skills.split(",").map((skill) => (
                        <Badge variant={"secondary"} key={skill}>
                          {skill}
                        </Badge>
                      ))}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-2">
                    <span className="font-medium">Applied on:</span>
                    <span className="col-span-2">
                      {formatDate(app.createdAt)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-2">
                    <span className="font-medium">Resume:</span>
                    <a
                      href={app.applicant.resume}
                      target="_blank"
                      className="col-span-2 text-green-500 font-[instrumental-regular] tracking-tighter hover:underline"
                    >
                      View Resume.
                    </a>
                  </div>
                  <div className="grid grid-cols-3 items-start gap-2 mt-2">
                    <span className="font-medium">Bio:</span>
                    <p className="col-span-2 text-sm">{app.applicant.bio}</p>
                  </div>
                </div>
                {index < applications.length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            ))
          )}
        </ScrollArea>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
