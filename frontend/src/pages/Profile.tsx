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
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
import { LogOut, Trash2, UserMinus } from "lucide-react";
import { useProfile } from "@/hooks/FetchProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { WEB_URL } from "@/Config";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import ApplicationCard from "@/components/ApplicationCard";
import CreatedJobCard from "@/components/CreatedJobCard";

export default function Profile() {
  const { data, loading } = useProfile();

  const navigate = useNavigate();

  const [deactivateLoading, setDeactivateLoading] = useState(false);
  const handleDeactivateAccount = async () => {
    try {
      setDeactivateLoading(true);
      const response = await axios.post(
        `${WEB_URL}/api/v1/user/remove`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem("token")?.split(" ")[1],
          },
        }
      );

      if (response.status === 200) {
        setDeactivateLoading(false);
        toast({
          title: "!Bye Bye",
          description: "Account Deleted Successfully.",
          variant: "success",
        });
      }
      localStorage.removeItem("role");
      navigate("/signup");
    } catch (error) {
      toast({
        title: "Account Error",
        description: "Error while Account Deletion...",
        variant: "destructive",
      });
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/signin");
  };

  if (loading) {
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
              {data?.fullName.split(" ").map((e) => e[0])}
            </div>
            <div>
              <CardTitle className="capitalize">{data?.fullName}</CardTitle>
              <CardDescription>{data?.email}</CardDescription>
            </div>
          </div>
          <Badge className="ml-auto">{data?.role}</Badge>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex items-center">
                  <UserMinus className="mr-2 h-4 w-4" />
                  Deactivate
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to deactivate your account?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently
                    deactivate your account and remove your data from our
                    servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button
                    disabled={deactivateLoading}
                    variant={"destructive"}
                    onClick={handleDeactivateAccount}
                  >
                    {deactivateLoading
                      ? "Deactivating Account..."
                      : "Deactivate Account"}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="secondary" className="flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to log out?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    You will be signed out of your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>
                    Log Out
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      <div>
        {/* createdJobs */}
        {data?.role === "Recruiter" ? (
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" className="w-full">
                Created Jobs
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full ">
                <DrawerHeader>
                  <DrawerTitle>Created Jobs</DrawerTitle>
                  <DrawerDescription>
                    Here are the jobs you've created.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4 space-y-4 max-h-[60vh] my-2 overflow-y-auto custom-scrollbar">
                  {data?.createdJobs.map((job) => (
                    <CreatedJobCard key={job.id} job={job} />
                  ))}
                </div>
                <div className="w-full flex items-center justify-center">
                  <DrawerClose>
                    <Button variant="outline" className="w-full mb-2">
                      Close
                    </Button>
                  </DrawerClose>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" className="w-full">
                  Saved Jobs
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full">
                  <DrawerHeader>
                    <DrawerTitle>Saved Jobs</DrawerTitle>
                    <DrawerDescription>
                      Here are the jobs you've saved for later.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 space-y-4 max-h-[60vh] my-2 overflow-y-auto custom-scrollbar">
                    {data?.savedJobs.map((job) => (
                      <JobCard key={job.id} job={job} type="saved" />
                    ))}
                  </div>
                  <div className="w-full flex items-center justify-center">
                    <DrawerClose>
                      <Button variant="outline" className="w-full mb-2">
                        Close
                      </Button>
                    </DrawerClose>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" className="w-full">
                  Applied Jobs
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full">
                  <DrawerHeader>
                    <DrawerTitle>Applied Jobs</DrawerTitle>
                    <DrawerDescription>
                      Here are the job applications that you applied for.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 space-y-4 max-h-[60vh] my-2 overflow-y-auto custom-scrollbar">
                    {data?.jobApplication.map((e) => (
                      <ApplicationCard
                        key={e.id}
                        title={e.job.title}
                        description={e.job.description}
                        createdAt={e.createdAt}
                        isOpen={e.job.isOpen}
                        status={e.status}
                        companyName={e.job.company.name}
                        companyLogo={e.job.company.logo}
                        location={e.job.location}
                        jobId={e.job.id}
                        jobType={e.job.type}
                      />
                    ))}
                  </div>
                  <div className="w-full flex items-center justify-center">
                    <DrawerClose>
                      <Button variant="outline" className="w-full mb-2">
                        Close
                      </Button>
                    </DrawerClose>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
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
          <Button variant={"secondary"} size={"sm"}>Open</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function ProfileSkeleton() {
  return (
    <Card className="mt-24 md:mt-32 mb-8">
      <CardHeader className="flex flex-row items-center space-y-0">
        <div className="flex items-center space-x-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Skeleton className="ml-auto h-6 w-20" />
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </CardContent>
    </Card>
  );
}
