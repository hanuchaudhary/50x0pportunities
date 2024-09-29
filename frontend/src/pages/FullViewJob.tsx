import ApplyForJob from "@/components/ApplyForJob";
import Navbar from "@/components/Navbar";
import { useSingleJob } from "@/hooks/FetchSingleJob";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { MapPin } from "lucide-react";
import { useParams } from "react-router-dom";

const FullViewJob = () => {
  const { id } = useParams();
  const { data, loading } = useSingleJob({ id: id! });
  console.log(data?.createAt);

  return (
    <div>
      <Navbar />
      <div className="mt-40 px-20">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div className="title flex items-center justify-between">
              <h1 className="text-3xl capitalize font-semibold">
                {data?.title || "Job Title"}{" "}
                <span className="text-sm bg-green-300 font-bold select-none text-green-800 rounded-md inline-block py-1 px-2">
                  {data?.type || "types"}
                </span>
              </h1>
              <div className="w-20">
                <img
                  src="https://imgs.search.brave.com/BW68j84XzF9g-Ws-KpajjMNw3PZfdFHsvpHzRIn4iJA/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMuc3RpY2twbmcu/Y29tL2ltYWdlcy81/ODBiNTdmY2Q5OTk2/ZTI0YmM0M2M1MWYu/cG5n"
                  alt=""
                />
              </div>
            </div>
            <div className="flex items-center w-full justify-between pt-2">
              <h1 className="text-sm bg-orange-300 font-semibold text-orange-800 rounded-md inline-block py-1 px-2">
                {data?.createAt || "11 Sept, 2077"}
              </h1>
              <div className="text-sm bg-orange-300 font-semibold text-orange-800 rounded-md gap-1 py-1 px-2 flex ">
                <MapPin size={20} />
                <h1>{data?.location || "Location"}</h1>
              </div>
            </div>
            <div className="desc py-5">
              {data?.description || "No description available"}
            </div>
            <div>
              <MarkdownEditor.Markdown
                className="bg-background p-2 hover:bg-neutral-900 rounded-lg"
                source={data?.requirement || "requirements"}
              />
            </div>
            <div className="w-full">
              <ApplyForJob
                companyName="Apple"
                jobTitle={data?.title as string}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FullViewJob;
