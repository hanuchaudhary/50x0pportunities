import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Bookmark, Loader2, MapPin, Calendar, Building } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
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
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const jobId = job.id;

  const { Authorization } = getAuthHeaders();

  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    if (savedJobs.includes(jobId)) {
      setIsSaved(true);
    }
  }, [jobId]);

  const handleSaveJob = async () => {
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

      const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]");

      if (response.status === 201) {
        savedJobs.push(jobId);
        localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
        setIsSaved(true);
        toast({
          title: "Job Saved",
          description: "Job saved successfully",
          variant: "success",
        });
      } else if (response.status === 200) {
        const updatedSavedJobs = savedJobs.filter((id: string) => id !== jobId);
        localStorage.setItem("savedJobs", JSON.stringify(updatedSavedJobs));
        setIsSaved(false);
        toast({
          title: "Job Unsaved",
          description: "Job unsaved successfully",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Saving Error",
        description: "Error while saving job",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="dark:bg-neutral-900 flex flex-col justify-between bg-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="pb-2 relative">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold text-primary">
              {job.title}
            </CardTitle>
            <Badge
              variant="outline"
              className={`absolute top-2 right-2 ${
                job.type.toString() === "Remote"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
              }`}
            >
              {job.type}
            </Badge>
          </div>
          <CardDescription className="text-sm font-medium text-muted-foreground flex items-center mt-1">
            <Building className="w-4 h-4 mr-1" />
            {job.company.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{format(new Date(job.createdAt), "MMM d, yyyy")}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="logo">
              {job.company.logo && (
                <img
                  className="w-16 h-16 object-contain rounded-full"
                  src={job.company.logo}
                  alt={`${job.company.name} logo`}
                />
              )}
            </div>
          </div>
          <CardDescription className="text-sm min-h-16 line-clamp-3 text-neutral-600 dark:text-neutral-300">
            {job.description}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex rounded-t-xl items-center gap-4 justify-between  bg-neutral-50 dark:bg-neutral-800">
          <Link to={`/jobs/${job.id}`} className="flex-grow">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              View Details
            </Button>
          </Link>
          {role === "Candidate" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`saveJob transition-colors duration-300 ${
                      isSaved ? "bg-primary text-primary-foreground" : ""
                    }`}
                    onClick={handleSaveJob}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Bookmark className={isSaved ? "fill-current" : ""} />
                    )}
                    <span className="sr-only">
                      {isSaved ? "Unsave job" : "Save job"}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isSaved ? "Unsave Job" : "Save Job"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default JobCard;
