import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import JobApplicationCard from "./JobApplicationCard";
import { useJobApplicationsStore } from "@/store/useJobApplicationsStore";
import { formatDate } from "@/lib/FormatDate";
import { ManageJob } from "./ManageJob";

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
  _count: {
    jobApplication: number;
  };
  isOpen: boolean;
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
  isOpen
}: JobCardProps) {
  const userRole = localStorage.getItem("role");
  const { fetchJobApplications, applications, loading } =
    useJobApplicationsStore();

  return (
    <Link
      to={`${userRole === "Candidate" ? `/jobs/${jobId}` : ""}`}
      className={cn("w-full", className)}
    >
      <div className="p-3 dark:hover:bg-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors duration-300">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden border-secondary border p-2">
              <img
                src={logo}
                alt={companyName}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-xl">
                {position}{" "}
                <span className="text-muted-foreground">at {companyName}</span>
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{location}</span>
                <span>•</span>
                <span>{type}</span>
                <span>•</span>
                <span>{experience}</span>
                <span>•</span>
                <span>{formatDate(createdAt)}</span>
              </div>
            </div>
          </div>
          {userRole === "Candidate" ? (
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bookmark className="h-5 w-5" />
            </Button>
          ) : (
            <div>
              <JobApplicationCard
                isLoading={loading}
                companyName={companyName}
                jobPosition={position}
                applications={applications}
                applicationsCount={_count.jobApplication}
                handleApplicationFetch={() => fetchJobApplications(jobId)}
              />
              <ManageJob isOpen={isOpen} jobId={jobId}/>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {skills.slice(0, 4).map((skill) => (
            <Badge key={skill} variant="secondary" className="rounded-full">
              {skill}
            </Badge>
          ))}
          {skills.length > 4 && (
            <Badge variant="secondary" className="rounded-full">
              +{skills.length - 4}
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
}
