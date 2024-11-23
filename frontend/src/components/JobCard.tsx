import { Bookmark, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Link } from "react-router-dom";
import axios from "axios";
import { WEB_URL } from "@/Config";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { getAuthHeaders } from "@/store/profileState";

interface CardType {
  id: string;
  description: string;
  location: string;
  title: string;
  companyLogo: string;
  companyName: string;
}

const JobCard = ({
  id,
  description,
  location,
  title,
  companyLogo,
  companyName,
}: CardType) => {
  const role = localStorage.getItem("role");
  const jobId = id;
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { Authorization} = getAuthHeaders()

  const HandleSaveJob = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${WEB_URL}/api/v1/job/saved`,
        { jobId },
        {
          headers: {
            Authorization
          },
        }
      );
      setSuccess(true);
      setLoading(false);
      if (response.status == 201) {
        toast({
          title: "!!Saved",
          description: "Job Saved Succesfully",
          variant: "success",
        });
      }
    } catch (error) {
      setLoading(false);
      toast({
        title: "Saving Error",
        description: "Error While Saving Job",
        variant: "destructive",
      });
    }
  };
  

  return (
    <div>
      <Card className="dark:bg-neutral-900 flex flex-col justify-between bg-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors duration-500">
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex h-20 overflow-hidden items-center justify-between border-b">
          <div className="logo ">
            {companyLogo && (
              <img
                className="w-16 object-cover"
                src={companyLogo}
                alt={`${companyName} logo`}
              />
            )}
          </div>
          <div className="flex items-center justify-center gap-1">
            <MapPin />
            <div className="location font-semibold">{location}</div>
          </div>
        </CardContent>
        <CardContent className="pt-2 h-28">
          <CardDescription>
            {description?.length > 180
              ? description?.substring(0, 180) + "..."
              : description}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex items-center gap-4 justify-between">
          <Link to={`/jobs/${id}`}>
            <Button className="w-full">More Details</Button>
          </Link>
          {role === "Candidate" && (
            <button
              disabled={success}
              className="saveJob"
              onClick={HandleSaveJob}
            >
              {loading ? (
                <ClipLoader color="white" />
              ) : (
                <Bookmark fill={success ? "white" : "transparent"} size={30} />
              )}
            </button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default JobCard;
