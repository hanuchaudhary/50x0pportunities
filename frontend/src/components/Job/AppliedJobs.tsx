import { useAppliedJobsStore } from "@/store/useCreatedJobsStore";
import AppliedJobCard from "./MiniAppliedJobCard";
import { useEffect } from "react";

export default function AppliedJobs() {
  const { appliedJobs, fetchAppliedJobs } = useAppliedJobsStore();
  useEffect(() => {
    fetchAppliedJobs();
  }, [fetchAppliedJobs]);
  return (
    <div>
      {appliedJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-neutral-500">
          <h1 className="text-3xl font-[instrumnetal-regular] tracking-tighter leading-none text-center">
            No applied jobs
          </h1>
          <p className="text-sm text-center leading-none">
            You can apply to jobs by clicking on the apply button on the job
            card
          </p>
        </div>
      ) : (
        appliedJobs.map(({ job, status }) => (
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
        ))
      )}
    </div>
  );
}
