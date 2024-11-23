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

interface applicationCard {
  jobId: string;
  status: ApplicationStatus;
  id?: string;
  companyName: string;
  companyLogo: string;
  title: string;
  description: string;
  location: string;
  jobType: string;
  isOpen: boolean;
  createdAt: string;
}

export default function ApplicationCard({
  title,
  description,
  companyName,
  companyLogo,
  location,
  jobType,
  createdAt,
  jobId,
  status,
}: applicationCard) {
  
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
      <CardHeader className="flex flex-row items-start justify-between gap-5 pb-2">
        <div>
          <CardTitle className="text-xl font-bold">
            {title}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {description.length > 150
              ? description.substring(0, 150) + "..."
              : description}
          </CardDescription>
        </div>
        <div className="flex flex-col items-end">
          <h2 className="text-sm font-semibold">
            {companyName}
          </h2>
          <img
            className="w-12 h-12 object-contain"
            src={companyLogo}
            alt={`${companyName} logo`}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {location}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {jobType === "onsite" ? "On Site" : "Remote"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Applied on {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <Badge
          className={`${getStatusColor(
            status
          )} px-2 py-1 text-xs font-bold rounded-full`}
        >
          {status}
        </Badge>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link to={"/jobs/" + jobId}>
          <Button variant="outline">View Job</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
