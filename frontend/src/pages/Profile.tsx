import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { ProfileSkeleton } from "@/components/ProfileSkeleton";
import SavedJobs from "@/components/Drawers/SavedJobs";
import CreatedJobs from "@/components/Drawers/CreatedJobs";
import useProfileState from "@/store/profileState";
import AppliedJobs from "@/components/Drawers/AppliedJobs";
import ProfilePageCard from "@/components/Profile/ProfilePageCard";
import { Role } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function Profile() {
  const { fetchProfile, isLoading, profile } = useProfileState();

  useEffect(() => {
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="container max-w-5xl mx-auto mt-20 md:mt-24 p-3">
        <ProfileSkeleton />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-20 md:mt-24 p-3">
      <div className="max-w-5xl mx-auto">
        <Link to="/jobs">
          <Button size={"sm"} variant={"outline"} className="flex items-center my-3">
            <ChevronLeft className="h-4 w-4" />
            Jobs
          </Button>
        </Link>
        <ProfilePageCard
          id={profile?.id || ""}
          email={profile?.email || ""}
          fullName={profile?.fullName || ""}
          experience={profile?.experience || ""}
          education={profile?.education || ""}
          resume={profile?.resume || ""}
          avatar={profile?.avatar || ""}
          bio={profile?.bio || ""}
          skills={profile?.skills || ""}
          role={profile?.role as Role}
        />
        <div className="md:py-8 py-3">
          {profile?.role === "Recruiter" ? (
            <CreatedJobs />
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <SavedJobs />
              <AppliedJobs />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
