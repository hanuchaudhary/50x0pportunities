import { X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Bookmark,
  ClipboardList,
  Shield,
  Globe,
  Gift,
  BarChart,
  PenToolIcon as Tool,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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
      href: "/profile",
    },
    {
      icon: <Bookmark className="w-5 h-5" />,
      title: "Your Jobs",
      description: "Manage your job postings and applications.",
      href : "/jobs/user/applied"
    },
    {
      icon: <ClipboardList className="w-5 h-5" />,
      title: "Job Preferences",
      description: "Your availability and role preferences.",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Verification",
      description: "Manage identity and other verifications.",
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Custom Domain",
      description: "Use your profile as portfolio on your domain.",
      badge: "Not Connected",
    },
    {
      icon: <Gift className="w-5 h-5" />,
      title: "Invite Friends",
      description: "See who joined using your invite link.",
    },
    {
      icon: <BarChart className="w-5 h-5" />,
      title: "Analytics",
      description: "Views, clicks, and who viewed your profile.",
    },
    {
      icon: <Tool className="w-5 h-5" />,
      title: "Tools",
      description: "Email signature, GitHub Recap, and 2 more.",
    },
  ];

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/signin", { replace: true });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="fixed right-0 top-0 h-full w-[400px] bg-background shadow-lg">
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

          <div className="px-6 space-y-6 flex-1 overflow-y-auto">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage className="object-cover" src={user.avatar} alt={user.email} />
                <AvatarFallback>
                  {user.email
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">{user.email}</h2>
                <p className="text-muted-foreground text-sm">
                  Manage integrations, resume, collections, etc.
                </p>
              </div>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link key={item.title} to={item.href || "#"} onClick={onClose}>
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
                          {item.badge && (
                            <Badge
                              variant="secondary"
                              className="bg-red-100 text-red-600 hover:bg-red-100"
                            >
                              {item.badge}
                            </Badge>
                          )}
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

          <div onClick={handleLogout} className="p-6 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
