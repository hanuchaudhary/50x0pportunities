import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import JobApplicationCard from "./JobApplicationCard";
import { useJobApplicationsStore } from "@/store/useJobApplicationsStore";
import { formatDate } from "@/lib/FormatDate";
import { ManageJob } from "./ManageJob";
import { Link } from "react-router-dom";
import { useSavedJobsStore } from "@/store/useSavedJobsStore";
import { Button } from "../ui/button";

interface JobCardProps {
  companyName: string;
  logo: string;
  position: string;
  location: string;
  type: string;
  experience: string;
  createdAt: string;
  skills: string[];
  className?: string;
  jobId: string;
  _count?: {
    jobApplication: number;
  };
  isOpen?: boolean;
}

export default function MiniJobCard({
  jobId,
  companyName,
  logo,
  position,
  location,
  type,
  experience,
  createdAt,
  skills,
  className,
  _count,
  isOpen,
}: JobCardProps) {
  const userRole = localStorage.getItem("role");
  const { fetchJobApplications, applications } = useJobApplicationsStore();
  return (
    <div className={cn("w-full block", className)}>
      <div className="p-3 dark:hover:bg-neutral-900 w-full hover:bg-neutral-100 rounded-xl transition-colors duration-300">
        <div className="w-full space-y-1">
          <div className="flex items-start justify-between w-full">
            <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden border-secondary border p-2">
              <img
                src={logo}
                alt={companyName}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              {userRole === "Candidate" ? (
                <div className="z-50">
                  <Button
                    onClick={() => {
                      useSavedJobsStore.getState().unsaveJob(jobId);
                    }}
                    size={"sm"}
                    variant={"outline"}
                  >
                    {useSavedJobsStore.getState().unsaveLoading ? (
                      <span>Unsaving...</span>
                    ) : (
                      <span>Unsave</span>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <JobApplicationCard
                    companyName={companyName}
                    jobPosition={position}
                    applications={applications}
                    applicationsCount={_count?.jobApplication ?? 0}
                    handleApplicationFetch={() => fetchJobApplications(jobId)}
                  />
                  <ManageJob isOpen={isOpen!} jobId={jobId} />
                </div>
              )}
            </div>
          </div>
          <div className="space-y-1 w-full sm:w-auto">
            <Link
              to={`${userRole === "Candidate" ? `/jobs/${jobId}` : ""}`}
              className="font-semibold text-lg sm:text-xl"
            >
              {position}{" "}
              <span className="text-muted-foreground text-sm sm:text-base">
                at {companyName}
              </span>
            </Link>
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <span>{location}</span>
              <span className="hidden sm:inline">•</span>
              <span>{type}</span>
              <span className="hidden sm:inline">•</span>
              <span>{experience}</span>
              <span className="hidden sm:inline">•</span>
              <span>{formatDate(createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {skills.slice(0, 4).map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="rounded-full text-xs sm:text-sm"
            >
              {skill}
            </Badge>
          ))}
          {skills.length > 4 && (
            <Badge
              variant="secondary"
              className="rounded-full text-xs sm:text-sm"
            >
              +{skills.length - 4}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
