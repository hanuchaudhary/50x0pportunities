"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { X, User, Briefcase, BookmarkCheck, LogOut } from "lucide-react";
import useProfileStore from "@/store/profileState";

export function MiniProfile({
  setMenu,
}: {
  setMenu: (value: boolean) => void;
}) {
  const { isLoading, profile, error } = useProfileStore();
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsClosing(true);
    setTimeout(() => {
      setMenu(false);
      navigate("/signin");
    }, 300);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => setMenu(false), 300);
  };

  if (isLoading) {
    return (
      <Card className="lg:w-[30vw] md:w-[40vw] w-[70vw] shadow-xl bg-background/80 backdrop-blur-sm">
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
      <Card className="lg:w-[30vw] md:w-[40vw] shadow-xl bg-background/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <p className="text-center text-red-500">
            Error loading profile data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <AnimatePresence>
      {!isClosing && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="lg:w-[30vw] md:w-[40vw] w-[90vw] shadow-xl relative overflow-hidden bg-background/80 backdrop-blur-xl">
            <motion.div
              className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary-foreground to-primary"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="absolute top-4 right-4 cursor-pointer bg-background/50 backdrop-blur-sm rounded-full p-1"
            >
              <X className="text-primary" />
            </motion.div>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Avatar className="w-16 h-16 border-2 border-primary">
                  <AvatarImage className="object-cover" src={profile.avatar} alt="User avatar" />
                    <AvatarFallback className="text-2xl uppercase font-semibold bg-primary text-primary-foreground">
                      {profile.email.split("@")[0][0] || "UN"}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <div className="flex-grow">
                  <CardTitle className="text-xl capitalize text-primary">
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
                  <motion.div
                    className="flex flex-col items-center p-3 bg-accent rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-2xl font-bold text-primary">
                      {profile?._count?.createdJobs}
                    </span>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Briefcase className="w-4 h-4" /> Created Jobs
                    </span>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <motion.div
                      className="flex flex-col items-center p-3 bg-accent rounded-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-2xl font-bold text-primary">
                        {profile?._count?.jobApplication}
                      </span>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Briefcase className="w-4 h-4" /> Applied Jobs
                      </span>
                    </motion.div>
                    <motion.div
                      className="flex flex-col items-center p-3 bg-accent rounded-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-2xl font-bold text-primary">
                        {profile?._count?.savedJobs}
                      </span>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <BookmarkCheck className="w-4 h-4" /> Saved Jobs
                      </span>
                    </motion.div>
                  </div>
                )}
              </div>
              <div className="mt-4 flex flex-col gap-2 justify-end">
                <Button
                  onClick={handleClose}
                  asChild
                  variant="outline"
                  className="w-full group transition-all duration-300 ease-in-out"
                >
                  <Link
                    to="/profile"
                    className="flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4 group-hover:text-primary transition-colors duration-300" />
                    View Full Profile
                  </Link>
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full group transition-all duration-300 ease-in-out"
                >
                  <span className="flex items-center justify-center gap-2">
                    <LogOut className="w-4 h-4 group-hover:text-white transition-colors duration-300" />
                    Logout
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
