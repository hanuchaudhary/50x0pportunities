import { useSavedJobsStore } from "@/store/useSavedJobsStore";
import MiniJobCard from "./MiniJobCard";
import { useEffect } from "react";

export default function SavedJobs() {
  const { savedJobs, fetchSavedJobs } = useSavedJobsStore();
  useEffect(() => {
    fetchSavedJobs();
  }, [fetchSavedJobs]);
  return (
    <div className="">
      {savedJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-neutral-500">
          <h1 className="text-3xl font-[instrumnetal-regular] tracking-tighter leading-none text-center">No saved jobs</h1>
          <p className="text-sm text-center leading-none">
            You can save jobs by clicking on the save button on the job card
          </p>
        </div>
      ) : (
        savedJobs.map(({ job }) => (
          <MiniJobCard
            jobId={job.id}
            key={job.id}
            companyName={job.company.name}
            logo={job.company.logo}
            position={job.position}
            location={job.location}
            type={job.jobType}
            experience={job.experience as unknown as string}
            createdAt={new Date(job.createdAt).toDateString()}
            isOpen={job.isOpen}
            skills={job.skills.split(",")}
          />
        ))
      )}
    </div>
  );
}
