import { Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "../providers/ThemeProviser";
import { Button } from "./ui/button";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const path = "/";
  return (
    <div className="w-full flex justify-center relative overflow-hidden">
      <header className="fixed w-[95%] top-4 border-2 z-[100] dark:border-neutral-800 dark:bg-opacity-55 dark:backdrop-filter dark:backdrop-blur-md backdrop-filter backdrop-blur-md bg-opacity-55 border-neutral-200 rounded-xl bg-neutral-300 dark:bg-neutral-800 shadow-md py-5 mx-auto">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-bold">jobConnect</div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600 transition duration-300"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </button>
            {path === "/" && <Button>Signup</Button>}
            <div>
              <button className="p-2 rounded-full bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600 transition duration-300">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </button>
              <div className="relative">
                <button className="flex items-center space-x-2 p-2 rounded-full bg-neutral-300 dark:bg-neutral-700 dark:bg-opacity-55 hover:bg-neutral-400 dark:hover:bg-neutral-600 dark:backdrop-filter dark:backdrop-blur-sm backdrop-filter backdrop-blur-md bg-opacity-55 transition duration-300">
                  <h1 className="h-7 uppercase w-7 flex items-center justify-center font-semibold">
                    S
                  </h1>
                  <span className="sr-only">User menu</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
