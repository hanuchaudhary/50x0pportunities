import { useState } from "react";
import { MoreHorizontal, X, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCreatedJobsStore } from "@/store/useCreatedJobsStore";

interface JobActionsProps {
  jobId: string;
  isOpen: boolean;
}

export function ManageJob({ jobId, isOpen }: JobActionsProps) {
  const [showOpenConfirm, setShowOpenConfirm] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleOpenJob = async () => {
    setShowOpenConfirm(true);
    useCreatedJobsStore.getState().updateJobStatus(jobId, isOpen);
  };

  const handleCloseJob = async () => {
    setShowCloseConfirm(true);
    useCreatedJobsStore.getState().updateJobStatus(jobId, isOpen);
  };

  const handleDeleteJob = async () => {
    setShowDeleteConfirm(true);
    useCreatedJobsStore.getState().deleteJob(jobId);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {!isOpen && (
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => setShowOpenConfirm(true)}
            >
              <Check className="mr-2 h-4 w-4" />
              <span>Open Job</span>
            </DropdownMenuItem>
          )}
          {isOpen && (
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => setShowCloseConfirm(true)}
            >
              <X className="mr-2 h-4 w-4" />
              <span>Close Job</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setShowDeleteConfirm(true)}
            className="text-destructive cursor-pointer"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete Job</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showOpenConfirm} onOpenChange={setShowOpenConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-green-600 font-[instrumental-regular] font-thin tracking-tighter">
              Are you sure you want to open this job?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action will make the job visible to applicants and allow new
              applications.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleOpenJob}>
              Open Job
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showCloseConfirm} onOpenChange={setShowCloseConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-green-600 font-[instrumental-regular] font-thin tracking-tighter">
              Are you sure you want to close this job?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action will mark the job as closed and it will no longer be
              visible to applicants.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCloseJob}>
              Close Job
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 font-[instrumental-regular] font-thin tracking-tighter">
              Are you sure you want to delete this job?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the job
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteJob}
              className="bg-destructive text-primary hover:bg-destructive-hover"
            >
              Delete Job
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
