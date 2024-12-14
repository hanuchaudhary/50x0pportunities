import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, User2Icon } from "lucide-react";
import { useTheme } from "../providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useProfileStore from "@/store/profileState";
import MiniProfile from "./Profile/MiniProfile";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const path = location.pathname;
  const [menu, setMenu] = useState(false);

  const handleClose = () => {
    setMenu(false);
  };
  const role =  localStorage.getItem("role");
  console.log(role);
  
  const { profile } = useProfileStore();

  return (
    <div className="w-full flex justify-center fixed top-4 left-0 right-0 z-50 px-4">
      <header className="flex w-full justify-between bg-secondary/15 shadow-lg shadow-neutral-600/5 backdrop-blur-lg border border-primary/10 md:px-3 py-3 rounded-2xl">
        <div className="container flex justify-between items-center">
          <div className="md:text-xl select-none leading-none tracking-tighter font-[instrumental-regular] text-primary">
            50<span className="text-green-500">x</span>Opportunities
          </div>
          <div className="flex items-center space-x-1 md:space-x-4">
            {role === "Recruiter" &&
            path !== "/" &&
            path !== "/signin" &&
            path !== "/signup" ? (
              <Link to={"/dashboard"}>
                <Button variant={"green"} className="rounded-xl" size={"sm"}>
                  Create Job
                </Button>
              </Link>
            ) : (
              <div className="space-x-2">
                <Link to={"/edit"}>
                  <Button variant={"green"} className="rounded-xl" size={"sm"}>
                    Edit Profile
                  </Button>
                </Link>
                <Link to={"/jobs/user"}>
                  <Button variant={"green"} className="rounded-xl" size={"sm"}>
                    Your Jobs
                  </Button>
                </Link>
              </div>
            )}
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
            {path === "/" || path === "/signup" || path === "/signin" ? (
              <Link to="/signin">
                <Button variant={"green"} className="rounded-xl">
                  Sign In
                </Button>
              </Link>
            ) : (
              <Avatar
                onClick={() => setMenu((prev) => !prev)}
                className="cursor-pointer hover:ring-2 hover:ring-primary transition-all duration-200"
              >
                <AvatarImage
                  className="object-cover"
                  src={profile?.avatar}
                  alt="@shadcn"
                />
                <AvatarFallback className="uppercase font-semibold">
                  <User2Icon />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </header>
      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed right-4 lg:right-20 top-24"
            initial={{ opacity: 0, y: -20}}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <MiniProfile onClose={handleClose} user={profile} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
