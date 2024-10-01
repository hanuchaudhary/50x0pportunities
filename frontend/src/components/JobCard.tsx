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
import { useFetchSingleCompany } from "@/hooks/FetchCompany";
import axios from "axios";
import { WEB_URL } from "@/Config";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { ClipLoader } from "react-spinners";

interface CardType {
  id: string;
  description: string;
  location: string;
  title: string;
  companyId: string;
}

const JobCard = ({ id, description, location, title, companyId }: CardType) => {
  const role = localStorage.getItem("role");
  const { company, companyLoading } = useFetchSingleCompany({ id: companyId });
  const jobId = id;
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const HandleSaveJob = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token")?.split(" ")[1];
      const response = await axios.post(
        `${WEB_URL}/api/v1/job/saved`,
        { jobId },
        {
          headers: {
            Authorization: token,
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
          draggable: true,
        });
      }
    } catch (error) {
      setLoading(false)
      toast({
        title: "Saving Error",
        description: "Error While Saving Job",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Card className="dark:bg-neutral-900 bg-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors duration-500">
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex h-20 overflow-hidden items-center justify-between border-b">
          <div className="logo ">
            {companyLoading ? (
              <div className="skeleton-loader"><ClipLoader color="white"/></div>
            ) : (
              company && (
                <img
                  className="w-16 object-cover"
                  src={company.logo}
                  alt={`${company.name} logo`}
                />
              )
            )}
          </div>
          <div className="flex items-center justify-center gap-1">
            <MapPin />
            <div className="location font-semibold">{location}</div>
          </div>
        </CardContent>
        <CardContent className="pt-2">
          <CardDescription>
            {description?.length > 200
              ? description?.substring(0, 200) + "..."
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
                <Bookmark fill={success ? "white" : ""} size={30} />
              )}
            </button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default JobCard;
