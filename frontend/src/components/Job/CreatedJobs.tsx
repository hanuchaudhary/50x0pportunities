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
      {createdJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-neutral-500">
          <h1 className="text-3xl font-[instrumnetal-regular] tracking-tighter leading-none text-center">
            No jobs created yet
          </h1>
          <p className="text-sm text-center leading-none">
            Create a job to get started
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 w-full">
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
      )}
    </div>
  );
}
