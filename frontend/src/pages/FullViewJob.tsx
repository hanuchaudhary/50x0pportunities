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
  console.log(jobData?.data);

  return (
    <div>
      <Navbar />
      <div className="mt-40 px-20">
        {loading ? (
          <SingleJobSkeleton/>
        ) : (
          <>
            <div className="title flex items-center justify-between">
              <h1 className="text-3xl capitalize font-semibold">
                {jobData?.data.job.title || "Job Title"}{" "}
                <span className="text-sm bg-green-300 font-bold select-none text-green-800 rounded-md inline-block py-1 px-2">
                  {jobData?.data.job.type || "types"}
                </span>
              </h1>
              <div>
                <img
                  src={jobData?.data.company.logo}
                  className="w-16"
                  alt=""
                />
              </div>
            </div>
            <div className="flex items-center w-full justify-between pt-2">
              <h1 className="text-sm bg-orange-300 font-semibold text-orange-800 rounded-md inline-block py-1 px-2">
                {jobData?.data.job.createdAt || "11 Sept, 2077"}
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
                className="bg-background p-2 hover:bg-neutral-800 bg-neutral-900 transition-colors duration-500 rounded-lg"
                source={jobData?.data.job.requirement || "requirements"}
              />
            </div>
            <div className="w-full mt-5">
              <ApplyForJob
                companyName={jobData?.data.company.name}
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
