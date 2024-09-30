import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { useProfile } from "@/hooks/FetchProfile";

export default function MiniProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const { data } = useProfile();
  // console.log(data?.jobApplication);
  
  const handleEdit = () => {
    setIsEditing(true);
    console.log("Edit mode activated", isEditing);
  };

  return (
    <Card className="w-full dark:bg-neutral-900 max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage
            src="/placeholder.svg?height=64&width=64"
            alt="User avatar"
          />
          <AvatarFallback className="uppercase font-semibold text-2xl">
            {data?.fullName.split(" ").map((e) => e[0])}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-grow">
          <div className="flex justify-between items-center">
            <CardTitle>{data?.fullName}</CardTitle>
            <Button variant="ghost" size="icon" onClick={handleEdit}>
              <PencilIcon className="h-4 w-4" />
              <span className="sr-only">Edit profile</span>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{data?.email}</p>
          <Badge className="mt-2 w-fit">{data?.role}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {data?.role === "Candidate" ? (
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <span className="text-2xl font-bold">
                {data?.jobApplication.length}
              </span>{" "}
              <span className="text-sm text-muted-foreground">
                Applied Jobs
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <span className="text-2xl font-bold">
                {data?.createdJobs.length}
              </span>{" "}
              <span className="text-sm text-muted-foreground">
                Created Jobs
              </span>
            </div>
          )}
          <div className="flex flex-col items-center p-4 border rounded-lg">
            <span className="text-2xl font-bold">25</span>
            <span className="text-sm text-muted-foreground">Saved Jobs</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
