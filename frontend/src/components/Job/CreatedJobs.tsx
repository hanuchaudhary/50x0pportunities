import React from "react";
import { useCreatedJobsStore } from "../../store/useCreatedJobsStore";
import MiniJobCard from "./MiniJobCard";
export default function CreatedJobs() {
  const { createdJobs, fetchCreatedJobs } = useCreatedJobsStore();
  React.useEffect(() => {
    fetchCreatedJobs();
  }, [fetchCreatedJobs]);

  return (
    <div>
      <div className="flex flex-col gap-4">
        {createdJobs.map((job) => (
          <MiniJobCard
            isOpen={job.isOpen}
            _count={{ jobApplication: job._count.jobApplication }}
            key={job.id}
            companyName={job.company.name}
            createdAt={job.createdAt}
            experience={job.experience + " years"}
            jobId={job.id}
            location={job.location}
            position={job.position}
            logo={job.company.logo}
            skills={job.skills.split(",")}
            type={job.jobType}
          />
        ))}
      </div>
    </div>
  );
}
