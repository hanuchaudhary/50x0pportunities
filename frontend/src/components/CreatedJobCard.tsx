import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Calendar, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { WEB_URL } from "@/Config";
import { toast } from "@/hooks/use-toast";
import { Label } from "./ui/label";
import EditJob from "./EditJob";

enum ApplicationStatus {
  Rejected = "Rejected",
  Applied = "Applied",
  Interviewing = "Interviewing",
  Hired = "Hired",
}

interface Applicant {
  applicantId: string;
  fullName: string;
  email: string;
  role: string;
}

interface JobApplication {
  id: string;
  status: ApplicationStatus;
  isApplied: boolean;
  resume: string;
  skills: string;
  experience: string;
  education: string;
  createdAt: string;
  applicant: Applicant;
}

interface CreatedJob {
  id : true
  title: string;
  description: string;
  location: string;
  type: string;
  requirement: string;
  isOpen: boolean;
  createdAt: string;
  jobApplication: JobApplication[];
}

interface CreatedJobCardProps {
  job: CreatedJob;
}

export default function CreatedJobCard({ job }: CreatedJobCardProps) {
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{job.title}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {job.description.length > 200
                ? job.description.substring(0, 200) + "..."
                : job.description}
            </CardDescription>
          </div>
          <Badge
            className={`${
              job.isOpen
                ? "bg-green-400 text-green-950 font-semibold"
                : "bg-red-400 text-red-950 font-semibold"
            } `}
            variant={job.isOpen ? "default" : "secondary"}
          >
            {job.isOpen ? "Open" : "Closed"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {job.location}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{job.type}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Created on {new Date(job.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {job.jobApplication.length} application(s)
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <ApplicationDialog job={job} />
        <EditJob isOpen={job.isOpen} id={job.id }/>
      </CardFooter>
    </Card>
  );
}

function ApplicationDialog({ job }: CreatedJobCardProps) {
  const [applications, setApplications] = useState(job.jobApplication);
  const updateApplicationStatus = async (
    applicationId: string,
    status: ApplicationStatus
  ) => {
    try {
      const response = await axios.put(
        `${WEB_URL}/api/v1/user/status`,
        {
          applicationId: applicationId,
          status: status,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token")?.split(" ")[1],
          },
        }
      );

      if (response.status === 200) {
        setApplications((prevApps) =>
          prevApps.map((app) =>
            app.id === applicationId ? { ...app, status } : app
          )
        );

        toast({
          title: "Yay! Status Updated",
          description: "Status updated successfully",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Server Error",
        description: "Error while updating status",
        variant: "destructive",
      });
      console.log(error);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">View Applications</Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Applications for {job.title}</DialogTitle>
            <DialogDescription>
              Review and update the status of applications
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {applications.map((application) => (
              <Card key={application.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold capitalize">
                      {application.applicant.fullName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {application.applicant.email}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 ">
                      <Label>Resume: </Label>
                      <h1>{application.resume}</h1>
                    </div>
                    <Select
                      value={application.status}
                      onValueChange={(status: ApplicationStatus) =>
                        updateApplicationStatus(application.id, status)
                      }
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
                </div>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Skills:</strong> {application.skills}
                  </p>
                  <p>
                    <strong>Experience:</strong> {application.experience}
                  </p>
                  <p className="capitalize">
                    <strong>Education:</strong> {application.education}
                  </p>
                  <p>
                    <strong>Applied on:</strong>{" "}
                    {new Date(application.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
