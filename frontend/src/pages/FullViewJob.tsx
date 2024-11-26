import ApplyForJob from "@/components/ApplyForJob";
import SingleJobSkeleton from "@/components/SingleJobSkeleton";
import { useSingleJobStore } from "@/store/useSingleJobState";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { MapPin } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const FullViewJob = () => {
  const { id } = useParams();
  const { fetchSingleJob, isLoading, singleJob } = useSingleJobStore();
  useEffect(() => {
    fetchSingleJob(id as string);
  }, []);
  
  console.log(singleJob);

  const role = localStorage.getItem("role");
  return (
    <div>
      <div className="pt-28 px-4 md:px-40">
        {isLoading ? (
          <SingleJobSkeleton />
        ) : (
          <>
            <div className="title flex items-center justify-between">
              <h1 className="text-3xl capitalize font-semibold">
                {singleJob?.title || "Job Title"}{" "}
                <span className="md:text-sm text-xs bg-green-300 font-bold select-none text-green-900 rounded-md inline-block py-1 px-2 mr-2">
                  {singleJob?.type?.toString() === "Remote"
                    ? "Remote"
                    : "On Site"}
                </span>
                {singleJob?.isOpen ? (
                  <span className="md:text-sm text-xs bg-green-300 font-bold select-none text-green-900 rounded-md inline-block py-1 px-2">
                    Open For Hiring
                  </span>
                ) : (
                  <span className="text-xs md:text-sm bg-red-300 font-bold select-none text-red-900 rounded-md inline-block py-1 px-2">
                    Hiring Closed
                  </span>
                )}
              </h1>
              <div>
                <img src={singleJob?.company.logo} className="w-20" alt="" />
              </div>
            </div>
            <div className="flex items-center w-full justify-between pt-2">
              <h1 className="text-xs md:text-sm bg-orange-300 font-semibold text-orange-800 rounded-md inline-block py-1 px-2">
                {singleJob?.createdAt
                  ? new Date(singleJob.createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "00 September, 0000"}
              </h1>

              <div className="text-xs md:text-sm bg-orange-300 font-semibold text-orange-800 rounded-md gap-1 py-1 px-2 flex ">
                <MapPin size={20} />
                <h1>{singleJob?.location || "Location"}</h1>
              </div>
            </div>
            <div className="desc py-5">
              {singleJob?.description || "No description available"}
            </div>
            <div>
              <MarkdownEditor.Markdown
                className="text-black dark:text-neutral-100 bg-background p-2 hover:bg-neutral-100 bg-neutral-200 dark:hover:bg-neutral-800 dark:bg-neutral-900 transition-colors duration-500 rounded-lg"
                source={singleJob?.requirement || "requirements"}
              />
            </div>
            <div className="w-full py-5">
              {role === "Candidate" && singleJob?.isOpen === true && (
                <ApplyForJob
                  companyName={singleJob?.company.name as string}
                  jobTitle={singleJob?.title as string}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FullViewJob;
