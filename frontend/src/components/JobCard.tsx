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

interface cardType {
  id: string;
  createdAt?: Date;
  description?: string;
  isOpen?: boolean;
  location: string;
  requirement?: string;
  title: string;
  type?: string;
}

const JobCard = ({
  id,
  description,
  location,
  title,
}: cardType) => {
  return (
    <div>
      <Card className="">
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between border-b">
          <div className="logo w-20">
            <img
              src="https://imgs.search.brave.com/BW68j84XzF9g-Ws-KpajjMNw3PZfdFHsvpHzRIn4iJA/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMuc3RpY2twbmcu/Y29tL2ltYWdlcy81/ODBiNTdmY2Q5OTk2/ZTI0YmM0M2M1MWYu/cG5n"
              alt=""
            />
          </div>
          <div className="flex items-center justify-center gap-1">
            <MapPin />
            <div className="location font-semibold">{location}</div>
          </div>
        </CardContent>
        <CardContent className="pt-2">
          <CardDescription>{description}</CardDescription>
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
