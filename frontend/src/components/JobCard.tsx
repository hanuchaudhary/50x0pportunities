import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Bookmark, Loader2, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WEB_URL } from "@/Config";
import { toast } from "@/hooks/use-toast";
import { getAuthHeaders } from "@/store/profileState";
import { Company, Job } from "@/types/types";

interface CardType extends Job {
  company: Company;
}

const JobCard = (job: CardType) => {
  const role = localStorage.getItem("role");
  const jobId = job.id;
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { Authorization } = getAuthHeaders();
  console.log(job.jobRole);

  const HandleSaveJob = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${WEB_URL}/api/v1/job/save`,
        { jobId },
        {
          headers: {
            Authorization,
          },
        }
      );
      setSuccess(true);
      setLoading(false);
      if (response.status == 201) {
        toast({
          title: "Job Saved",
          description: "Job saved successfully",
          variant: "success",
        });
      }
    } catch (error) {
      setLoading(false);
      toast({
        title: "Saving Error",
        description: "Error while saving job",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className="dark:bg-neutral-900 flex flex-col justify-between bg-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors duration-500">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{job.title}</CardTitle>
          <Badge
            variant="outline"
            className={`${
              job.type.toString() === "Remote"
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {job.type}
          </Badge>
        </div>
        <CardDescription className="text-sm font-medium text-muted-foreground">
          {job.company.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="py-2">
        <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(job.createdAt), "MMM d, yyyy")}</span>
          </div>
        </div>
        <div className="logo mb-4">
          {job.company.logo && (
            <img
              className="w-16 h-16 object-contain"
              src={job.company.logo}
              alt={`${job.company.name} logo`}
            />
          )}
        </div>
        <CardDescription className="text-sm line-clamp-3">
          {job.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex items-center gap-4 justify-between pt-4">
        <Link to={`/jobs/${job.id}`} className="flex-grow">
          <Button className="w-full">View Details</Button>
        </Link>
        {role === "Candidate" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="saveJob"
                  onClick={HandleSaveJob}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Bookmark className={success ? "fill-current" : ""} />
                  )}
                  <span className="sr-only">Save job</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{success ? "Job Saved" : "Save Job"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
