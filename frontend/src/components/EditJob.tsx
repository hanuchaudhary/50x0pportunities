import { useState } from "react";
import axios from "axios";
import { AlertCircle, CheckCircle2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { WEB_URL } from "@/Config";
import { toast } from "@/hooks/use-toast";
import { getAuthHeaders } from "@/store/profileState";
import { useCreatedJobsStore } from "@/store/userJobsStore";

interface editTypes {
  isOpen: boolean;
  id: string;
}

export default function EditJob({ isOpen, id }: editTypes) {
  const { fetchCreatedJobs } = useCreatedJobsStore();
  const [delLoading, setDelLoading] = useState(false);
  const [openLoading, setOpenLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const { Authorization } = getAuthHeaders();
  const handleDeleteJob = async () => {
    try {
      setDelLoading(true);
      const response = await axios.post(
        `${WEB_URL}/api/v1/job/delete`,
        { id },
        {
          headers: {
            Authorization,
          },
        }
      );
      if (response) {
        fetchCreatedJobs();
        setDelLoading(false);
        setDialogOpen(false);
        setAlertDialogOpen(false);
        toast({
          title: "Deleted!",
          description: "Job deleted successfully",
          variant: "success",
        });
      }
    } catch (error) {
      setDelLoading(false);
      toast({
        title: "Server Error",
        description: "Error while deleting the Job",
        variant: "destructive",
      });
    }
  };

  const handleOpenJob = async () => {
    try {
      setOpenLoading(true);
      const response = await axios.put(
        `${WEB_URL}/api/v1/job/open`,
        { jobId: id, isOpenValue: !isOpen },
        {
          headers: {
            Authorization,
          },
        }
      );
      if (response.status === 200) {
        fetchCreatedJobs();
        setOpenLoading(false);
        setDialogOpen(false);
        toast({
          title: "Success!",
          description: isOpen ? "Job marked as closed." : "Job marked as open.",
          variant: "success",
        });
      }
    } catch (error) {
      setOpenLoading(false);
      toast({
        title: "Server Error",
        description: "Error while updating job status",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Manage Job</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Job Listing</DialogTitle>
          <DialogDescription>
            Change the status of this job or remove it from the listings.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          {isOpen ? (
            <Button
              variant="outline"
              className="justify-start text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100"
              onClick={handleOpenJob}
              disabled={openLoading}
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              Mark as Closed
            </Button>
          ) : (
            <Button
              variant="outline"
              className="justify-start text-green-600 hover:text-green-700 hover:bg-green-100"
              onClick={handleOpenJob}
              disabled={openLoading}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark as Open
            </Button>
          )}

          <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-red-600 hover:text-red-700 hover:bg-red-100"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Job
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  job listing.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteJob}
                  disabled={delLoading}
                >
                  {delLoading ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DialogContent>
    </Dialog>
  );
}
