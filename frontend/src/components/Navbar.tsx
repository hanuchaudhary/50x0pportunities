import { Moon, Sun } from "lucide-react";
import { useTheme } from "../providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import Profile from "@/components/MiniProfile";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const path = location.pathname;

  const [menu, setMenu] = useState(false);

  return (
    <div className="w-full flex justify-center relative overflow-hidden">
      <header className="fixed w-[95%] top-4 border-2 z-[100] dark:border-neutral-800 dark:bg-opacity-55 dark:backdrop-filter dark:backdrop-blur-md backdrop-filter backdrop-blur-md bg-opacity-55 border-neutral-200 rounded-xl bg-neutral-300 dark:bg-neutral-800 shadow-md py-5 mx-auto">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-bold">jobConnect</div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600 transition duration-300"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            {path === "/" ? (
              <Button>Signup</Button>
            ) : (
              <Avatar onClick={() => setMenu((prev) => !prev)}>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>Cn</AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
        <AnimatePresence>
          {menu && (
            <motion.div
              className="fixed right-10 lg:right-20 lg:top-16"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Profile />
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}
