import { useAppliedJobsStore } from "@/store/userJobsStore";
import AppliedJobCard from "./MiniAppliedJobCard";
import { useEffect } from "react";

export default function AppliedJobs() {
  const { appliedJobs, fetchAppliedJobs } = useAppliedJobsStore();
  useEffect(() => {
    fetchAppliedJobs();
  }, [fetchAppliedJobs]);
  return (
    <div>
      {appliedJobs.map(({ job, status }) => (
        <AppliedJobCard
          jobId={job.id}
          salary={`${job.salaryFrom}Lpa - ${job.salaryTo}Lpa`}
          key={job.id}
          status={status}
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
