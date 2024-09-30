import ApplyForJob from "@/components/ApplyForJob";
import Navbar from "@/components/Navbar";
import SingleJobSkeleton from "@/components/SingleJobSkeleton";
import { useSingleJob } from "@/hooks/FetchSingleJob";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { MapPin } from "lucide-react";
import { useParams } from "react-router-dom";

const FullViewJob = () => {
  const { id } = useParams();
  const { jobData, loading } = useSingleJob({ id: id! });
  const role = localStorage.getItem("role");

  return (
    <div>
      <Navbar />
      <div className="mt-32 md:mt-40 px-4 md:px-20">
        {loading ? (
          <SingleJobSkeleton />
        ) : (
          <>
            <div className="title flex items-center justify-between">
              <h1 className="text-3xl capitalize font-semibold">
                {jobData?.data.job.title || "Job Title"}{" "}
                <span className="text-sm bg-green-300 font-bold select-none text-green-900 rounded-md inline-block py-1 px-2 mr-2">
                  {jobData?.data.job.type === "onsite"
                    ? "On Site"
                    : "Remote" || "types"}
                </span>
                {jobData?.data.job.isOpen ? (
                  <span className="text-sm bg-green-300 font-bold select-none text-green-900 rounded-md inline-block py-1 px-2">
                    Open For Hiring
                  </span>
                ) : (
                  <span className="text-sm bg-red-300 font-bold select-none text-red-900 rounded-md inline-block py-1 px-2">
                    Hiring Closed
                  </span>
                )}
              </h1>
              <div>
                <img src={jobData?.data.company.logo} className="w-20" alt="" />
              </div>
            </div>
            <div className="flex items-center w-full justify-between pt-2">
              <h1 className="text-sm bg-orange-300 font-semibold text-orange-800 rounded-md inline-block py-1 px-2">
                {jobData?.data?.job?.createdAt
                  ? new Date(jobData.data.job.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )
                  : "00 September, 0000"}
              </h1>

              <div className="text-sm bg-orange-300 font-semibold text-orange-800 rounded-md gap-1 py-1 px-2 flex ">
                <MapPin size={20} />
                <h1>{jobData?.data.job.location || "Location"}</h1>
              </div>
            </div>
            <div className="desc py-5">
              {jobData?.data.job.description || "No description available"}
            </div>
            <div>
              <MarkdownEditor.Markdown
                className="text-black dark:text-neutral-100 bg-background p-2 hover:bg-neutral-100 bg-neutral-200 dark:hover:bg-neutral-800 dark:bg-neutral-900 transition-colors duration-500 rounded-lg"
                source={jobData?.data.job.requirement || "requirements"}
              />
            </div>
            <div className="w-full">
              <ApplyForJob
                companyName={jobData?.data.company.name as string}
                jobTitle={jobData?.data.job.title as string}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FullViewJob;
