import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin } from "lucide-react";
import { User } from "@/types/types";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
export default function ProfilePageCard(user: User) {
  const role = localStorage.getItem("role");

  const navigate = useNavigate();
  const LogoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/signin", { replace: true });
  };

  return (
    <div className="space-y-4">
      <Card className="w-full">
        <div className="flex flex-col items-center py-4">
          <Avatar className="w-32 h-32 mb-4">
            <AvatarImage
              className="object-cover"
              src={
                user.avatar ||
                "https://i.pinimg.com/736x/71/e5/d2/71e5d2e61c2ce50df62c7eb751a3ce8e.jpg"
              }
              alt={user.fullName}
            />
            <AvatarFallback className="text-4xl font-bold uppercase">
              {user.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <CardHeader className="text-center space-y-2 pb-0 p-3">
            <CardTitle className="text-3xl font-bold">
              {user.fullName || user.email}
            </CardTitle>
            {role === "Candidate" && (
              <div>
                <p className="text-sm max-w-xl">{user.bio}</p>
                <p className="text-base font-semibold py-2 text-muted-foreground">
                  Education | <span>{user.education}</span>
                </p>
              </div>
            )}
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              {role === "Candidate" ? (
                <div>
                  <MapPin className="w-4 h-4" />
                  {user.location}
                </div>
              ) : (
                <Badge>{user.role}</Badge>
              )}
            </div>
          </CardHeader>
          {role === "Candidate" && (
            <CardContent className="w-full mt-4 p-3">
              <div className="flex flex-wrap gap-3 justify-center mb-4">
                {user.skills.split(",").map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="rounded-lg text-xs"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          )}
        </div>
      </Card>
      <Card className="w-full">
        <div className="flex items-center p-3 gap-3 ">
          <Link to="/edit" className="w-full">
            <Button variant={"secondary"} size={"sm"} className="w-full">
              Edit Profile
            </Button>
          </Link>
          {role === "Candidate" ? (
            <Link to={`/jobs/user/saved`} className="w-full">
              <Button variant={"secondary"} size={"sm"} className="w-full">
                Your Jobs
              </Button>
            </Link>
          ) : (
            <Link to={`/jobs/user/created`} className="w-full">
              <Button variant={"secondary"} size={"sm"} className="w-full">
                Your Jobs
              </Button>
            </Link>
          )}
          {role === "Recruiter" && (
            <Link to="/dashboard" className="w-full">
              <Button variant={"secondary"} size={"sm"} className="w-full">
                Create Job
              </Button>
            </Link>
          )}
          <Button
            onClick={LogoutUser}
            variant={"secondary"}
            size={"sm"}
            className="w-full"
          >
            Logout
          </Button>
        </div>
      </Card>
    </div>
  );
}
