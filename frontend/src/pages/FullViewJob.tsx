import ApplyForJob from "@/components/ApplyForJob";
import BackButton from "@/components/BackButton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSingleJobStore } from "@/store/useSingleJobState";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const FullViewJob = () => {
  const { id } = useParams();
  const { fetchSingleJob, fetchIsApplied, isApplied, isLoading, singleJob } =
    useSingleJobStore();
  useEffect(() => {
    fetchIsApplied(id as string);
    fetchSingleJob(id as string);
  }, [fetchSingleJob, fetchIsApplied, id]);

  const role = localStorage.getItem("role");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="animate-spin h-14 w-14 text-green-600" />
      </div>
    );
  }
  return (
    <div className="max-w-4xl px-3 mx-auto">
      <div className="py-3">
        <BackButton href="/jobs" title="" />
      </div>
      <Separator />
      <div>
        <div className="py-3 dark:bg-neutral-900/30 px-3 bg-neutral-100 my-2 rounded-xl">
          <div className="flex items-center justify-between pb-8 ">
            <div className="flex items-center justify-between border dark:border-neutral-800 bg-white border-neutral-200 p-2 rounded-3xl w-20 h-20">
              <img
                src={singleJob?.company.logo}
                className="w-full h-full object-contain"
                alt="company logo"
              />
            </div>
            {role === "Candidate" && (
              <ApplyForJob
                companyName={singleJob?.company.name}
                jobTitle={singleJob?.position}
                isApplied={isApplied}
              />
            )}
          </div>
          <div>
            <h1 className="font-semibold text-2xl">{singleJob?.title}</h1>
            <div className="flex items-center gap-2 pb-4">
              <p>at {singleJob?.company.name} |</p>
              <p>{singleJob?.jobType}</p>
            </div>
            <div className="flex md:gap-8 gap-4 flex-wrap pb-4">
              <div>
                <p className="text-sm dark:text-neutral-400 text-neutral-600">
                  Experience
                </p>
                <p className="text-sm font-semibold">
                  0 - {singleJob?.experience}Years
                </p>
              </div>
              <div>
                <p className="text-sm dark:text-neutral-400 text-neutral-600">
                  Location
                </p>
                <p className="text-sm font-semibold">
                  {singleJob?.jobType === "Remote" ? (
                    "Remote"
                  ) : (
                    <>
                      ({singleJob?.jobType}) {singleJob?.location}
                    </>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm dark:text-neutral-400 text-neutral-600">
                  Role
                </p>
                <p className="text-sm font-semibold">{singleJob?.position}</p>
              </div>
              <div>
                <p className="text-sm dark:text-neutral-400 text-neutral-600">
                  Salary
                </p>
                <p className="text-sm font-semibold">
                  {singleJob?.salaryFrom}Lpa - {singleJob?.salaryTo}Lpa
                </p>
              </div>
            </div>
          </div>
        </div>
        <Separator />
        <div className="py-5">
          <h1 className="pb-3 font-semibold">Must have Skills</h1>
          <div className="flex flex-wrap gap-1">
            {singleJob?.skills.split(",").map((skill) => (
              <Badge key={skill} variant="outline" className="mr-2">
                {skill}
              </Badge>
            ))}
            <div className="py-10">
              <h1 className="pb-3 font-semibold">Job Description</h1>
              <div
                dangerouslySetInnerHTML={{
                  __html: singleJob?.requirement || "",
                }}
                className="p-2 rounded-xl"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullViewJob;
