import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../providers/ThemeProvider";
import { useProfile } from "@/hooks/FetchProfile";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const path = location.pathname;
  const [menu, setMenu] = useState(false);

  return (
    <div className="w-full flex justify-center fixed top-0 left-0 right-0 z-50 px-4">
      <header className="w-full max-w-7xl mt-4 border dark:border-neutral-800 bg-background/80 backdrop-blur-md rounded-xl shadow-lg py-3">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            jobConnect
          </Link>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-accent"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            {path === "/" ? (
              <Button asChild>
                <Link to="/signup">Signup</Link>
              </Button>
            ) : (
              <Avatar
                onClick={() => setMenu((prev) => !prev)}
                className="cursor-pointer hover:ring-2 hover:ring-primary transition-all duration-200"
              >
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>Cn</AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </header>
      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed right-4 lg:right-20 top-24"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <MiniProfile />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MiniProfile() {
  const { data, loading, error } = useProfile();

  // loader
  if (loading) {
    return (
      <Card className="lg:w-[30vw] md:w-[40vw] shadow-xl">
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
    <Card className="lg:w-[30vw] md:w-[40vw] shadow-xl">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border-2 border-primary">
            <AvatarImage
              src="/placeholder.svg?height=64&width=64"
              alt="User avatar"
            />
            <AvatarFallback className="text-2xl font-semibold bg-primary text-primary-foreground">
              {data?.fullName
                .split(" ")
                .map((e) => e[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <CardTitle className="text-xl">{data?.fullName}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{data?.email}</p>
            <Badge variant="secondary" className="mt-2">
              {data?.role}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div
          className={`grid ${
            data?.role === "Candidate" ? "grid-cols-2" : "grid-cols-1"
          }  gap-4`}
        >
          {data?.role === "Recruiter" ? (
            <div className="flex flex-col items-center p-3 bg-accent rounded-lg">
              <span className="text-2xl font-bold">
                {data?.createdJobs.length}
              </span>
              <span className="text-sm text-muted-foreground">
                Created Jobs
              </span>
            </div>
          ) : null}
          
          <div className="flex flex-col items-center p-3 bg-accent rounded-lg">
            <span className="text-2xl font-bold">
              {data?.jobApplication.length}
            </span>
            <span className="text-sm text-muted-foreground">Applied Jobs</span>
          </div>

          {data?.role === "Candidate" && (
            <div className="flex flex-col items-center p-3 bg-accent rounded-lg">
              <span className="text-2xl font-bold">
                {data?.savedJobs.length}
              </span>
              <span className="text-sm text-muted-foreground">Saved Jobs</span>
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <Button asChild variant="outline" className="w-full">
            <Link to="/profile">View Full Profile</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
