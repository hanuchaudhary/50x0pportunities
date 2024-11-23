import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { LogOut, UserMinus } from "lucide-react";
import axios from "axios";
import { WEB_URL } from "@/Config";
import { useState } from "react";
import { getAuthHeaders } from "@/store/profileState";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function DeactivateAccout() {
    const { Authorization } = getAuthHeaders();
    const [deactivateLoading, setDeactivateLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/signin");
    };
    const handleDeactivateAccount = async () => {
      try {
        setDeactivateLoading(true);
        const response = await axios.post(
          `${WEB_URL}/api/v1/user/remove`,
          {},
          {
            headers: {
              Authorization: Authorization,
            },
          }
        );
  
        if (response.status === 200) {
          setDeactivateLoading(false);
          toast({
            title: "!Bye Bye",
            description: "Account Deleted Successfully.",
            variant: "success",
          });
        }
        localStorage.removeItem("role");
        localStorage.removeItem("token");
        navigate("/signup");

      } catch (error) {
        toast({
          title: "Account Error",
          description: "Error while Account Deletion...",
          variant: "destructive",
        });
        console.log(error);
      }
    };

  return (
    <div className="flex space-x-4">
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="flex items-center">
          <UserMinus className="mr-2 h-4 w-4" />
          Deactivate
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to deactivate your account?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently
            deactivate your account and remove your data from our
            servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={deactivateLoading}
            variant={"destructive"}
            onClick={handleDeactivateAccount}
          >
            {deactivateLoading
              ? "Deactivating Account..."
              : "Deactivate Account"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" className="flex items-center">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to log out?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You will be signed out of your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout}>
            Log Out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
  )
}
