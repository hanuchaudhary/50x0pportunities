import { useEffect } from "react";
import { motion } from "framer-motion";
import { ProfileSkeleton } from "@/components/ProfileSkeleton";
import SavedJobs from "@/components/Drawers/SavedJobs";
import CreatedJobs from "@/components/Drawers/CreatedJobs";
import useProfileState from "@/store/profileState";
import AppliedJobs from "@/components/Drawers/AppliedJobs";
import ProfilePageCard from "@/components/Profile/ProfilePageCard";
import { Role } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft,Briefcase } from 'lucide-react';

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
          <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-md" />
          <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mt-20 md:mt-24 p-3 min-h-screen bg-gradient-to-b from-background to-background/80"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Link to="/jobs">
            <Button size={"sm"} variant={"outline"} className="flex items-center my-3 hover:bg-primary hover:text-primary-foreground transition-colors duration-300">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
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
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="md:py-8 py-3"
        >
          {profile?.role === "Recruiter" ? (
            <div className="bg-card rounded-lg shadow-lg md:p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="md:text-2xl text-xl font-semibold mb-4 flex items-center">
                <Briefcase className="mr-2 text-primary" />
                Created Jobs
              </h2>
              <CreatedJobs />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 md:gap-6 gap-2">
              <div className="bg-card rounded-lg shadow-lg md:p-3 hover:shadow-xl transition-shadow duration-300">
                <SavedJobs />
              </div>
              <div className="bg-card rounded-lg shadow-lg md:p-3 hover:shadow-xl transition-shadow duration-300">
                <AppliedJobs />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

