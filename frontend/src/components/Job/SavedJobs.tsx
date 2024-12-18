import { useSavedJobsStore } from "@/store/useCreatedJobsStore";
import MiniJobCard from "./MiniJobCard";
import { useEffect } from "react";

export default function SavedJobs() {
  const { fetchSavedJobs, savedJobs } = useSavedJobsStore();
  useEffect(() => {
    fetchSavedJobs();
  }, [fetchSavedJobs]);
  return (
    <div className="">
      {savedJobs.map(({ job }) => (
        <MiniJobCard
          jobId={job.id}
          key={job.id}
          companyName={job.company.name}
          logo={job.company.logo}
          position={job.position}
          location={job.location}
          type={job.jobType}
          experience={"3+ years"}
          createdAt={job.createdAt}
          skills={job.skills.split(",")}
        />
      ))}
    </div>
  );
}
