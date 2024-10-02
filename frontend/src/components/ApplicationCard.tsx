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
import { Briefcase, MapPin, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

enum ApplicationStatus {
  Rejected = "Rejected",
  Applied = "Applied",
  Interviewing = "Interviewing",
  Hired = "Hired",
}

interface Application {
  id: string;
  applicantId: string;
  jobId: string;
  status: ApplicationStatus;
  isApplied: boolean;
  resume: string;
  skills: string;
  experience: string;
  education: string;
  createdAt: string;
  job: {
    id: string;
    company: {
      name: string;
      logo: string;
    };
    recruiterId: string;
    companyId: string;
    title: string;
    description: string;
    location: string;
    type: string;
    requirement: string;
    isOpen: boolean;
    createdAt: string;
  };
}

interface ApplicationCardProps {
  application: Application;
}

export default function ApplicationCard({ application }: ApplicationCardProps) {
  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.Rejected:
        return "bg-red-400 text-red-950";
      case ApplicationStatus.Applied:
        return "bg-blue-400 text-blue-950 ";
      case ApplicationStatus.Interviewing:
        return "bg-yellow-400 text-yellow-950 ";
      case ApplicationStatus.Hired:
        return "bg-green-400 text-green-950";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold">
            {application.job.title}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {application.job.description.length > 250
              ? application.job.description.substring(0, 250) + "..."
              : application.job.description}
          </CardDescription>
        </div>
        <div className="flex flex-col items-end">
          <h2 className="text-sm font-semibold">
            {application.job.company.name}
          </h2>
          <img
            className="w-12 h-12 object-contain"
            src={application.job.company.logo}
            alt={`${application.job.company.name} logo`}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {application.job.location}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {application.job.type}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Applied on {new Date(application.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <Badge
          className={`${getStatusColor(
            application.status
          )} px-2 py-1 text-xs font-bold rounded-full`}
        >
          {application.status}
        </Badge>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link to={"/jobs/" + application.job.id}>
          <Button variant="outline">View Job</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
