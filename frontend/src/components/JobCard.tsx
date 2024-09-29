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

interface CardType {
  id: string;
  createdAt?: Date;
  description?: string;
  isOpen?: boolean;
  location: string;
  requirement?: string;
  title: string;
  type?: string;
  companyId: string;
}

const JobCard = ({ id, description, location, title, companyId }: CardType) => {
  const { company, loading } = useFetchSingleCompany({ id: companyId });

  return (
    <div>
      <Card className="dark:bg-neutral-900 dark:hover:bg-neutral-800 transition-colors duration-500">
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex h-20 overflow-hidden items-center justify-between border-b">
          <div className="logo ">
            {loading ? (
              <div className="skeleton-loader">Loading...</div>
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
            {description?.length > 200 ? description?.substring(0,200) + "..." : description}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex items-center gap-4 justify-between">
          <Link to={`/jobs/${id}`}>
            <Button className="w-full">More Details</Button>
          </Link>
          <Bookmark size={30} />
        </CardFooter>
      </Card>
    </div>
  );
};

export default JobCard;
