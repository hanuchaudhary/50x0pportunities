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
import { ApplicationStatus } from "@/types/types";
import { appliedJob } from "@/store/useCreatedJobsStore";

export default function ApplicationCard(data: appliedJob) {

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
          <CardTitle className="text-xl font-bold">{data.job.title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {data.job.description.length > 150
              ? data.job.description.substring(0, 150) + "..."
              : data.job.description}
          </CardDescription>
        </div>
        <div className="flex flex-col items-end">
          <h2 className="text-sm font-semibold">{data.job.company.name}</h2>
          <img
            className="w-12 h-12 object-contain"
            src={data.job.company.logo}
            alt={`${data.job.company.name} logo`}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {data.job.location}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {/* {data.job.type === "remote" ? "Remote" : "On Site"} */}
              {data.job.type}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Applied on {new Date(data.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <Badge
          className={`${getStatusColor(
            data.status
          )} px-2 py-1 text-xs font-bold rounded-full`}
        >
          {data.status}
        </Badge>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link to={"/jobs/" + data.jobId}>
          <Button variant="outline">View Job</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
