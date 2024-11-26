import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import useProfileStore from "@/store/profileState";

export function MiniProfile({
  setMenu,
}: {
  setMenu: (value: boolean) => void;
}) {
  const { isLoading, profile, error} = useProfileStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setMenu(false);
    navigate("/signin");
  };

  if (isLoading) {
    return (
      <Card className="lg:w-[30vw] md:w-[40vw] w-[70vw] shadow-xl">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="flex-grow">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-5 w-16 mt-2" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20 rounded-lg" />
            <Skeleton className="h-20 rounded-lg" />
          </div>
          <Skeleton className="h-10 w-full mt-4" />
          <Skeleton className="h-10 w-full mt-4" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="lg:w-[30vw] md:w-[40vw] shadow-xl">
        <CardContent className="p-6">
          <p className="text-center text-red-500">
            Error loading profile data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:w-[30vw] md:w-[40vw] shadow-xl relative">
      <div
        onClick={() => setMenu(false)}
        className="absolute top-4 right-4 cursor-pointer"
      >
        <X />
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border-2 border-primary">
            <AvatarImage
              src="/placeholder.svg?height=64&width=64"
              alt="User avatar"
            />
            <AvatarFallback className="text-2xl uppercase font-semibold bg-primary text-primary-foreground">
              {profile?.fullName
                .split(" ")
                .map((e) => e[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <CardTitle className="text-xl capitalize">
              {profile?.fullName}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {profile?.email}
            </p>
            <Badge variant="secondary" className="mt-2">
              {profile?.role}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div>
          {profile?.role === "Recruiter" ? (
            <div className="flex flex-col items-center p-3 bg-accent rounded-lg">
              <span className="text-2xl font-bold">
                {/* {profile?.createdJobs.length} */}
              </span>
              <span className="text-sm text-muted-foreground">
                Created Jobs
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col items-center p-3 bg-accent rounded-lg">
                <span className="text-2xl font-bold">
                  {/* {profile?.jobApplication.length} */}
                </span>
                <span className="text-sm text-muted-foreground">
                  Applied Jobs
                </span>
              </div>

              <div className="flex flex-col items-center p-3 bg-accent rounded-lg">
                <span className="text-2xl font-bold">
                  {/* {profile?.savedJobs.length} */}
                </span>
                <span className="text-sm text-muted-foreground">
                  Saved Jobs
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 flex flex-col gap-2 justify-end">
          <Button
            onClick={() => setMenu(false)}
            asChild
            variant="outline"
            className="w-full"
          >
            <Link to="/profile">View Full Profile</Link>
          </Button>
          <Button
            onClick={handleLogout}
            asChild
            variant="destructive"
            className="w-full"
          >
            <h1>Logout</h1>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
