import { useEffect } from "react";
import { motion } from "framer-motion";
import SavedJobs from "@/components/Drawers/SavedJobs";
import CreatedJobs from "@/components/Drawers/CreatedJobs";
import useProfileState from "@/store/profileState";
import AppliedJobs from "@/components/Drawers/AppliedJobs";
import ProfilePageCard from "@/components/Profile/ProfilePageCard";
import { Briefcase } from "lucide-react";
import BackButton from "@/components/BackButton";

export default function Profile() {
  const { fetchProfile, profile } = useProfileState();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container p-3 bg-gradient-to-b from-background to-background/80"
    >
      <div className="max-w-3xl mx-auto">
        <div className="mb-3">
          <BackButton href="/jobs" title="Back to jobs" />
        </div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <ProfilePageCard
           {...profile}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
