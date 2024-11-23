import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import axios from "axios";
import { WEB_URL } from "@/Config";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { ProfileSkeleton } from "@/components/ProfileSkeleton";
import SavedJobs from "@/components/Drawers/SavedJobs";
import CreatedJobs from "@/components/Drawers/CreatedJobs";
import useProfileState from "@/store/profileState";
import DeactivateAccout from "@/components/Profile/DeactivateAccout";
import AppliedJobs from "@/components/Drawers/AppliedJobs";

export default function Profile() {
  const { fetchProfile, isLoading, profile } = useProfileState();
  useEffect(() => {
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="container mt-0 mx-auto p-4">
        <ProfileSkeleton />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mt-24 md:mt-32 dark:bg-neutral-900 bg-blue-50 bg-opacity-75 mb-8">
        <CardHeader className="flex flex-row items-center space-y-0">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold uppercase">
              {!profile?.fullName
                ? "Unknown"
                : profile?.fullName.split(" ").map((e) => e[0])}
            </div>
            <div>
              <CardTitle className="capitalize">{profile?.fullName}</CardTitle>
              <CardDescription>{profile?.email}</CardDescription>
            </div>
          </div>
          <Badge className="ml-auto">{profile?.role}</Badge>
        </CardHeader>
        <CardContent>
          <DeactivateAccout />
        </CardContent>
        <Link to={"/edit"}>
          <Button>Edit Profile</Button>
        </Link>
      </Card>

      <div>
        {/* createdJobs */}
        {profile?.role === "Recruiter" ? (
          <CreatedJobs data={profile.createdJobs} />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <SavedJobs data={profile?.savedJobs || []} />
            <AppliedJobs data={profile?.jobApplication || [] } />
          </div>
        )}
      </div>
    </div>
  );
}

function JobCard({ job, type }: any) {
  const handleRemoveSavedJob = async () => {
    try {
      const response = await axios.post(
        `${WEB_URL}/api/v1/job/removesave`,
        {
          id: job.id,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token")?.split(" ")[1],
          },
        }
      );

      if (response.status === 200) {
        toast({
          title: "Successfully Removed",
          description: "Saved job successfully removed.",
          variant: "success",
        });
        window.location.reload();
      }
    } catch (error) {
      toast({
        title: "Removing Error",
        description: "Error while removing saved job.",
        variant: "destructive",
      });
      console.log(error);
    }
  };

  return (
    <Card className="mb-4 dark:bg-neutral-900">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{job.job.title}</CardTitle>
        <div className="flex space-x-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <div className="mx-4">
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this job from your {type} jobs.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleRemoveSavedJob}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </div>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">
          Location: {job.job.location}
        </p>
        <p className="text-xs text-muted-foreground">Type: {job.job.type}</p>
        <p className="text-sm mt-2">
          {job.job.description.length > 200
            ? job.job.description.substring(0, 200) + "..."
            : job.job.description}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col justify-start items-start gap-2">
        <p className="text-xs text-muted-foreground">
          Created: {new Date(job.job.createdAt).toLocaleDateString()}
        </p>
        <Link to={"/jobs/" + job.job.id}>
          <Button variant={"secondary"} size={"sm"}>
            Open
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
