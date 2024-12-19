import {
  User2,
  X,
  Settings,
  ClipboardList,
  Shield,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

interface ProfileMenuProps {
  user: {
    email: string;
    avatar: string;
  };
  onClose: () => void;
}

export default function MiniProfile({ user, onClose }: ProfileMenuProps) {
  const menuItems = [
    {
      icon: <Settings className="w-5 h-5" />,
      title: "Profile Settings",
      description: "Edit profile, account, notifications, +2 more.",
      href: "/edit",
    },
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      title: "Your Jobs",
      description: "Manage your job postings and applications.",
      href: "/jobs/user/",
    },
    {
      icon: <ClipboardList className="w-5 h-5" />,
      title: "Job Preferences",
      description: "Your availability and role preferences.",
      href: "/job-preferences",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Verification",
      description: "Manage identity and other verifications.",
      href: "/verification",
    },
    {
      icon: <GitHubLogoIcon className="w-5 h-5" />,
      title: "Github",
      description: "Made with ❤️ by Kush Chaudhary",
      href: "https://github.com/hanuchaudhary",
    }
  ];

  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const LogoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/signin", { replace: true });
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-[400px] bg-background/80 backdrop-blur-sm shadow-lg"
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ type: "tween", duration: 0.3 }}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-end p-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="px-6 space-y-3 flex-1 overflow-y-auto">
          <Link to={"/profile"} onClick={onClose} className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                className="object-cover"
                src={
                  user.avatar ||
                  "https://i.pinimg.com/736x/71/e5/d2/71e5d2e61c2ce50df62c7eb751a3ce8e.jpg"
                }
                alt={user.email}
              />
              <AvatarFallback className="uppercase">
                <User2 className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">{user.email}</h2>
              <p className="text-muted-foreground text-sm">
                Manage integrations, resume, collections, etc.
              </p>
            </div>
          </Link>

          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={
                  item.title === "Your Jobs"
                    ? role === "Candidate"
                      ? "/jobs/user/applied"
                      : "/jobs/user/created"
                    : item.href
                }
                onClick={onClose}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto py-3 px-4"
                >
                  <div className="flex items-start">
                    <span className="shrink-0 mr-3 mt-1 text-muted-foreground">
                      {item.icon}
                    </span>
                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{item.title}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Button>
              </Link>
            ))}
          </nav>
        </div>
        <Button
          onClick={LogoutUser}
          variant="secondary"
          className="py-6 rounded-t-xl rounded-b-none"
        >
          <LogOut className="mr-2 h-5 w-5" />
          Log Out
        </Button>
      </div>
    </motion.div>
  );
}
