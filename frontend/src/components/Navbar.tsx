import { useState, useEffect, useRef } from "react";
import { useLocation, Link,} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun} from "lucide-react";
import { useTheme } from "../providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { MiniProfile } from "./Profile/MiniProfile";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const role = localStorage.getItem("role");
  const location = useLocation();
  const path = location.pathname;
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menu]);

  return (
    <div className="w-full flex justify-center fixed top-4 left-0 right-0 z-50 px-4">
      <header className="flex w-full justify-between bg-secondary/15 shadow-lg shadow-neutral-600/5 backdrop-blur-lg border border-primary/10 p-3 rounded-2xl">
        <div className="container flex justify-between items-center">
          <Link to="/jobs" className="md:text-2xl font-bold text-primary">
            50<span className="text-blue-500">x</span>Opportunities
          </Link>
          <div className="flex items-center space-x-1 md:space-x-4">
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
            {role === "Recruiter" && (
              <Link to={"/dashboard"}>
                <Button size={"sm"}>Post Job</Button>
              </Link>
            )}
            {path === "/" || path === "/signup" || path === "/signin" ? (
              <Button size={"sm"} asChild>
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
            ref={menuRef}
          >
            <MiniProfile setMenu={setMenu} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

